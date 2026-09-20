import type { Metadata } from "next";
import PageHeader from "../../components/PageHeader";
import VolunteerForm from "../../components/VolunteerForm";
import Reveal from "../../components/Reveal";
import { Icon } from "../../components/Icons";

export const metadata: Metadata = {
  title: "Devenir bénévole",
  description:
    "Rejoignez les bénévoles de l'Association Al Nissa : maraudes, distributions, visites aux aînés. Donnez un peu de votre temps, changez des vies.",
};

const REASONS = [
  { icon: "soup", title: "Participer aux maraudes", text: "Distribuez repas et petits-déjeuners, allez à la rencontre des personnes de la rue." },
  { icon: "box", title: "Préparer les colis", text: "Aidez à trier, préparer et distribuer les colis alimentaires mensuels." },
  { icon: "elder", title: "Visiter nos aînés", text: "Partagez des moments de joie avec les personnes âgées et en EHPAD." },
  { icon: "share", title: "Faire connaître", text: "Communication, collecte, événements : vos talents sont les bienvenus." },
];

export default function BenevolatPage() {
  return (
    <>
      <PageHeader
        kicker="Rejoignez-nous"
        title="Devenir bénévole"
        subtitle="Quelques heures de votre temps suffisent à illuminer une journée. Ensemble, nous allons plus loin."
        icon="handHeart"
      />

      <section className="container-x py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((r, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="glass-card h-full p-6">
                <div className="mb-3 inline-grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 text-white">
                  <Icon name={r.icon} width={24} height={24} />
                </div>
                <h3 className="font-display text-xl text-plum">{r.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-plum/75">{r.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x py-8">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="mb-6 text-center">
              <h2 className="font-display text-3xl text-plum sm:text-4xl">
                Envie de nous rejoindre&nbsp;?
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-plum/75">
                Remplissez ce formulaire, nous revenons vers vous rapidement.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <VolunteerForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
