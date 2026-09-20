import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const email = typeof data.email === "string" ? data.email.trim().toLowerCase().slice(0, 200) : "";
    if (!email || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "E-mail invalide." }, { status: 400 });
    }
    await prisma.subscriber.upsert({
      where: { email },
      create: { email },
      update: {},
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Erreur serveur." }, { status: 500 });
  }
}
