"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "../../../components/Icons";
import { PageTitle, Badge, Modal, ConfirmButton, SearchInput, EmptyState } from "../../components/ui";
import { formatEuro, formatDate, initials } from "@/lib/format";
import { DONATION_METHODS, DONATION_STATUSES, DONATION_FREQUENCIES, label } from "@/lib/constants";
import { saveDonation, deleteDonation, issueReceipt } from "../../actions";

type DonorLite = { id: string; firstName: string; lastName: string };
type CampaignLite = { id: string; name: string };
type Donation = {
  id: string;
  amount: number;
  date: string | Date;
  method: string;
  status: string;
  isRecurring: boolean;
  frequency: string | null;
  reference: string | null;
  message: string | null;
  anonymous: boolean;
  receiptIssued: boolean;
  receiptNumber: string | null;
  receiptDate: string | Date | null;
  donorId: string | null;
  campaignId: string | null;
  donor: DonorLite | null;
  campaign: (CampaignLite & { color?: string }) | null;
};

const emptyForm = {
  id: "",
  donorId: "",
  campaignId: "",
  amount: "",
  date: new Date().toISOString().slice(0, 10),
  method: "BANK_TRANSFER",
  status: "RECEIVED",
  isRecurring: false,
  frequency: "MONTHLY",
  reference: "",
  message: "",
  anonymous: false,
  receiptIssued: false,
  receiptNumber: "",
  receiptDate: "",
};

const STATUS_VARIANT: Record<string, "green" | "amber" | "gray"> = {
  RECEIVED: "green",
  PENDING: "amber",
  REFUNDED: "gray",
};

