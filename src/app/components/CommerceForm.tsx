"use client";

import { useState } from "react";
import { Icon } from "./Icons";
import AddressAutocomplete, { type AddressValue } from "./AddressAutocomplete";

const BUSINESS_TYPES = [
  "Boulangerie", "Pâtisserie", "Épicerie", "Superette", "Supermarché",
  "Grande surface", "Primeur", "Restaurant", "Traiteur", "Café",
  "Marché", "Cantine", "Autre",
];

const FREQUENCIES = ["Ponctuel", "Régulier", "Quotidien", "Hebdomadaire", "Mensuel"];

const initial = {
  businessName: "",
  businessType: "",
  contactName: "",
  email: "",
  phone: "",
  address: "",
  postalCode: "",
  city: "",
  lat: null as number | null,
  lng: null as number | null,
  foodType: "",
  frequency: "Régulier",
  availability: "",
  message: "",
};

export default function CommerceForm() {
  const [form, setForm] = useState(initial);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  function set<K extends keyof typeof initial>(key: K, value: (typeof initial)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onAddress(v: AddressValue) {
    setForm((f) => ({ ...f, address: v.address, postalCode: v.postalCode, city: v.city, lat: v.lat, lng: v.lng }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.businessName.trim()) return;
    setState("loading");
    try {
      const res = await fetch("/api/commerce", {
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
        <h3 className="mt-4 font-display text-3xl text-plum">Merci pour votre générosité 🌸</h3>
        <p className="mt-2 text-plum/75">
          Votre proposition de don a bien été reçue. Notre équipe vous recontacte très vite
          pour organiser la collecte.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="glass-card p-7 sm:p-9">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Nom du commerce *</label>
          <input className="field" value={form.businessName} onChange={(e) => set("businessName", e.target.value)} required placeholder="Ex. Boulangerie Le Fournil" />
        </div>
        <div>
          <label className="field-label">Type de commerce</label>
          <input className="field" list="business-types" value={form.businessType} onChange={(e) => set("businessType", e.target.value)} placeholder="Boulangerie, épicerie…" />
          <datalist id="business-types">
            {BUSINESS_TYPES.map((t) => <option key={t} value={t} />)}
          </datalist>
        </div>
      </div>

      <div className="mt-4">
        <label className="field-label">Adresse du commerce</label>
        <AddressAutocomplete
          value={form.address}
          onChange={(v) => set("address", v)}
          onSelect={onAddress}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Code postal</label>
          <input className="field" value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} />
        </div>
        <div>
          <label className="field-label">Ville</label>
          <input className="field" value={form.city} onChange={(e) => set("city", e.target.value)} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Personne à contacter</label>
          <input className="field" value={form.contactName} onChange={(e) => set("contactName", e.target.value)} />
        </div>
        <div>
          <label className="field-label">Téléphone</label>
          <input className="field" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="field-label">E-mail</label>
          <input className="field" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Denrées proposées</label>
          <input className="field" value={form.foodType} onChange={(e) => set("foodType", e.target.value)} placeholder="Pain, invendus, fruits & légumes…" />
        </div>
        <div>
          <label className="field-label">Fréquence</label>
          <select className="field" value={form.frequency} onChange={(e) => set("frequency", e.target.value)}>
            {FREQUENCIES.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="field-label">Créneaux de collecte</label>
        <input className="field" value={form.availability} onChange={(e) => set("availability", e.target.value)} placeholder="Ex. tous les soirs après 19h, le samedi matin…" />
      </div>

      <div className="mt-4">
        <label className="field-label">Message (facultatif)</label>
        <textarea className="field min-h-[100px] resize-y" value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Précisions utiles pour organiser la collecte…" />
      </div>

      {state === "error" && (
        <p className="mt-3 text-sm text-rose-600">Une erreur est survenue. Merci de réessayer ou de nous écrire directement.</p>
      )}

      <button type="submit" className="btn btn-primary mt-6 w-full" disabled={state === "loading"}>
        {state === "loading" ? "Envoi…" : "Proposer mon don de nourriture"}
        {state !== "loading" && <Icon name="arrowRight" width={18} height={18} />}
      </button>
      <p className="mt-3 text-center text-xs text-muted">
        Votre proposition arrive directement dans l'espace de l'association.
      </p>
    </form>
  );
}
