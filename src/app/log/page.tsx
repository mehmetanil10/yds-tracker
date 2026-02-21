"use client";
import { useEffect, useState } from "react";
import Shell from "@/components/Shell";
import { XP_VALUES, ActivityType } from "@/lib/xp";

const QUICK: {
  label: string;
  task: string;
  type: ActivityType;
  xp: number;
  icon: string;
}[] = [
  {
    icon: "📚",
    label: "10 kelime öğren",
    task: "10 kelime öğren",
    type: "Kelime",
    xp: 50,
  },
  {
    icon: "✍️",
    label: "5 cümle kur",
    task: "5 cümleyle kelime kullan",
    type: "Writing",
    xp: 50,
  },
  {
    icon: "📖",
    label: "1 paragraf oku",
    task: "1 akademik paragraf oku",
    type: "Reading",
    xp: 20,
  },
  {
    icon: "🎯",
    label: "10 test sorusu",
    task: "10 YDS/YÖKDİL sorusu",
    type: "Test",
    xp: 100,
  },
  {
    icon: "🖊️",
    label: "Mini paragraf",
    task: "Mini paragraf (4-5 cümle)",
    type: "MiniParagraf",
    xp: 40,
  },
  {
    icon: "📝",
    label: "Tam deneme",
    task: "Tam deneme sınavı",
    type: "Deneme",
    xp: 150,
  },
];

interface Activity {
  id: number;
  task: string;
  type: string;
  xp: number;
  note?: string;
  date: string;
}

export default function LogPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [form, setForm] = useState({
    task: "",
    type: "Kelime" as ActivityType,
    xp: 5,
    note: "",
  });
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState({ msg: "", xp: 0 });

  const load = () =>
    fetch("/api/activities?days=7")
      .then((r) => r.json())
      .then(setActivities);
  useEffect(() => {
    load();
  }, []);

  const quickAdd = async (q: (typeof QUICK)[0]) => {
    const res = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: q.task, type: q.type, xp: q.xp }),
    });
    if (res.ok) {
      setFlash({ msg: `${q.icon} ${q.label}`, xp: q.xp });
      setTimeout(() => setFlash({ msg: "", xp: 0 }), 2500);
      load();
    }
  };

  const save = async () => {
    if (!form.task) return;
    setSaving(true);
    await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setFlash({ msg: form.task, xp: form.xp });
    setTimeout(() => setFlash({ msg: "", xp: 0 }), 2500);
    setForm({ task: "", type: "Kelime", xp: 5, note: "" });
    load();
  };

  const del = async (id: number) => {
    await fetch(`/api/activities?id=${id}`, { method: "DELETE" });
    load();
  };

  const todayXP = activities
    .filter(
      (a) =>
        new Date(a.date).toISOString().slice(0, 10) ===
        new Date().toISOString().slice(0, 10),
    )
    .reduce((s, a) => s + a.xp, 0);

  return (
    <Shell>
      <div className="fade-up">
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: -1 }}>
            ✅ XP Kaydet
          </h1>
          <p
            style={{
              color: "var(--muted)",
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 12,
              marginTop: 6,
            }}
          >
            Bugün:{" "}
            <span style={{ color: "var(--accent)", fontWeight: 700 }}>
              {todayXP} XP
            </span>
          </p>
        </div>

        {/* Flash */}
        {flash.msg && (
          <div
            className="alert-success fade-up"
            style={{
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{flash.msg}</span>
            <span
              style={{
                fontFamily: "IBM Plex Mono, monospace",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              +{flash.xp} XP 🎉
            </span>
          </div>
        )}

        {/* Quick buttons */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 800, marginBottom: 14 }}>Hızlı Ekle</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10,
            }}
          >
            {QUICK.map((q) => (
              <button
                key={q.label}
                onClick={() => quickAdd(q)}
                style={{
                  background: "var(--surface2)",
                  border: "1px solid var(--border2)",
                  borderRadius: 8,
                  padding: "12px 14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "var(--accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border2)")
                }
              >
                <span style={{ fontSize: 20 }}>{q.icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--text)",
                    }}
                  >
                    {q.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "IBM Plex Mono, monospace",
                      fontSize: 11,
                      color: "var(--accent)",
                      marginTop: 2,
                    }}
                  >
                    +{q.xp} XP
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Manual form */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 800, marginBottom: 16 }}>Manuel Kayıt</div>
          <div style={{ display: "grid", gap: 12 }}>
            <input
              className="input"
              placeholder="Görev açıklaması..."
              value={form.task}
              onChange={(e) => setForm({ ...form, task: e.target.value })}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 120px",
                gap: 12,
              }}
            >
              <select
                className="input"
                value={form.type}
                onChange={(e) => {
                  const t = e.target.value as ActivityType;
                  setForm({ ...form, type: t, xp: XP_VALUES[t] });
                }}
              >
                {Object.keys(XP_VALUES).map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <input
                className="input"
                type="number"
                value={form.xp}
                readOnly
                style={{ opacity: 0.6, cursor: "not-allowed" }}
              />
            </div>
            <input
              className="input"
              placeholder="Not (opsiyonel)"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
            <button
              className="btn-primary"
              onClick={save}
              disabled={saving || !form.task}
            >
              {saving ? "Kaydediliyor..." : `Kaydet +${form.xp} XP`}
            </button>
          </div>
        </div>

        {/* Activity list */}
        <div className="card">
          <div style={{ fontWeight: 800, marginBottom: 16 }}>
            Son 7 Günün Aktiviteleri
          </div>
          {activities.length === 0 && (
            <div
              style={{
                color: "var(--muted)",
                textAlign: "center",
                padding: "40px 0",
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 13,
              }}
            >
              henüz kayıt yok — çalışmaya başla! 🚀
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {activities.map((a) => (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "var(--surface2)",
                  borderRadius: 8,
                  padding: "11px 14px",
                }}
              >
                <span className={`tag tag-${a.type}`}>{a.type}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {a.task}
                  </div>
                  {a.note && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--muted)",
                        marginTop: 2,
                      }}
                    >
                      {a.note}
                    </div>
                  )}
                </div>
                <span
                  style={{
                    fontFamily: "IBM Plex Mono, monospace",
                    color: "var(--accent)",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  +{a.xp}
                </span>
                <span
                  style={{
                    color: "var(--muted)",
                    fontSize: 11,
                    fontFamily: "IBM Plex Mono, monospace",
                    flexShrink: 0,
                  }}
                >
                  {new Date(a.date).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <button
                  onClick={() => del(a.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--muted)",
                    cursor: "pointer",
                    fontSize: 18,
                    lineHeight: 1,
                    flexShrink: 0,
                    padding: 0,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
