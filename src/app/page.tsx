"use client";
import { useEffect, useState } from "react";
import Shell from "@/components/Shell";
import { getLevelInfo, getDailyGoalStatus, LEVELS } from "@/lib/xp";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Stats {
  totalXP: number;
  todayXP: number;
  streak: number;
  daily: { date: string; xp: number }[];
  breakdown: Record<string, number>;
}

const DAY_TR = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/landing");
  }, [status, router]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [leaders, setLeaders] = useState<
    { id: string; name: string; totalXP: number }[]
  >([]);
  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data.totalXP === "number") setStats(data);
      })
      .catch(() => {});
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setLeaders(data);
      })
      .catch(() => {});
  }, [status]);

  if (!stats)
    return (
      <Shell>
        <div
          style={{
            color: "var(--muted)",
            marginTop: 60,
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 13,
          }}
        >
          yükleniyor...
        </div>
      </Shell>
    );

  const { current, next, progressPct, progressInLevel, levelRange } =
    getLevelInfo(stats.totalXP);
  const goal = getDailyGoalStatus(stats.todayXP);

  return (
    <Shell>
      <div className="fade-up">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              color: "var(--muted)",
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 11,
              marginBottom: 8,
              letterSpacing: "0.1em",
            }}
          >
            HOŞ GELDİN, {(session?.user?.name ?? "KULLANICI").toUpperCase()}
          </div>
          <h1
            style={{
              fontSize: 34,
              fontWeight: 900,
              letterSpacing: -1.5,
              lineHeight: 1.1,
            }}
          >
            {current.emoji} {current.title}
            <span style={{ color: "var(--accent)", marginLeft: 12 }}>
              Lv.{current.level}
            </span>
          </h1>
          <p
            style={{
              color: "var(--muted)",
              marginTop: 8,
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 12,
            }}
          >
            {stats.totalXP.toLocaleString()} XP toplamda · {stats.streak} gün
            seri 🔥
          </p>
        </div>

        {/* Level bar */}
        <div
          className="card"
          style={{
            marginBottom: 20,
            borderColor: "rgba(245,158,11,0.2)",
            background: "rgba(245,158,11,0.03)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 12,
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>
                Seviye İlerlemesi
              </div>
              <div
                style={{
                  color: "var(--muted)",
                  fontSize: 12,
                  fontFamily: "IBM Plex Mono, monospace",
                  marginTop: 3,
                }}
              >
                {progressInLevel.toLocaleString()} /{" "}
                {levelRange.toLocaleString()} XP
              </div>
            </div>
            <div
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 28,
                fontWeight: 700,
                color: "var(--accent)",
              }}
            >
              {progressPct}%
            </div>
          </div>
          <div className="xp-bar" style={{ height: 10 }}>
            <div className="xp-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
          {next && (
            <div
              style={{
                color: "var(--muted)",
                fontSize: 12,
                marginTop: 10,
                fontFamily: "IBM Plex Mono, monospace",
              }}
            >
              {next.emoji} Seviye {next.level} için{" "}
              {(next.min - stats.totalXP).toLocaleString()} XP kaldı
            </div>
          )}
        </div>

        {/* Stat cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 20,
          }}
        >
          {/* Today XP */}
          <div className="card">
            <div
              style={{
                color: "var(--muted)",
                fontSize: 11,
                fontFamily: "IBM Plex Mono, monospace",
                letterSpacing: "0.08em",
                marginBottom: 12,
              }}
            >
              BUGÜN
            </div>
            <div className="stat-num" style={{ color: goal.color }}>
              {stats.todayXP}
            </div>
            <div
              style={{
                color: "var(--muted)",
                fontSize: 12,
                marginTop: 4,
                marginBottom: 14,
              }}
            >
              XP kazanıldı
            </div>
            <div className="xp-bar">
              <div
                className="xp-bar-fill"
                style={{ width: `${goal.pct}%`, background: goal.color }}
              />
            </div>
            <div
              style={{
                fontSize: 12,
                marginTop: 8,
                color: goal.color,
                fontWeight: 700,
              }}
            >
              {goal.label}
            </div>
          </div>

          {/* Goals */}
          <div className="card">
            <div
              style={{
                color: "var(--muted)",
                fontSize: 11,
                fontFamily: "IBM Plex Mono, monospace",
                letterSpacing: "0.08em",
                marginBottom: 12,
              }}
            >
              GÜNLÜK HEDEF
            </div>
            {[
              { xp: 300, label: "İdeal", color: "#10b981", icon: "✅" },
              { xp: 500, label: "Çok İyi", color: "#8b5cf6", icon: "⚡" },
              { xp: 700, label: "Peak", color: "#f97316", icon: "🔥" },
            ].map((g) => (
              <div
                key={g.xp}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 0",
                  opacity: stats.todayXP >= g.xp ? 1 : 0.35,
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span>{g.icon}</span>
                <span
                  style={{
                    flex: 1,
                    fontSize: 13,
                    color: stats.todayXP >= g.xp ? g.color : "var(--muted)",
                    fontWeight: 600,
                  }}
                >
                  {g.label}
                </span>
                <span
                  style={{
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 12,
                    color: "var(--muted)",
                  }}
                >
                  {g.xp} XP
                </span>
              </div>
            ))}
          </div>

          {/* Streak */}
          <div
            className="card"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                color: "var(--muted)",
                fontSize: 11,
                fontFamily: "IBM Plex Mono, monospace",
                letterSpacing: "0.08em",
                marginBottom: 12,
              }}
            >
              SERİ & TOPLAM
            </div>
            <div>
              <div
                style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 11,
                  color: "var(--muted)",
                  marginBottom: 4,
                }}
              >
                GÜN SERİSİ
              </div>
              <div className="stat-num" style={{ color: "#f97316" }}>
                {stats.streak}
                <span style={{ fontSize: 24 }}>🔥</span>
              </div>
            </div>
            <div
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: 12,
                marginTop: 12,
              }}
            >
              <div
                style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 11,
                  color: "var(--muted)",
                  marginBottom: 4,
                }}
              >
                TOPLAM XP
              </div>
              <div
                style={{
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--accent)",
                }}
              >
                {stats.totalXP.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly bar chart */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 800, marginBottom: 20 }}>
            Son 7 Günlük XP
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={stats.daily} barCategoryGap="35%">
              <XAxis
                dataKey="date"
                tickFormatter={(d) =>
                  DAY_TR[new Date(d + "T12:00:00").getDay()]
                }
                tick={{
                  fill: "#5a5a7a",
                  fontSize: 11,
                  fontFamily: "IBM Plex Mono",
                }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                  fontFamily: "IBM Plex Mono",
                }}
                cursor={{ fill: "rgba(245,158,11,0.05)" }}
                formatter={(val: any) => [`${val} XP`, ""]}
              />
              <Bar dataKey="xp" radius={[5, 5, 0, 0]}>
                {stats.daily.map((e, i) => (
                  <Cell
                    key={i}
                    fill={
                      e.xp >= 700
                        ? "#f97316"
                        : e.xp >= 500
                          ? "#8b5cf6"
                          : e.xp >= 300
                            ? "#10b981"
                            : e.xp > 0
                              ? "#f59e0b44"
                              : "#252535"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
            {[
              { c: "#10b981", l: "300+ İdeal" },
              { c: "#8b5cf6", l: "500+ Çok İyi" },
              { c: "#f97316", l: "700+ Peak" },
            ].map((x) => (
              <div
                key={x.l}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  color: "var(--muted)",
                  fontFamily: "IBM Plex Mono, monospace",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: x.c,
                  }}
                />
                {x.l}
              </div>
            ))}
          </div>
        </div>

        {/* Level roadmap */}
        <div className="card">
          <div style={{ fontWeight: 800, marginBottom: 16 }}>
            Seviye Yol Haritası
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 8,
            }}
          >
            {LEVELS.map((l) => {
              const done = stats.totalXP >= l.max;
              const active = l.level === current.level;
              return (
                <div
                  key={l.level}
                  style={{
                    textAlign: "center",
                    padding: "14px 6px",
                    borderRadius: 10,
                    background: active
                      ? "rgba(245,158,11,0.1)"
                      : done
                        ? "rgba(16,185,129,0.07)"
                        : "var(--surface2)",
                    border: `1px solid ${active ? "rgba(245,158,11,0.4)" : "transparent"}`,
                    opacity:
                      !done && !active && l.level > current.level ? 0.35 : 1,
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 22 }}>{l.emoji}</div>
                  <div
                    style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: 9,
                      color: "var(--muted)",
                      marginTop: 6,
                    }}
                  >
                    LV.{l.level}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: active
                        ? "var(--accent)"
                        : done
                          ? "#10b981"
                          : "var(--muted)",
                      marginTop: 3,
                    }}
                  >
                    {l.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Leaderboard */}
        <div className="card" style={{ marginTop: 20 }}>
          <div style={{ fontWeight: 800, marginBottom: 16 }}>
            🏆 Liderlik Sıralaması
          </div>
          {leaders.length === 0 ? (
            <div
              style={{
                color: "var(--muted)",
                textAlign: "center",
                padding: "24px 0",
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 13,
              }}
            >
              henüz yeterli veri yok
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {leaders.map((u, i) => {
                const isMe = u.id === (session?.user as any)?.id;
                const medal =
                  i === 0
                    ? "🥇"
                    : i === 1
                      ? "🥈"
                      : i === 2
                        ? "🥉"
                        : `${i + 1}.`;
                return (
                  <div
                    key={u.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      background: isMe
                        ? "rgba(245,158,11,0.08)"
                        : "var(--surface2)",
                      border: `1px solid ${isMe ? "rgba(245,158,11,0.3)" : "transparent"}`,
                      borderRadius: 10,
                      padding: "12px 16px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "IBM Plex Mono, monospace",
                        fontSize: 16,
                        width: 28,
                        textAlign: "center",
                      }}
                    >
                      {medal}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        fontWeight: isMe ? 800 : 600,
                        fontSize: 14,
                      }}
                    >
                      {u.name}{" "}
                      {isMe && (
                        <span style={{ color: "var(--accent)", fontSize: 11 }}>
                          (sen)
                        </span>
                      )}
                    </span>
                    <span
                      style={{
                        fontFamily: "IBM Plex Mono, monospace",
                        fontWeight: 700,
                        color: "var(--accent)",
                        fontSize: 14,
                      }}
                    >
                      {u.totalXP.toLocaleString()} XP
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
