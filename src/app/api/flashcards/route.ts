import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sm2 } from '@/lib/xp'
import { getUserId, unauthorized } from '@/lib/session'

export async function GET(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()

  const { searchParams } = new URL(req.url)
  const all = searchParams.get('all') === '1'
  const now = new Date()

  const cards = await prisma.flashcard.findMany({
    where: all ? { userId } : { userId, nextReview: { lte: now } },
    orderBy: { nextReview: 'asc' },
    take: all ? 1000 : 50,
  })
  return NextResponse.json(cards)
}

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()

  const body = await req.json()

  if (body.action === 'review') {
    const card = await prisma.flashcard.findFirst({
      where: { id: body.id, userId },
    })
    if (!card) return NextResponse.json({ error: 'not found' }, { status: 404 })

    const { newEF, newInterval, newReps, nextReview } = sm2(
      card.easeFactor, card.interval, card.repetitions, body.quality
    )
    const updated = await prisma.flashcard.update({
      where: { id: body.id },
      data: { easeFactor: newEF, interval: newInterval, repetitions: newReps, nextReview },
    })
    return NextResponse.json(updated)
  }

  const card = await prisma.flashcard.create({
    data: {
      userId,
      word: body.word,
      meaning: body.meaning,
      exampleEn: body.exampleEn,
      exampleOwn: body.exampleOwn ?? null,
    },
  })
  return NextResponse.json(card)
}

export async function DELETE(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()

  const { searchParams } = new URL(req.url)
  const id = parseInt(searchParams.get('id') ?? '0')
  await prisma.flashcard.deleteMany({ where: { id, userId } })
  return NextResponse.json({ ok: true })
}
