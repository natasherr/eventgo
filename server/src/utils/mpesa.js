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
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting token:", error.response?.data || error.message);
    throw new Error("Failed to get OAuth Token");
  }
}

// Initiate STK Push
async function initiateSTKPush(phoneNumber, amount, accountReference) {
  const token = await getOAuthToken();
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;

  // Generate Timestamp in East Africa Time (EAT) - Crucial for Safaricom
  const now = new Date();
  const eatTime = new Date(now.getTime() + (3 * 60 * 60 * 1000)); // Add 3 hours for EAT
  const timestamp = eatTime.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  
  // Password = Base64(Shortcode + Passkey + Timestamp)
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

  try {
    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
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
      },
      { 
        headers: { 
          Authorization: `Bearer ${token}` 
        } 
      }
    );

    return response.data;
  } catch (error) {
    console.error("STK Push Error Details:", error.response?.data || error.message);
    throw error; // Re-throw so the controller catches it
  }
}

module.exports = { getOAuthToken, initiateSTKPush };