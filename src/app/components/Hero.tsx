import Link from "next/link";
import Image from "next/image";
import { Icon } from "./Icons";
import type { SiteContent } from "@/lib/content";

export default function Hero({ content }: { content: SiteContent }) {
  const { hero, brand } = content;

  return (
    <section className="relative overflow-hidden">
      {/* Cœurs décoratifs flottants */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <span className="absolute left-[8%] top-[22%] text-rose-200/70 animate-float" style={{ animationDelay: "0s" }}>
          <Icon name="heart" width={30} height={30} />
        </span>
        <span className="absolute right-[10%] top-[30%] text-mauve/40 animate-float" style={{ animationDelay: "1.5s" }}>
          <Icon name="heart" width={22} height={22} />
        </span>
        <span className="absolute left-[18%] bottom-[14%] text-rose-300/50 animate-float" style={{ animationDelay: "2.4s" }}>
          <Icon name="sparkle" width={26} height={26} />
        </span>
        <span className="absolute right-[16%] bottom-[20%] text-rose-200/60 animate-float" style={{ animationDelay: "0.8s" }}>
          <Icon name="heart" width={18} height={18} />
        </span>
      </div>

      <div className="container-x flex flex-col items-center py-10 text-center sm:py-16">
        <div
          className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-rose-700 animate-fade-up"
        >
          <Icon name="mapPin" width={16} height={16} />
          {hero.kicker}
        </div>

        <div className="relative mt-8 animate-fade-up" style={{ animationDelay: "0.05s" }}>
          <div className="absolute inset-0 -z-10 scale-125 rounded-full bg-rose-200/40 blur-2xl" />
          <Image
            src="/logo.png"
            alt={brand.name}
            width={168}
            height={168}
            priority
            className="h-32 w-32 rounded-full shadow-soft ring-4 ring-white/60 sm:h-40 sm:w-40 animate-float"
          />
        </div>

        <h1
          className="display-hero mt-7 text-5xl text-plum sm:text-7xl animate-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          AL NISSA
        </h1>
        <p
          className="mt-3 text-sm font-semibold uppercase tracking-[0.4em] text-rose-600 animate-fade-up sm:text-base"
          style={{ animationDelay: "0.15s" }}
        >
          {brand.tagline}
        </p>

        <h2
          className="mt-8 max-w-3xl font-display text-3xl leading-tight text-plum sm:text-5xl animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          {hero.title}{" "}
          <span className="text-gradient">{hero.highlight}</span>
        </h2>

        <p
          className="mt-5 max-w-xl text-base leading-relaxed text-plum/80 animate-fade-up sm:text-lg"
          style={{ animationDelay: "0.25s" }}
        >
          {hero.subtitle}
        </p>

        <div
          className="mt-9 flex flex-col items-center gap-3 animate-fade-up sm:flex-row"
          style={{ animationDelay: "0.3s" }}
        >
          <Link href={hero.ctaPrimary.href} className="btn btn-primary w-full sm:w-auto">
            <Icon name="heart" width={19} height={19} />
            {hero.ctaPrimary.label}
          </Link>
          <Link href={hero.ctaSecondary.href} className="btn btn-glass w-full sm:w-auto">
            <Icon name="handHeart" width={19} height={19} />
            {hero.ctaSecondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
