import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function clean(v: unknown, max = 5000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Honeypot anti-spam (champ caché "website")
    if (clean(data.website)) {
      return NextResponse.json({ ok: true });
    }

    const name = clean(data.name, 120);
    const body = clean(data.body, 5000);
    const email = clean(data.email, 200);
    const phone = clean(data.phone, 60);
    const subject = clean(data.subject, 200) || "Message via le site";
    const channel = ["BUBBLE", "CONTACT", "EMAIL"].includes(data.channel)
      ? data.channel
      : "CONTACT";

    if (!name || !body) {
      return NextResponse.json(
        { ok: false, error: "Nom et message requis." },
        { status: 400 },
      );
    }

    await prisma.message.create({
      data: { name, email: email || null, phone: phone || null, subject, body, channel },
    });

    await prisma.activityLog.create({
      data: {
        action: "message.received",
        entity: "Message",
        detail: `Nouveau message de ${name} (${channel})`,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Erreur serveur." }, { status: 500 });
  }
}
