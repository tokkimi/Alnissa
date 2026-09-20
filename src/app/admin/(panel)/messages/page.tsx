import { prisma } from "@/lib/prisma";
import MessagesClient from "./MessagesClient";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });
  return <MessagesClient messages={messages} />;
}
