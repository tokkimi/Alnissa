"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "../../../components/Icons";
import { PageTitle, Badge, Modal, ConfirmButton, EmptyState } from "../../components/ui";
import { formatEuro } from "@/lib/format";
import { saveCampaign, deleteCampaign } from "../../actions";

type Campaign = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  goalAmount: number;
  color: string;
  icon: string;
  isActive: boolean;
  sortOrder: number;
  raised: number;
  count: number;
};

const ICONS = ["heart", "soup", "box", "gift", "elder", "water", "star", "handHeart", "share", "megaphone"];
const COLORS = ["#e79aa8", "#d98aa0", "#c98fb0", "#e6a9b4", "#d3a0c0", "#b57fa0", "#c25f78"];

const emptyForm = {
  id: "", name: "", slug: "", description: "", goalAmount: "",
  color: "#e79aa8", icon: "heart", isActive: true, sortOrder: "0",
};

export default function CampaignsClient({ campaigns }: { campaigns: Campaign[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function openNew() { setForm({ ...emptyForm, sortOrder: String(campaigns.length + 1) }); setError(""); setOpen(true); }
  function openEdit(c: Campaign) {
    setForm({
      id: c.id, name: c.name, slug: c.slug, description: c.description ?? "",
      goalAmount: String(c.goalAmount), color: c.color, icon: c.icon,
      isActive: c.isActive, sortOrder: String(c.sortOrder),
    });
    setError(""); setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    const res = await saveCampaign(form);
    setSaving(false);
    if (!res.ok) { setError(res.error || "Erreur"); return; }
    setOpen(false); router.refresh();
  }

  return (
    <>
      <PageTitle
        title="Campagnes"
        subtitle="Vos projets et collectes de fonds"
        icon="megaphone"
        action={<button onClick={openNew} className="btn btn-primary"><Icon name="plus" width={18} height={18} /> Nouvelle campagne</button>}
      />

      {campaigns.length === 0 ? (
        <EmptyState icon="megaphone" title="Aucune campagne" sub="Créez votre première campagne de collecte." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {campaigns.map((c) => {
            const pct = c.goalAmount > 0 ? Math.min(100, Math.round((c.raised / c.goalAmount) * 100)) : 0;
            return (
              <div key={c.id} className="glass-card p-5">
                <div className="flex items-start gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white" style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}bb)` }}>
                    <Icon name={c.icon} width={24} height={24} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-2xl text-plum">{c.name}</h3>
                      {!c.isActive && <Badge variant="gray">Inactive</Badge>}
                    </div>
                    {c.description && <p className="mt-1 text-sm text-plum/75">{c.description}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-semibold text-plum">{formatEuro(c.raised)}</span>
                    {c.goalAmount > 0 && <span className="text-muted">Objectif {formatEuro(c.goalAmount)}</span>}
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-rose-100">
                    <div className="h-full rounded-full" style={{ width: `${Math.max(3, pct)}%`, background: `linear-gradient(90deg, ${c.color}, ${c.color}cc)` }} />
                  </div>
                  <p className="mt-1 text-xs text-muted">{c.count} don{c.count > 1 ? "s" : ""}{c.goalAmount > 0 ? ` · ${pct}% de l'objectif` : ""}</p>
                </div>

                <div className="mt-3 flex justify-end gap-1 border-t border-white/50 pt-3">
                  <button onClick={() => openEdit(c)} title="Modifier" className="grid h-9 w-9 place-items-center rounded-full text-plum/70 transition hover:bg-white">
                    <Icon name="edit" width={17} height={17} />
                  </button>
                  <ConfirmButton iconOnly message="Supprimer cette campagne ? Les dons associés seront conservés." onConfirm={async () => { await deleteCampaign(c.id); router.refresh(); }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={form.id ? "Modifier la campagne" : "Nouvelle campagne"}>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="field-label">Nom *</label>
            <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="field-label">Description</label>
            <textarea className="field min-h-[70px] resize-y" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Objectif (€)</label>
              <input className="field" type="number" min="0" step="1" value={form.goalAmount} onChange={(e) => setForm({ ...form, goalAmount: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Ordre d'affichage</label>
              <input className="field" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="field-label">Icône</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((ic) => (
                <button key={ic} type="button" onClick={() => setForm({ ...form, icon: ic })} className={`grid h-11 w-11 place-items-center rounded-xl transition ${form.icon === ic ? "bg-rose-500 text-white" : "bg-white/70 text-plum/70 hover:bg-white"}`}>
                  <Icon name={ic} width={20} height={20} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="field-label">Couleur</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((col) => (
                <button key={col} type="button" onClick={() => setForm({ ...form, color: col })} className={`h-9 w-9 rounded-full transition ${form.color === col ? "ring-2 ring-plum ring-offset-2" : ""}`} style={{ background: col }} aria-label={col} />
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-plum">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Campagne active
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
