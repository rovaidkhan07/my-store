import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  createSessionToken,
  setCustomerSessionCookie,
} from "@/lib/auth/jwt";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function POST(req: NextRequest) {
  try {
    if (!GOOGLE_CLIENT_ID) {
      return NextResponse.json(
        { error: "Google sign-in is not configured. Please contact support." },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { credential } = body;

    if (!credential || typeof credential !== "string") {
      return NextResponse.json(
        { error: "Google credential is missing" },
        { status: 400 }
      );
    }

    // Verify the ID token with Google — this is the real authentication.
    // An attacker cannot forge this; only Google can sign it.
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return NextResponse.json(
        { error: "Google verification failed — email not found" },
        { status: 401 }
      );
    }

    if (!payload.email_verified) {
      return NextResponse.json(
        { error: "Google email is not verified" },
        { status: 401 }
      );
    }

    const cleanEmail = payload.email.toLowerCase().trim();
    const cleanName = (payload.name || cleanEmail.split("@")[0]).trim();

    // Find or create customer
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      // Create new customer account with random secure password hash
      // (Google users never use password login; this is a placeholder)
      const randomPassword = `google-auth-${Date.now()}-${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
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
    return NextResponse.json(
      { error: "Google sign-in verification failed. Please try again." },
      { status: 401 }
    );
  }
}
