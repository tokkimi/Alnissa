"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "../../../components/Icons";
import { PageTitle, Badge, ConfirmButton } from "../../components/ui";
import { formatDate } from "@/lib/format";
import type { SiteContent } from "@/lib/content";
import { saveContent, changePassword, deleteSubscriber } from "../../actions";

const ICON_NAMES = ["heart", "hands", "share", "soup", "box", "gift", "elder", "water", "star", "handHeart", "sparkle"];

type Sub = { id: string; email: string; createdAt: string | Date };

const TABS = [
  { key: "brand", label: "Marque", icon: "heart" },
  { key: "hero", label: "Accueil", icon: "sparkle" },
  { key: "about", label: "À propos", icon: "hands" },
  { key: "stats", label: "Chiffres", icon: "trend" },
  { key: "actions", label: "Nos actions", icon: "handHeart" },
  { key: "media", label: "Photos", icon: "star" },
  { key: "donation", label: "Dons / RIB", icon: "bank" },
  { key: "contact", label: "Contact", icon: "mail" },
  { key: "socials", label: "Réseaux", icon: "instagram" },
  { key: "bubble", label: "Bulle", icon: "chat" },
  { key: "legal", label: "Légal", icon: "receipt" },
  { key: "security", label: "Sécurité", icon: "settings" },
  { key: "subs", label: "Abonnés", icon: "users" },
];

