import Link from "next/link";
import Image from "next/image";
import { Icon } from "./Icons";
import NewsletterForm from "./NewsletterForm";
import type { SiteContent } from "@/lib/content";

export default function Footer({ content }: { content: SiteContent }) {
  const { brand, contact, socials } = content;
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 overflow-hidden text-white">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, #a5495f 0%, #c25f78 45%, #b57fa0 100%)",
        }}
      />
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          background:
            "radial-gradient(30rem 30rem at 90% 0%, rgba(255,255,255,0.4), transparent 60%)",
        }}
      />

      <div className="container-x py-16">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Marque */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt={brand.name}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full ring-2 ring-white/50"
              />
              <div>
                <p className="font-display text-2xl tracking-[0.16em]">AL NISSA</p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/80">
                  {brand.tagline}
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/85">
              Ensemble, faisons la différence. Chaque geste compte pour redonner
              espoir et dignité.
            </p>
            <div className="mt-5 flex gap-2">
              {socials.instagram && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="grid h-11 w-11 place-items-center rounded-full bg-white/15 transition hover:bg-white/30"
                >
                  <Icon name="instagram" width={20} height={20} />
                </a>
              )}
              {socials.linktree && (
                <a
                  href={socials.linktree}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Linktree"
                  className="grid h-11 w-11 place-items-center rounded-full bg-white/15 transition hover:bg-white/30"
                >
                  <Icon name="link" width={20} height={20} />
                </a>
              )}
              {socials.whatsapp && (
                <a
                  href={socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="grid h-11 w-11 place-items-center rounded-full bg-white/15 transition hover:bg-white/30"
                >
                  <Icon name="whatsapp" width={20} height={20} />
                </a>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/70">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-white/90">
              <li><Link href="/" className="hover:text-white">Accueil</Link></li>
              <li><Link href="/nos-actions" className="hover:text-white">Nos actions</Link></li>
              <li><Link href="/faire-un-don" className="hover:text-white">Faire un don</Link></li>
              <li><Link href="/benevolat" className="hover:text-white">Devenir bénévole</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-white">Mentions légales</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/70">
              Nous joindre
            </h4>
            <ul className="space-y-3 text-sm text-white/90">
              <li className="flex items-start gap-2.5">
                <Icon name="mail" width={18} height={18} className="mt-0.5 shrink-0 text-white/70" />
                <a href={`mailto:${contact.email}`} className="break-all hover:text-white">
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="phone" width={18} height={18} className="mt-0.5 shrink-0 text-white/70" />
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="mapPin" width={18} height={18} className="mt-0.5 shrink-0 text-white/70" />
                <span>{contact.addressLyon} · {contact.addressAgadir}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/70">
              Restez informé·e
            </h4>
            <p className="mb-3 text-sm text-white/85">
              Recevez nos actualités et appels aux dons.
            </p>
            <NewsletterForm />
            <Link href="/faire-un-don" className="btn mt-4 w-full rounded-full bg-white font-semibold text-rose-700 hover:bg-rose-50">
              <Icon name="heart" width={18} height={18} />
              Soutenir l'association
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/20 pt-6 text-sm text-white/75 sm:flex-row">
          <p>© {year} {brand.name}. Tous droits réservés.</p>
          <p className="flex items-center gap-1.5">
            Fait avec <span className="text-white">♥</span> pour la solidarité
          </p>
        </div>
      </div>
    </footer>
  );
}
