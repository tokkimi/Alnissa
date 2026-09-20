import { prisma } from "@/lib/prisma";
import VolunteersClient from "./VolunteersClient";

export const dynamic = "force-dynamic";

export default async function BenevolesPage() {
  const volunteers = await prisma.volunteer.findMany({ orderBy: { createdAt: "desc" } });
  return <VolunteersClient volunteers={volunteers} />;
}
