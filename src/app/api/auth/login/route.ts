import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ensureSeeded } from "@/lib/bootstrap";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Champs requis." }, { status: 400 });
    }
    // Crée le compte admin par défaut au premier lancement (production).
    await ensureSeeded();
    const user = await authenticate(String(email), String(password));
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Identifiants incorrects." },
        { status: 401 },
      );
    }
    const session = await getSession();
    session.userId = user.id;
    session.email = user.email;
    session.name = user.name;
    session.role = user.role;
    session.isLoggedIn = true;
    await session.save();

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Erreur serveur." }, { status: 500 });
  }
}
