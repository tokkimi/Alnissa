import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { Icon } from "./Icons";
import { prisma } from "@/lib/prisma";

const TYPE_ICON: Record<string, string> = {
  MARAUDE: "soup",
  DISTRIBUTION: "water",
  VISITE: "elder",
  COLLECTE: "box",
  EVENT: "star",
};

const RECURRENCE_LABEL: Record<string, string> = {
  WEEKLY: "Chaque semaine",
  MONTHLY: "Chaque mois",
  ONCE: "Ponctuel",
};

export default async function PlanningSection() {
  const events = await prisma.eventItem.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  if (events.length === 0) return null;

  return (
    <section id="planning" className="container-x py-16 sm:py-20">
      <SectionHeader
        kicker="Notre planning"
        title="Rejoignez-nous sur le terrain"
        subtitle="Nos rendez-vous réguliers. Chacun est le bienvenu pour donner un coup de main."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {events.map((e, i) => (
          <Reveal key={e.id} delay={(i % 2) * 90}>
            <article className="glass-card flex gap-4 p-6">
              <div className="grid h-14 w-14 shrink-0 place-items-center self-start rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-lg shadow-rose-500/30">
                <Icon name={TYPE_ICON[e.type] ?? "heart"} width={26} height={26} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-2xl text-plum">{e.title}</h3>
                  <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                    {RECURRENCE_LABEL[e.recurrence] ?? e.recurrence}
                  </span>
                </div>
                {e.description && (
                  <p className="mt-1.5 text-sm leading-relaxed text-plum/75">
                    {e.description}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-plum/70">
                  {(e.dayOfWeek || e.time) && (
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="clock" width={16} height={16} className="text-rose-500" />
                      {[e.dayOfWeek, e.time].filter(Boolean).join(" · ")}
                    </span>
                  )}
                  {e.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="mapPin" width={16} height={16} className="text-rose-500" />
                      {e.location}
                    </span>
                  )}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
