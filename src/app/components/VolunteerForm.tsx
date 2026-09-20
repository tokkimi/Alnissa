"use client";

import { useState } from "react";
import { Icon } from "./Icons";

const initial = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  availability: "",
  skills: "",
  motivation: "",
};

export default function VolunteerForm() {
  const [form, setForm] = useState(initial);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  function update<K extends keyof typeof initial>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim()) return;
    setState("loading");
    try {
      const res = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
        <h3 className="mt-4 font-display text-3xl text-plum">Merci infiniment 🌸</h3>
        <p className="mt-2 text-plum/75">
          Votre candidature a bien été reçue. Nous vous recontacterons très vite pour rejoindre l'aventure&nbsp;!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="glass-card p-7 sm:p-9">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Prénom *</label>
          <input className="field" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required />
        </div>
        <div>
          <label className="field-label">Nom *</label>
          <input className="field" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required />
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
          <label className="field-label">Ville</label>
          <input className="field" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Lyon, Agadir…" />
        </div>
        <div>
          <label className="field-label">Disponibilités</label>
          <input className="field" value={form.availability} onChange={(e) => update("availability", e.target.value)} placeholder="Dimanche matin, week-ends…" />
        </div>
      </div>
      <div className="mt-4">
        <label className="field-label">Vos talents / envies</label>
        <input className="field" value={form.skills} onChange={(e) => update("skills", e.target.value)} placeholder="Cuisine, logistique, animation, collecte…" />
      </div>
      <div className="mt-4">
        <label className="field-label">Votre message (facultatif)</label>
        <textarea className="field min-h-[120px] resize-y" value={form.motivation} onChange={(e) => update("motivation", e.target.value)} placeholder="Dites-nous ce qui vous motive à nous rejoindre…" />
      </div>

      {state === "error" && (
        <p className="mt-3 text-sm text-rose-600">
          Une erreur est survenue. Merci de réessayer ou de nous écrire directement.
        </p>
      )}

      <button type="submit" className="btn btn-primary mt-6 w-full" disabled={state === "loading"}>
        {state === "loading" ? "Envoi…" : "Envoyer ma candidature"}
        {state !== "loading" && <Icon name="arrowRight" width={18} height={18} />}
      </button>
    </form>
  );
}