function Field({
  label, value, onChange, textarea, placeholder, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void;
  textarea?: boolean; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {textarea ? (
        <textarea className="field min-h-[90px] resize-y" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      ) : (
        <input className="field" type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}

export default function SettingsClient({
  content: initial,
  subscribers,
}: {
  content: SiteContent;
  subscribers: Sub[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState("brand");
  const [content, setContent] = useState<SiteContent>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // password
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function update(mutator: (draft: SiteContent) => void) {
    const draft = structuredClone(content);
    mutator(draft);
    setContent(draft);
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError("");
    const res = await saveContent(content);
    setSaving(false);
    if (!res.ok) { setError(res.error || "Erreur"); return; }
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 3000);
  }

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    if (pw.next !== pw.confirm) { setPwMsg({ ok: false, text: "Les mots de passe ne correspondent pas." }); return; }
    const res = await changePassword(pw.current, pw.next);
    if (res.ok) {
      setPwMsg({ ok: true, text: "Mot de passe modifié avec succès." });
      setPw({ current: "", next: "", confirm: "" });
    } else {
      setPwMsg({ ok: false, text: res.error || "Erreur" });
    }
  }

  return (
    <>
      <PageTitle
        title="Paramètres"
        subtitle="Modifiez le contenu du site sans toucher au code"
        icon="settings"
        action={
          tab !== "security" && tab !== "subs" ? (
            <button onClick={save} className="btn btn-primary" disabled={saving}>
              <Icon name="check" width={18} height={18} />
              {saving ? "Enregistrement…" : saved ? "Enregistré ✓" : "Enregistrer"}
            </button>
          ) : undefined
        }
      />

      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === t.key ? "bg-rose-500 text-white" : "bg-white/60 text-plum/70 hover:bg-white"
            }`}
          >
            <Icon name={t.icon} width={16} height={16} />
            {t.label}
          </button>
        ))}
      </div>

      {error && <p className="mb-4 rounded-xl bg-rose-100 px-4 py-2 text-sm text-rose-700">{error}</p>}

      {/* MARQUE */}
      {tab === "brand" && (
        <div className="glass-card space-y-4 p-6">
          <Field label="Nom de l'association" value={content.brand.name} onChange={(v) => update((d) => { d.brand.name = v; })} />
          <Field label="Nom court" value={content.brand.shortName} onChange={(v) => update((d) => { d.brand.shortName = v; })} />
          <Field label="Slogan" value={content.brand.tagline} onChange={(v) => update((d) => { d.brand.tagline = v; })} />
        </div>
      )}

      {/* HERO */}
      {tab === "hero" && (
        <div className="glass-card space-y-4 p-6">
          <Field label="Sur-titre (ex. Lyon & Agadir)" value={content.hero.kicker} onChange={(v) => update((d) => { d.hero.kicker = v; })} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Titre" value={content.hero.title} onChange={(v) => update((d) => { d.hero.title = v; })} />
            <Field label="Mot mis en avant" value={content.hero.highlight} onChange={(v) => update((d) => { d.hero.highlight = v; })} />
          </div>
          <Field label="Sous-titre" value={content.hero.subtitle} onChange={(v) => update((d) => { d.hero.subtitle = v; })} textarea />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Bouton 1 — texte" value={content.hero.ctaPrimary.label} onChange={(v) => update((d) => { d.hero.ctaPrimary.label = v; })} />
            <Field label="Bouton 1 — lien" value={content.hero.ctaPrimary.href} onChange={(v) => update((d) => { d.hero.ctaPrimary.href = v; })} />
            <Field label="Bouton 2 — texte" value={content.hero.ctaSecondary.label} onChange={(v) => update((d) => { d.hero.ctaSecondary.label = v; })} />
            <Field label="Bouton 2 — lien" value={content.hero.ctaSecondary.href} onChange={(v) => update((d) => { d.hero.ctaSecondary.href = v; })} />
          </div>
        </div>
      )}

      {/* ABOUT */}
      {tab === "about" && (
        <div className="space-y-4">
          <div className="glass-card space-y-4 p-6">
            <Field label="Sur-titre" value={content.about.kicker} onChange={(v) => update((d) => { d.about.kicker = v; })} />
            <Field label="Titre" value={content.about.title} onChange={(v) => update((d) => { d.about.title = v; })} />
            <div>
              <label className="field-label">Paragraphes</label>
              {content.about.paragraphs.map((p, i) => (
                <div key={i} className="mb-2 flex gap-2">
                  <textarea className="field min-h-[70px] resize-y" value={p} onChange={(e) => update((d) => { d.about.paragraphs[i] = e.target.value; })} />
                  <button onClick={() => update((d) => { d.about.paragraphs.splice(i, 1); })} className="grid h-9 w-9 shrink-0 place-items-center self-start rounded-full text-rose-600 hover:bg-rose-100"><Icon name="trash" width={16} height={16} /></button>
                </div>
              ))}
              <button onClick={() => update((d) => { d.about.paragraphs.push(""); })} className="btn btn-glass text-sm"><Icon name="plus" width={16} height={16} /> Ajouter un paragraphe</button>
            </div>
          </div>
          <div className="glass-card space-y-3 p-6">
            <h3 className="font-display text-xl text-plum">Valeurs</h3>
            {content.about.values.map((val, i) => (
              <div key={i} className="grid grid-cols-1 gap-2 rounded-2xl bg-white/60 p-3 sm:grid-cols-[8rem_1fr_auto]">
                <input className="field" list="icon-names" value={val.icon} onChange={(e) => update((d) => { d.about.values[i].icon = e.target.value; })} placeholder="icône" />
                <div className="space-y-2">
                  <input className="field" value={val.title} onChange={(e) => update((d) => { d.about.values[i].title = e.target.value; })} placeholder="Titre" />
                  <textarea className="field min-h-[60px] resize-y" value={val.description} onChange={(e) => update((d) => { d.about.values[i].description = e.target.value; })} placeholder="Description" />
                </div>
                <button onClick={() => update((d) => { d.about.values.splice(i, 1); })} className="grid h-9 w-9 shrink-0 place-items-center self-start rounded-full text-rose-600 hover:bg-rose-100"><Icon name="trash" width={16} height={16} /></button>
              </div>
            ))}
            <button onClick={() => update((d) => { d.about.values.push({ icon: "heart", title: "", description: "" }); })} className="btn btn-glass text-sm"><Icon name="plus" width={16} height={16} /> Ajouter une valeur</button>
          </div>
        </div>
      )}

      {/* STATS */}
      {tab === "stats" && (
        <div className="glass-card space-y-4 p-6">
          <Field label="Sur-titre" value={content.stats.kicker} onChange={(v) => update((d) => { d.stats.kicker = v; })} />
          <Field label="Titre" value={content.stats.title} onChange={(v) => update((d) => { d.stats.title = v; })} />
          <Field label="Sous-titre" value={content.stats.subtitle} onChange={(v) => update((d) => { d.stats.subtitle = v; })} />
          <div>
            <label className="field-label">Chiffres</label>
            {content.stats.items.map((s, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <input className="field sm:w-40" value={s.value} onChange={(e) => update((d) => { d.stats.items[i].value = e.target.value; })} placeholder="2 000+" />
                <input className="field" value={s.label} onChange={(e) => update((d) => { d.stats.items[i].label = e.target.value; })} placeholder="Repas distribués" />
                <button onClick={() => update((d) => { d.stats.items.splice(i, 1); })} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-rose-600 hover:bg-rose-100"><Icon name="trash" width={16} height={16} /></button>
              </div>
            ))}
            <button onClick={() => update((d) => { d.stats.items.push({ value: "", label: "" }); })} className="btn btn-glass text-sm"><Icon name="plus" width={16} height={16} /> Ajouter un chiffre</button>
          </div>
        </div>
      )}

      {/* ACTIONS */}
      {tab === "actions" && (
        <div className="glass-card space-y-3 p-6">
          <Field label="Sur-titre" value={content.actions.kicker} onChange={(v) => update((d) => { d.actions.kicker = v; })} />
          <Field label="Titre" value={content.actions.title} onChange={(v) => update((d) => { d.actions.title = v; })} />
          <Field label="Sous-titre" value={content.actions.subtitle} onChange={(v) => update((d) => { d.actions.subtitle = v; })} />
          <div className="space-y-2 pt-2">
            {content.actions.items.map((a, i) => (
              <div key={i} className="grid grid-cols-1 gap-2 rounded-2xl bg-white/60 p-3 sm:grid-cols-[8rem_1fr_auto]">
                <input className="field" list="icon-names" value={a.icon} onChange={(e) => update((d) => { d.actions.items[i].icon = e.target.value; })} placeholder="icône" />
                <div className="space-y-2">
                  <input className="field" value={a.title} onChange={(e) => update((d) => { d.actions.items[i].title = e.target.value; })} placeholder="Titre" />
                  <textarea className="field min-h-[60px] resize-y" value={a.description} onChange={(e) => update((d) => { d.actions.items[i].description = e.target.value; })} placeholder="Description" />
                </div>
                <button onClick={() => update((d) => { d.actions.items.splice(i, 1); })} className="grid h-9 w-9 shrink-0 place-items-center self-start rounded-full text-rose-600 hover:bg-rose-100"><Icon name="trash" width={16} height={16} /></button>
              </div>
            ))}
            <button onClick={() => update((d) => { d.actions.items.push({ icon: "heart", title: "", description: "" }); })} className="btn btn-glass text-sm"><Icon name="plus" width={16} height={16} /> Ajouter une action</button>
          </div>
        </div>
      )}

      {/* MEDIA / PHOTOS */}
      {tab === "media" && (
        <div className="space-y-4">
          <div className="glass-card space-y-3 p-6">
            <h3 className="font-display text-xl text-plum">Photo « À propos »</h3>
            <p className="text-sm text-plum/70">
              Grande photo affichée dans la section « Qui sommes-nous » de l'accueil. Collez le
              lien (URL) d'une image, idéalement une vraie photo de l'association.
            </p>
            <Field label="URL de l'image" value={content.media.aboutImage} onChange={(v) => update((d) => { d.media.aboutImage = v; })} placeholder="https://…" />
            {content.media.aboutImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={content.media.aboutImage} alt="Aperçu" className="mt-2 h-40 w-full rounded-xl object-cover" />
            )}
          </div>

          <div className="glass-card space-y-3 p-6">
            <h3 className="font-display text-xl text-plum">Galerie « En images »</h3>
            <p className="text-sm text-plum/70">
              Ajoutez les photos à afficher dans la galerie (accueil & page « Nos actions »).
              La galerie n'apparaît que si au moins une photo est ajoutée.
            </p>
            {content.media.gallery.map((img, i) => (
              <div key={i} className="grid grid-cols-1 gap-2 rounded-2xl bg-white/60 p-3 sm:grid-cols-[6rem_1fr_1fr_auto] sm:items-center">
                {img.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img.url} alt="" className="h-16 w-full rounded-lg object-cover sm:w-24" />
                ) : (
                  <div className="grid h-16 w-full place-items-center rounded-lg bg-rose-100 text-rose-400 sm:w-24"><Icon name="star" width={20} height={20} /></div>
                )}
                <input className="field" value={img.url} onChange={(e) => update((d) => { d.media.gallery[i].url = e.target.value; })} placeholder="URL de la photo" />
                <input className="field" value={img.caption} onChange={(e) => update((d) => { d.media.gallery[i].caption = e.target.value; })} placeholder="Légende (facultatif)" />
                <button onClick={() => update((d) => { d.media.gallery.splice(i, 1); })} className="grid h-9 w-9 shrink-0 place-items-center justify-self-end rounded-full text-rose-600 hover:bg-rose-100"><Icon name="trash" width={16} height={16} /></button>
              </div>
            ))}
            <button onClick={() => update((d) => { d.media.gallery.push({ url: "", caption: "" }); })} className="btn btn-glass text-sm"><Icon name="plus" width={16} height={16} /> Ajouter une photo</button>
            <p className="rounded-2xl bg-rose-50/70 p-3 text-xs text-plum/70">
              💡 Astuce : vous pouvez aussi envoyer vos photos à l'équipe qui gère le site pour
              qu'elles soient intégrées directement.
            </p>
          </div>
        </div>
      )}

      {/* DONATION */}
      {tab === "donation" && (
        <div className="glass-card space-y-4 p-6">
          <div className="rounded-2xl bg-amber-100/70 p-4 text-sm text-amber-800">
            <strong>Important :</strong> vérifiez soigneusement l'IBAN et le BIC. Ces informations
            servent à recevoir les dons par virement.
          </div>
          <Field label="Sur-titre" value={content.donation.kicker} onChange={(v) => update((d) => { d.donation.kicker = v; })} />
          <Field label="Titre" value={content.donation.title} onChange={(v) => update((d) => { d.donation.title = v; })} />
          <Field label="Sous-titre" value={content.donation.subtitle} onChange={(v) => update((d) => { d.donation.subtitle = v; })} textarea />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Bénéficiaire" value={content.donation.accountName} onChange={(v) => update((d) => { d.donation.accountName = v; })} />
            <Field label="Banque" value={content.donation.bankName} onChange={(v) => update((d) => { d.donation.bankName = v; })} />
            <Field label="IBAN" value={content.donation.iban} onChange={(v) => update((d) => { d.donation.iban = v; })} />
            <Field label="BIC" value={content.donation.bic} onChange={(v) => update((d) => { d.donation.bic = v; })} />
            <Field label="Lien don en ligne" value={content.donation.onlineUrl} onChange={(v) => update((d) => { d.donation.onlineUrl = v; })} />
            <Field label="Texte du bouton en ligne" value={content.donation.onlineLabel} onChange={(v) => update((d) => { d.donation.onlineLabel = v; })} />
          </div>
          <Field label="Note (moyens de don)" value={content.donation.note} onChange={(v) => update((d) => { d.donation.note = v; })} textarea />
          <Field label="Note fiscale / reçu" value={content.donation.taxNote} onChange={(v) => update((d) => { d.donation.taxNote = v; })} textarea />
          <Field
            label="Montants suggérés (séparés par des virgules)"
            value={content.donation.suggestions.join(", ")}
            onChange={(v) => update((d) => { d.donation.suggestions = v.split(",").map((x) => parseInt(x.trim(), 10)).filter((n) => Number.isFinite(n)); })}
          />
        </div>
      )}

      {/* CONTACT */}
      {tab === "contact" && (
        <div className="glass-card space-y-4 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="E-mail" value={content.contact.email} onChange={(v) => update((d) => { d.contact.email = v; })} />
            <Field label="Téléphone" value={content.contact.phone} onChange={(v) => update((d) => { d.contact.phone = v; })} />
            <Field label="WhatsApp (numéro international)" value={content.contact.whatsapp} onChange={(v) => update((d) => { d.contact.whatsapp = v; })} placeholder="+33672141673" />
            <Field label="Horaires / infos" value={content.contact.hours} onChange={(v) => update((d) => { d.contact.hours = v; })} />
            <Field label="Adresse Lyon" value={content.contact.addressLyon} onChange={(v) => update((d) => { d.contact.addressLyon = v; })} />
            <Field label="Adresse Agadir" value={content.contact.addressAgadir} onChange={(v) => update((d) => { d.contact.addressAgadir = v; })} />
          </div>
        </div>
      )}

      {/* SOCIALS */}
      {tab === "socials" && (
        <div className="glass-card space-y-4 p-6">
          <Field label="Instagram (URL)" value={content.socials.instagram} onChange={(v) => update((d) => { d.socials.instagram = v; })} />
          <Field label="Linktree (URL)" value={content.socials.linktree} onChange={(v) => update((d) => { d.socials.linktree = v; })} />
          <Field label="WhatsApp (URL wa.me)" value={content.socials.whatsapp} onChange={(v) => update((d) => { d.socials.whatsapp = v; })} />
          <Field label="Facebook (URL)" value={content.socials.facebook} onChange={(v) => update((d) => { d.socials.facebook = v; })} />
          <Field label="TikTok (URL)" value={content.socials.tiktok} onChange={(v) => update((d) => { d.socials.tiktok = v; })} />
        </div>
      )}

      {/* BUBBLE */}
      {tab === "bubble" && (
        <div className="glass-card space-y-4 p-6">
          <Field label="Titre de la bulle" value={content.bubble.title} onChange={(v) => update((d) => { d.bubble.title = v; })} />
          <Field label="Libellé « en ligne »" value={content.bubble.onlineLabel} onChange={(v) => update((d) => { d.bubble.onlineLabel = v; })} />
          <Field label="Titre messagerie" value={content.bubble.messagingTitle} onChange={(v) => update((d) => { d.bubble.messagingTitle = v; })} />
          <Field label="Sous-titre messagerie" value={content.bubble.messagingSubtitle} onChange={(v) => update((d) => { d.bubble.messagingSubtitle = v; })} />
          <Field label="Libellé bouton de son" value={content.bubble.soundLabel} onChange={(v) => update((d) => { d.bubble.soundLabel = v; })} />
        </div>
      )}

      {/* LEGAL */}
      {tab === "legal" && (
        <div className="glass-card space-y-4 p-6">
          <Field label="Nom de l'association" value={content.legal.associationName} onChange={(v) => update((d) => { d.legal.associationName = v; })} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="N° RNA" value={content.legal.rna} onChange={(v) => update((d) => { d.legal.rna = v; })} />
            <Field label="SIRET" value={content.legal.siret} onChange={(v) => update((d) => { d.legal.siret = v; })} />
          </div>
          <Field label="Adresse" value={content.legal.address} onChange={(v) => update((d) => { d.legal.address = v; })} />
          <Field label="Directeur de publication" value={content.legal.publisher} onChange={(v) => update((d) => { d.legal.publisher = v; })} />
          <Field label="Hébergeur" value={content.legal.host} onChange={(v) => update((d) => { d.legal.host = v; })} />
        </div>
      )}

      {/* SECURITY */}
      {tab === "security" && (
        <form onSubmit={submitPassword} className="glass-card max-w-md space-y-4 p-6">
          <h3 className="font-display text-2xl text-plum">Changer le mot de passe</h3>
          <Field label="Mot de passe actuel" type="password" value={pw.current} onChange={(v) => setPw({ ...pw, current: v })} />
          <Field label="Nouveau mot de passe" type="password" value={pw.next} onChange={(v) => setPw({ ...pw, next: v })} />
          <Field label="Confirmer le nouveau" type="password" value={pw.confirm} onChange={(v) => setPw({ ...pw, confirm: v })} />
          {pwMsg && <p className={`text-sm ${pwMsg.ok ? "text-emerald-600" : "text-rose-600"}`}>{pwMsg.text}</p>}
          <button type="submit" className="btn btn-primary w-full">Mettre à jour</button>
        </form>
      )}

      {/* SUBSCRIBERS */}
      {tab === "subs" && (
        <div className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-2xl text-plum">Abonnés newsletter</h3>
            <a href="/api/admin/export?type=subscribers" className="btn btn-glass text-sm"><Icon name="download" width={16} height={16} /> Exporter</a>
          </div>
          {subscribers.length === 0 ? (
            <p className="text-sm text-muted">Aucun abonné pour le moment.</p>
          ) : (
            <div className="space-y-1.5">
              {subscribers.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl bg-white/60 px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-plum">{s.email}</p>
                    <p className="text-xs text-muted">Inscrit le {formatDate(s.createdAt)}</p>
                  </div>
                  <ConfirmButton iconOnly message="Supprimer cet abonné ?" onConfirm={async () => { await deleteSubscriber(s.id); router.refresh(); }} />
                </div>
              ))}
            </div>
          )}
          <p className="mt-4"><Badge variant="rose">{subscribers.length} abonné{subscribers.length > 1 ? "s" : ""}</Badge></p>
        </div>
      )}

      <datalist id="icon-names">
        {ICON_NAMES.map((n) => <option key={n} value={n} />)}
      </datalist>
    </>
  );
}
