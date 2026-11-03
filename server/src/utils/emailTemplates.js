// Escapes user-supplied text so a name like "<script>" can't inject HTML into the email
const escapeHtml = (str = "") =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

exports.resetPasswordTemplate = (name, resetLink) => {
  const safeName = escapeHtml(name);
  const safeLink = escapeHtml(resetLink);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>Reset your EventGo password</title>
</head>
<body style="margin:0; padding:0; background-color:#eef2f7; -webkit-text-size-adjust:100%;">

  <!-- Preheader: the preview text shown in the inbox list (hidden in the email body) -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; font-size:1px; line-height:1px; color:#eef2f7;">
    Use this link within 15 minutes to choose a new EventGo password.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eef2f7;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:560px;">

          <!-- Brand header -->
          <tr>
            <td align="center" style="padding:0 0 24px 0; font-family:'Segoe UI', Helvetica, Arial, sans-serif; font-size:26px; font-weight:800; letter-spacing:-0.5px; color:#1e3a8a;">
              Event<span style="color:#2563eb;">Go</span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#ffffff; border-radius:16px; border:1px solid #e2e8f0; overflow:hidden;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                <!-- Accent bar -->
                <tr>
                  <td height="6" style="height:6px; line-height:6px; font-size:6px; background-color:#2563eb;">&nbsp;</td>
                </tr>

                <!-- Icon circle -->
                <tr>
                  <td align="center" style="padding:36px 40px 0 40px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" width="64" height="64" style="width:64px; height:64px; background-color:#dbeafe; border-radius:32px; font-size:30px; line-height:64px;">
                          &#128274;
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding:24px 40px 8px 40px; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
                    <h1 style="margin:0 0 16px 0; font-size:24px; line-height:32px; font-weight:700; color:#0f172a; text-align:center;">
                      Reset your password
                    </h1>
                    <p style="margin:0 0 12px 0; font-size:16px; line-height:26px; color:#475569;">
                      Hi <strong style="color:#0f172a;">${safeName}</strong>,
                    </p>
                    <p style="margin:0; font-size:16px; line-height:26px; color:#475569;">
                      We received a request to reset the password for your EventGo account.
                      Click the button below to choose a new one.
                    </p>
                  </td>
                </tr>

                <!-- Button -->
                <tr>
                  <td align="center" style="padding:28px 40px 8px 40px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" bgcolor="#2563eb" style="background-color:#2563eb; border-radius:10px;">
                          <a href="${safeLink}" target="_blank"
                             style="display:inline-block; padding:15px 36px; font-family:'Segoe UI', Helvetica, Arial, sans-serif; font-size:16px; font-weight:700; color:#ffffff; text-decoration:none; border-radius:10px;">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Expiry notice -->
                <tr>
                  <td align="center" style="padding:20px 40px 0 40px; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color:#fff7ed; border:1px solid #fed7aa; border-radius:8px; padding:10px 16px; font-size:14px; line-height:20px; color:#9a3412;">
                          &#9201; This link expires in <strong>15 minutes</strong>.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Fallback link -->
                <tr>
                  <td style="padding:28px 40px 0 40px; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
                    <p style="margin:0 0 6px 0; font-size:13px; line-height:20px; color:#64748b;">
                      Button not working? Copy and paste this link into your browser:
                    </p>
                    <p style="margin:0; font-size:13px; line-height:20px; word-break:break-all;">
                      <a href="${safeLink}" target="_blank" style="color:#2563eb; text-decoration:underline;">${safeLink}</a>
                    </p>
                  </td>
                </tr>

                <!-- Security note -->
                <tr>
                  <td style="padding:24px 40px 36px 40px; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="border-top:1px solid #e2e8f0; padding-top:20px; font-size:14px; line-height:22px; color:#64748b;">
                          <strong style="color:#334155;">Didn't request this?</strong>
                          You can safely ignore this email. Your password will stay the same and no changes will be made to your account.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 16px 0 16px; font-family:'Segoe UI', Helvetica, Arial, sans-serif; font-size:12px; line-height:18px; color:#94a3b8;">
              &copy; ${new Date().getFullYear()} EventGo Ticketing. All rights reserved.<br>
              This is an automated message, please do not reply.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
};



exports.twoFactorCodeTemplate = (name, otp) => {
  const safeName = escapeHtml(name);
  const safeOtp = escapeHtml(otp);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your EventGo Admin Code</title>
</head>
<body style="margin:0; padding:0; background-color:#eef2f7; -webkit-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eef2f7;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:560px;">
          
          <!-- Brand header -->
          <tr>
            <td align="center" style="padding:0 0 24px 0; font-family:'Segoe UI', Helvetica, Arial, sans-serif; font-size:26px; font-weight:800; letter-spacing:-0.5px; color:#1e3a8a;">
              Event<span style="color:#2563eb;">Go</span> Admin
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#ffffff; border-radius:16px; border:1px solid #e2e8f0; overflow:hidden;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                
                <!-- Accent bar -->
                <tr>
                  <td height="6" style="height:6px; line-height:6px; font-size:6px; background-color:#2563eb;">&nbsp;</td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding:36px 40px 8px 40px; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
                    <h1 style="margin:0 0 16px 0; font-size:24px; line-height:32px; font-weight:700; color:#0f172a; text-align:center;">
                      Security Verification
                    </h1>
                    <p style="margin:0 0 12px 0; font-size:16px; line-height:26px; color:#475569; text-align:center;">
                      Hi <strong style="color:#0f172a;">${safeName}</strong>,
                    </p>
                    <p style="margin:0; font-size:16px; line-height:26px; color:#475569; text-align:center;">
                      Please use the following 6-digit code to complete your administrator login.
                    </p>
                  </td>
                </tr>

                <!-- OTP Box -->
                <tr>
                  <td align="center" style="padding:28px 40px;">
                    <div style="background-color:#f8fafc; border:2px dashed #cbd5e1; border-radius:12px; padding:20px 40px; font-family:'Courier New', Courier, monospace; font-size:36px; font-weight:bold; letter-spacing:8px; color:#1e3a8a;">
                      ${safeOtp}
                    </div>
                  </td>
                </tr>

                <!-- Expiry notice -->
                <tr>
                  <td align="center" style="padding:0 40px 36px 40px; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
                    <p style="margin:0; font-size:14px; line-height:20px; color:#64748b;">
                      This code expires in <strong>5 minutes</strong>. If you did not attempt to log in, please secure your account immediately.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 16px 0 16px; font-family:'Segoe UI', Helvetica, Arial, sans-serif; font-size:12px; line-height:18px; color:#94a3b8;">
              &copy; ${new Date().getFullYear()} EventGo Ticketing. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};