const { Resend } = require('resend');

/**
 * Sends an email using Resend.
 * Requires RESEND_API_KEY environment variable.
 *
 * Note: Without a verified custom domain, Resend can only deliver
 * to the email address registered with the Resend account.
 *
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} htmlContent - HTML body of the email
 */
const sendEmail = async (to, subject, htmlContent) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const data = await resend.emails.send({
    from: 'EventGo <onboarding@resend.dev>',
    to: [to],
    subject,
    html: htmlContent,
  });

  console.log('📧 Email sent successfully. ID:', data.id);
  return data;
};

module.exports = { sendEmail };
