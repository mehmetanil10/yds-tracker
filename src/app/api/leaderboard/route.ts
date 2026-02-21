import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      activities: {
        select: { xp: true },
      },
    },
  });

  const leaderboard = users
    .map((u) => ({
      id: u.id,
      name: u.name ?? u.email?.split("@")[0] ?? "Anonim",
      totalXP: u.activities.reduce((s, a) => s + a.xp, 0),
    }))
    .filter((u) => u.totalXP > 0)
    .sort((a, b) => b.totalXP - a.totalXP)
    .slice(0, 10);

  return NextResponse.json(leaderboard);
}
