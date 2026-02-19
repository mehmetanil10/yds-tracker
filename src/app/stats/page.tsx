'use client'
import { useEffect, useState } from 'react'
import Shell from '@/components/Shell'
import { getLevelInfo, LEVELS } from '@/lib/xp'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface Stats { totalXP: number; todayXP: number; streak: number; daily: { date: string; xp: number }[]; breakdown: Record<string, number> }

const TYPE_COLOR: Record<string, string> = {
  Kelime: '#60a5fa', Reading: '#10b981', Test: '#fbbf24', Writing: '#f97316', MiniParagraf: '#f97316', Deneme: '#8b5cf6'
}
const DAY_TR = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => { fetch('/api/stats').then(r => r.json()).then(setStats) }, [])

  if (!stats) return <Shell><div style={{ color: 'var(--muted)', fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, marginTop: 60 }}>yükleniyor...</div></Shell>

  const { current, next, progressPct } = getLevelInfo(stats.totalXP)
  const weekTotal = stats.daily.reduce((s, d) => s + d.xp, 0)
  const avg = Math.round(weekTotal / 7)
  const pie = Object.entries(stats.breakdown).map(([name, value]) => ({ name, value }))

  return (
    <Shell>
      <div className="fade-up">
        <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: -1, marginBottom: 28 }}>📊 İstatistikler</h1>

        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
          {[
            { l: 'TOPLAM XP', v: stats.totalXP.toLocaleString(), c: 'var(--accent)' },
            { l: 'BU HAFTA', v: weekTotal.toLocaleString(), c: '#8b5cf6' },
            { l: 'GÜNLÜK ORT.', v: avg, c: '#10b981' },
            { l: 'GÜN SERİSİ', v: `${stats.streak}🔥`, c: '#f97316' },
          ].map(s => (
            <div key={s.l} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: 12 }}>{s.l}</div>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 28, fontWeight: 700, color: s.c }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Level */}
        <div className="card" style={{ marginBottom: 20, borderColor: 'rgba(245,158,11,0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontWeight: 800 }}>{current.emoji} {current.title} → {next ? `${next.emoji} ${next.title}` : '👑 MAX'}</span>
            <span style={{ fontFamily: 'IBM Plex Mono, monospace', color: 'var(--accent)', fontWeight: 700 }}>{progressPct}%</span>
          </div>
          <div className="xp-bar" style={{ height: 8 }}>
            <div className="xp-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
          {next && <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 8, fontFamily: 'IBM Plex Mono, monospace' }}>
            {(next.min - stats.totalXP).toLocaleString()} XP daha kazanırsan Seviye {next.level}!
          </div>}
        </div>

        {/* Area chart */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 800, marginBottom: 20 }}>Haftalık XP Akışı</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={stats.daily}>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date"
                tickFormatter={d => DAY_TR[new Date(d + 'T12:00:00').getDay()]}
                tick={{ fill: '#5a5a7a', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
                axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, fontFamily: 'IBM Plex Mono' }}
                formatter={(v: any) => [`${v} XP`, '']} />
              <Area type="monotone" dataKey="xp" stroke="#f59e0b" fill="url(#g)" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie + breakdown */}
        {pie.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, marginBottom: 20 }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontWeight: 800, marginBottom: 12, alignSelf: 'flex-start' }}>Dağılım</div>
              <PieChart width={180} height={160}>
                <Pie data={pie} cx={90} cy={80} innerRadius={45} outerRadius={72} dataKey="value" paddingAngle={4}>
                  {pie.map((e, i) => <Cell key={i} fill={TYPE_COLOR[e.name] ?? '#f59e0b'} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', justifyContent: 'center' }}>
                {pie.map(e => (
                  <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: TYPE_COLOR[e.name] ?? '#f59e0b' }} />
                    <span style={{ color: 'var(--muted)' }}>{e.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div style={{ fontWeight: 800, marginBottom: 16 }}>Kategori XP</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {Object.entries(stats.breakdown).sort(([, a], [, b]) => b - a).map(([type, xp]) => {
                  const pct = Math.round((xp / stats.totalXP) * 100)
                  const c = TYPE_COLOR[type] ?? '#f59e0b'
                  return (
                    <div key={type}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                        <span style={{ fontWeight: 600 }}>{type}</span>
                        <span style={{ fontFamily: 'IBM Plex Mono, monospace', color: c }}>{xp.toLocaleString()} XP ({pct}%)</span>
                      </div>
                      <div className="xp-bar">
                        <div className="xp-bar-fill" style={{ width: `${pct}%`, background: c }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Level grid */}
        <div className="card">
          <div style={{ fontWeight: 800, marginBottom: 16 }}>Seviye Yol Haritası</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
            {LEVELS.map(l => {
              const done = stats.totalXP >= l.max
              const active = l.level === current.level
              return (
                <div key={l.level} style={{
                  textAlign: 'center', padding: '14px 6px', borderRadius: 10,
                  background: active ? 'rgba(245,158,11,0.1)' : done ? 'rgba(16,185,129,0.07)' : 'var(--surface2)',
                  border: `1px solid ${active ? 'rgba(245,158,11,0.35)' : 'transparent'}`,
                  opacity: !done && !active && l.level > current.level ? 0.35 : 1,
                }}>
                  <div style={{ fontSize: 22 }}>{l.emoji}</div>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, color: 'var(--muted)', marginTop: 6 }}>LV.{l.level}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, marginTop: 3, color: active ? 'var(--accent)' : done ? '#10b981' : 'var(--muted)' }}>{l.title}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Shell>
  )
}
