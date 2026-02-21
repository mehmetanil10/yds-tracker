"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const FEATURES = [
  {
    icon: "⚡",
    title: "XP Sistemi",
    desc: "Her aktivite XP kazandırır. Kelime, okuma, test, yazma — hepsi sayılır.",
  },
  {
    icon: "🪜",
    title: "7 Seviye",
    desc: "Başlangıç'tan Efsane'ye uzanan yolculuk. Her seviye bir sonrakini açar.",
  },
  {
    icon: "🃏",
    title: "Flashcards (SM-2)",
    desc: "Spaced repetition algoritması. Kelimeyi unutmadan önce tekrarla.",
  },
  {
    icon: "📊",
    title: "İstatistikler",
    desc: "Haftalık grafik, streak sayacı, kategori dağılımı. İlerlemeyi gör.",
  },
  {
    icon: "🔥",
    title: "Günlük Hedef",
    desc: "300 ideal · 500 çok iyi · 700 peak gün. Motivasyon ilerleme görünce gelir.",
  },
  {
    icon: "🏆",
    title: "Liderlik",
    desc: "Arkadaşlarınla rekabet et. Kim daha çok XP toplar?",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Kayıt ol",
    desc: "Email ve şifrenle saniyeler içinde hesap oluştur.",
  },
  {
    num: "02",
    title: "Çalış",
    desc: "Kelime öğren, paragraf oku, test çöz. Her aktiviteyi kaydet.",
  },
  {
    num: "03",
    title: "XP Kazan",
    desc: "Her görev XP kazandırır, seviye atlar, sıralamada yükselirsin.",
  },
  {
    num: "04",
    title: "Geç",
    desc: "Sistematik çalışmanın gücüyle YDS/YÖKDİL'i geç.",
  },
];

const XP_TABLE = [
  { task: "1 kelime", xp: 5 },
  { task: "1 paragraf", xp: 20 },
  { task: "1 test sorusu", xp: 10 },
  { task: "Mini paragraf", xp: 40 },
  { task: "Tam deneme", xp: 150 },
];

