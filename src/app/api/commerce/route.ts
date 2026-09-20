import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function clean(v: unknown, max = 2000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}
function numOrNull(v: unknown): number | null {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : null;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (clean(data.website)) return NextResponse.json({ ok: true }); // honeypot

    const businessName = clean(data.businessName, 200);
    if (!businessName) {
      return NextResponse.json({ ok: false, error: "Nom du commerce requis." }, { status: 400 });
    }

    await prisma.foodPartner.create({
      data: {
        businessName,
        businessType: clean(data.businessType, 100) || null,
        contactName: clean(data.contactName, 120) || null,
        email: clean(data.email, 200) || null,
        phone: clean(data.phone, 60) || null,
        address: clean(data.address, 300) || null,
        postalCode: clean(data.postalCode, 20) || null,
        city: clean(data.city, 120) || null,
        lat: numOrNull(data.lat),
        lng: numOrNull(data.lng),
        foodType: clean(data.foodType, 300) || null,
        frequency: clean(data.frequency, 60) || null,
        availability: clean(data.availability, 300) || null,
        message: clean(data.message, 3000) || null,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "commerce.offer",
        entity: "FoodPartner",
        detail: `Nouvelle proposition de don : ${businessName}`,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Erreur serveur." }, { status: 500 });
  }
}
