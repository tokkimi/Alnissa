import { prisma } from "@/lib/prisma";
import DonorsClient from "./DonorsClient";

export const dynamic = "force-dynamic";

export default async function DonateursPage() {
  const donors = await prisma.donor.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      donations: {
        orderBy: { date: "desc" },
        select: {
          id: true,
          amount: true,
          date: true,
          status: true,
          method: true,
          campaign: { select: { name: true } },
        },
      },
    },
  });

  return <DonorsClient donors={donors} />;
}
