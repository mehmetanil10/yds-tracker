import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email ve şifre gerekli" },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Bu email zaten kayıtlı" },
      { status: 409 },
    );
  }

  const hashed = await bcrypt.hash(password, 12);
  const code = generateCode();
  const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 dakika

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      verified: false,
      verifyToken: code,
      verifyExpiry: expiry,
    },
  });

  await sendVerificationEmail(email, code);

  return NextResponse.json(
    { message: "Doğrulama kodu emailine gönderildi" },
    { status: 201 },
  );
}
