import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  createSessionToken,
  setCustomerSessionCookie,
} from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, picture } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: "Google account details are missing (Email and Name required)" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();

    // Find or create customer
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      // Create new customer account with random secure password hash
      const randomPassword = `google-auth-${Math.random().toString(36).substring(2)}${Date.now()}`;
      const passwordHash = await hashPassword(randomPassword);

      user = await prisma.user.create({
        data: {
          name: cleanName,
          email: cleanEmail,
          passwordHash,
          role: "customer",
        },
      });
    }

    const token = await createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone || null,
      role: user.role as "customer" | "admin",
    });

    await setCustomerSessionCookie(token);

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
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Google login error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
