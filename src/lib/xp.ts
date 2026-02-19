export const XP_VALUES = {
  Kelime: 5,
  Reading: 20,
  Test: 10,
  Writing: 10,
  MiniParagraf: 40,
  Deneme: 150,
} as const

export type ActivityType = 'Kelime' | 'Reading' | 'Test' | 'Writing' | 'MiniParagraf' | 'Deneme'

export const LEVELS = [
  { level: 1, min: 0,    max: 500,      title: 'Başlangıç', emoji: '🌱' },
  { level: 2, min: 500,  max: 1200,     title: 'Çaylak',    emoji: '📖' },
  { level: 3, min: 1200, max: 2500,     title: 'Öğrenci',   emoji: '🎯' },
  { level: 4, min: 2500, max: 4000,     title: 'Kararlı',   emoji: '⚡' },
  { level: 5, min: 4000, max: 6000,     title: 'Usta',      emoji: '🔥' },
  { level: 6, min: 6000, max: 9000,     title: 'Uzman',     emoji: '💎' },
  { level: 7, min: 9000, max: Infinity, title: 'Efsane',    emoji: '👑' },
]

export function getLevelInfo(totalXP: number) {
  const current = LEVELS.find((l) => totalXP >= l.min && totalXP < l.max) ?? LEVELS[LEVELS.length - 1]
  const next = LEVELS.find((l) => l.level === current.level + 1)
  const progressInLevel = totalXP - current.min
  const levelRange = (next?.min ?? current.max) - current.min
  const progressPct = Math.min(100, Math.round((progressInLevel / levelRange) * 100))
  return { current, next, progressPct, progressInLevel, levelRange }
}

export function getDailyGoalStatus(xp: number) {
  if (xp >= 700) return { label: 'Peak Gün! 🔥', color: '#f97316', pct: 100 }
  if (xp >= 500) return { label: 'Çok İyi! ⚡', color: '#a78bfa', pct: Math.round((xp / 700) * 100) }
  if (xp >= 300) return { label: 'Harika! ✅', color: '#34d399', pct: Math.round((xp / 700) * 100) }
  if (xp >= 100) return { label: 'Devam Et 💪', color: '#60a5fa', pct: Math.round((xp / 700) * 100) }
  return { label: 'Başla 🌙', color: '#6b7080', pct: Math.round((xp / 700) * 100) }
}

// SM-2 algorithm
export function sm2(easeFactor: number, interval: number, repetitions: number, quality: number) {
  let newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (newEF < 1.3) newEF = 1.3

  let newInterval: number
  let newReps: number

  if (quality < 3) {
    newInterval = 1
    newReps = 0
  } else {
    newReps = repetitions + 1
    if (repetitions === 0) newInterval = 1
    else if (repetitions === 1) newInterval = 6
    else newInterval = Math.round(interval * newEF)
  }

  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + newInterval)

  return { newEF, newInterval, newReps, nextReview }
}
