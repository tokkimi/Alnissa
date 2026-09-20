"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "./Icons";

export interface BubbleProps {
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  donateHref: string;
  labels: {
    title: string;
    onlineLabel: string;
    messagingTitle: string;
    messagingSubtitle: string;
    soundLabel: string;
  };
  brandName: string;
}

export default function ContactBubble({
  email,
  phone,
  whatsapp,
  instagram,
  donateHref,
  labels,
  brandName,
}: BubbleProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"menu" | "message" | "sent">("menu");
  const [form, setForm] = useState({ name: "", email: "", body: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  async function submitMessage(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.body.trim()) {
      setError("Merci d'indiquer votre nom et votre message.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, channel: "BUBBLE" }),
      });
      if (!res.ok) throw new Error();
      setView("sent");
      setForm({ name: "", email: "", body: "" });
    } catch {
      setError("Une erreur est survenue. Réessayez ou écrivez-nous par courriel.");
    } finally {
      setSubmitting(false);
    }
  }

  const waLink = whatsapp
    ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`
    : "";

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {/* Panneau déployé */}
      {open && (
        <div
          ref={panelRef}
          className="glass-card w-[min(92vw,22rem)] overflow-hidden animate-fade-up"
          role="dialog"
          aria-label={labels.title}
        >
          {/* En-tête */}
          <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-3">
            <h3 className="font-display text-2xl leading-none text-plum">
              {labels.title}
            </h3>
            <button
              onClick={() => setOpen(false)}
              aria-label="Fermer"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/70 text-plum transition hover:bg-white"
            >
              <Icon name="close" width={18} height={18} />
            </button>
          </div>

          {view === "menu" && (
            <div className="px-3 pb-3">
              {/* Courriel */}
              <a
                href={`mailto:${email}`}
                className="group flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-white/70"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-rose-100 text-rose-600">
                  <Icon name="mail" width={20} height={20} />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-plum">
                    Envoyer un courriel
                  </span>
                  <span className="block truncate text-sm text-muted">{email}</span>
                </span>
              </a>

              <div className="mx-3 my-1 h-px bg-rose-100" />

              {/* Messagerie interne */}
              <button
                onClick={() => setView("message")}
                className="group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-white/70"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-rose-100 text-rose-600">
                  <Icon name="chat" width={20} height={20} />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-plum">
                    {labels.messagingTitle}
                  </span>
                  <span className="block truncate text-sm text-muted">
                    {labels.messagingSubtitle}
                  </span>
                </span>
              </button>

              <div className="mx-3 my-1 h-px bg-rose-100" />

              {/* Bloc marque + faire un don */}
              <Link
                href={donateHref}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-white/70"
              >
                <Image
                  src="/logo.png"
                  alt={brandName}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full"
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold uppercase tracking-wide text-plum">
                    {brandName}
                  </span>
                  <span className="block text-xs uppercase tracking-[0.2em] text-muted">
                    Faire un don &amp; contact
                  </span>
                </span>
                <span className="online-dot" title={labels.onlineLabel} />
              </Link>

              {/* Réseaux rapides */}
              <div className="flex items-center justify-center gap-2 px-3 pb-2 pt-1">
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="grid h-10 w-10 place-items-center rounded-full bg-white/70 text-rose-600 transition hover:bg-white"
                  >
                    <Icon name="instagram" width={19} height={19} />
                  </a>
                )}
                {waLink && (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="grid h-10 w-10 place-items-center rounded-full bg-white/70 text-rose-600 transition hover:bg-white"
                  >
                    <Icon name="whatsapp" width={19} height={19} />
                  </a>
                )}
                {phone && (
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    aria-label="Téléphone"
                    className="grid h-10 w-10 place-items-center rounded-full bg-white/70 text-rose-600 transition hover:bg-white"
                  >
                    <Icon name="phone" width={19} height={19} />
                  </a>
                )}
              </div>
            </div>
          )}

          {view === "message" && (
            <form onSubmit={submitMessage} className="px-5 pb-5">
              <button
                type="button"
                onClick={() => setView("menu")}
                className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-rose-600"
              >
                <Icon name="chevronRight" width={16} height={16} className="rotate-180" />
                Retour
              </button>
              <div className="space-y-3">
                <input
                  className="field"
                  placeholder="Votre nom *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  className="field"
                  type="email"
                  placeholder="Votre e-mail (pour la réponse)"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <textarea
                  className="field min-h-[110px] resize-y"
                  placeholder="Votre message *"
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                />
                {error && <p className="text-sm text-rose-600">{error}</p>}
                <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
                  {submitting ? "Envoi…" : "Envoyer le message"}
                  {!submitting && <Icon name="arrowRight" width={18} height={18} />}
                </button>
                <p className="text-center text-xs text-muted">
                  Votre message arrive directement dans la messagerie de l'association.
                </p>
              </div>
            </form>
          )}

          {view === "sent" && (
            <div className="px-6 pb-8 pt-2 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-100 text-rose-600">
                <Icon name="check" width={30} height={30} />
              </div>
              <h4 className="mt-4 font-display text-2xl text-plum">Message envoyé 🌸</h4>
              <p className="mt-1 text-sm text-muted">
                Merci ! Nous vous répondrons dès que possible.
              </p>
              <button
                onClick={() => setView("menu")}
                className="btn btn-glass mt-5"
              >
                Revenir au menu
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bouton flottant */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Fermer le contact" : "Nous contacter"}
        aria-expanded={open}
        className="relative grid h-16 w-16 place-items-center rounded-full shadow-[0_16px_40px_-8px_rgba(197,95,120,0.6)] transition-transform hover:scale-105 active:scale-95"
        style={{
          background:
            "linear-gradient(135deg, var(--color-rose-400), var(--color-rose-600))",
        }}
      >
        {open ? (
          <Icon name="close" width={26} height={26} className="text-white" />
        ) : (
          <>
            <Icon name="chat" width={26} height={26} className="text-white" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-300 opacity-75" />
              <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-rose-600">
                ♥
              </span>
            </span>
          </>
        )}
      </button>
    </div>
  );
}
