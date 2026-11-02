const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends an email using Resend
 * @param {string} to - The recipient's email address
 * @param {string} subject - The email subject line
 * @param {string} htmlContent - The HTML body of the email
 */
const sendEmail = async (to, subject, htmlContent) => {
  try {
    // Note: Without a custom domain, Resend requires you to use 'onboarding@resend.dev' as the sender
    // and you can ONLY send emails to the email address you registered your Resend account with.
    const data = await resend.emails.send({
      from: 'EventGo <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: htmlContent
    });

    console.log('📧 Email sent successfully. ID:', data.id);
    return data;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
};

module.exports = { sendEmail };