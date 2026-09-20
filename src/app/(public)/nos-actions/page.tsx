import type { Metadata } from "next";
import PageHeader from "../../components/PageHeader";
import ActionsSection from "../../components/ActionsSection";
import PlanningSection from "../../components/PlanningSection";
import ValuesSection from "../../components/ValuesSection";
import DonateBand from "../../components/DonateBand";
import { getSiteContent } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Nos actions",
  description:
    "Maraudes, repas chauds, colis alimentaires, visites aux aînés, distributions d'eau et événements solidaires. Découvrez les actions de l'Association Al Nissa.",
};

export default async function NosActionsPage() {
  const content = await getSiteContent();
  return (
    <>
      <PageHeader
        kicker="Sur le terrain"
        title="Nos actions"
        subtitle="Une aide concrète, humaine et régulière auprès des plus démunis, à Lyon et à Agadir."
        icon="handHeart"
      />
      <ActionsSection content={content} />
      <PlanningSection />
      <ValuesSection content={content} />
      <DonateBand content={content} />
    </>
  );
}
