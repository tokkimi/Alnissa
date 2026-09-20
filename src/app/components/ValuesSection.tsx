import Image from "next/image";
import Reveal from "./Reveal";
import { Icon } from "./Icons";
import type { SiteContent } from "@/lib/content";

export default function ValuesSection({ content }: { content: SiteContent }) {
  const { about } = content;
  const aboutImage = content.media?.aboutImage;
  return (
    <section className="container-x py-10 sm:py-16">
      <div className="grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-2">
        <Reveal>
          <div>
            <p className="kicker">{about.kicker}</p>
            <h2 className="mt-3 font-display text-4xl text-plum sm:text-5xl">
              {about.title}
            </h2>
            <div className="mt-5 space-y-4 text-[1.02rem] leading-relaxed text-plum/80">
              {about.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {about.values.map((v, i) => (
                <div key={i} className="glass-card p-5">
                  <div className="mb-3 inline-grid h-11 w-11 place-items-center rounded-xl bg-rose-100 text-rose-600">
                    <Icon name={v.icon} width={22} height={22} />
                  </div>
                  <h3 className="font-display text-xl text-plum">{v.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-plum/70">
                    {v.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative mx-auto max-w-md">
            <div className="absolute inset-0 -z-10 scale-105 rounded-[2rem] bg-gradient-to-br from-rose-200/50 to-mauve/25 blur-2xl" />
            {aboutImage ? (
              <div className="glass-card overflow-hidden">
                <div className="aspect-[4/5] w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={aboutImage}
                    alt="Association Al Nissa — solidarité au quotidien"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 text-center">
                  <p className="font-display text-2xl text-plum">
                    « Un geste, un sourire, une main tendue. »
                  </p>
                  <p className="mt-2 text-sm uppercase tracking-[0.25em] text-rose-600">
                    {content.brand.tagline}
                  </p>
                </div>
              </div>
            ) : (
              <div className="glass-card overflow-hidden p-10 text-center">
                <Image
                  src="/logo.png"
                  alt={content.brand.name}
                  width={220}
                  height={220}
                  className="mx-auto h-48 w-48 rounded-full shadow-soft ring-4 ring-white/60 animate-float"
                />
                <p className="mt-6 font-display text-2xl text-plum">
                  « Un geste, un sourire, une main tendue. »
                </p>
                <p className="mt-2 text-sm uppercase tracking-[0.25em] text-rose-600">
                  {content.brand.tagline}
                </p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
