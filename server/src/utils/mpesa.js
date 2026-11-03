const axios = require('axios');

// Get OAuth Token
async function getOAuthToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );

    console.log('✅ Token generated successfully:', response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Failed to get OAuth Token:', error.response?.data || error.message);
    throw error;
  }
}

// Initiate STK Push
async function initiateSTKPush(phoneNumber, amount, accountReference) {
  const token = await getOAuthToken();
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;

  // Timestamp in YYYYMMDDHHmmss format
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  
  // Password = Base64(Shortcode + Passkey + Timestamp)
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phoneNumber, 
    PartyB: shortcode,
    PhoneNumber: phoneNumber,
    CallBackURL: process.env.MPESA_CALLBACK_URL,
    AccountReference: accountReference, 
    TransactionDesc: 'Payment for EventGo Ticket'
  };

  console.log('📤 Sending STK Push with payload:', payload);

  try {
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      { headers: { Authorization: `Bearer ${token}` } } // <-- Crucial: Bearer + space
    );
    
    return response.data;
  } catch (error) {
    console.error('❌ STK Push Error Details:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = { getOAuthToken, initiateSTKPush };