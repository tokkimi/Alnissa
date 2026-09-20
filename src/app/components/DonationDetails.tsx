"use client";

import { useState } from "react";
import { Icon } from "./Icons";
import type { SiteContent } from "@/lib/content";

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  }
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/70 px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
        <p className="truncate font-mono text-[0.95rem] font-medium text-plum">{value}</p>
      </div>
      <button
        onClick={copy}
        className="btn shrink-0 rounded-full bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-200"
        aria-label={`Copier ${label}`}
      >
        <Icon name={copied ? "check" : "copy"} width={16} height={16} />
        {copied ? "Copié" : "Copier"}
      </button>
    </div>
  );
}

export default function DonationDetails({ content }: { content: SiteContent }) {
  const { donation, contact } = content;
  const [amount, setAmount] = useState<number | null>(donation.suggestions[1] ?? null);

  return (
    <section className="container-x py-10">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Don en ligne / montants */}
        <div className="glass-card p-7 sm:p-9">
          <div className="mb-2 inline-grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 text-white">
            <Icon name="heart" width={24} height={24} />
          </div>
          <h2 className="font-display text-3xl text-plum">Don en ligne</h2>
          <p className="mt-2 text-sm leading-relaxed text-plum/75">
            Choisissez un montant qui vous parle. Chaque don, quel qu'il soit, a un impact réel.
          </p>

          <div className="mt-6 grid grid-cols-4 gap-2.5">
            {donation.suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setAmount(s)}
                className={`rounded-2xl border py-3 text-center font-semibold transition ${
                  amount === s
                    ? "border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                    : "border-rose-200 bg-white/60 text-plum hover:border-rose-400"
                }`}
              >
                {s} €
              </button>
            ))}
          </div>

          <a
            href={donation.onlineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-6 w-full"
          >
            <Icon name="heart" width={19} height={19} />
            {amount ? `Donner ${amount} € en ligne` : donation.onlineLabel}
          </a>
          <p className="mt-3 text-center text-xs text-muted">
            Vous serez redirigé·e vers notre plateforme de dons sécurisée.
          </p>
        </div>

        {/* Virement bancaire (RIB) */}
        <div className="glass-card p-7 sm:p-9">
          <div className="mb-2 inline-grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-mauve to-rose-600 text-white">
            <Icon name="bank" width={24} height={24} />
          </div>
          <h2 className="font-display text-3xl text-plum">Par virement bancaire</h2>
          <p className="mt-2 text-sm leading-relaxed text-plum/75">
            Vous pouvez soutenir l'association directement par virement, ponctuel ou régulier.
          </p>

          <div className="mt-6 space-y-2.5">
            {donation.accountName && (
              <CopyRow label="Bénéficiaire" value={donation.accountName} />
            )}
            {donation.iban && <CopyRow label="IBAN" value={donation.iban} />}
            {donation.bic && <CopyRow label="BIC" value={donation.bic} />}
            {donation.bankName && (
              <div className="rounded-2xl bg-white/70 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">Banque</p>
                <p className="font-medium text-plum">{donation.bankName}</p>
              </div>
            )}
          </div>

          <p className="mt-5 text-xs leading-relaxed text-muted">
            {donation.taxNote}
          </p>
        </div>
      </div>

      {/* Autres façons d'aider */}
      <div className="glass-card mt-6 flex flex-col items-center justify-between gap-4 p-7 text-center sm:flex-row sm:text-left">
        <div>
          <h3 className="font-display text-2xl text-plum">Dons en nature & partenariats</h3>
          <p className="mt-1 text-sm text-plum/75">
            Vêtements, denrées, produits d'hygiène, mécénat d'entreprise… Contactez-nous, tout est utile.
          </p>
        </div>
        <a href={`mailto:${contact.email}`} className="btn btn-glass shrink-0">
          <Icon name="mail" width={18} height={18} />
          Nous écrire
        </a>
      </div>
    </section>
  );
}
