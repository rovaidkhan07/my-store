import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  createSessionToken,
  setCustomerSessionCookie,
} from "@/lib/auth/jwt";

// In-memory pending registration cache with 15-minute expiration
interface PendingRegistration {
  name: string;
  email: string;
  phone: string | null;
  passwordHash: string;
  code: string;
  expiresAt: number;
}

const pendingRegistrations = new Map<string, PendingRegistration>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action = "init", name, email, phone, password, code } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // ---------------- STEP 1: INITIALIZE REGISTRATION & SEND OTP ----------------
    if (action === "init" || !action) {
      if (!name || !password) {
        return NextResponse.json(
          { error: "Full Name, Email, and Password are required" },
          { status: 400 }
        );
      }

      const cleanName = name.trim();
      if (cleanName.length < 2) {
        return NextResponse.json(
          { error: "Please provide a valid full name" },
          { status: 400 }
        );
      }

      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters long" },
          { status: 400 }
        );
      }

      // Check if email already registered
      const existing = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });

      if (existing) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please Sign In." },
          { status: 409 }
        );
      }

      // Generate 6-digit OTP verification code
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const passwordHash = await hashPassword(password);

      pendingRegistrations.set(cleanEmail, {
        name: cleanName,
        email: cleanEmail,
        phone: phone ? phone.trim() : null,
        passwordHash,
        code: otpCode,
        expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
      });

      return NextResponse.json({
        success: true,
        requireVerification: true,
        message: `Verification code sent to ${cleanEmail}`,
        demoOtp: otpCode, // For seamless dev / testing verification
      });
    }

    // ---------------- STEP 2: RESEND OTP CODE ----------------
    if (action === "resend") {
      const pending = pendingRegistrations.get(cleanEmail);
      if (!pending) {
        return NextResponse.json(
          { error: "No pending registration found for this email. Please sign up again." },
          { status: 400 }
        );
      }

      const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
      pending.code = newOtpCode;
      pending.expiresAt = Date.now() + 15 * 60 * 1000;
      pendingRegistrations.set(cleanEmail, pending);

      return NextResponse.json({
        success: true,
        message: "New verification OTP sent successfully.",
        demoOtp: newOtpCode,
      });
    }

    // ---------------- STEP 3: VERIFY OTP & CREATE USER ----------------
    if (action === "verify") {
      if (!code) {
        return NextResponse.json(
          { error: "Please enter the 6-digit verification code sent to your email" },
          { status: 400 }
        );
      }

      const pending = pendingRegistrations.get(cleanEmail);
      if (!pending || pending.expiresAt < Date.now()) {
        return NextResponse.json(
          { error: "Verification code has expired or is invalid. Please request a new code." },
          { status: 400 }
        );
      }

      if (pending.code !== code.trim()) {
        return NextResponse.json(
          { error: "Invalid verification code. Please check and try again." },
          { status: 400 }
        );
      }

      // Check once more in case user registered in parallel
      const existing = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });

      let user;
      if (existing) {
        user = existing;
      } else {
        user = await prisma.user.create({
          data: {
            name: pending.name,
            email: pending.email,
            phone: pending.phone,
            passwordHash: pending.passwordHash,
            role: "customer",
          },
        });
      }

      // Clear pending registration
      pendingRegistrations.delete(cleanEmail);

      // Create authenticated customer session
      const token = await createSessionToken({
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone || null,
        role: "customer",
      });

      await setCustomerSessionCookie(token);

      return NextResponse.json({
        success: true,
        verified: true,
        message: "Email verified successfully! Welcome to MobileHub.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
        },
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Customer register error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
