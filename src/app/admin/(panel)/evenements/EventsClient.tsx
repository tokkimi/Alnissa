"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "../../../components/Icons";
import { PageTitle, Badge, Modal, ConfirmButton, EmptyState } from "../../components/ui";
import { EVENT_TYPES, EVENT_RECURRENCES, label } from "@/lib/constants";

import { saveEvent, deleteEvent } from "../../actions";

type EventItem = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  recurrence: string;
  dayOfWeek: string | null;
  time: string | null;
  location: string | null;
  date: string | Date | null;
  isPublished: boolean;
  sortOrder: number;
};

const TYPE_ICON: Record<string, string> = {
  MARAUDE: "soup", DISTRIBUTION: "water", VISITE: "elder", COLLECTE: "box", EVENT: "star",
};
const DAYS = ["", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const emptyForm = {
  id: "", title: "", description: "", type: "MARAUDE", recurrence: "WEEKLY",
  dayOfWeek: "", time: "", location: "", date: "", isPublished: true, sortOrder: "0",
};

export default function EventsClient({ events }: { events: EventItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function openNew() { setForm({ ...emptyForm, sortOrder: String(events.length + 1) }); setError(""); setOpen(true); }
  function openEdit(ev: EventItem) {
    setForm({
      id: ev.id, title: ev.title, description: ev.description ?? "", type: ev.type,
      recurrence: ev.recurrence, dayOfWeek: ev.dayOfWeek ?? "", time: ev.time ?? "",
      location: ev.location ?? "", date: ev.date ? new Date(ev.date).toISOString().slice(0, 10) : "",
      isPublished: ev.isPublished, sortOrder: String(ev.sortOrder),
    });
    setError(""); setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    const res = await saveEvent(form);
    setSaving(false);
    if (!res.ok) { setError(res.error || "Erreur"); return; }
    setOpen(false); router.refresh();
  }

  async function togglePublish(ev: EventItem) {
    await saveEvent({ ...ev, date: ev.date ? new Date(ev.date).toISOString().slice(0, 10) : "", isPublished: !ev.isPublished });
    router.refresh();
  }

  return (
    <>
      <PageTitle
        title="Planning"
        subtitle="Vos rendez-vous et événements affichés sur le site"
        icon="calendar"
        action={<button onClick={openNew} className="btn btn-primary"><Icon name="plus" width={18} height={18} /> Nouvel événement</button>}
      />

      {events.length === 0 ? (
        <EmptyState icon="calendar" title="Aucun événement" sub="Ajoutez vos maraudes, distributions et rendez-vous." />
      ) : (
        <div className="space-y-3">
          {events.map((ev) => (
            <div key={ev.id} className="glass-card flex flex-wrap items-center gap-4 p-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 text-white">
                <Icon name={TYPE_ICON[ev.type] ?? "heart"} width={24} height={24} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-xl text-plum">{ev.title}</h3>
                  <Badge variant="rose">{label(EVENT_RECURRENCES, ev.recurrence)}</Badge>
                  {!ev.isPublished && <Badge variant="gray">Masqué</Badge>}
                </div>
                <p className="text-xs text-muted">
                  {label(EVENT_TYPES, ev.type)}
                  {(ev.dayOfWeek || ev.time) ? ` · ${[ev.dayOfWeek, ev.time].filter(Boolean).join(" ")}` : ""}
                  {ev.location ? ` · ${ev.location}` : ""}
                </p>
              </div>
              <button
                onClick={() => togglePublish(ev)}
                title={ev.isPublished ? "Masquer du site" : "Afficher sur le site"}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${ev.isPublished ? "bg-emerald-500" : "bg-plum/20"}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${ev.isPublished ? "left-[1.4rem]" : "left-0.5"}`} />
              </button>
              <div className="flex gap-1">
                <button onClick={() => openEdit(ev)} title="Modifier" className="grid h-9 w-9 place-items-center rounded-full text-plum/70 transition hover:bg-white">
                  <Icon name="edit" width={17} height={17} />
                </button>
                <ConfirmButton iconOnly onConfirm={async () => { await deleteEvent(ev.id); router.refresh(); }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={form.id ? "Modifier l'événement" : "Nouvel événement"} wide>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="field-label">Titre *</label>
            <input className="field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="field-label">Description</label>
            <textarea className="field min-h-[70px] resize-y" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Type</label>
              <select className="field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {Object.entries(EVENT_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Récurrence</label>
              <select className="field" value={form.recurrence} onChange={(e) => setForm({ ...form, recurrence: e.target.value })}>
                {Object.entries(EVENT_RECURRENCES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Jour</label>
              <select className="field" value={form.dayOfWeek} onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}>
                {DAYS.map((d) => <option key={d} value={d}>{d || "—"}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Heure</label>
              <input className="field" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Lieu</label>
              <input className="field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Départ Perrache, Lyon…" />
            </div>
            <div>
              <label className="field-label">Date précise (ponctuel)</label>
              <input className="field" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Ordre d'affichage</label>
              <input className="field" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-plum">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
            Afficher sur le site public
          </label>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn btn-glass">Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer"}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
