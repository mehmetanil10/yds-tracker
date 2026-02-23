"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Kayıt başarısız");
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    router.push("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.06) 0%, transparent 70%)",
      }}
    >
      <div className="auth-card fade-up">
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: -1 }}>
            YDS<span style={{ color: "var(--accent)" }}>XP</span>
          </div>
          <div style={{ color: "var(--muted)", marginTop: 6, fontSize: 14 }}>
            Hesap oluştur, çalışmaya başla
          </div>
        </div>

        {error && (
          <div className="alert-error" style={{ marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
          <input
            className="input"
            type="text"
            placeholder="Adın (opsiyonel)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
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
            placeholder="Şifre (en az 6 karakter)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            minLength={6}
            required
          />
          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: "100%", marginTop: 4 }}
          >
            {loading ? "Oluşturuluyor..." : "Hesap Oluştur"}
          </button>
        </form>

        <div className="divider" />

        <div
          style={{ textAlign: "center", fontSize: 13, color: "var(--muted)" }}
        >
          Zaten hesabın var mı?{" "}
          <Link
            href="/auth/login"
            style={{
              color: "var(--accent)",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Giriş yap
          </Link>
        </div>
      </div>
    </div>
  );
}
