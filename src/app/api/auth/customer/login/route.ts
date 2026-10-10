import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  comparePassword,
  createSessionToken,
  setCustomerSessionCookie,
  setAdminSessionCookie,
} from "@/lib/auth/jwt";
import { authRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";
    if (!(await authRateLimit.check(ip, 8, 15 * 60 * 1000))) {
      return NextResponse.json(
        { error: "Too many login attempts, please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password. Please check your credentials." },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password. Please check your credentials." },
        { status: 401 }
      );
    }

    const token = await createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone || null,
      role: user.role as "customer" | "admin",
    });

    await setCustomerSessionCookie(token);
    if (user.role === "admin") {
      await setAdminSessionCookie(token);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    console.error("Customer login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
