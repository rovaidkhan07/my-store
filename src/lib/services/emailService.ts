import nodemailer from "nodemailer";

// Configure SMTP transport with environment variables or fallback
const smtpHost = process.env.SMTP_HOST;
const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM || process.env.NEXT_PUBLIC_STORE_EMAIL || "no-reply@mobilehub.pk";

let transporter: nodemailer.Transporter | null = null;

if (smtpHost && smtpUser && smtpPass) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
}

/**
 * Sends a 6-digit Verification OTP email to the customer's inbox
 */
export async function sendVerificationEmail(toEmail: string, otpCode: string, customerName?: string) {
  const subject = `Your MobileHub Verification Code: ${otpCode}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>MobileHub Email Verification</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 40px 20px; }
    .container { max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; border: 1px solid #E7E0D6; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { text-align: center; margin-bottom: 28px; }
    .badge { display: inline-block; background-color: #0A0D14; color: #ffffff; padding: 10px 18px; border-radius: 16px; font-weight: 900; font-size: 16px; letter-spacing: -0.5px; }
    .badge span { color: #FF5500; }
    .title { font-size: 22px; font-weight: 900; color: #0A0D14; margin: 18px 0 8px; text-transform: uppercase; letter-spacing: -0.5px; }
    .text { font-size: 14px; color: #555555; line-height: 1.6; margin-bottom: 24px; }
    .otp-card { background-color: #FAF8F5; border: 2px dashed #FF5500; border-radius: 18px; padding: 20px; text-align: center; margin: 24px 0; }
    .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; color: #0A0D14; letter-spacing: 8px; margin: 0; }
    .expiry { font-size: 11px; color: #888888; margin-top: 8px; }
    .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #999999; border-top: 1px solid #EEEEEE; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">Mobile<span>Hub</span></div>
      <div class="title">Verify Your Email</div>
    </div>
    
    <p class="text">
      Assalam-o-Alaikum ${customerName ? `<strong>${customerName}</strong>` : "Customer"},<br><br>
      Thank you for creating an account with <strong>MobileHub</strong>. To complete your registration and activate your account, please enter the following 6-digit verification code:
    </p>

    <div class="otp-card">
      <div class="otp-code">${otpCode}</div>
      <div class="expiry">Valid for 15 minutes. Do not share this code with anyone.</div>
    </div>

    <p class="text" style="font-size: 12px; color: #777;">
      If you did not initiate this sign-up request, you can safely ignore this email.
    </p>

    <div class="footer">
      &copy; 2026 MobileHub Technologies Pakistan. Premium Mobile Accessories.<br>
      Need help? Contact support on WhatsApp: +92 300 5879869
    </div>
  </div>
</body>
</html>
`;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"MobileHub" <${smtpFrom}>`,
        to: toEmail,
        subject,
        html,
      });
      console.log(`[EmailService] Verification email sent to ${toEmail}`);
      return { success: true };
    } catch (err) {
      console.error(`[EmailService] Failed to send email via SMTP:`, err);
    }
  } else {
    // If SMTP is not yet configured, log to server console for local testing
    console.log(`\n==================================================`);
    console.log(`📧 [TRANSACTIONAL EMAIL DISPATCH - NO SMTP CONFIGURED]`);
    console.log(`To: ${toEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Verification Code: ${otpCode}`);
    console.log(`(To send real emails, set SMTP_HOST, SMTP_USER, SMTP_PASS in .env)`);
    console.log(`==================================================\n`);
  }

  return { success: true };
}

/**
 * Sends a Password Reset OTP email
 */
export async function sendPasswordResetEmail(toEmail: string, otpCode: string) {
  const subject = `Your MobileHub Password Reset Code: ${otpCode}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>MobileHub Password Reset</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 40px 20px; }
    .container { max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; border: 1px solid #E7E0D6; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { text-align: center; margin-bottom: 28px; }
    .badge { display: inline-block; background-color: #0A0D14; color: #ffffff; padding: 10px 18px; border-radius: 16px; font-weight: 900; font-size: 16px; letter-spacing: -0.5px; }
    .badge span { color: #FF5500; }
    .title { font-size: 22px; font-weight: 900; color: #0A0D14; margin: 18px 0 8px; text-transform: uppercase; letter-spacing: -0.5px; }
    .text { font-size: 14px; color: #555555; line-height: 1.6; margin-bottom: 24px; }
    .otp-card { background-color: #FAF8F5; border: 2px dashed #FF5500; border-radius: 18px; padding: 20px; text-align: center; margin: 24px 0; }
    .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; color: #0A0D14; letter-spacing: 8px; margin: 0; }
    .expiry { font-size: 11px; color: #888888; margin-top: 8px; }
    .footer { text-align: center; margin-top: 32px; font-size: 12px; color: #999999; border-top: 1px solid #EEEEEE; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">Mobile<span>Hub</span></div>
      <div class="title">Reset Account Password</div>
    </div>
    
    <p class="text">
      We received a request to reset the password for your <strong>MobileHub</strong> customer account. Please use the 6-digit recovery code below:
    </p>

    <div class="otp-card">
      <div class="otp-code">${otpCode}</div>
      <div class="expiry">Valid for 15 minutes. Never share this code with anyone.</div>
    </div>

    <p class="text" style="font-size: 12px; color: #777;">
      If you did not request a password reset, please secure your account immediately or contact our support team.
    </p>

    <div class="footer">
      &copy; 2026 MobileHub Technologies Pakistan.<br>
      Need help? Contact support on WhatsApp: +92 300 5879869
    </div>
  </div>
</body>
</html>
`;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"MobileHub" <${smtpFrom}>`,
        to: toEmail,
        subject,
        html,
      });
      console.log(`[EmailService] Password reset email sent to ${toEmail}`);
      return { success: true };
    } catch (err) {
      console.error(`[EmailService] Failed to send reset email via SMTP:`, err);
    }
  } else {
    console.log(`\n==================================================`);
    console.log(`📧 [PASSWORD RESET EMAIL DISPATCH - NO SMTP CONFIGURED]`);
    console.log(`To: ${toEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Reset Code: ${otpCode}`);
    console.log(`==================================================\n`);
  }

  return { success: true };
}