export default function DonationsClient({
  donations,
  donors,
  campaigns,
}: {
  donations: Donation[];
  donors: DonorLite[];
  campaigns: CampaignLite[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [fMethod, setFMethod] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fCampaign, setFCampaign] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return donations.filter((d) => {
      if (fMethod && d.method !== fMethod) return false;
      if (fStatus && d.status !== fStatus) return false;
      if (fCampaign && d.campaignId !== fCampaign) return false;
      if (!q) return true;
      const name = d.donor ? `${d.donor.firstName} ${d.donor.lastName}` : "anonyme";
      return (
        name.toLowerCase().includes(q) ||
        String(d.amount).includes(q) ||
        (d.reference ?? "").toLowerCase().includes(q)
      );
    });
  }, [donations, search, fMethod, fStatus, fCampaign]);

  const total = filtered.filter((d) => d.status === "RECEIVED").reduce((s, d) => s + d.amount, 0);

  function openNew() {
    setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 10) });
    setError("");
    setOpen(true);
  }

  function openEdit(d: Donation) {
    setForm({
      id: d.id,
      donorId: d.donorId ?? "",
      campaignId: d.campaignId ?? "",
      amount: String(d.amount),
      date: new Date(d.date).toISOString().slice(0, 10),
      method: d.method,
      status: d.status,
      isRecurring: d.isRecurring,
      frequency: d.frequency ?? "MONTHLY",
      reference: d.reference ?? "",
      message: d.message ?? "",
      anonymous: d.anonymous,
      receiptIssued: d.receiptIssued,
      receiptNumber: d.receiptNumber ?? "",
      receiptDate: d.receiptDate ? new Date(d.receiptDate).toISOString().slice(0, 10) : "",
    });
    setError("");
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await saveDonation({ ...form, donorId: form.anonymous ? "" : form.donorId });
    setSaving(false);
    if (!res.ok) {
      setError(res.error || "Erreur");
      return;
    }
    setOpen(false);
    router.refresh();
  }

  async function quickReceipt(d: Donation) {
    const num = window.prompt("Numéro du reçu fiscal (facultatif) :", d.receiptNumber || "");
    if (num === null) return;
    await issueReceipt(d.id, num);
    router.refresh();
  }

  return (
    <>
      <PageTitle
        title="Dons"
        subtitle={`${donations.length} don${donations.length > 1 ? "s" : ""} enregistré${donations.length > 1 ? "s" : ""}`}
        icon="euro"
        action={
          <div className="flex gap-2">
            <a href="/api/admin/export?type=donations" className="btn btn-glass">
              <Icon name="download" width={18} height={18} />
              <span className="hidden sm:inline">Exporter</span>
            </a>
            <button onClick={openNew} className="btn btn-primary">
              <Icon name="plus" width={18} height={18} />
              Nouveau don
            </button>
          </div>
        }
      />

      {/* Filtres */}
      <div className="glass-card mb-4 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Nom, montant, référence…" />
        <select className="field" value={fMethod} onChange={(e) => setFMethod(e.target.value)}>
          <option value="">Toutes les méthodes</option>
          {Object.entries(DONATION_METHODS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select className="field" value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          {Object.entries(DONATION_STATUSES).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select className="field" value={fCampaign} onChange={(e) => setFCampaign(e.target.value)}>
          <option value="">Toutes les campagnes</option>
          {campaigns.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Badge variant="rose">{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</Badge>
        <span className="text-sm text-plum/70">
          Total reçu (filtré) : <strong className="text-plum">{formatEuro(total)}</strong>
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="euro" title="Aucun don" sub="Ajustez les filtres ou enregistrez un nouveau don." />
      ) : (
        <div className="space-y-2">
          {filtered.map((d) => (
            <div key={d.id} className="glass-card flex flex-wrap items-center gap-3 p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-rose-100 text-sm font-bold text-rose-600">
                {d.donor ? initials(d.donor.firstName, d.donor.lastName) : "€"}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-plum">
                    {d.anonymous ? "Don anonyme" : d.donor ? `${d.donor.firstName} ${d.donor.lastName}` : "Donateur inconnu"}
                  </p>
                  {d.isRecurring && <Badge variant="purple">Récurrent</Badge>}
                  {d.receiptIssued && <Badge variant="blue">Reçu émis</Badge>}
                </div>
                <p className="text-xs text-muted">
                  {formatDate(d.date)} · {label(DONATION_METHODS, d.method)}
                  {d.campaign ? ` · ${d.campaign.name}` : ""}
                  {d.reference ? ` · réf. ${d.reference}` : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl text-plum">{formatEuro(d.amount)}</p>
                <Badge variant={STATUS_VARIANT[d.status] ?? "gray"}>{label(DONATION_STATUSES, d.status)}</Badge>
              </div>
              <div className="flex items-center gap-1">
                {!d.receiptIssued && d.status === "RECEIVED" && (
                  <button
                    onClick={() => quickReceipt(d)}
                    title="Émettre le reçu fiscal"
                    className="grid h-9 w-9 place-items-center rounded-full text-amber-600 transition hover:bg-amber-100"
                  >
                    <Icon name="receipt" width={17} height={17} />
                  </button>
                )}
                <button
                  onClick={() => openEdit(d)}
                  title="Modifier"
                  className="grid h-9 w-9 place-items-center rounded-full text-plum/70 transition hover:bg-white"
                >
                  <Icon name="edit" width={17} height={17} />
                </button>
                <ConfirmButton iconOnly onConfirm={async () => { await deleteDonation(d.id); router.refresh(); }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modale ajout / édition */}
      <Modal open={open} onClose={() => setOpen(false)} title={form.id ? "Modifier le don" : "Nouveau don"} wide>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="field-label">Donateur</label>
              <select
                className="field"
                value={form.donorId}
                onChange={(e) => setForm({ ...form, donorId: e.target.value })}
                disabled={form.anonymous}
              >
                <option value="">— Sélectionner —</option>
                {donors.map((d) => (
                  <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>
                ))}
              </select>
              <label className="mt-2 flex items-center gap-2 text-sm text-plum">
                <input type="checkbox" checked={form.anonymous} onChange={(e) => setForm({ ...form, anonymous: e.target.checked })} />
                Don anonyme
              </label>
            </div>
            <div>
              <label className="field-label">Montant (€) *</label>
              <input className="field" type="number" step="0.01" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            </div>
            <div>
              <label className="field-label">Date</label>
              <input className="field" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Méthode</label>
              <select className="field" value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
                {Object.entries(DONATION_METHODS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Statut</label>
              <select className="field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {Object.entries(DONATION_STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Campagne</label>
              <select className="field" value={form.campaignId} onChange={(e) => setForm({ ...form, campaignId: e.target.value })}>
                <option value="">— Aucune —</option>
                {campaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Référence</label>
              <input className="field" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} placeholder="N° virement, chèque…" />
            </div>
          </div>

          <div className="rounded-2xl bg-rose-50/70 p-4">
            <label className="flex items-center gap-2 text-sm font-medium text-plum">
              <input type="checkbox" checked={form.isRecurring} onChange={(e) => setForm({ ...form, isRecurring: e.target.checked })} />
              Don récurrent
            </label>
            {form.isRecurring && (
              <div className="mt-3">
                <label className="field-label">Fréquence</label>
                <select className="field" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
                  {Object.entries(DONATION_FREQUENCIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-rose-50/70 p-4">
            <label className="flex items-center gap-2 text-sm font-medium text-plum">
              <input type="checkbox" checked={form.receiptIssued} onChange={(e) => setForm({ ...form, receiptIssued: e.target.checked })} />
              Reçu fiscal émis
            </label>
            {form.receiptIssued && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="field-label">N° de reçu</label>
                  <input className="field" value={form.receiptNumber} onChange={(e) => setForm({ ...form, receiptNumber: e.target.value })} />
                </div>
                <div>
                  <label className="field-label">Date du reçu</label>
                  <input className="field" type="date" value={form.receiptDate} onChange={(e) => setForm({ ...form, receiptDate: e.target.value })} />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="field-label">Message / note</label>
            <textarea className="field min-h-[80px] resize-y" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn btn-glass">Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
