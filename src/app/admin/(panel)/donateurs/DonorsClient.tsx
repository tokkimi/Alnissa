"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "../../../components/Icons";
import { PageTitle, Badge, Modal, ConfirmButton, SearchInput, EmptyState } from "../../components/ui";
import { formatEuro, formatDate, initials } from "@/lib/format";
import { DONOR_TYPES, DONATION_METHODS, label } from "@/lib/constants";
import { saveDonor, deleteDonor } from "../../actions";

type DonationLite = {
  id: string;
  amount: number;
  date: string | Date;
  status: string;
  method: string;
  campaign: { name: string } | null;
};
type Donor = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  postalCode: string | null;
  city: string | null;
  country: string;
  type: string;
  organization: string | null;
  tags: string;
  notes: string | null;
  consentEmail: boolean;
  donations: DonationLite[];
};

const emptyForm = {
  id: "", firstName: "", lastName: "", email: "", phone: "", address: "",
  postalCode: "", city: "", country: "France", type: "INDIVIDUAL",
  organization: "", tags: "", notes: "", consentEmail: false,
};

export default function DonorsClient({ donors }: { donors: Donor[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [fType, setFType] = useState("");
  const [modal, setModal] = useState<"none" | "view" | "edit">("none");
  const [current, setCurrent] = useState<Donor | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const enriched = useMemo(
    () =>
      donors.map((d) => {
        const received = d.donations.filter((x) => x.status === "RECEIVED");
        const total = received.reduce((s, x) => s + x.amount, 0);
        const last = d.donations.length
          ? d.donations.reduce((a, b) => (new Date(a.date) > new Date(b.date) ? a : b))
          : null;
        return { ...d, total, count: d.donations.length, last };
      }),
    [donors],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enriched.filter((d) => {
      if (fType && d.type !== fType) return false;
      if (!q) return true;
      return [d.firstName, d.lastName, d.email, d.city, d.tags, d.organization]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [enriched, search, fType]);

  function openNew() {
    setForm({ ...emptyForm });
    setError("");
    setModal("edit");
  }
  function openView(d: Donor) {
    setCurrent(d);
    setModal("view");
  }
  function openEdit(d: Donor) {
    setForm({
      id: d.id, firstName: d.firstName, lastName: d.lastName, email: d.email ?? "",
      phone: d.phone ?? "", address: d.address ?? "", postalCode: d.postalCode ?? "",
      city: d.city ?? "", country: d.country, type: d.type, organization: d.organization ?? "",
      tags: d.tags, notes: d.notes ?? "", consentEmail: d.consentEmail,
    });
    setError("");
    setModal("edit");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await saveDonor(form);
    setSaving(false);
    if (!res.ok) { setError(res.error || "Erreur"); return; }
    setModal("none");
    router.refresh();
  }

  const tagList = (t: string) => t.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <>
      <PageTitle
        title="Donateurs"
        subtitle={`${donors.length} donateur${donors.length > 1 ? "s" : ""} au fichier`}
        icon="users"
        action={
          <div className="flex gap-2">
            <a href="/api/admin/export?type=donors" className="btn btn-glass">
              <Icon name="download" width={18} height={18} />
              <span className="hidden sm:inline">Exporter</span>
            </a>
            <button onClick={openNew} className="btn btn-primary">
              <Icon name="plus" width={18} height={18} />
              Nouveau
            </button>
          </div>
        }
      />

      <div className="glass-card mb-4 grid gap-3 p-4 sm:grid-cols-[1fr_auto]">
        <SearchInput value={search} onChange={setSearch} placeholder="Nom, e-mail, ville, étiquette…" />
        <select className="field sm:w-52" value={fType} onChange={(e) => setFType(e.target.value)}>
          <option value="">Tous les types</option>
          {Object.entries(DONOR_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="users" title="Aucun donateur" sub="Ajoutez un donateur ou modifiez votre recherche." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtered.map((d) => (
            <div key={d.id} className="glass-card p-4">
              <div className="flex items-start gap-3">
                <button onClick={() => openView(d)} className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-white">
                  {d.type === "COMPANY" ? <Icon name="megaphone" width={20} height={20} /> : <span className="text-sm font-bold">{initials(d.firstName, d.lastName)}</span>}
                </button>
                <div className="min-w-0 flex-1">
                  <button onClick={() => openView(d)} className="text-left">
                    <p className="font-semibold text-plum hover:text-rose-600">
                      {d.firstName} {d.lastName}
                    </p>
                    {d.organization && <p className="text-xs text-muted">{d.organization}</p>}
                  </button>
                  <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted">
                    {d.email && <span className="truncate">{d.email}</span>}
                    {d.city && <span>{d.city}</span>}
                  </div>
                  {tagList(d.tags).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {tagList(d.tags).map((t) => <Badge key={t} variant="rose">{t}</Badge>)}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="font-display text-xl text-plum">{formatEuro(d.total)}</p>
                  <p className="text-xs text-muted">{d.count} don{d.count > 1 ? "s" : ""}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/50 pt-3">
                <span className="text-xs text-muted">
                  {d.last ? `Dernier don : ${formatDate(d.last.date)}` : "Aucun don enregistré"}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(d)} title="Modifier" className="grid h-9 w-9 place-items-center rounded-full text-plum/70 transition hover:bg-white">
                    <Icon name="edit" width={17} height={17} />
                  </button>
                  <ConfirmButton
                    iconOnly
                    message="Supprimer ce donateur ? Ses dons seront conservés mais dissociés."
                    onConfirm={async () => { await deleteDonor(d.id); router.refresh(); }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fiche donateur */}
      <Modal open={modal === "view"} onClose={() => setModal("none")} title="Fiche donateur" wide>
        {current && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-xl font-bold text-white">
                {initials(current.firstName, current.lastName)}
              </span>
              <div>
                <h3 className="font-display text-2xl text-plum">{current.firstName} {current.lastName}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge variant={current.type === "COMPANY" ? "purple" : "gray"}>{label(DONOR_TYPES, current.type)}</Badge>
                  {current.consentEmail && <Badge variant="green">Newsletter OK</Badge>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 rounded-2xl bg-white/60 p-4 sm:grid-cols-2">
              {current.email && <Info icon="mail" label="E-mail" value={current.email} />}
              {current.phone && <Info icon="phone" label="Téléphone" value={current.phone} />}
              {(current.address || current.city) && (
                <Info icon="mapPin" label="Adresse" value={[current.address, current.postalCode, current.city, current.country].filter(Boolean).join(", ")} />
              )}
              {current.organization && <Info icon="megaphone" label="Organisation" value={current.organization} />}
            </div>

            {current.notes && (
              <div className="rounded-2xl bg-rose-50/70 p-4 text-sm text-plum/80">
                <p className="mb-1 font-semibold text-plum">Notes</p>
                {current.notes}
              </div>
            )}

            <div>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-display text-xl text-plum">Historique des dons</h4>
                <span className="font-semibold text-plum">
                  {formatEuro(current.donations.filter((x) => x.status === "RECEIVED").reduce((s, x) => s + x.amount, 0))}
                </span>
              </div>
              <div className="space-y-1.5">
                {current.donations.length === 0 && <p className="text-sm text-muted">Aucun don pour ce donateur.</p>}
                {[...current.donations]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((don) => (
                    <div key={don.id} className="flex items-center justify-between rounded-xl bg-white/60 px-3 py-2 text-sm">
                      <span className="text-muted">{formatDate(don.date)} · {label(DONATION_METHODS, don.method)}{don.campaign ? ` · ${don.campaign.name}` : ""}</span>
                      <span className="font-semibold text-plum">{formatEuro(don.amount)}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => openEdit(current)} className="btn btn-glass">
                <Icon name="edit" width={17} height={17} /> Modifier
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Ajout / édition */}
      <Modal open={modal === "edit"} onClose={() => setModal("none")} title={form.id ? "Modifier le donateur" : "Nouveau donateur"} wide>
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Prénom *</label>
              <input className="field" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
            </div>
            <div>
              <label className="field-label">Nom *</label>
              <input className="field" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
            </div>
            <div>
              <label className="field-label">Type</label>
              <select className="field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {Object.entries(DONOR_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Organisation</label>
              <input className="field" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
            </div>
            <div>
              <label className="field-label">E-mail</label>
              <input className="field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Téléphone</label>
              <input className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Adresse</label>
              <input className="field" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Code postal</label>
              <input className="field" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Ville</label>
              <input className="field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Pays</label>
              <input className="field" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Étiquettes (séparées par des virgules)</label>
              <input className="field" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="fidèle, mensuel, entreprise…" />
            </div>
          </div>
          <div>
            <label className="field-label">Notes internes</label>
            <textarea className="field min-h-[80px] resize-y" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm text-plum">
            <input type="checkbox" checked={form.consentEmail} onChange={(e) => setForm({ ...form, consentEmail: e.target.checked })} />
            Accepte de recevoir la newsletter / les actualités
          </label>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModal("none")} className="btn btn-glass">Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer"}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

function Info({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-rose-500"><Icon name={icon} width={18} height={18} /></span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
        <p className="break-words text-sm text-plum">{value}</p>
      </div>
    </div>
  );
}
