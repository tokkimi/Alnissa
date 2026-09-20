import { prisma } from "@/lib/prisma";
import CommercePartnersClient from "./CommercePartnersClient";

export const dynamic = "force-dynamic";

export default async function CommercesPage() {
  const partners = await prisma.foodPartner.findMany({ orderBy: { createdAt: "desc" } });
  return <CommercePartnersClient partners={partners} />;
}
