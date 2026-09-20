import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import type { SiteContent } from "@/lib/content";

export default function StatsSection({ content }: { content: SiteContent }) {
  const { stats } = content;
  return (
    <section className="container-x py-10 sm:py-16">
      <SectionHeader kicker={stats.kicker} title={stats.title} subtitle={stats.subtitle} />
      <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {stats.items.map((s, i) => (
          <Reveal key={i} delay={i * 90}>
            <div className="glass-card group h-full p-6 text-center transition-transform duration-300 hover:-translate-y-1 sm:p-8">
              <p className="font-display text-4xl text-gradient sm:text-6xl">{s.value}</p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-plum/70 sm:text-base">
                {s.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
