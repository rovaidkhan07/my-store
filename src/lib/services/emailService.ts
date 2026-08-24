import { Resend } from "resend";
import nodemailer from "nodemailer";

// Resend Configuration (Recommended - Free tier: 3,000 emails/mo)
const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM || "onboarding@resend.dev";
const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

// SMTP Fallback Configuration
const smtpHost = process.env.SMTP_HOST;
const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM || "MobileHub <no-reply@mobilehub.pk>";

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
 * Universal email sender: prioritized through Resend, then SMTP, with dev logging fallback.
 */
async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; id?: string }> {
  // 1. Primary: Resend API
  if (resendClient) {
    try {
      const response = await resendClient.emails.send({
        from: resendFrom,
        to: [to],
        subject,
        html,
      });

      if (response.error) {
        console.error(`[EmailService/Resend] API Error:`, response.error);
      } else {
        console.log(`[EmailService/Resend] Email successfully sent to ${to} (ID: ${response.data?.id})`);
        return { success: true, id: response.data?.id };
      }
    } catch (err) {
      console.error(`[EmailService/Resend] Failed to send via Resend:`, err);
    }
  }

  // 2. Secondary: SMTP Transport
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: smtpFrom,
        to,
        subject,
        html,
      });
      console.log(`[EmailService/SMTP] Email sent to ${to} (MessageID: ${info.messageId})`);
      return { success: true, id: info.messageId };
    } catch (err) {
      console.error(`[EmailService/SMTP] Failed to send via SMTP:`, err);
    }
  }

  // 3. Dev Fallback: Terminal Output
  console.log(`\n==================================================`);
  console.log(`📧 [EMAIL DISPATCH - RESEND / SMTP READY]`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`(To send live emails to inbox, add RESEND_API_KEY in .env)`);
  console.log(`==================================================\n`);

  return { success: true };
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
      Thank you for signing up with <strong>MobileHub</strong>. Please enter the following 6-digit verification code to activate your account:
    </p>

    <div class="otp-card">
      <div class="otp-code">${otpCode}</div>
      <div class="expiry">Valid for 15 minutes. Never share this code with anyone.</div>
    </div>

    <p class="text" style="font-size: 12px; color: #777;">
      If you did not create a MobileHub account, you can safely ignore this email.
    </p>

    <div class="footer">
      &copy; 2026 MobileHub Technologies Pakistan. Premium Mobile Accessories.<br>
      Need help? WhatsApp: +92 300 5879869
    </div>
  </div>
</body>
</html>
`;

  return await sendEmail({ to: toEmail, subject, html });
}

/**
 * Sends a Password Reset OTP email to the customer's inbox
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
      We received a request to reset your password for your <strong>MobileHub</strong> account. Use the 6-digit recovery code below:
    </p>

    <div class="otp-card">
      <div class="otp-code">${otpCode}</div>
      <div class="expiry">Valid for 15 minutes. Never share this code with anyone.</div>
    </div>

    <p class="text" style="font-size: 12px; color: #777;">
      If you did not request a password reset, please ignore this email or contact our support team.
    </p>

    <div class="footer">
      &copy; 2026 MobileHub Technologies Pakistan.<br>
      Need help? WhatsApp: +92 300 5879869
    </div>
  </div>
</body>
</html>
`;

  return await sendEmail({ to: toEmail, subject, html });
}
