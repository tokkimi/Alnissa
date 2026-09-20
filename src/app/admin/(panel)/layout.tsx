import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import AdminShell from "../components/AdminShell";

export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await requireAuth();
  if (!auth) redirect("/admin/login");

  const [messages, volunteers, commerces] = await Promise.all([
    prisma.message.count({ where: { status: "NEW" } }),
    prisma.volunteer.count({ where: { status: "NEW" } }),
    prisma.foodPartner.count({ where: { status: "NEW" } }),
  ]);

  return (
    <AdminShell userName={auth.name || "Admin"} badges={{ messages, volunteers, commerces }}>
      {children}
    </AdminShell>
  );
}