export default function LandingPage() {
  const [xpDemo, setXpDemo] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((p) => p + 1), 40);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setXpDemo((prev) => {
      const target = 340;
      if (prev < target) return Math.min(prev + 4, target);
      return 0;
    });
  }, [tick]);

  const pct = Math.round((xpDemo / 500) * 100);

  return (
    <div
      style={{
        background: "var(--bg)",
        minHeight: "100vh",
        color: "var(--text)",
      }}
    >
      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 40px",
          background: "rgba(8,8,16,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -1 }}>
          YDS<span style={{ color: "var(--accent)" }}>XP</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link
            href="/auth/login"
            style={{
              color: "var(--muted)",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 14,
              padding: "8px 16px",
              borderRadius: 8,
              transition: "color 0.15s",
            }}
          >
            Giriş Yap
          </Link>
          <Link
            href="/auth/register"
            style={{
              background: "var(--accent)",
              color: "#000",
              textDecoration: "none",
              fontWeight: 800,
              fontSize: 14,
              padding: "9px 20px",
              borderRadius: 8,
              transition: "opacity 0.15s",
            }}
          >
            Ücretsiz Başla
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 24px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "20%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.25)",
            borderRadius: 20,
            padding: "6px 16px",
            marginBottom: 32,
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 12,
            color: "var(--accent)",
            animation: "fadeUp 0.5s ease both",
          }}
        >
          ⚡ YDS / YÖKDİL için XP sistemi
        </div>

        <h1
          style={{
            fontSize: "clamp(36px, 7vw, 80px)",
            fontWeight: 900,
            letterSpacing: -3,
            lineHeight: 1.05,
            marginBottom: 24,
            maxWidth: 800,
            animation: "fadeUp 0.5s 0.1s ease both",
          }}
        >
          Çalış. <span style={{ color: "var(--accent)" }}>XP Kazan.</span> Geç.
        </h1>

        <p
          style={{
            fontSize: 18,
            color: "var(--muted)",
            maxWidth: 520,
            lineHeight: 1.7,
            marginBottom: 40,
            animation: "fadeUp 0.5s 0.2s ease both",
          }}
        >
          Motivasyon "çalışmalıyım" düşüncesinden gelmez — ilerleme gördüğünde
          gelir. YDSXP bunu sağlar.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "fadeUp 0.5s 0.3s ease both",
          }}
        >
          <Link
            href="/auth/register"
            style={{
              background: "var(--accent)",
              color: "#000",
              textDecoration: "none",
              fontWeight: 800,
              fontSize: 16,
              padding: "14px 32px",
              borderRadius: 10,
              display: "inline-block",
              transition: "opacity 0.15s, transform 0.1s",
            }}
          >
            Ücretsiz Hesap Oluştur →
          </Link>
          <Link
            href="/auth/login"
            style={{
              background: "var(--surface)",
              color: "var(--text)",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 16,
              padding: "14px 32px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              display: "inline-block",
            }}
          >
            Giriş Yap
          </Link>
        </div>

        {/* Live XP Demo */}
        <div
          style={{
            marginTop: 64,
            width: "100%",
            maxWidth: 480,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 24,
            textAlign: "left",
            animation: "fadeUp 0.5s 0.4s ease both",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 14 }}>
              📖 Çaylak → 🎯 Öğrenci
            </span>
            <span
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                color: "var(--accent)",
                fontWeight: 700,
              }}
            >
              {xpDemo} / 500 XP
            </span>
          </div>
          <div
            style={{
              height: 8,
              background: "var(--border)",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 4,
                background: "linear-gradient(90deg, #8b5cf6, #f59e0b)",
                width: `${pct}%`,
                transition: "width 0.05s linear",
              }}
            />
          </div>
          <div
            style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}
          >
            {XP_TABLE.map((x) => (
              <div
                key={x.task}
                style={{
                  background: "var(--surface2)",
                  borderRadius: 6,
                  padding: "4px 10px",
                  fontSize: 12,
                  fontFamily: "IBM Plex Mono, monospace",
                  color: "var(--muted)",
                }}
              >
                {x.task} <span style={{ color: "var(--accent)" }}>+{x.xp}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 11,
              color: "var(--accent)",
              letterSpacing: "0.15em",
              marginBottom: 12,
            }}
          >
            NELER VAR?
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 900,
              letterSpacing: -1.5,
            }}
          >
            Sıkılmadan çalışmanın sistemi
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: "28px 24px",
                transition: "border-color 0.2s, transform 0.2s",
                animationDelay: `${i * 0.05}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8 }}>
                {f.title}
              </div>
              <div
                style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}
              >
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        style={{
          padding: "80px 40px",
          background:
            "linear-gradient(180deg, transparent, rgba(245,158,11,0.03), transparent)",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 11,
                color: "var(--accent)",
                letterSpacing: "0.15em",
                marginBottom: 12,
              }}
            >
              NASIL ÇALIŞIR?
            </div>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 900,
                letterSpacing: -1.5,
              }}
            >
              4 adımda başla
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {STEPS.map((s, i) => (
              <div
                key={s.num}
                style={{ display: "flex", gap: 24, alignItems: "flex-start" }}
              >
                {/* Timeline */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "rgba(245,158,11,0.1)",
                      border: "2px solid rgba(245,158,11,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "IBM Plex Mono, monospace",
                      fontWeight: 700,
                      fontSize: 13,
                      color: "var(--accent)",
                      flexShrink: 0,
                    }}
                  >
                    {s.num}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      style={{
                        width: 2,
                        flex: 1,
                        minHeight: 40,
                        background: "var(--border)",
                        margin: "8px 0",
                      }}
                    />
                  )}
                </div>
                {/* Content */}
                <div
                  style={{
                    paddingBottom: i < STEPS.length - 1 ? 32 : 0,
                    paddingTop: 10,
                  }}
                >
                  <div
                    style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}
                  >
                    {s.title}
                  </div>
                  <div
                    style={{
                      color: "var(--muted)",
                      fontSize: 15,
                      lineHeight: 1.6,
                    }}
                  >
                    {s.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* XP TABLE */}
      <section
        style={{ padding: "80px 40px", maxWidth: 700, margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 11,
              color: "var(--accent)",
              letterSpacing: "0.15em",
              marginBottom: 12,
            }}
          >
            XP TABLOSU
          </div>
          <h2
            style={{
              fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 900,
              letterSpacing: -1,
            }}
          >
            Her çalışma sayılır
          </h2>
        </div>
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {[
            { task: "1 kelime öğren", xp: 5, icon: "📚" },
            { task: "1 paragraf oku", xp: 20, icon: "📖" },
            { task: "1 test sorusu çöz", xp: 10, icon: "🎯" },
            { task: "Mini paragraf yaz", xp: 40, icon: "✍️" },
            { task: "Tam deneme sınavı", xp: 150, icon: "📝" },
            { task: "Flashcard tekrar", xp: 5, icon: "🃏" },
          ].map((x, i, arr) => (
            <div
              key={x.task}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 24px",
                borderBottom:
                  i < arr.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <span style={{ fontSize: 20 }}>{x.icon}</span>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 600 }}>
                {x.task}
              </span>
              <span
                style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontWeight: 700,
                  color: "var(--accent)",
                  fontSize: 16,
                }}
              >
                +{x.xp} XP
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "80px 40px 120px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.25)",
            borderRadius: 20,
            padding: "6px 16px",
            marginBottom: 24,
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 12,
            color: "#10b981",
          }}
        >
          🆓 Tamamen ücretsiz
        </div>
        <h2
          style={{
            fontSize: "clamp(28px, 5vw, 56px)",
            fontWeight: 900,
            letterSpacing: -2,
            marginBottom: 16,
            lineHeight: 1.1,
          }}
        >
          Bugün başla,
          <br />
          <span style={{ color: "var(--accent)" }}>farkı hisset.</span>
        </h2>
        <p
          style={{
            color: "var(--muted)",
            fontSize: 16,
            marginBottom: 40,
            maxWidth: 400,
            margin: "0 auto 40px",
          }}
        >
          Kayıt ol, ilk XP'ni kazan. Motivasyonun geri geldiğini göreceksin.
        </p>
        <Link
          href="/auth/register"
          style={{
            background: "var(--accent)",
            color: "#000",
            textDecoration: "none",
            fontWeight: 800,
            fontSize: 18,
            padding: "16px 40px",
            borderRadius: 12,
            display: "inline-block",
            transition: "opacity 0.15s, transform 0.1s",
          }}
        >
          Ücretsiz Hesap Oluştur →
        </Link>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "24px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 16 }}>
          YDS<span style={{ color: "var(--accent)" }}>XP</span>
        </div>
        <div
          style={{
            color: "var(--muted)",
            fontSize: 13,
            fontFamily: "IBM Plex Mono, monospace",
          }}
        >
          Mehmet Anıl tarafından geliştirilmiştir. © 2026
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <Link
            href="/auth/register"
            style={{
              color: "var(--muted)",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Kayıt Ol
          </Link>
          <Link
            href="/auth/login"
            style={{
              color: "var(--muted)",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Giriş Yap
          </Link>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
