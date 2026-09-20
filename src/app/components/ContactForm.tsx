"use client";

import { useState } from "react";
import { Icon } from "./Icons";

const initial = { name: "", email: "", phone: "", subject: "", body: "" };

export default function ContactForm() {
  const [form, setForm] = useState(initial);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  function update<K extends keyof typeof initial>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.body.trim()) return;
    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, channel: "CONTACT" }),
      });
      if (!res.ok) throw new Error();
      setState("done");
      setForm(initial);
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="glass-card p-10 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-100 text-rose-600">
          <Icon name="check" width={32} height={32} />
        </div>
        <h3 className="mt-4 font-display text-3xl text-plum">Message envoyé 🌸</h3>
        <p className="mt-2 text-plum/75">Merci de nous avoir écrit. Nous vous répondrons dès que possible.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="glass-card p-7 sm:p-9">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Nom *</label>
          <input className="field" value={form.name} onChange={(e) => update("name", e.target.value)} required />
        </div>
        <div>
          <label className="field-label">E-mail</label>
          <input className="field" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
        </div>
        <div>
          <label className="field-label">Téléphone</label>
          <input className="field" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </div>
        <div>
          <label className="field-label">Sujet</label>
          <input className="field" value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder="Don, bénévolat, partenariat…" />
        </div>
      </div>
      <div className="mt-4">
        <label className="field-label">Message *</label>
        <textarea className="field min-h-[140px] resize-y" value={form.body} onChange={(e) => update("body", e.target.value)} required />
      </div>

      {state === "error" && (
        <p className="mt-3 text-sm text-rose-600">Une erreur est survenue. Merci de réessayer.</p>
      )}

      <button type="submit" className="btn btn-primary mt-6 w-full" disabled={state === "loading"}>
        {state === "loading" ? "Envoi…" : "Envoyer le message"}
        {state !== "loading" && <Icon name="arrowRight" width={18} height={18} />}
      </button>
      <p className="mt-3 text-center text-xs text-muted">
        Votre message arrive dans la messagerie interne de l'association.
      </p>
    </form>
  );
}
