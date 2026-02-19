import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/session'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()

  const all = await prisma.activity.findMany({ where: { userId } })
  const totalXP = all.reduce((s, a) => s + a.xp, 0)

  // Last 7 days
  const daily: Record<string, number> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    daily[d.toISOString().slice(0, 10)] = 0
  }
  all.forEach((a) => {
    const key = new Date(a.date).toISOString().slice(0, 10)
    if (key in daily) daily[key] += a.xp
  })

  const todayXP = daily[new Date().toISOString().slice(0, 10)] ?? 0

  const breakdown: Record<string, number> = {}
  all.forEach((a) => {
    breakdown[a.type] = (breakdown[a.type] ?? 0) + a.xp
  })

  // Streak
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const dayXP = all
      .filter((a) => new Date(a.date).toISOString().slice(0, 10) === key)
      .reduce((s, a) => s + a.xp, 0)
    if (dayXP > 0) streak++
    else if (i > 0) break
  }

  return NextResponse.json({
    totalXP,
    todayXP,
    streak,
    daily: Object.entries(daily).map(([date, xp]) => ({ date, xp })),
    breakdown,
  })
}
