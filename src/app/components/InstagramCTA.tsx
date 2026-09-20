import Reveal from "./Reveal";
import { Icon } from "./Icons";
import type { SiteContent } from "@/lib/content";

export default function InstagramCTA({ content }: { content: SiteContent }) {
  const { socials } = content;
  const links = [
    { key: "instagram", label: "Instagram", href: socials.instagram, icon: "instagram", sub: "@association_alnissa" },
    { key: "linktree", label: "Tous nos liens", href: socials.linktree, icon: "link", sub: "linktr.ee/associationalnissa" },
    { key: "whatsapp", label: "WhatsApp", href: socials.whatsapp, icon: "whatsapp", sub: "Écrivez-nous" },
  ].filter((l) => l.href);

  return (
    <section className="container-x pb-8">
      <Reveal>
        <div className="glass-card p-8 text-center sm:p-12">
          <p className="kicker">Suivez notre aventure</p>
          <h2 className="mt-3 font-display text-4xl text-plum">Restons connectés</h2>
          <p className="mx-auto mt-3 max-w-xl text-plum/75">
            Retrouvez nos actions, notre planning et nos appels aux dons au quotidien.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {links.map((l) => (
              <a
                key={l.key}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-2xl bg-white/70 px-5 py-3 text-left transition hover:-translate-y-0.5 hover:bg-white"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600 text-white">
                  <Icon name={l.icon} width={22} height={22} />
                </span>
                <span>
                  <span className="block font-semibold text-plum">{l.label}</span>
                  <span className="block text-xs text-muted">{l.sub}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
