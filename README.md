# YDS/YÖKDİL XP Tracker 🎯

Next.js + Prisma + PostgreSQL + NextAuth ile tam production-ready çalışma takip sistemi.

## Stack

| Katman | Teknoloji |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Backend | Next.js API Routes |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js (Credentials) |
| Charts | Recharts |
| Algo | SM-2 Spaced Repetition |

---

## Kurulum

### 1. PostgreSQL kur ve veritabanı oluştur

```bash
# macOS
brew install postgresql@16
brew services start postgresql@16

# Ubuntu/Debian
sudo apt install postgresql
sudo systemctl start postgresql

# Veritabanı oluştur
psql -U postgres -c "CREATE DATABASE yds_tracker;"
```

### 2. Projeyi kur

```bash
# .env dosyası oluştur
cp .env.example .env

# .env dosyasını düzenle:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/yds_tracker"
# NEXTAUTH_SECRET="$(openssl rand -base64 32)"
# NEXTAUTH_URL="http://localhost:3000"
```

### 3. Bağımlılıkları ve DB'yi kur

```bash
npm install
npx prisma migrate dev --name init
# veya hızlıca:
npx prisma db push
```

### 4. Başlat

```bash
npm run dev
```

🌐 **http://localhost:3000** → kayıt ol → kullan!

---

## Production Deploy (Vercel)

```bash
# 1. Vercel CLI
npm i -g vercel
vercel

# 2. Env vars ekle (Vercel dashboard > Settings > Environment Variables):
#    DATABASE_URL  → Supabase / Neon / Railway bağlantı URL
#    NEXTAUTH_SECRET → openssl rand -base64 32
#    NEXTAUTH_URL → https://senin-domain.vercel.app

# 3. Deploy
vercel --prod
```

**Ücretsiz PostgreSQL seçenekleri:**
- [Supabase](https://supabase.com) — 500MB free
- [Neon](https://neon.tech) — serverless, generous free tier
- [Railway](https://railway.app) — $5 kredi ile başla

---

## Özellikler

### 🔐 Auth
- Email + şifre ile kayıt / giriş
- Bcrypt ile şifreler hashleniyor (12 salt rounds)
- JWT session (stateless, scalable)
- Her kullanıcının verisi tamamen izole

### ⚡ Dashboard
- Toplam XP + seviye (7 seviye)
- Bugünkü XP ve üç hedef (300 / 500 / 700)
- Haftalık bar chart (renk kodlu)
- Gün serisi sayacı
- Seviye yol haritası grid

### ✅ XP Kaydet
- 6 hızlı görev butonu (tek tıkla)
- Manuel kayıt formu (tür + XP seçimi)
- Son 7 gün aktivite listesi

### 🃏 Flashcards (SM-2)
- Anki ile özdeş SM-2 algoritması
- 4 kalite seviyesi (0/3/4/5)
- Kart çevirme animasyonu
- Her tekrarda +5 XP otomatik
- Tüm kartları listele / sil

### 📊 İstatistikler
- Area chart (haftalık XP akışı)
- Donut chart (kategori dağılımı)
- Kategori bazlı XP breakdown + progress bars
- Seviye grid

---

## XP Tablosu

| Görev | XP |
|---|---|
| 1 kelime | 5 XP |
| 1 paragraf okuma | 20 XP |
| 1 test sorusu | 10 XP |
| 1 cümle yazma | 10 XP |
| Mini paragraf (4-5 cümle) | 40 XP |
| Tam deneme sınavı | 150 XP |
| Flashcard tekrar | 5 XP |

**Günlük hedefler:** 300 ✅ | 500 ⚡ | 700 🔥

---

## Seviyeler

| | Seviye | XP | Unvan |
|---|---|---|---|
| 🌱 | 1 | 0–500 | Başlangıç |
| 📖 | 2 | 500–1.200 | Çaylak |
| 🎯 | 3 | 1.200–2.500 | Öğrenci |
| ⚡ | 4 | 2.500–4.000 | Kararlı |
| 🔥 | 5 | 4.000–6.000 | Usta |
| 💎 | 6 | 6.000–9.000 | Uzman |
| 👑 | 7 | 9.000+ | Efsane |

---

## Veritabanı Yönetimi

```bash
# Görsel arayüz
npm run db:studio

# Şema değişikliği
npx prisma migrate dev --name degisiklik_adi

# Tüm verileri sıfırla
npx prisma migrate reset
```
