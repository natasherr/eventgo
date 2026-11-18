const nodemailer = require('nodemailer');

/**
 * Sends an email using Gmail via Nodemailer.
 * Requires GMAIL_USER and GMAIL_APP_PASSWORD environment variables.
 *
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} htmlContent - HTML body of the email
 */
const sendEmail = async (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: `"EventGo" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html: htmlContent,
  });

  console.log('📧 Email sent successfully. ID:', info.messageId);
  return info;
};

module.exports = { sendEmail };
