import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, createSessionToken, setAdminSessionCookie, setCustomerSessionCookie } from "@/lib/auth/jwt";
import { adminAuthRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    if (!adminAuthRateLimit.check(ip, 5, 15 * 60 * 1000)) { // 5 attempts per 15 minutes
      return NextResponse.json({ error: "Too many login attempts, please try again later." }, { status: 429 });
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }

    const token = await createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await setAdminSessionCookie(token);
    await setCustomerSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    console.error("Authentication error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
