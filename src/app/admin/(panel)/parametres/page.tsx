import { prisma } from "@/lib/prisma";
import { getSiteContent } from "@/lib/settings";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function ParametresPage() {
  const [content, subscribers] = await Promise.all([
    getSiteContent(),
    prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return <SettingsClient content={content} subscribers={subscribers} />;
}
