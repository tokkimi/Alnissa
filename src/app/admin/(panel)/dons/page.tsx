import { prisma } from "@/lib/prisma";
import DonationsClient from "./DonationsClient";

export const dynamic = "force-dynamic";

export default async function DonsPage() {
  const [donations, donors, campaigns] = await Promise.all([
    prisma.donation.findMany({ orderBy: { date: "desc" }, include: { donor: true, campaign: true } }),
    prisma.donor.findMany({ orderBy: { firstName: "asc" }, select: { id: true, firstName: true, lastName: true } }),
    prisma.campaign.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);

  return <DonationsClient donations={donations} donors={donors} campaigns={campaigns} />;
}
