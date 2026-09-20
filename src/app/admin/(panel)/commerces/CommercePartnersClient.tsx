"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "../../../components/Icons";
import { PageTitle, Badge, Modal, ConfirmButton, SearchInput, EmptyState } from "../../components/ui";
import { formatDate } from "@/lib/format";
import { FOOD_PARTNER_STATUSES, label } from "@/lib/constants";
import { saveFoodPartner, deleteFoodPartner } from "../../actions";

type FoodPartner = {
  id: string;
  businessName: string;
  businessType: string | null;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  postalCode: string | null;
  city: string | null;
  lat: number | null;
  lng: number | null;
  foodType: string | null;
  frequency: string | null;
  availability: string | null;
  message: string | null;
  status: string;
  notes: string | null;
  createdAt: string | Date;
};

const STATUS_VARIANT: Record<string, "rose" | "amber" | "green" | "gray"> = {
  NEW: "rose",
  CONTACTED: "amber",
  ACTIVE: "green",
  DECLINED: "gray",
};

const emptyForm = {
  id: "", businessName: "", businessType: "", contactName: "", email: "", phone: "",
  address: "", postalCode: "", city: "", foodType: "", frequency: "", availability: "",
  message: "", status: "NEW", notes: "",
};

function mapUrl(p: FoodPartner): string | null {
  if (p.lat != null && p.lng != null) return `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
  const q = [p.address, p.postalCode, p.city].filter(Boolean).join(" ");
  return q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : null;
}

export default function CommercePartnersClient({ partners }: { partners: FoodPartner[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return partners.filter((p) => {
      if (fStatus && p.status !== fStatus) return false;
      if (!q) return true;
      return [p.businessName, p.businessType, p.city, p.address, p.foodType, p.contactName, p.email]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [partners, search, fStatus]);

  function openNew() { setForm({ ...emptyForm }); setError(""); setOpen(true); }
  function openEdit(p: FoodPartner) {
    setForm({
      id: p.id, businessName: p.businessName, businessType: p.businessType ?? "",
      contactName: p.contactName ?? "", email: p.email ?? "", phone: p.phone ?? "",
      address: p.address ?? "", postalCode: p.postalCode ?? "", city: p.city ?? "",
      foodType: p.foodType ?? "", frequency: p.frequency ?? "", availability: p.availability ?? "",
      message: p.message ?? "", status: p.status, notes: p.notes ?? "",
    });
    setError(""); setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    const res = await saveFoodPartner(form);
    setSaving(false);
    if (!res.ok) { setError(res.error || "Erreur"); return; }
    setOpen(false); router.refresh();
  }

  async function quickStatus(p: FoodPartner, status: string) {
    await saveFoodPartner({ ...p, status });
    router.refresh();
  }

  return (
    <>
      <PageTitle
        title="Commerçants"
        subtitle={`${partners.length} proposition${partners.length > 1 ? "s" : ""} de don alimentaire`}
        icon="box"
        action={
          <div className="flex gap-2">
            <a href="/api/admin/export?type=commerces" className="btn btn-glass">
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
        <SearchInput value={search} onChange={setSearch} placeholder="Commerce, ville, denrées…" />
        <select className="field sm:w-56" value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          {Object.entries(FOOD_PARTNER_STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="box" title="Aucune proposition" sub="Les dons proposés par les commerçants apparaîtront ici." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((p) => {
            const url = mapUrl(p);
            return (
              <div key={p.id} className="glass-card p-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 text-white">
                    <Icon name="box" width={22} height={22} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-plum">{p.businessName}</p>
                    {p.businessType && <p className="text-xs text-muted">{p.businessType}</p>}
                  </div>
                  <Badge variant={STATUS_VARIANT[p.status]}>{label(FOOD_PARTNER_STATUSES, p.status)}</Badge>
                </div>

                <div className="mt-3 space-y-1.5 text-sm text-plum/80">
                  {(p.address || p.city) && (
                    <p className="flex items-start gap-2">
                      <Icon name="mapPin" width={16} height={16} className="mt-0.5 shrink-0 text-rose-500" />
                      <span>
                        {[p.address, p.postalCode, p.city].filter(Boolean).join(", ")}
                        {url && (
                          <>
                            {" "}
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:underline">
                              (carte)
                            </a>
                          </>
                        )}
                      </span>
                    </p>
                  )}
                  {p.foodType && (
                    <p className="flex items-center gap-2"><Icon name="soup" width={16} height={16} className="text-rose-500" /> {p.foodType}</p>
                  )}
                  {(p.frequency || p.availability) && (
                    <p className="flex items-center gap-2"><Icon name="clock" width={16} height={16} className="text-rose-500" /> {[p.frequency, p.availability].filter(Boolean).join(" · ")}</p>
                  )}
                  {(p.contactName || p.phone || p.email) && (
                    <p className="flex items-center gap-2"><Icon name="phone" width={16} height={16} className="text-rose-500" /> {[p.contactName, p.phone, p.email].filter(Boolean).join(" · ")}</p>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-white/50 pt-3">
                  <select
                    className="rounded-full border border-rose-200 bg-white/70 px-3 py-1 text-xs font-medium text-plum outline-none"
                    value={p.status}
                    onChange={(e) => quickStatus(p, e.target.value)}
                  >
                    {Object.entries(FOOD_PARTNER_STATUSES).map(([k, lab]) => <option key={k} value={k}>{lab}</option>)}
                  </select>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(p)} title="Modifier / voir" className="grid h-9 w-9 place-items-center rounded-full text-plum/70 transition hover:bg-white">
                      <Icon name="eye" width={17} height={17} />
                    </button>
                    <ConfirmButton iconOnly onConfirm={async () => { await deleteFoodPartner(p.id); router.refresh(); }} />
                  </div>
                </div>
                <p className="mt-2 text-right text-xs text-muted">Reçu le {formatDate(p.createdAt)}</p>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={form.id ? "Fiche commerçant" : "Nouveau commerçant"} wide>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="field-label">Nom du commerce *</label><input className="field" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} required /></div>
            <div><label className="field-label">Type</label><input className="field" value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className="field-label">Adresse</label><input className="field" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <div><label className="field-label">Code postal</label><input className="field" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} /></div>
            <div><label className="field-label">Ville</label><input className="field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            <div><label className="field-label">Contact</label><input className="field" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} /></div>
            <div><label className="field-label">Téléphone</label><input className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className="field-label">E-mail</label><input className="field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="field-label">Denrées</label><input className="field" value={form.foodType} onChange={(e) => setForm({ ...form, foodType: e.target.value })} /></div>
            <div><label className="field-label">Fréquence</label><input className="field" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className="field-label">Créneaux de collecte</label><input className="field" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} /></div>
            <div>
              <label className="field-label">Statut</label>
              <select className="field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {Object.entries(FOOD_PARTNER_STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div><label className="field-label">Message du commerçant</label><textarea className="field min-h-[70px] resize-y" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
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
