"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "../../../components/Icons";
import { PageTitle, Badge, Modal, ConfirmButton, SearchInput, EmptyState } from "../../components/ui";
import { formatDate, initials } from "@/lib/format";
import { VOLUNTEER_STATUSES, label } from "@/lib/constants";
import { saveVolunteer, deleteVolunteer } from "../../actions";

type Volunteer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  availability: string | null;
  skills: string;
  motivation: string | null;
  status: string;
  notes: string | null;
  createdAt: string | Date;
};

const STATUS_VARIANT: Record<string, "rose" | "amber" | "green" | "gray"> = {
  NEW: "rose",
  CONTACTED: "amber",
  ACTIVE: "green",
  INACTIVE: "gray",
};

const emptyForm = {
  id: "", firstName: "", lastName: "", email: "", phone: "", city: "",
  availability: "", skills: "", motivation: "", status: "NEW", notes: "",
};

export default function VolunteersClient({ volunteers }: { volunteers: Volunteer[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return volunteers.filter((v) => {
      if (fStatus && v.status !== fStatus) return false;
      if (!q) return true;
      return [v.firstName, v.lastName, v.email, v.city, v.skills].filter(Boolean).some((x) => String(x).toLowerCase().includes(q));
    });
  }, [volunteers, search, fStatus]);

  function openNew() { setForm({ ...emptyForm }); setError(""); setOpen(true); }
  function openEdit(v: Volunteer) {
    setForm({
      id: v.id, firstName: v.firstName, lastName: v.lastName, email: v.email ?? "",
      phone: v.phone ?? "", city: v.city ?? "", availability: v.availability ?? "",
      skills: v.skills, motivation: v.motivation ?? "", status: v.status, notes: v.notes ?? "",
    });
    setError(""); setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    const res = await saveVolunteer(form);
    setSaving(false);
    if (!res.ok) { setError(res.error || "Erreur"); return; }
    setOpen(false); router.refresh();
  }

  async function quickStatus(v: Volunteer, status: string) {
    await saveVolunteer({ ...v, status });
    router.refresh();
  }

  return (
    <>
      <PageTitle
        title="Bénévoles"
        subtitle={`${volunteers.length} bénévole${volunteers.length > 1 ? "s" : ""} et candidature${volunteers.length > 1 ? "s" : ""}`}
        icon="handHeart"
        action={
          <div className="flex gap-2">
            <a href="/api/admin/export?type=volunteers" className="btn btn-glass">
              <Icon name="download" width={18} height={18} />
              <span className="hidden sm:inline">Exporter</span>
            </a>
            <button onClick={openNew} className="btn btn-primary">
              <Icon name="plus" width={18} height={18} /> Ajouter
            </button>
          </div>
        }
      />

      <div className="glass-card mb-4 grid gap-3 p-4 sm:grid-cols-[1fr_auto]">
        <SearchInput value={search} onChange={setSearch} placeholder="Nom, ville, compétence…" />
        <select className="field sm:w-52" value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          {Object.entries(VOLUNTEER_STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="handHeart" title="Aucun bénévole" sub="Les candidatures envoyées depuis le site apparaîtront ici." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((v) => (
            <div key={v.id} className="glass-card p-4">
              <div className="flex items-start gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-sm font-bold text-white">
                  {initials(v.firstName, v.lastName)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-plum">{v.firstName} {v.lastName}</p>
                  <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-muted">
                    {v.email && <span className="truncate">{v.email}</span>}
                    {v.city && <span>{v.city}</span>}
                  </div>
                  {v.availability && <p className="mt-1 text-xs text-plum/70">Dispo : {v.availability}</p>}
                </div>
                <Badge variant={STATUS_VARIANT[v.status]}>{label(VOLUNTEER_STATUSES, v.status)}</Badge>
              </div>
              {v.skills && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {v.skills.split(",").map((s) => s.trim()).filter(Boolean).map((s) => <Badge key={s} variant="rose">{s}</Badge>)}
                </div>
              )}
              <div className="mt-3 flex items-center justify-between border-t border-white/50 pt-3">
                <select
                  className="rounded-full border border-rose-200 bg-white/70 px-3 py-1 text-xs font-medium text-plum outline-none"
                  value={v.status}
                  onChange={(e) => quickStatus(v, e.target.value)}
                >
                  {Object.entries(VOLUNTEER_STATUSES).map(([k, lab]) => <option key={k} value={k}>{lab}</option>)}
                </select>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(v)} title="Modifier / voir" className="grid h-9 w-9 place-items-center rounded-full text-plum/70 transition hover:bg-white">
                    <Icon name="eye" width={17} height={17} />
                  </button>
                  <ConfirmButton iconOnly onConfirm={async () => { await deleteVolunteer(v.id); router.refresh(); }} />
                </div>
              </div>
              <p className="mt-2 text-right text-xs text-muted">Reçu le {formatDate(v.createdAt)}</p>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={form.id ? "Fiche bénévole" : "Nouveau bénévole"} wide>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="field-label">Prénom *</label><input className="field" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required /></div>
            <div><label className="field-label">Nom *</label><input className="field" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required /></div>
            <div><label className="field-label">E-mail</label><input className="field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="field-label">Téléphone</label><input className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div><label className="field-label">Ville</label><input className="field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            <div><label className="field-label">Disponibilités</label><input className="field" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} /></div>
            <div><label className="field-label">Compétences (virgules)</label><input className="field" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} /></div>
            <div>
              <label className="field-label">Statut</label>
              <select className="field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {Object.entries(VOLUNTEER_STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div><label className="field-label">Message / motivation</label><textarea className="field min-h-[80px] resize-y" value={form.motivation} onChange={(e) => setForm({ ...form, motivation: e.target.value })} /></div>
          <div><label className="field-label">Notes internes</label><textarea className="field min-h-[70px] resize-y" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
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
