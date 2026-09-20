import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import type { SiteContent } from "@/lib/content";

export default function GallerySection({ content }: { content: SiteContent }) {
  const gallery = content.media?.gallery ?? [];
  if (gallery.length === 0) return null;

  return (
    <section id="galerie" className="container-x py-10 sm:py-16">
      <SectionHeader
        kicker="En images"
        title="Al Nissa en images"
        subtitle="Des moments de partage capturés sur le terrain."
      />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 lg:grid-cols-3">
        {gallery.map((img, i) => (
          <Reveal key={i} delay={(i % 3) * 80}>
            <figure className="group relative overflow-hidden rounded-2xl shadow-[var(--shadow-glass)]">
              <div className="aspect-[4/3] w-full overflow-hidden bg-rose-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.caption || "Association Al Nissa"}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {img.caption && (
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-plum/70 to-transparent p-3 text-sm font-medium text-white">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
