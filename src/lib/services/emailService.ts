import { Resend } from "resend";
import nodemailer from "nodemailer";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function getSmtpTransporter() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }
  return null;
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
  const resend = getResendClient();
  const resendFrom = process.env.RESEND_FROM || "onboarding@resend.dev";

  // 1. Primary: Resend API
  if (resend) {
    try {
      const response = await resend.emails.send({
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
  const transporter = getSmtpTransporter();
  const smtpFrom = process.env.SMTP_FROM || "MobileHub <no-reply@mobilehub.pk>";
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
  console.log(`==================================================\n`);

  return { success: true };
}

/**
 * Sends a high-end Luxury Branded Verification OTP Email
 */
export async function sendVerificationEmail(toEmail: string, otpCode: string, customerName?: string) {
  const subject = `${otpCode} is your MobileHub verification code`;
  const nameDisplay = customerName ? customerName.trim() : "Valued Customer";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your MobileHub Account</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #FAF8F5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #FAF8F5;
      padding: 40px 16px;
    }
    .main-card {
      background-color: #FFFFFF;
      margin: 0 auto;
      max-width: 540px;
      border-radius: 28px;
      border: 1px solid #E7E0D6;
      box-shadow: 0 10px 30px rgba(10, 13, 20, 0.04);
      overflow: hidden;
    }
    .header-banner {
      background-color: #0A0D14;
      padding: 32px 24px;
      text-align: center;
    }
    .brand-pill {
      display: inline-block;
      background-color: #161B26;
      border: 1px solid #2B3545;
      padding: 8px 18px;
      border-radius: 9999px;
      color: #FFFFFF;
      font-weight: 900;
      font-size: 15px;
      letter-spacing: -0.3px;
    }
    .brand-accent {
      color: #FF5500;
    }
    .content-body {
      padding: 40px 36px 32px;
    }
    .badge-tag {
      display: inline-block;
      background-color: #FAF8F5;
      border: 1px solid #E7E0D6;
      color: #0A0D14;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 6px 14px;
      border-radius: 9999px;
      margin-bottom: 16px;
    }
    .headline {
      color: #0A0D14;
      font-size: 26px;
      font-weight: 900;
      line-height: 1.25;
      margin: 0 0 16px;
      letter-spacing: -0.8px;
      text-transform: uppercase;
    }
    .paragraph {
      color: #4A5568;
      font-size: 14px;
      line-height: 1.65;
      margin: 0 0 24px;
    }
    .otp-container {
      background: linear-gradient(180deg, #FAF8F5 0%, #F5F1EB 100%);
      border: 2px dashed #0A0D14;
      border-radius: 20px;
      padding: 26px 16px;
      text-align: center;
      margin: 28px 0;
    }
    .otp-label {
      font-size: 11px;
      font-weight: 800;
      color: #718096;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 10px;
    }
    .otp-digits {
      font-family: 'SF Mono', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      font-size: 42px;
      font-weight: 900;
      color: #0A0D14;
      letter-spacing: 12px;
      margin: 0 0 10px;
      padding-left: 12px;
    }
    .otp-timer {
      display: inline-block;
      background-color: #FFFFFF;
      border: 1px solid #E2E8F0;
      color: #FF5500;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 9999px;
    }
    .features-row {
      background-color: #FAF8F5;
      border-radius: 16px;
      padding: 16px;
      margin-top: 24px;
    }
    .feature-item {
      font-size: 12px;
      color: #4A5568;
      font-weight: 600;
      line-height: 1.6;
    }
    .feature-item span {
      color: #FF5500;
      font-weight: 900;
      margin-right: 6px;
    }
    .footer-section {
      background-color: #FAF8F5;
      border-top: 1px solid #E7E0D6;
      padding: 24px;
      text-align: center;
    }
    .whatsapp-btn {
      display: inline-block;
      background-color: #25D366;
      color: #FFFFFF !important;
      text-decoration: none;
      font-weight: 800;
      font-size: 12px;
      padding: 10px 20px;
      border-radius: 9999px;
      margin-bottom: 16px;
    }
    .legal-text {
      color: #A0AEC0;
      font-size: 11px;
      line-height: 1.5;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      <!-- Dark Brand Header -->
      <div class="header-banner">
        <div class="brand-pill">
          MOBILE<span class="brand-accent">HUB</span>
        </div>
      </div>

      <!-- Main Body -->
      <div class="content-body">
        <div class="badge-tag">
          🔒 Secure Email Verification
        </div>

        <h1 class="headline">
          Welcome to MobileHub
        </h1>

        <p class="paragraph">
          Assalam-o-Alaikum <strong>${nameDisplay}</strong>,<br><br>
          Thank you for creating an account. To complete your registration and activate your customer profile, please enter the following 6-digit confirmation code:
        </p>

        <!-- OTP Code Card -->
        <div class="otp-container">
          <div class="otp-label">Your Verification Code</div>
          <div class="otp-digits">${otpCode}</div>
          <div class="otp-timer">⏱️ Valid for 15 minutes</div>
        </div>

        <p class="paragraph" style="font-size: 12px; color: #718096; margin-bottom: 0;">
          For security reasons, never share this code with anyone. If you did not sign up for an account on MobileHub, you can safely ignore this email.
        </p>

        <!-- Perks Section -->
        <div class="features-row">
          <div class="feature-item"><span>✓</span> 100% Genuine Fast Chargers, GaN Adapters &amp; Cables</div>
          <div class="feature-item"><span>✓</span> Nationwide Cash on Delivery across Pakistan</div>
          <div class="feature-item"><span>✓</span> Live Courier Tracking from Warehouse to Doorstep</div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer-section">
        <a href="https://wa.me/923005879869" class="whatsapp-btn">
          Need Help? Chat on WhatsApp
        </a>
        <p class="legal-text">
          &copy; 2026 MobileHub Technologies Pakistan. All rights reserved.<br>
          Karachi, Lahore, Islamabad &amp; Nationwide Delivery.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;

  return await sendEmail({ to: toEmail, subject, html });
}

/**
 * Sends a high-end Luxury Branded Password Reset OTP Email
 */
export async function sendPasswordResetEmail(toEmail: string, otpCode: string) {
  const subject = `${otpCode} is your MobileHub password reset code`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your MobileHub Password</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #FAF8F5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    table {
      border-collapse: collapse;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #FAF8F5;
      padding: 40px 16px;
    }
    .main-card {
      background-color: #FFFFFF;
      margin: 0 auto;
      max-width: 540px;
      border-radius: 28px;
      border: 1px solid #E7E0D6;
      box-shadow: 0 10px 30px rgba(10, 13, 20, 0.04);
      overflow: hidden;
    }
    .header-banner {
      background-color: #0A0D14;
      padding: 32px 24px;
      text-align: center;
    }
    .brand-pill {
      display: inline-block;
      background-color: #161B26;
      border: 1px solid #2B3545;
      padding: 8px 18px;
      border-radius: 9999px;
      color: #FFFFFF;
      font-weight: 900;
      font-size: 15px;
      letter-spacing: -0.3px;
    }
    .brand-accent {
      color: #FF5500;
    }
    .content-body {
      padding: 40px 36px 32px;
    }
    .badge-tag {
      display: inline-block;
      background-color: #FFF5F5;
      border: 1px solid #FED7D7;
      color: #C53030;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 6px 14px;
      border-radius: 9999px;
      margin-bottom: 16px;
    }
    .headline {
      color: #0A0D14;
      font-size: 26px;
      font-weight: 900;
      line-height: 1.25;
      margin: 0 0 16px;
      letter-spacing: -0.8px;
      text-transform: uppercase;
    }
    .paragraph {
      color: #4A5568;
      font-size: 14px;
      line-height: 1.65;
      margin: 0 0 24px;
    }
    .otp-container {
      background: linear-gradient(180deg, #FAF8F5 0%, #F5F1EB 100%);
      border: 2px dashed #FF5500;
      border-radius: 20px;
      padding: 26px 16px;
      text-align: center;
      margin: 28px 0;
    }
    .otp-label {
      font-size: 11px;
      font-weight: 800;
      color: #718096;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 10px;
    }
    .otp-digits {
      font-family: 'SF Mono', SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      font-size: 42px;
      font-weight: 900;
      color: #0A0D14;
      letter-spacing: 12px;
      margin: 0 0 10px;
      padding-left: 12px;
    }
    .otp-timer {
      display: inline-block;
      background-color: #FFFFFF;
      border: 1px solid #E2E8F0;
      color: #FF5500;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 9999px;
    }
    .footer-section {
      background-color: #FAF8F5;
      border-top: 1px solid #E7E0D6;
      padding: 24px;
      text-align: center;
    }
    .whatsapp-btn {
      display: inline-block;
      background-color: #25D366;
      color: #FFFFFF !important;
      text-decoration: none;
      font-weight: 800;
      font-size: 12px;
      padding: 10px 20px;
      border-radius: 9999px;
      margin-bottom: 16px;
    }
    .legal-text {
      color: #A0AEC0;
      font-size: 11px;
      line-height: 1.5;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      <!-- Dark Brand Header -->
      <div class="header-banner">
        <div class="brand-pill">
          MOBILE<span class="brand-accent">HUB</span>
        </div>
      </div>

      <!-- Main Body -->
      <div class="content-body">
        <div class="badge-tag">
          🔑 Password Reset Request
        </div>

        <h1 class="headline">
          Reset Your Password
        </h1>

        <p class="paragraph">
          Assalam-o-Alaikum,<br><br>
          We received a request to reset the password for your MobileHub customer account. Enter the 6-digit recovery code below to choose a new password:
        </p>

        <!-- OTP Code Card -->
        <div class="otp-container">
          <div class="otp-label">Password Recovery Code</div>
          <div class="otp-digits">${otpCode}</div>
          <div class="otp-timer">⏱️ Valid for 15 minutes</div>
        </div>

        <p class="paragraph" style="font-size: 12px; color: #718096; margin-bottom: 0;">
          If you did not request this password reset, please ignore this email or contact our support team immediately to secure your account.
        </p>
      </div>

      <!-- Footer -->
      <div class="footer-section">
        <a href="https://wa.me/923005879869" class="whatsapp-btn">
          Need Help? Chat on WhatsApp
        </a>
        <p class="legal-text">
          &copy; 2026 MobileHub Technologies Pakistan. All rights reserved.<br>
          Karachi, Lahore, Islamabad &amp; Nationwide Delivery.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;

  return await sendEmail({ to: toEmail, subject, html });
}
