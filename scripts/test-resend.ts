import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

async function testResend() {
  const apiKey = process.env.RESEND_API_KEY;
  console.log("Using API Key:", apiKey ? `${apiKey.substring(0, 8)}...` : "NONE");

  const resend = new Resend(apiKey);

  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "muhammad.rovaid@zaxiss.com",
      subject: "MobileHub Email Verification Test",
      html: `
        <div style="font-family: sans-serif; padding: 24px; background: #FAF8F5; border-radius: 16px;">
          <h1 style="color: #0A0D14;">MobileHub OTP Test</h1>
          <p>Assalam-o-Alaikum Muhammad Rovaid,</p>
          <p>Your 6-digit MobileHub verification code is: <strong style="font-size: 24px; color: #FF5500; font-family: monospace;">829401</strong></p>
          <p>Resend integration is working perfectly!</p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully via Resend! Response:", data);
  } catch (error) {
    console.error("❌ Resend error:", error);
  }
}

testResend();
