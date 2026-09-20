import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function clean(v: unknown, max = 2000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (clean(data.website)) return NextResponse.json({ ok: true }); // honeypot

    const firstName = clean(data.firstName, 120);
    const lastName = clean(data.lastName, 120);
    if (!firstName || !lastName) {
      return NextResponse.json(
        { ok: false, error: "Prénom et nom requis." },
        { status: 400 },
      );
    }

    await prisma.volunteer.create({
      data: {
        firstName,
        lastName,
        email: clean(data.email, 200) || null,
        phone: clean(data.phone, 60) || null,
        city: clean(data.city, 120) || null,
        availability: clean(data.availability, 300) || null,
        skills: clean(data.skills, 500),
        motivation: clean(data.motivation, 3000) || null,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "volunteer.applied",
        entity: "Volunteer",
        detail: `Nouvelle candidature bénévole : ${firstName} ${lastName}`,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Erreur serveur." }, { status: 500 });
  }
}
