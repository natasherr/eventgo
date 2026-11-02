require('dotenv').config();
const axios = require('axios');

async function testAuth() {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${key}:${secret}`).toString('base64');

  try {
    console.log("Testing Daraja Authentication...");
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );
    console.log("✅ SUCCESS! Your keys are correct.");
    console.log("Here is your access token:", response.data.access_token);
  } catch (error) {
    console.error("❌ FAILED. Here is the exact error from Safaricom:");
    console.error(error.response ? error.response.data : error.message);
  }
}

testAuth();