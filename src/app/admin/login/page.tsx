"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Icon } from "../../components/Icons";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Connexion impossible.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Erreur réseau. Réessayez.");
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Image
            src="/logo.png"
            alt="Al Nissa"
            width={88}
            height={88}
            className="mx-auto h-20 w-20 rounded-full shadow-soft ring-4 ring-white/60"
          />
          <h1 className="mt-4 font-display text-4xl text-plum">Espace administration</h1>
          <p className="mt-1 text-sm text-plum/70">Association Al Nissa</p>
        </div>

        <form onSubmit={submit} className="glass-card p-7 sm:p-9">
          <div className="space-y-4">
            <div>
              <label className="field-label">Adresse e-mail</label>
              <input
                className="field"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="field-label">Mot de passe</label>
              <input
                className="field"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="rounded-xl bg-rose-100 px-3 py-2 text-sm text-rose-700">{error}</p>
            )}
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? "Connexion…" : "Se connecter"}
              {!loading && <Icon name="arrowRight" width={18} height={18} />}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-plum/50">
          Accès réservé à l'équipe de l'association.
        </p>
      </div>
    </div>
  );
}
