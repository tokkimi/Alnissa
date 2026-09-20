import { prisma } from "@/lib/prisma";
import EventsClient from "./EventsClient";

export const dynamic = "force-dynamic";

export default async function EvenementsPage() {
  const events = await prisma.eventItem.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return <EventsClient events={events} />;
}
