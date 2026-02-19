'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Sidebar from './Sidebar'

export default function Shell({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
  }, [status, router])

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: 13 }}>
          Yükleniyor...
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') return null

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '36px 40px', maxWidth: 960, overflowX: 'hidden' }}>
        {children}
      </main>
    </div>
  )
}
