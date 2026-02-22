import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.verifyToken || !user.verifyExpiry) {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  if (new Date() > user.verifyExpiry) {
    return NextResponse.json({ error: "Kodun süresi doldu" }, { status: 400 });
  }

  if (user.verifyToken !== code) {
    return NextResponse.json({ error: "Kod hatalı" }, { status: 400 });
  }

  await prisma.user.update({
    where: { email },
    data: { verified: true, verifyToken: null, verifyExpiry: null },
  });

  return NextResponse.json({ message: "Email doğrulandı" });
}
