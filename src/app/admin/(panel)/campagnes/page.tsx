import { prisma } from "@/lib/prisma";
import CampaignsClient from "./CampaignsClient";

export const dynamic = "force-dynamic";

export default async function CampagnesPage() {
  const raw = await prisma.campaign.findMany({
    orderBy: { sortOrder: "asc" },
    include: { donations: { select: { amount: true, status: true } } },
  });

  const campaigns = raw.map((c) => {
    const received = c.donations.filter((d) => d.status === "RECEIVED");
    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      goalAmount: c.goalAmount,
      color: c.color,
      icon: c.icon,
      isActive: c.isActive,
      sortOrder: c.sortOrder,
      raised: received.reduce((s, d) => s + d.amount, 0),
      count: c.donations.length,
    };
  });

  return <CampaignsClient campaigns={campaigns} />;
}
