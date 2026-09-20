import type { Metadata } from "next";
import PageHeader from "../../components/PageHeader";
import ContactForm from "../../components/ContactForm";
import Reveal from "../../components/Reveal";
import { Icon } from "../../components/Icons";
import { getSiteContent } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez l'Association Al Nissa (Lyon & Agadir) par e-mail, téléphone, WhatsApp ou via notre messagerie interne.",
};

export default async function ContactPage() {
  const content = await getSiteContent();
  const { contact, socials } = content;

  const cards = [
    { icon: "mail", label: "E-mail", value: contact.email, href: `mailto:${contact.email}` },
    { icon: "phone", label: "Téléphone", value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, "")}` },
    { icon: "whatsapp", label: "WhatsApp", value: "Écrivez-nous", href: socials.whatsapp },
    { icon: "instagram", label: "Instagram", value: "@association_alnissa", href: socials.instagram },
  ].filter((c) => c.href);

  return (
    <>
      <PageHeader
        kicker="Parlons-en"
        title="Nous contacter"
        subtitle="Une question, une proposition, une envie d'aider ? Nous sommes à votre écoute."
        icon="chat"
      />

      <section className="container-x py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <Reveal key={i} delay={i * 70}>
              <a
                href={c.href}
                target={c.href?.startsWith("http") ? "_blank" : undefined}
                rel={c.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                className="glass-card flex h-full items-center gap-3 p-5 transition hover:-translate-y-0.5"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-white">
                  <Icon name={c.icon} width={22} height={22} />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    {c.label}
                  </span>
                  <span className="block truncate font-medium text-plum">{c.value}</span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div className="glass-card h-full p-7 sm:p-9">
              <h2 className="font-display text-3xl text-plum">Où nous trouver</h2>
              <div className="mt-5 space-y-4 text-plum/80">
                <p className="flex items-start gap-3">
                  <Icon name="mapPin" width={20} height={20} className="mt-0.5 shrink-0 text-rose-500" />
                  <span>
                    <strong className="text-plum">Lyon, France</strong>
                    <br />
                    {contact.hours}
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <Icon name="mapPin" width={20} height={20} className="mt-0.5 shrink-0 text-rose-500" />
                  <span>
                    <strong className="text-plum">Agadir, Maroc</strong>
                    <br />
                    Actions solidaires locales
                  </span>
                </p>
              </div>
              <div className="mt-8 rounded-2xl bg-rose-50/80 p-5">
                <p className="flex items-center gap-2 font-semibold text-plum">
                  <Icon name="chat" width={20} height={20} className="text-rose-500" />
                  Astuce
                </p>
                <p className="mt-1 text-sm text-plum/75">
                  Utilisez la bulle de contact en bas à droite pour nous écrire instantanément,
                  activer une ambiance douce ou nous envoyer un courriel.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
