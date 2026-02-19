'use client'
import { useEffect, useState } from 'react'
import Shell from '@/components/Shell'

interface Card { id: number; word: string; meaning: string; exampleEn: string; exampleOwn?: string; nextReview: string; repetitions: number; interval: number }
type Tab = 'review' | 'add' | 'list'

const QUALITY_BTNS = [
  { label: '😰 Bilmedim', q: 0, color: '#ef4444' },
  { label: '🤔 Zor',      q: 3, color: '#f97316' },
  { label: '👍 Kolay',    q: 4, color: '#8b5cf6' },
  { label: '⚡ Refleks',  q: 5, color: '#10b981' },
]

export default function FlashcardsPage() {
  const [tab, setTab] = useState<Tab>('review')
  const [due, setDue] = useState<Card[]>([])
  const [all, setAll] = useState<Card[]>([])
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({ word: '', meaning: '', exampleEn: '', exampleOwn: '' })
  const [saving, setSaving] = useState(false)
  const [xpPop, setXpPop] = useState('')

  const loadDue = () => fetch('/api/flashcards')
    .then(r => r.json())
    .then((d: Card[]) => { setDue(d); setIdx(0); setFlipped(false); setDone(false) })

  const loadAll = () => fetch('/api/flashcards?all=1').then(r => r.json()).then(setAll)

  useEffect(() => { loadDue() }, [])
  useEffect(() => { if (tab === 'list') loadAll() }, [tab])

  const cur = due[idx]

  const review = async (q: number) => {
    if (!cur) return
    await fetch('/api/flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'review', id: cur.id, quality: q }),
    })
    await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: `Kart tekrar: ${cur.word}`, type: 'Kelime', xp: 5 }),
    })
    setXpPop('+5 XP')
    setTimeout(() => setXpPop(''), 800)
    if (idx + 1 >= due.length) setDone(true)
    else { setIdx(idx + 1); setFlipped(false) }
  }

  const addCard = async () => {
    if (!form.word || !form.meaning || !form.exampleEn) return
    setSaving(true)
    await fetch('/api/flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: `Yeni kelime: ${form.word}`, type: 'Kelime', xp: 5 }),
    })
    setSaving(false)
    setXpPop('+5 XP ✅')
    setTimeout(() => setXpPop(''), 1000)
    setForm({ word: '', meaning: '', exampleEn: '', exampleOwn: '' })
    loadDue()
  }

  return (
    <Shell>
      <div className="fade-up">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: -1 }}>🃏 Flashcards</h1>
            <p style={{ color: 'var(--muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, marginTop: 6 }}>
              SM-2 spaced repetition · {due.length} kart bekliyor
            </p>
          </div>
          {xpPop && (
            <div className="pop" style={{
              fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, fontSize: 22,
              color: 'var(--accent3)', background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: '8px 16px',
            }}>{xpPop}</div>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {(['review', 'add', 'list'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`btn-ghost${tab === t ? ' active' : ''}`}>
              {t === 'review' ? `📖 Tekrar (${due.length})` : t === 'add' ? '➕ Yeni Kelime' : '📋 Tüm Kartlar'}
            </button>
          ))}
        </div>

        {/* REVIEW */}
        {tab === 'review' && (
          due.length === 0 || done ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>Tüm kartlar tamam!</div>
              <div style={{ color: 'var(--muted)', marginTop: 10, fontSize: 14 }}>Bugünlük tekrar bitti. Yeni kelime ekleyebilirsin.</div>
              <button className="btn-primary" style={{ marginTop: 24 }} onClick={() => setTab('add')}>Yeni Kelime Ekle</button>
            </div>
          ) : (
            <div>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>
                {idx + 1} / {due.length}
              </div>

              {/* Progress bar */}
              <div className="xp-bar" style={{ marginBottom: 20 }}>
                <div className="xp-bar-fill" style={{ width: `${((idx) / due.length) * 100}%` }} />
              </div>

              {/* Card */}
              <div className="flip-card" style={{ cursor: 'pointer', height: 260, marginBottom: 24 }} onClick={() => setFlipped(!flipped)}>
                <div className={`flip-inner${flipped ? ' flipped' : ''}`} style={{ height: '100%' }}>
                  {/* Front */}
                  <div className="flip-front card" style={{
                    position: 'absolute', width: '100%', height: '100%',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    borderColor: 'rgba(245,158,11,0.2)',
                  }}>
                    <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -2 }}>{cur.word}</div>
                    <div style={{ color: 'var(--muted)', marginTop: 20, fontSize: 12, fontFamily: 'IBM Plex Mono, monospace' }}>
                      → çevirmek için tıkla
                    </div>
                  </div>
                  {/* Back */}
                  <div className="flip-back card" style={{
                    position: 'absolute', width: '100%', height: '100%',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(139,92,246,0.06)', borderColor: 'rgba(139,92,246,0.3)',
                    textAlign: 'center', padding: 32,
                  }}>
                    <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent2)', marginBottom: 16 }}>{cur.meaning}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 14, fontStyle: 'italic' }}>"{cur.exampleEn}"</div>
                    {cur.exampleOwn && <div style={{ color: 'var(--accent3)', fontSize: 13, marginTop: 10 }}>✍️ {cur.exampleOwn}</div>}
                  </div>
                </div>
              </div>

              {flipped && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  {QUALITY_BTNS.map(b => (
                    <button key={b.q} onClick={() => { setFlipped(false); review(b.q) }} style={{
                      background: `${b.color}18`,
                      border: `1px solid ${b.color}55`,
                      borderRadius: 10, padding: '14px 8px', color: b.color,
                      fontFamily: 'Epilogue, sans-serif', fontWeight: 800, cursor: 'pointer',
                      fontSize: 13, transition: 'all 0.15s',
                    }}>
                      {b.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        )}

        {/* ADD */}
        {tab === 'add' && (
          <div className="card" style={{ maxWidth: 520 }}>
            <div style={{ fontWeight: 800, marginBottom: 16 }}>Yeni Kelime Ekle</div>
            <div style={{ display: 'grid', gap: 12 }}>
              <input className="input" placeholder="Kelime (İngilizce)" value={form.word} onChange={e => setForm({ ...form, word: e.target.value })} />
              <input className="input" placeholder="Türkçe anlam" value={form.meaning} onChange={e => setForm({ ...form, meaning: e.target.value })} />
              <textarea className="input" placeholder="İngilizce örnek cümle" rows={2} value={form.exampleEn} onChange={e => setForm({ ...form, exampleEn: e.target.value })} style={{ resize: 'vertical' }} />
              <textarea className="input" placeholder="Kendi cümlen (opsiyonel)" rows={2} value={form.exampleOwn} onChange={e => setForm({ ...form, exampleOwn: e.target.value })} style={{ resize: 'vertical' }} />
              <button className="btn-primary" onClick={addCard} disabled={saving || !form.word || !form.meaning || !form.exampleEn}>
                {saving ? 'Kaydediliyor...' : 'Kelime Ekle (+5 XP)'}
              </button>
            </div>
          </div>
        )}

        {/* LIST */}
        {tab === 'list' && (
          <div className="card">
            <div style={{ fontWeight: 800, marginBottom: 16 }}>{all.length} Kelime</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 580, overflowY: 'auto' }}>
              {all.map(c => (
                <div key={c.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: 'var(--surface2)', borderRadius: 8, padding: '12px 16px',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{c.word}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>{c.meaning}</div>
                  </div>
                  <div style={{ textAlign: 'right', fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: 'var(--muted)', flexShrink: 0 }}>
                    <div>{c.repetitions} tekrar</div>
                    <div>{c.interval}g interval</div>
                  </div>
                </div>
              ))}
              {all.length === 0 && <div style={{ color: 'var(--muted)', textAlign: 'center', padding: 40, fontFamily: 'IBM Plex Mono, monospace', fontSize: 13 }}>henüz kelime yok</div>}
            </div>
          </div>
        )}
      </div>
    </Shell>
  )
}
