import Reveal from "./Reveal";

export default function SectionHeader({
  kicker,
  title,
  subtitle,
  center = true,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <Reveal>
      <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
        {kicker && <p className="kicker">{kicker}</p>}
        <h2 className="mt-3 font-display text-4xl text-plum sm:text-5xl">{title}</h2>
        {subtitle && (
          <p className="mt-4 text-base leading-relaxed text-plum/75 sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </Reveal>
  );
}
