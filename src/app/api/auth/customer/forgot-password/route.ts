import { NextRequest, NextResponse } from "next/server";
import { randomInt, createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/jwt";
import { sendPasswordResetEmail } from "@/lib/services/emailService";
import { authRateLimit } from "@/lib/rate-limit";

const RESET_TTL_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const successMessage = "If an account is registered with this email, a password reset code has been sent.";

function codeHash(userId: string, code: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET");
  return createHmac("sha256", secret).update(userId).update(":").update(code).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
    if (!authRateLimit.check(ip, 5, RESET_TTL_MS)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }
    const body = await req.json();
    const { action, email, code, newPassword } = body ?? {};
    if (typeof email !== "string" || email.length > 254 || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "Valid email address is required" }, { status: 400 });
    }
    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail }, select: { id: true } });

    if (action === "request") {
      if (user) {
        const otpCode = randomInt(100000, 1000000).toString();
        await prisma.passwordResetToken.upsert({
          where: { userId: user.id },
          create: { userId: user.id, codeHash: codeHash(user.id, otpCode), expiresAt: new Date(Date.now() + RESET_TTL_MS), attempts: 0 },
          update: { codeHash: codeHash(user.id, otpCode), expiresAt: new Date(Date.now() + RESET_TTL_MS), attempts: 0 },
        });
        await sendPasswordResetEmail(cleanEmail, otpCode);
      }
      return NextResponse.json({ success: true, message: successMessage });
    }

    if (action !== "reset") return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    if (typeof code !== "string" || !/^\\d{6}$/.test(code.trim()) ||
        typeof newPassword !== "string" || newPassword.length < 12 || newPassword.length > 128) {
      return NextResponse.json({ error: "A six-digit code and a password of 12-128 characters are required." }, { status: 400 });
    }
    if (!user) return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 400 });
    const submittedHash = Buffer.from(codeHash(user.id, code.trim()), "hex");
    const newHash = await hashPassword(newPassword);
    const result = await prisma.$transaction(async (tx) => {
      const record = await tx.passwordResetToken.findUnique({ where: { userId: user.id } });
      if (!record || record.expiresAt <= new Date() || record.attempts >= MAX_ATTEMPTS) return "invalid";
      const attempts = await tx.passwordResetToken.updateMany({
        where: { userId: user.id, codeHash: record.codeHash, attempts: { lt: MAX_ATTEMPTS }, expiresAt: { gt: new Date() } },
        data: { attempts: { increment: 1 } },
      });
      if (attempts.count !== 1) return "invalid";
      const expectedHash = Buffer.from(record.codeHash, "hex");
      if (expectedHash.length !== submittedHash.length || !timingSafeEqual(expectedHash, submittedHash)) return "invalid";
      const consumed = await tx.passwordResetToken.deleteMany({
        where: { userId: user.id, codeHash: record.codeHash, attempts: { lte: MAX_ATTEMPTS } },
      });
      if (consumed.count !== 1) return "invalid";
      await tx.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });
      return "success";
    });
    if (result !== "success") return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 400 });
    return NextResponse.json({ success: true, message: "Password reset successfully. Please log in." });
  } catch (error) {
    console.error("Password reset failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
