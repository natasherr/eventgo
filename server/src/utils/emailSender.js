const axios = require('axios');

/**
 * Sends an email using the Brevo HTTP API (port 443 — works on all hosting platforms).
 * Requires BREVO_API_KEY and BREVO_SENDER_EMAIL environment variables.
 *
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} htmlContent - HTML body of the email
 */
const sendEmail = async (to, subject, htmlContent) => {
  const response = await axios.post(
    'https://api.brevo.com/v3/smtp/email',
    {
      sender: {
        name: 'EventGo',
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: to }],
      subject,
      htmlContent,
    },
    {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
    }
  );

  console.log('📧 Email sent successfully. MessageId:', response.data.messageId);
  return response.data;
};

module.exports = { sendEmail };
