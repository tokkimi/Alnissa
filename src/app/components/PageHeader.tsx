import { Icon } from "./Icons";

export default function PageHeader({
  kicker,
  title,
  subtitle,
  icon,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  icon?: string;
}) {
  return (
    <section className="container-x pt-6 pb-4 text-center sm:pt-10">
      {icon && (
        <div className="mx-auto mb-5 inline-grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-lg shadow-rose-500/30 animate-fade-up">
          <Icon name={icon} width={32} height={32} />
        </div>
      )}
      {kicker && <p className="kicker animate-fade-up">{kicker}</p>}
      <h1
        className="mt-3 font-display text-4xl text-plum animate-fade-up sm:text-6xl"
        style={{ animationDelay: "0.05s" }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-plum/75 animate-fade-up sm:text-lg"
          style={{ animationDelay: "0.1s" }}
        >
          {subtitle}
        </p>
      )}
    </section>
  );
}
