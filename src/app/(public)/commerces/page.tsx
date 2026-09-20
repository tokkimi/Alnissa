import type { Metadata } from "next";
import PageHeader from "../../components/PageHeader";
import CommerceForm from "../../components/CommerceForm";
import Reveal from "../../components/Reveal";
import { Icon } from "../../components/Icons";

export const metadata: Metadata = {
  title: "Commerçants — Donnez votre nourriture",
  description:
    "Commerçants (boulangeries, épiceries, restaurants…) : proposez vos invendus et denrées à l'Association Al Nissa. Renseignez votre adresse, nous venons collecter.",
};

const STEPS = [
  { icon: "box", title: "1. Vous proposez", text: "Indiquez votre commerce, votre adresse et les denrées disponibles." },
  { icon: "chat", title: "2. On vous contacte", text: "Notre équipe vous recontacte pour convenir des créneaux de collecte." },
  { icon: "soup", title: "3. On redistribue", text: "Vos dons sont distribués lors de nos maraudes et à des familles." },
];

const BENEFITS = [
  { icon: "heart", title: "Luttez contre le gaspillage", text: "Vos invendus deviennent des repas pour ceux qui en ont besoin." },
  { icon: "hands", title: "Un geste solidaire local", text: "Vous aidez concrètement des personnes de votre quartier." },
  { icon: "share", title: "Simple et flexible", text: "Ponctuel ou régulier : vous choisissez ce qui vous convient." },
];

export default function CommercesPage() {
  return (
    <>
      <PageHeader
        kicker="Commerçants & partenaires"
        title="Donnez votre nourriture"
        subtitle="Boulangeries, épiceries, restaurants, primeurs… Vos invendus et denrées peuvent nourrir et réchauffer. Proposez un don en quelques secondes, nous nous occupons de la collecte."
        icon="box"
      />

      {/* Comment ça marche */}
      <section className="container-x py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="glass-card h-full p-6 text-center">
                <div className="mx-auto mb-3 inline-grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-lg shadow-rose-500/30">
                  <Icon name={s.icon} width={26} height={26} />
                </div>
                <h3 className="font-display text-xl text-plum">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-plum/75">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Formulaire */}
      <section className="container-x py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <div>
              <h2 className="font-display text-3xl text-plum sm:text-4xl">Pourquoi donner&nbsp;?</h2>
              <div className="mt-6 space-y-4">
                {BENEFITS.map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600">
                      <Icon name={b.icon} width={22} height={22} />
                    </span>
                    <div>
                      <h3 className="font-display text-lg text-plum">{b.title}</h3>
                      <p className="text-sm leading-relaxed text-plum/75">{b.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="glass-card mt-6 p-5">
                <p className="flex items-center gap-2 font-semibold text-plum">
                  <Icon name="mapPin" width={20} height={20} className="text-rose-500" />
                  Adresse en un instant
                </p>
                <p className="mt-1 text-sm text-plum/75">
                  Commencez simplement à taper votre adresse : des suggestions apparaissent
                  automatiquement pour aller plus vite.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <CommerceForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
