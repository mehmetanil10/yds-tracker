import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { NextResponse } from 'next/server'

export async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  return (session?.user as any)?.id ?? null
}

export function unauthorized() {
  return NextResponse.json({ error: 'Giriş yapmanız gerekiyor' }, { status: 401 })
}
