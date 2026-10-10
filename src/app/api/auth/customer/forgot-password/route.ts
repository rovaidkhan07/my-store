import { NextRequest, NextResponse } from "next/server";
import { randomInt, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/jwt";
import { sendPasswordResetEmail } from "@/lib/services/emailService";
import { authRateLimit } from "@/lib/rate-limit";

interface RecoveryRecord {
  code: string;
  expiresAt: number;
  attempts: number;
}
const recoveryCodes = new Map<string, RecoveryRecord>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    if (!authRateLimit.check(ip, 5, 15 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await req.json();
    const { action, email, code, newPassword } = body;

    if (!email) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (action === "request") {
      if (user) {
        // Generate secure 6-digit verification code
        const otpCode = randomInt(100000, 1000000).toString();
        recoveryCodes.set(cleanEmail, {
          code: otpCode,
          expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
          attempts: 0,
        });

        // Send password reset email directly to inbox
        sendPasswordResetEmail(cleanEmail, otpCode);
      }

      // Always return success to prevent email enumeration
      return NextResponse.json({
        success: true,
        message: `If an account is registered with ${cleanEmail}, a password reset code has been sent. Please check your inbox.`,
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: "No account found registered with this email address." },
        { status: 404 }
      );
    }

    if (action === "reset") {
      if (!code || !newPassword) {
        return NextResponse.json(
          { error: "Verification OTP code and new password are required" },
          { status: 400 }
        );
      }

      if (typeof newPassword !== "string" || newPassword.length < 12) {
        return NextResponse.json(
          { error: "New password must be at least 12 characters long" },
          { status: 400 }
        );
      }

      const record = recoveryCodes.get(cleanEmail);
      if (!record || record.expiresAt < Date.now()) {
        return NextResponse.json(
          { error: "Verification code has expired. Please request a new code." },
          { status: 400 }
        );
      }

      if (record.attempts >= 5) {
        recoveryCodes.delete(cleanEmail);
        return NextResponse.json({ error: "Too many invalid attempts. Request a new code." }, { status: 429 });
      }
      const suppliedCode = typeof code === "string" ? code.trim() : "";
      const expected = Buffer.from(record.code);
      const received = Buffer.from(suppliedCode);
      if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
        record.attempts += 1;
        return NextResponse.json(
          { error: "Invalid 6-digit verification code. Please check your email and try again." },
          { status: 400 }
        );
      }

      // Hash new password and update in database
      const newHash = await hashPassword(newPassword);
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newHash },
      });

      // Clear used recovery code
      recoveryCodes.delete(cleanEmail);

      return NextResponse.json({
        success: true,
        message: "Your password has been successfully reset! You can now log in.",
      });
    }

    return NextResponse.json({ error: "Invalid action parameter" }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

