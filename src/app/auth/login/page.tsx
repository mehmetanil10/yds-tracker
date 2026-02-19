'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })
    setLoading(false)
    if (res?.error) setError('Email veya şifre hatalı')
    else router.push('/')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: 24,
      background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.06) 0%, transparent 70%)',
    }}>
      <div className="auth-card fade-up">
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1 }}>
            YDS<span style={{ color: 'var(--accent)' }}>XP</span>
          </div>
          <div style={{ color: 'var(--muted)', marginTop: 6, fontSize: 14 }}>
            Hesabına giriş yap
          </div>
        </div>

        {error && <div className="alert-error" style={{ marginBottom: 16 }}>{error}</div>}

        <form onSubmit={submit} style={{ display: 'grid', gap: 14 }}>
          <input
            className="input"
            type="email"
            placeholder="Email adresi"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Şifre"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 4 }}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="divider" />

        <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>
          Hesabın yok mu?{' '}
          <Link href="/auth/register" style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>
            Kayıt ol
          </Link>
        </div>
      </div>
    </div>
  )
}
