"use client";

import { useEffect, useState } from "react";
import { Icon } from "../../components/Icons";

/* ── Titre de page ── */
export function PageTitle({
  title,
  subtitle,
  action,
  icon,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-3">
        {icon && (
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-lg shadow-rose-500/30">
            <Icon name={icon} width={24} height={24} />
          </span>
        )}
        <div>
          <h1 className="font-display text-3xl text-plum sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-plum/70">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

/* ── Carte statistique ── */
export function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: string;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-plum/70">{label}</p>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-rose-100 text-rose-600">
          <Icon name={icon} width={18} height={18} />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl text-plum sm:text-4xl">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}

/* ── Badge ── */
const BADGE_STYLES: Record<string, string> = {
  rose: "bg-rose-100 text-rose-700",
  green: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  gray: "bg-plum/10 text-plum/70",
  blue: "bg-sky-100 text-sky-700",
  purple: "bg-purple-100 text-purple-700",
};
export function Badge({
  children,
  variant = "gray",
}: {
  children: React.ReactNode;
  variant?: keyof typeof BADGE_STYLES;
}) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE_STYLES[variant]}`}>
      {children}
    </span>
  );
}

/* ── Fenêtre modale ── */
export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-plum/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`glass-card relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-b-none sm:rounded-3xl ${
          wide ? "sm:max-w-3xl" : "sm:max-w-lg"
        } animate-fade-up`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/60 bg-white/70 px-6 py-4 backdrop-blur">
          <h3 className="font-display text-2xl text-plum">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-plum hover:bg-white"
          >
            <Icon name="close" width={18} height={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/* ── Bouton de suppression avec confirmation ── */
export function ConfirmButton({
  onConfirm,
  label = "Supprimer",
  message = "Confirmer la suppression ? Cette action est définitive.",
  className = "",
  iconOnly = false,
}: {
  onConfirm: () => Promise<unknown> | void;
  label?: string;
  message?: string;
  className?: string;
  iconOnly?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  async function handle() {
    if (!window.confirm(message)) return;
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  }
  if (iconOnly) {
    return (
      <button
        onClick={handle}
        disabled={busy}
        aria-label={label}
        title={label}
        className={`grid h-9 w-9 place-items-center rounded-full text-rose-600 transition hover:bg-rose-100 disabled:opacity-50 ${className}`}
      >
        <Icon name="trash" width={17} height={17} />
      </button>
    );
  }
  return (
    <button
      onClick={handle}
      disabled={busy}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-rose-600 transition hover:bg-rose-100 disabled:opacity-50 ${className}`}
    >
      <Icon name="trash" width={16} height={16} />
      {busy ? "…" : label}
    </button>
  );
}

/* ── Recherche ── */
export function SearchInput({
  value,
  onChange,
  placeholder = "Rechercher…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
        <Icon name="search" width={18} height={18} />
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field pl-10"
      />
    </div>
  );
}

/* ── État vide ── */
export function EmptyState({ icon = "sparkle", title, sub }: { icon?: string; title: string; sub?: string }) {
  return (
    <div className="glass-card flex flex-col items-center justify-center gap-2 p-12 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-rose-100 text-rose-500">
        <Icon name={icon} width={28} height={28} />
      </span>
      <p className="mt-1 font-display text-2xl text-plum">{title}</p>
      {sub && <p className="text-sm text-muted">{sub}</p>}
    </div>
  );
}
