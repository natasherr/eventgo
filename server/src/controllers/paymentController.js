const { initiateSTKPush } = require('../utils/mpesa');
const { Order, Payment } = require('../models');

// @desc    Initiate M-Pesa STK Push
// @route   POST /api/payments/stkpush
exports.initiatePayment = async (req, res) => {
  try {
    const { phoneNumber, amount, orderId } = req.body;

    // In a real app, you would validate the order and amount here
    // For now, we'll just trigger the push
    const response = await initiateSTKPush(phoneNumber, amount, `ORDER-${orderId}`);

    // Save the CheckoutRequestID to your DB to match the callback later
    console.log('STK Push initiated. CheckoutRequestID:', response.CheckoutRequestID);

    res.status(200).json({
      message: 'STK Push sent. Check your phone.',
      checkoutRequestId: response.CheckoutRequestID
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to initiate M-Pesa payment' });
  }
};

// @desc    Handle M-Pesa Callback
// @route   POST /api/payments/callback
exports.handleCallback = async (req, res) => {
  try {
    const callbackData = req.body.Body.stkCallback;
    console.log('M-Pesa Callback Received:', callbackData);

    // A ResultCode of 0 means the payment was successful
    if (callbackData.ResultCode === 0) {
      // Here you would:
      // 1. Find the order using the CheckoutRequestID
      // 2. Update the order status to 'paid'
      // 3. Create a 'Ticket' record for the user
      // 4. Save the M-Pesa receipt number
      console.log('Payment successful! Receipt:', callbackData.CallbackMetadata.Item[1].Value);
    } else {
      console.log('Payment failed or cancelled by user.');
    }

    // Always respond with 200 OK to acknowledge receipt
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({ message: 'Callback processing error' });
  }
};