import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId, unauthorized } from "@/lib/session";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return unauthorized();

  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get("days") ?? "30");
  const since = new Date();
  since.setDate(since.getDate() - days);

  const activities = await prisma.activity.findMany({
    where: { userId, date: { gte: since } },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(activities);
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return unauthorized();

  const body = await req.json();
  const activity = await prisma.activity.create({
    data: {
      userId,
      task: body.task,
      type: body.type,
      xp: body.xp,
      note: body.note ?? null,
      date: body.date ? new Date(body.date) : new Date(),
    },
  });
  return NextResponse.json(activity);
}

export async function DELETE(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return unauthorized();

  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id") ?? "0");

  // Only delete if belongs to user
  await prisma.activity.deleteMany({ where: { id, userId } });
  return NextResponse.json({ ok: true });
}
