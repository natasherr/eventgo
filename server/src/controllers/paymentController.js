const { initiateSTKPush } = require('../utils/mpesa');
const { sequelize, Order, Payment, Ticket, TicketType } = require('../models');
const { logAction } = require('../utils/auditLogger');
const crypto = require('crypto');

// @desc    Initiate M-Pesa STK Push (Creates Order and Payment in DB)
// @route   POST /api/payments/stkpush
// @access  Private (User must be logged in)
exports.initiatePayment = async (req, res) => {
  try {
    const { ticketTypeId, quantity, phoneNumber } = req.body;
    const userId = req.user.user_id; 

    // 1. Validate ticket type
    const ticketType = await TicketType.findByPk(ticketTypeId);
    if (!ticketType) {
      return res.status(404).json({ message: 'Ticket type not found' });
    }

    // 2. Calculate total amount
    const totalAmount = parseFloat(ticketType.price) * quantity;

    // 3. Create the Order in the database
    const order = await Order.create({
      user_id: userId,
      ticket_type_id: ticketTypeId,
      quantity: quantity,
      total_amount: totalAmount,
      status: 'pending'
    });

    // 4. Initiate STK Push with Safaricom
    const accountReference = `ORD-${order.order_id}`;
    const mpesaResponse = await initiateSTKPush(phoneNumber, totalAmount, accountReference);

    // 5. Create the Payment record in the database
    await Payment.create({
      order_id: order.order_id,
      phone_number: phoneNumber,
      amount: totalAmount,
      checkout_request_id: mpesaResponse.CheckoutRequestID,
      status: 'pending'
    });

    res.status(200).json({
      message: 'STK Push sent. Check your phone.',
      checkoutRequestId: mpesaResponse.CheckoutRequestID,
      orderId: order.order_id
    });

  } catch (error) {
    console.error('STK Push Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to initiate M-Pesa payment' });
  }
};

// @desc    Handle M-Pesa Callback
// @route   POST /api/payments/callback
// @access  Public (Safaricom hits this)
exports.handleCallback = async (req, res) => {
  // Start a transaction
  const t = await sequelize.transaction();

  try {
    const callbackData = req.body.Body.stkCallback;
    console.log('M-Pesa Callback Received. ResultCode:', callbackData.ResultCode);

    const checkoutRequestId = callbackData.CheckoutRequestID;

    // 1. Find the payment record
    const payment = await Payment.findOne({ 
      where: { checkout_request_id: checkoutRequestId },
      transaction: t
    });

    if (!payment) {
      console.log('❌ Payment record not found for CheckoutID:', checkoutRequestId);
      await t.rollback();
      return res.status(404).json({ message: 'Payment not found' });
    }

    // 2. Check if payment was successful (ResultCode 0)
    if (callbackData.ResultCode === 0) {
      
      // --- SECURITY CHECK 1: VERIFY AMOUNT ---
      const amountItem = callbackData.CallbackMetadata.Item.find(item => item.Name === 'Amount');
      const receiptItem = callbackData.CallbackMetadata.Item.find(item => item.Name === 'MpesaReceiptNumber');
      
      const paidAmount = amountItem ? parseFloat(amountItem.Value) : 0;
      const mpesaReceipt = receiptItem ? receiptItem.Value : null;

      if (Math.abs(paidAmount - payment.amount) > 0.01) {
          console.log(`❌ Amount mismatch! Expected ${payment.amount}, Paid ${paidAmount}`);
        payment.status = 'failed';
        await payment.save({ transaction: t });
        
        const order = await Order.findByPk(payment.order_id, { transaction: t });
        order.status = 'failed';
        await order.save({ transaction: t });
        
        await logAction(order.user_id, 'PAYMENT_FAILED', 'Order', order.order_id, 'Amount mismatch', req.ip);
        await t.commit();
        return res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
      }

      // --- SECURITY CHECK 2: PREVENT OVERSELLING ---
      // We lock the Order and TicketType rows so no other transaction can modify them until we finish
      const order = await Order.findByPk(payment.order_id, { transaction: t, lock: t.LOCK.UPDATE });
      const ticketType = await TicketType.findByPk(order.ticket_type_id, { transaction: t, lock: t.LOCK.UPDATE });

      // Calculate how many tickets are already sold for this ticket type
      const soldCount = await Order.sum('quantity', {
        where: { ticket_type_id: ticketType.ticket_type_id, status: 'paid' },
        transaction: t
      }) || 0;

      const remainingTickets = ticketType.quantity_total - soldCount;

      if (order.quantity > remainingTickets) {
        console.log(`❌ Oversold! Requested ${order.quantity}, Only ${remainingTickets} left.`);
        
        // In a real app, you would trigger an M-Pesa B2C Refund here. 
        // For now, we mark it as failed so they don't get a ticket.
        payment.status = 'failed'; 
        await payment.save({ transaction: t });
        
        order.status = 'failed';
        await order.save({ transaction: t });
        
        await logAction(order.user_id, 'PAYMENT_FAILED_OVERSOLD', 'Order', order.order_id, 'Sold out', req.ip);
        await t.commit();
        return res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
      }

      // --- IF ALL CHECKS PASS, ISSUE TICKETS ---
      console.log('✅ Payment successful & verified!');

      // Update Payment
      payment.status = 'success';
      payment.mpesa_receipt = mpesaReceipt;
      payment.paid_at = new Date();
      await payment.save({ transaction: t });

      // Update Order
      order.status = 'paid';
      await order.save({ transaction: t });

      // Generate Tickets
      const ticketsToCreate = [];
      for (let i = 0; i < order.quantity; i++) {
        ticketsToCreate.push({
          order_id: order.order_id,
          reference_code: `TKT-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
          status: 'valid'
        });
      }
      await Ticket.bulkCreate(ticketsToCreate, { transaction: t });
      
      // Log the successful sale
      await logAction(order.user_id, 'PAYMENT_SUCCESS', 'Order', order.order_id, `Purchased ${order.quantity} tickets`, req.ip);
      console.log(`🎟️ Generated ${order.quantity} ticket(s) for Order ${order.order_id}`);

    } else {
      // Payment failed or cancelled by user on their phone
      console.log('❌ Payment failed/cancelled:', callbackData.ResultDesc);
      payment.status = 'failed';
      await payment.save({ transaction: t });

      const order = await Order.findByPk(payment.order_id, { transaction: t });
      order.status = 'failed';
      await order.save({ transaction: t });
      
      await logAction(order.user_id, 'PAYMENT_CANCELLED', 'Order', order.order_id, 'User cancelled/failed', req.ip);
    }

    // Commit the transaction if everything succeeded
    await t.commit();
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });

  } catch (error) {
    // Rollback changes if anything fails
    await t.rollback();
    console.error('Callback processing error:', error);
    res.status(500).json({ message: 'Callback processing error' });
  }
};