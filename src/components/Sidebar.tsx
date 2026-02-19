'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

const NAV = [
  { href: '/',            label: 'Dashboard', icon: '⚡' },
  { href: '/log',         label: 'XP Kaydet',  icon: '✅' },
  { href: '/flashcards',  label: 'Flashcards', icon: '🃏' },
  { href: '/stats',       label: 'İstatistik', icon: '📊' },
]

export default function Sidebar() {
  const path = usePathname()
  const { data: session } = useSession()

  return (
    <aside style={{
      width: 210,
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 12px',
      position: 'sticky',
      top: 0,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '4px 14px', marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -1 }}>
          YDS<span style={{ color: 'var(--accent)' }}>XP</span>
        </div>
        <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'IBM Plex Mono, monospace', marginTop: 2 }}>
          çalış · kazan · geç
        </div>
      </div>

      {/* Nav links */}
      {NAV.map((n) => (
        <Link key={n.href} href={n.href} style={{ textDecoration: 'none' }}>
          <div className={`nav-item${path === n.href ? ' active' : ''}`}>
            <span style={{ fontSize: 16 }}>{n.icon}</span>
            <span>{n.label}</span>
          </div>
        </Link>
      ))}

      <div style={{ flex: 1 }} />

      {/* User info + sign out */}
      {session?.user && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <div style={{ padding: '0 14px 12px', fontSize: 12, color: 'var(--muted)' }}>
            <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
              {session.user.name ?? 'Kullanıcı'}
            </div>
            <div style={{ fontSize: 11, fontFamily: 'IBM Plex Mono, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {session.user.email}
            </div>
          </div>
          <button className="nav-item" onClick={() => signOut({ callbackUrl: '/auth/login' })}
            style={{ color: '#ef4444', fontSize: 13 }}>
            <span>🚪</span>
            <span>Çıkış Yap</span>
          </button>
        </div>
      )}
    </aside>
  )
}
