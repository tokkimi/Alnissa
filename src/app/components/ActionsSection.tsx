import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { Icon } from "./Icons";
import type { SiteContent } from "@/lib/content";

export default function ActionsSection({ content }: { content: SiteContent }) {
  const { actions } = content;
  return (
    <section id="nos-actions" className="container-x py-10 sm:py-16">
      <SectionHeader kicker={actions.kicker} title={actions.title} subtitle={actions.subtitle} />
      <div className="mt-8 sm:mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {actions.items.map((a, i) => (
          <Reveal key={i} delay={(i % 3) * 90}>
            <article className="glass-card group h-full overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft">
              <div className="mb-5 inline-grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-lg shadow-rose-500/30 transition-transform duration-300 group-hover:scale-110">
                <Icon name={a.icon} width={28} height={28} />
              </div>
              <h3 className="font-display text-2xl text-plum">{a.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-plum/75">
                {a.description}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
