import type { Metadata } from "next";
import PageHeader from "../../components/PageHeader";
import DonationDetails from "../../components/DonationDetails";
import Reveal from "../../components/Reveal";
import { Icon } from "../../components/Icons";
import { getSiteContent } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Faire un don",
  description:
    "Votre don change des vies. Soutenez l'Association Al Nissa par don en ligne ou virement bancaire (RIB). Chaque geste compte.",
};

const IMPACT = [
  { icon: "soup", amount: "10 €", text: "Plusieurs repas chauds distribués lors d'une maraude." },
  { icon: "box", amount: "20 €", text: "Un colis alimentaire pour aider une famille." },
  { icon: "gift", amount: "50 €", text: "Des kits d'hygiène et de première nécessité." },
  { icon: "star", amount: "100 €", text: "Un moment de joie lors d'un événement solidaire." },
];

export default async function FaireUnDonPage() {
  const content = await getSiteContent();
  return (
    <>
      <PageHeader
        kicker={content.donation.kicker}
        title={content.donation.title}
        subtitle={content.donation.subtitle}
        icon="heart"
      />

      {/* Impact */}
      <section className="container-x py-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {IMPACT.map((it, i) => (
            <Reveal key={i} delay={i * 70}>
              <div className="glass-card h-full p-4 text-center sm:p-6">
                <div className="mx-auto mb-2 inline-grid h-11 w-11 place-items-center rounded-2xl bg-rose-100 text-rose-600 sm:mb-3 sm:h-12 sm:w-12">
                  <Icon name={it.icon} width={22} height={22} />
                </div>
                <p className="font-display text-2xl text-gradient sm:text-3xl">{it.amount}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-plum/75 sm:text-sm">{it.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <DonationDetails content={content} />
    </>
  );
}
