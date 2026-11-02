const { initiateSTKPush } = require('../utils/mpesa');
const { sequelize, Order, Payment, Ticket, TicketType } = require('../models');
const crypto = require('crypto');

// @desc    Initiate M-Pesa STK Push (Creates Order and Payment in DB)
// @route   POST /api/payments/stkpush
// @access  Private (User must be logged in)
exports.initiatePayment = async (req, res) => {
  try {
    const { ticketTypeId, quantity, phoneNumber } = req.body;
    const userId = req.user.user_id; // From your JWT auth middleware

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
    // We pass the Order ID (e.g., ORD-1) as the Account Reference
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
  // We use a transaction to ensure that if ticket generation fails, the payment isn't marked as paid
  const t = await sequelize.transaction();

  try {
    const callbackData = req.body.Body.stkCallback;
    console.log('M-Pesa Callback Received:', callbackData.ResultCode);

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
      console.log('✅ Payment successful!');

      // Extract M-Pesa Receipt Number
      const mpesaReceipt = callbackData.CallbackMetadata.Item.find(
        item => item.Name === 'MpesaReceiptNumber'
      )?.Value;

      // Update Payment Record
      payment.status = 'success';
      payment.mpesa_receipt = mpesaReceipt;
      payment.paid_at = new Date();
      await payment.save({ transaction: t });

      // Update Order Record
      const order = await Order.findByPk(payment.order_id, { transaction: t });
      order.status = 'paid';
      await order.save({ transaction: t });

      // Generate Tickets (Loop based on quantity)
      const ticketsToCreate = [];
      for (let i = 0; i < order.quantity; i++) {
        ticketsToCreate.push({
          order_id: order.order_id,
          // Generate a unique reference code (e.g., TKT-A1B2C3)
          reference_code: `TKT-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
          status: 'valid'
        });
      }
      await Ticket.bulkCreate(ticketsToCreate, { transaction: t });
      
      console.log(`🎟️ Generated ${order.quantity} ticket(s) for Order ${order.order_id}`);

    } else {
      // Payment failed or cancelled
      console.log('❌ Payment failed/cancelled:', callbackData.ResultDesc);
      payment.status = 'failed';
      await payment.save({ transaction: t });

      const order = await Order.findByPk(payment.order_id, { transaction: t });
      order.status = 'failed';
      await order.save({ transaction: t });
    }

    // Commit the transaction if everything succeeded
    await t.commit();

    // Always respond with 200 OK to acknowledge receipt
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });

  } catch (error) {
    // Rollback changes if anything fails
    await t.rollback();
    console.error('Callback processing error:', error);
    res.status(500).json({ message: 'Callback processing error' });
  }
};