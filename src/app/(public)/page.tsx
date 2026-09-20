import Hero from "../components/Hero";
import StatsSection from "../components/StatsSection";
import ValuesSection from "../components/ValuesSection";
import ActionsSection from "../components/ActionsSection";
import PlanningSection from "../components/PlanningSection";
import DonateBand from "../components/DonateBand";
import InstagramCTA from "../components/InstagramCTA";
import { getSiteContent } from "@/lib/settings";

export default async function HomePage() {
  const content = await getSiteContent();
  return (
    <>
      <Hero content={content} />
      <StatsSection content={content} />
      <ValuesSection content={content} />
      <ActionsSection content={content} />
      <PlanningSection />
      <DonateBand content={content} />
      <InstagramCTA content={content} />
    </>
  );
}
