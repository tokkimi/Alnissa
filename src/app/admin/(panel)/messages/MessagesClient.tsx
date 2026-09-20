"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "../../../components/Icons";
import { PageTitle, Badge, Modal, ConfirmButton, SearchInput, EmptyState } from "../../components/ui";
import { formatDateTime, relativeTime } from "@/lib/format";
import { MESSAGE_CHANNELS, MESSAGE_STATUSES, label } from "@/lib/constants";
import { updateMessage, deleteMessage } from "../../actions";

type Message = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string;
  body: string;
  channel: string;
  status: string;
  isStarred: boolean;
  adminNote: string | null;
  createdAt: string | Date;
  readAt: string | Date | null;
};

const TABS = [
  { key: "", label: "Tous" },
  { key: "NEW", label: "Nouveaux" },
  { key: "READ", label: "Lus" },
  { key: "REPLIED", label: "Répondus" },
  { key: "ARCHIVED", label: "Archivés" },
];

const STATUS_VARIANT: Record<string, "rose" | "amber" | "green" | "gray"> = {
  NEW: "rose",
  READ: "amber",
  REPLIED: "green",
  ARCHIVED: "gray",
};

export default function MessagesClient({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const [tab, setTab] = useState("");
  const [search, setSearch] = useState("");
  const [current, setCurrent] = useState<Message | null>(null);
  const [note, setNote] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const m of messages) c[m.status] = (c[m.status] || 0) + 1;
    return c;
  }, [messages]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return messages.filter((m) => {
      if (tab && m.status !== tab) return false;
      if (!q) return true;
      return [m.name, m.email, m.subject, m.body].filter(Boolean).some((v) => String(v).toLowerCase().includes(q));
    });
  }, [messages, tab, search]);

  async function open(m: Message) {
    setCurrent(m);
    setNote(m.adminNote ?? "");
    if (m.status === "NEW") {
      await updateMessage(m.id, { status: "READ" });
      router.refresh();
    }
  }

  async function setStatus(id: string, status: string) {
    await updateMessage(id, { status });
    setCurrent((c) => (c ? { ...c, status } : c));
    router.refresh();
  }
  async function toggleStar(m: Message) {
    await updateMessage(m.id, { isStarred: !m.isStarred });
    router.refresh();
  }
  async function saveNote() {
    if (!current) return;
    await updateMessage(current.id, { adminNote: note });
    router.refresh();
  }

  return (
    <>
      <PageTitle
        title="Messagerie"
        subtitle="Messages reçus via la bulle de contact et le formulaire"
        icon="inbox"
        action={
          <a href="/api/admin/export?type=messages" className="btn btn-glass">
            <Icon name="download" width={18} height={18} />
            <span className="hidden sm:inline">Exporter</span>
          </a>
        }
      />

      <div className="glass-card mb-4 p-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un message…" />
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                tab === t.key ? "bg-rose-500 text-white" : "bg-white/60 text-plum/70 hover:bg-white"
              }`}
            >
              {t.label}
              {t.key && counts[t.key] ? ` (${counts[t.key]})` : ""}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="inbox" title="Aucun message" sub="Les messages envoyés depuis le site apparaîtront ici." />
      ) : (
        <div className="space-y-2">
          {filtered.map((m) => (
            <button
              key={m.id}
              onClick={() => open(m)}
              className="glass-card flex w-full items-start gap-3 p-4 text-left transition hover:-translate-y-0.5"
            >
              <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${m.status === "NEW" ? "bg-rose-500" : "bg-plum/20"}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className={`truncate ${m.status === "NEW" ? "font-bold" : "font-semibold"} text-plum`}>
                    {m.isStarred && <span className="mr-1 text-amber-500">★</span>}
                    {m.name}
                  </p>
                  <span className="shrink-0 text-xs text-muted">{relativeTime(m.createdAt)}</span>
                </div>
                <p className="truncate text-sm font-medium text-plum/80">{m.subject}</p>
                <p className="truncate text-sm text-muted">{m.body}</p>
                <div className="mt-1.5 flex gap-1.5">
                  <Badge variant={STATUS_VARIANT[m.status]}>{label(MESSAGE_STATUSES, m.status)}</Badge>
                  <Badge variant="gray">{label(MESSAGE_CHANNELS, m.channel)}</Badge>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Détail */}
      <Modal open={!!current} onClose={() => setCurrent(null)} title="Message" wide>
        {current && (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-2xl text-plum">{current.subject}</h3>
                <p className="mt-1 text-sm text-muted">
                  De <strong className="text-plum">{current.name}</strong> · {formatDateTime(current.createdAt)}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant={STATUS_VARIANT[current.status]}>{label(MESSAGE_STATUSES, current.status)}</Badge>
                  <Badge variant="gray">{label(MESSAGE_CHANNELS, current.channel)}</Badge>
                </div>
              </div>
              <button
                onClick={() => toggleStar(current)}
                aria-label="Favori"
                className={`grid h-10 w-10 place-items-center rounded-full transition ${current.isStarred ? "bg-amber-100 text-amber-500" : "bg-white/70 text-plum/50 hover:text-amber-500"}`}
              >
                <span className="text-lg">★</span>
              </button>
            </div>

            <div className="rounded-2xl bg-white/70 p-4 text-plum/90 whitespace-pre-wrap">{current.body}</div>

            {(current.email || current.phone) && (
              <div className="flex flex-wrap gap-4 text-sm">
                {current.email && (
                  <a href={`mailto:${current.email}?subject=RE: ${encodeURIComponent(current.subject)}`} className="inline-flex items-center gap-2 text-rose-600 hover:underline">
                    <Icon name="mail" width={17} height={17} /> {current.email}
                  </a>
                )}
                {current.phone && (
                  <a href={`tel:${current.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 text-rose-600 hover:underline">
                    <Icon name="phone" width={17} height={17} /> {current.phone}
                  </a>
                )}
              </div>
            )}

            <div>
              <label className="field-label">Note interne</label>
              <textarea className="field min-h-[80px] resize-y" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ajouter une note pour l'équipe…" />
              <button onClick={saveNote} className="btn btn-glass mt-2 text-sm">Enregistrer la note</button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/60 pt-4">
              <div className="flex flex-wrap gap-2">
                {current.email && (
                  <a href={`mailto:${current.email}?subject=RE: ${encodeURIComponent(current.subject)}`} onClick={() => setStatus(current.id, "REPLIED")} className="btn btn-primary text-sm">
                    <Icon name="reply" width={17} height={17} /> Répondre
                  </a>
                )}
                <button onClick={() => setStatus(current.id, "REPLIED")} className="btn btn-glass text-sm">
                  <Icon name="check" width={16} height={16} /> Marquer répondu
                </button>
                <button onClick={() => setStatus(current.id, "ARCHIVED")} className="btn btn-glass text-sm">
                  <Icon name="archive" width={16} height={16} /> Archiver
                </button>
              </div>
              <ConfirmButton onConfirm={async () => { await deleteMessage(current.id); setCurrent(null); router.refresh(); }} />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
