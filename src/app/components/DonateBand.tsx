import Link from "next/link";
import Reveal from "./Reveal";
import { Icon } from "./Icons";
import type { SiteContent } from "@/lib/content";

export default function DonateBand({ content }: { content: SiteContent }) {
  const { donation } = content;
  return (
    <section className="container-x py-16 sm:py-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] px-6 py-14 text-center text-white shadow-soft sm:px-16">
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(135deg, #c25f78 0%, #a5495f 50%, #b57fa0 100%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-40"
            style={{
              background:
                "radial-gradient(24rem 24rem at 15% 20%, rgba(255,255,255,0.35), transparent 60%), radial-gradient(20rem 20rem at 90% 90%, rgba(255,255,255,0.25), transparent 60%)",
            }}
          />
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
            {donation.kicker}
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
            {donation.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            {donation.subtitle}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/faire-un-don"
              className="btn w-full rounded-full bg-white font-semibold text-rose-700 hover:bg-rose-50 sm:w-auto"
            >
              <Icon name="heart" width={19} height={19} />
              Faire un don
            </Link>
            <Link
              href="/benevolat"
              className="btn w-full rounded-full border border-white/50 bg-white/10 font-semibold text-white backdrop-blur hover:bg-white/20 sm:w-auto"
            >
              <Icon name="handHeart" width={19} height={19} />
              Devenir bénévole
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
