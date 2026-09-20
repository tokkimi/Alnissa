import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { DONATION_METHODS, DONATION_STATUSES, DONOR_TYPES, VOLUNTEER_STATUSES, MESSAGE_CHANNELS, MESSAGE_STATUSES, FOOD_PARTNER_STATUSES, label } from "@/lib/constants";

function csvCell(v: unknown): string {
  const s = v === null || v === undefined ? "" : String(v);
  if (/[";\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(rows: (string | number | null | undefined)[][]): string {
  const body = rows.map((r) => r.map(csvCell).join(";")).join("\r\n");
  return "﻿" + body; // BOM pour Excel (accents)
}

function fdate(d: Date | null | undefined): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR");
}

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const type = req.nextUrl.searchParams.get("type") || "donations";
  let rows: (string | number | null | undefined)[][] = [];
  let filename = "export.csv";

  if (type === "donations") {
    const data = await prisma.donation.findMany({ orderBy: { date: "desc" }, include: { donor: true, campaign: true } });
    rows = [
      ["Date", "Donateur", "E-mail", "Montant (€)", "Méthode", "Statut", "Campagne", "Récurrent", "Fréquence", "Référence", "Reçu émis", "N° reçu", "Date reçu", "Message"],
      ...data.map((d) => [
        fdate(d.date),
        d.anonymous ? "Anonyme" : d.donor ? `${d.donor.firstName} ${d.donor.lastName}` : "",
        d.donor?.email ?? "",
        d.amount.toFixed(2).replace(".", ","),
        label(DONATION_METHODS, d.method),
        label(DONATION_STATUSES, d.status),
        d.campaign?.name ?? "",
        d.isRecurring ? "Oui" : "Non",
        d.frequency ?? "",
        d.reference ?? "",
        d.receiptIssued ? "Oui" : "Non",
        d.receiptNumber ?? "",
        fdate(d.receiptDate),
        d.message ?? "",
      ]),
    ];
    filename = "dons-al-nissa.csv";
  } else if (type === "donors") {
    const data = await prisma.donor.findMany({ orderBy: { lastName: "asc" }, include: { donations: true } });
    rows = [
      ["Prénom", "Nom", "Type", "Organisation", "E-mail", "Téléphone", "Adresse", "Code postal", "Ville", "Pays", "Étiquettes", "Total donné (€)", "Nb dons", "Consent. e-mail", "Notes"],
      ...data.map((d) => {
        const total = d.donations.filter((x) => x.status === "RECEIVED").reduce((s, x) => s + x.amount, 0);
        return [
          d.firstName, d.lastName, label(DONOR_TYPES, d.type), d.organization ?? "",
          d.email ?? "", d.phone ?? "", d.address ?? "", d.postalCode ?? "", d.city ?? "", d.country,
          d.tags, total.toFixed(2).replace(".", ","), d.donations.length, d.consentEmail ? "Oui" : "Non", d.notes ?? "",
        ];
      }),
    ];
    filename = "donateurs-al-nissa.csv";
  } else if (type === "volunteers") {
    const data = await prisma.volunteer.findMany({ orderBy: { createdAt: "desc" } });
    rows = [
      ["Prénom", "Nom", "E-mail", "Téléphone", "Ville", "Disponibilités", "Compétences", "Statut", "Message", "Date"],
      ...data.map((v) => [v.firstName, v.lastName, v.email ?? "", v.phone ?? "", v.city ?? "", v.availability ?? "", v.skills, label(VOLUNTEER_STATUSES, v.status), v.motivation ?? "", fdate(v.createdAt)]),
    ];
    filename = "benevoles-al-nissa.csv";
  } else if (type === "messages") {
    const data = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });
    rows = [
      ["Date", "Nom", "E-mail", "Téléphone", "Sujet", "Canal", "Statut", "Message", "Note interne"],
      ...data.map((m) => [fdate(m.createdAt), m.name, m.email ?? "", m.phone ?? "", m.subject, label(MESSAGE_CHANNELS, m.channel), label(MESSAGE_STATUSES, m.status), m.body, m.adminNote ?? ""]),
    ];
    filename = "messages-al-nissa.csv";
  } else if (type === "commerces") {
    const data = await prisma.foodPartner.findMany({ orderBy: { createdAt: "desc" } });
    rows = [
      ["Date", "Commerce", "Type", "Contact", "E-mail", "Téléphone", "Adresse", "Code postal", "Ville", "Denrées", "Fréquence", "Créneaux", "Statut", "Message", "Notes"],
      ...data.map((p) => [
        fdate(p.createdAt), p.businessName, p.businessType ?? "", p.contactName ?? "",
        p.email ?? "", p.phone ?? "", p.address ?? "", p.postalCode ?? "", p.city ?? "",
        p.foodType ?? "", p.frequency ?? "", p.availability ?? "", label(FOOD_PARTNER_STATUSES, p.status),
        p.message ?? "", p.notes ?? "",
      ]),
    ];
    filename = "commercants-al-nissa.csv";
  } else if (type === "subscribers") {
    const data = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });
    rows = [["E-mail", "Date d'inscription"], ...data.map((s) => [s.email, fdate(s.createdAt)])];
    filename = "abonnes-al-nissa.csv";
  } else {
    return NextResponse.json({ error: "Type inconnu" }, { status: 400 });
  }

  return new NextResponse(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
