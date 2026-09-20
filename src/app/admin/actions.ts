"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { saveSiteContent } from "@/lib/settings";
import { mergeContent, type SiteContent } from "@/lib/content";

type Result = { ok: boolean; error?: string; id?: string };

async function guard(): Promise<{ ok: true; userId: string } | { ok: false }> {
  const auth = await requireAuth();
  if (!auth?.userId) return { ok: false };
  return { ok: true, userId: auth.userId };
}

function str(v: unknown, max = 5000): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim().slice(0, max);
  return t.length ? t : null;
}
function num(v: unknown): number {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}
function bool(v: unknown): boolean {
  return v === true || v === "true" || v === "on" || v === 1;
}
function date(v: unknown): Date | null {
  if (!v) return null;
  const d = new Date(String(v));
  return Number.isNaN(d.getTime()) ? null : d;
}

async function log(action: string, entity: string, entityId?: string, detail?: string) {
  try {
    await prisma.activityLog.create({ data: { action, entity, entityId: entityId ?? null, detail: detail ?? null } });
  } catch {
    /* noop */
  }
}

/* ───────────────────────── Donateurs ───────────────────────── */
export async function saveDonor(data: Record<string, unknown>): Promise<Result> {
  const g = await guard();
  if (!g.ok) return { ok: false, error: "Non autorisé" };

  const firstName = str(data.firstName, 120);
  const lastName = str(data.lastName, 120);
  if (!firstName || !lastName) return { ok: false, error: "Prénom et nom requis" };

  const payload = {
    firstName,
    lastName,
    email: str(data.email, 200),
    phone: str(data.phone, 60),
    address: str(data.address, 300),
    postalCode: str(data.postalCode, 20),
    city: str(data.city, 120),
    country: str(data.country, 120) ?? "France",
    type: data.type === "COMPANY" ? "COMPANY" : "INDIVIDUAL",
    organization: str(data.organization, 200),
    tags: str(data.tags, 400) ?? "",
    notes: str(data.notes, 3000),
    consentEmail: bool(data.consentEmail),
  };

  const id = str(data.id, 60);
  if (id) {
    await prisma.donor.update({ where: { id }, data: payload });
    await log("donor.update", "Donor", id, `${firstName} ${lastName}`);
    revalidatePath("/admin/donateurs");
    return { ok: true, id };
  }
  const created = await prisma.donor.create({ data: payload });
  await log("donor.create", "Donor", created.id, `${firstName} ${lastName}`);
  revalidatePath("/admin/donateurs");
  return { ok: true, id: created.id };
}

export async function deleteDonor(id: string): Promise<Result> {
  const g = await guard();
  if (!g.ok) return { ok: false, error: "Non autorisé" };
  await prisma.donor.delete({ where: { id } });
  await log("donor.delete", "Donor", id);
  revalidatePath("/admin/donateurs");
  revalidatePath("/admin/dons");
  return { ok: true };
}

/* ───────────────────────── Dons ───────────────────────── */
export async function saveDonation(data: Record<string, unknown>): Promise<Result> {
  const g = await guard();
  if (!g.ok) return { ok: false, error: "Non autorisé" };

  const amount = num(data.amount);
  if (amount <= 0) return { ok: false, error: "Montant invalide" };

  const methods = ["BANK_TRANSFER", "CARD", "CASH", "CHECK", "HELLOASSO", "PAYPAL", "OTHER"];
  const statuses = ["PENDING", "RECEIVED", "REFUNDED"];

  const payload = {
    donorId: str(data.donorId, 60),
    campaignId: str(data.campaignId, 60),
    amount,
    currency: "EUR",
    date: date(data.date) ?? new Date(),
    method: methods.includes(String(data.method)) ? String(data.method) : "BANK_TRANSFER",
    status: statuses.includes(String(data.status)) ? String(data.status) : "RECEIVED",
    isRecurring: bool(data.isRecurring),
    frequency: str(data.frequency, 20),
    reference: str(data.reference, 120),
    message: str(data.message, 2000),
    anonymous: bool(data.anonymous),
    receiptIssued: bool(data.receiptIssued),
    receiptNumber: str(data.receiptNumber, 60),
    receiptDate: date(data.receiptDate),
  };

  const id = str(data.id, 60);
  if (id) {
    await prisma.donation.update({ where: { id }, data: payload });
    await log("donation.update", "Donation", id, `${amount} €`);
    revalidatePath("/admin/dons");
    revalidatePath("/admin");
    return { ok: true, id };
  }
  const created = await prisma.donation.create({ data: payload });
  await log("donation.create", "Donation", created.id, `${amount} €`);
  revalidatePath("/admin/dons");
  revalidatePath("/admin");
  return { ok: true, id: created.id };
}

export async function deleteDonation(id: string): Promise<Result> {
  const g = await guard();
  if (!g.ok) return { ok: false, error: "Non autorisé" };
  await prisma.donation.delete({ where: { id } });
  await log("donation.delete", "Donation", id);
  revalidatePath("/admin/dons");
  revalidatePath("/admin");
  return { ok: true };
}

export async function issueReceipt(id: string, receiptNumber: string): Promise<Result> {
  const g = await guard();
  if (!g.ok) return { ok: false, error: "Non autorisé" };
  await prisma.donation.update({
    where: { id },
    data: { receiptIssued: true, receiptNumber: receiptNumber || null, receiptDate: new Date() },
  });
  await log("donation.receipt", "Donation", id, receiptNumber);
  revalidatePath("/admin/dons");
  return { ok: true };
}

/* ───────────────────────── Messages ───────────────────────── */
export async function updateMessage(id: string, data: Record<string, unknown>): Promise<Result> {
  const g = await guard();
  if (!g.ok) return { ok: false, error: "Non autorisé" };
  const patch: Record<string, unknown> = {};
  if (data.status !== undefined) {
    const statuses = ["NEW", "READ", "REPLIED", "ARCHIVED"];
    if (statuses.includes(String(data.status))) {
      patch.status = data.status;
      if (data.status !== "NEW") patch.readAt = new Date();
    }
  }
  if (data.isStarred !== undefined) patch.isStarred = bool(data.isStarred);
  if (data.adminNote !== undefined) patch.adminNote = str(data.adminNote, 3000);
  await prisma.message.update({ where: { id }, data: patch });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteMessage(id: string): Promise<Result> {
  const g = await guard();
  if (!g.ok) return { ok: false, error: "Non autorisé" };
  await prisma.message.delete({ where: { id } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { ok: true };
}

/* ───────────────────────── Bénévoles ───────────────────────── */
export async function saveVolunteer(data: Record<string, unknown>): Promise<Result> {
  const g = await guard();
  if (!g.ok) return { ok: false, error: "Non autorisé" };
  const firstName = str(data.firstName, 120);
  const lastName = str(data.lastName, 120);
  if (!firstName || !lastName) return { ok: false, error: "Prénom et nom requis" };
  const statuses = ["NEW", "CONTACTED", "ACTIVE", "INACTIVE"];
  const payload = {
    firstName,
    lastName,
    email: str(data.email, 200),
    phone: str(data.phone, 60),
    city: str(data.city, 120),
    availability: str(data.availability, 300),
    skills: str(data.skills, 500) ?? "",
    motivation: str(data.motivation, 3000),
    status: statuses.includes(String(data.status)) ? String(data.status) : "NEW",
    notes: str(data.notes, 3000),
  };
  const id = str(data.id, 60);
  if (id) {
    await prisma.volunteer.update({ where: { id }, data: payload });
    revalidatePath("/admin/benevoles");
    return { ok: true, id };
  }
  const created = await prisma.volunteer.create({ data: payload });
  revalidatePath("/admin/benevoles");
  return { ok: true, id: created.id };
}

export async function deleteVolunteer(id: string): Promise<Result> {
  const g = await guard();
  if (!g.ok) return { ok: false, error: "Non autorisé" };
  await prisma.volunteer.delete({ where: { id } });
  revalidatePath("/admin/benevoles");
  return { ok: true };
}

/* ───────────────────────── Campagnes ───────────────────────── */
export async function saveCampaign(data: Record<string, unknown>): Promise<Result> {
  const g = await guard();
  if (!g.ok) return { ok: false, error: "Non autorisé" };
  const name = str(data.name, 200);
  if (!name) return { ok: false, error: "Nom requis" };
  const slug =
    str(data.slug, 120) ||
    name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const payload = {
    name,
    slug,
    description: str(data.description, 2000),
    goalAmount: num(data.goalAmount),
    color: str(data.color, 20) ?? "#e79aa8",
    icon: str(data.icon, 40) ?? "heart",
    isActive: data.isActive === undefined ? true : bool(data.isActive),
    sortOrder: Math.round(num(data.sortOrder)),
  };
  const id = str(data.id, 60);
  try {
    if (id) {
      await prisma.campaign.update({ where: { id }, data: payload });
      revalidatePath("/admin/campagnes");
      revalidatePath("/");
      return { ok: true, id };
    }
    const created = await prisma.campaign.create({ data: payload });
    revalidatePath("/admin/campagnes");
    revalidatePath("/");
    return { ok: true, id: created.id };
  } catch {
    return { ok: false, error: "Ce raccourci (slug) existe déjà." };
  }
}

export async function deleteCampaign(id: string): Promise<Result> {
  const g = await guard();
  if (!g.ok) return { ok: false, error: "Non autorisé" };
  await prisma.campaign.delete({ where: { id } });
  revalidatePath("/admin/campagnes");
  return { ok: true };
}

/* ───────────────────────── Événements / Planning ───────────────────────── */
export async function saveEvent(data: Record<string, unknown>): Promise<Result> {
  const g = await guard();
  if (!g.ok) return { ok: false, error: "Non autorisé" };
  const title = str(data.title, 200);
  if (!title) return { ok: false, error: "Titre requis" };
  const types = ["MARAUDE", "DISTRIBUTION", "VISITE", "COLLECTE", "EVENT"];
  const recs = ["WEEKLY", "MONTHLY", "ONCE"];
  const payload = {
    title,
    description: str(data.description, 2000),
    type: types.includes(String(data.type)) ? String(data.type) : "MARAUDE",
    recurrence: recs.includes(String(data.recurrence)) ? String(data.recurrence) : "WEEKLY",
    dayOfWeek: str(data.dayOfWeek, 30),
    time: str(data.time, 20),
    location: str(data.location, 200),
    date: date(data.date),
    isPublished: data.isPublished === undefined ? true : bool(data.isPublished),
    sortOrder: Math.round(num(data.sortOrder)),
  };
  const id = str(data.id, 60);
  if (id) {
    await prisma.eventItem.update({ where: { id }, data: payload });
    revalidatePath("/admin/evenements");
    revalidatePath("/");
    return { ok: true, id };
  }
  const created = await prisma.eventItem.create({ data: payload });
  revalidatePath("/admin/evenements");
  revalidatePath("/");
  return { ok: true, id: created.id };
}

export async function deleteEvent(id: string): Promise<Result> {
  const g = await guard();
  if (!g.ok) return { ok: false, error: "Non autorisé" };
  await prisma.eventItem.delete({ where: { id } });
  revalidatePath("/admin/evenements");
  revalidatePath("/");
  return { ok: true };
}

/* ───────────────────────── Paramètres du site ───────────────────────── */
export async function saveContent(content: SiteContent): Promise<Result> {
  const g = await guard();
  if (!g.ok) return { ok: false, error: "Non autorisé" };
  const merged = mergeContent(content);
  await saveSiteContent(merged);
  await log("settings.update", "Setting", "site_content");
  revalidatePath("/", "layout");
  revalidatePath("/admin/parametres");
  return { ok: true };
}

export async function changePassword(current: string, next: string): Promise<Result> {
  const g = await guard();
  if (!g.ok) return { ok: false, error: "Non autorisé" };
  if (!next || next.length < 8)
    return { ok: false, error: "Le nouveau mot de passe doit contenir au moins 8 caractères." };
  const user = await prisma.adminUser.findUnique({ where: { id: g.userId } });
  if (!user) return { ok: false, error: "Compte introuvable" };
  const ok = await verifyPassword(current, user.passwordHash);
  if (!ok) return { ok: false, error: "Mot de passe actuel incorrect." };
  await prisma.adminUser.update({
    where: { id: g.userId },
    data: { passwordHash: await hashPassword(next) },
  });
  return { ok: true };
}

/* ───────────────────────── Commerçants / dons alimentaires ───────────────────────── */
export async function saveFoodPartner(data: Record<string, unknown>): Promise<Result> {
  const g = await guard();
  if (!g.ok) return { ok: false, error: "Non autorisé" };
  const businessName = str(data.businessName, 200);
  if (!businessName) return { ok: false, error: "Nom du commerce requis" };
  const statuses = ["NEW", "CONTACTED", "ACTIVE", "DECLINED"];
  const payload = {
    businessName,
    businessType: str(data.businessType, 100),
    contactName: str(data.contactName, 120),
    email: str(data.email, 200),
    phone: str(data.phone, 60),
    address: str(data.address, 300),
    postalCode: str(data.postalCode, 20),
    city: str(data.city, 120),
    lat: data.lat === null || data.lat === undefined || data.lat === "" ? null : num(data.lat),
    lng: data.lng === null || data.lng === undefined || data.lng === "" ? null : num(data.lng),
    foodType: str(data.foodType, 300),
    frequency: str(data.frequency, 60),
    availability: str(data.availability, 300),
    message: str(data.message, 3000),
    status: statuses.includes(String(data.status)) ? String(data.status) : "NEW",
    notes: str(data.notes, 3000),
  };
  const id = str(data.id, 60);
  if (id) {
    await prisma.foodPartner.update({ where: { id }, data: payload });
    revalidatePath("/admin/commerces");
    return { ok: true, id };
  }
  const created = await prisma.foodPartner.create({ data: payload });
  revalidatePath("/admin/commerces");
  return { ok: true, id: created.id };
}

export async function deleteFoodPartner(id: string): Promise<Result> {
  const g = await guard();
  if (!g.ok) return { ok: false, error: "Non autorisé" };
  await prisma.foodPartner.delete({ where: { id } });
  revalidatePath("/admin/commerces");
  return { ok: true };
}

/* ───────────────────────── Abonnés ───────────────────────── */
export async function deleteSubscriber(id: string): Promise<Result> {
  const g = await guard();
  if (!g.ok) return { ok: false, error: "Non autorisé" };
  await prisma.subscriber.delete({ where: { id } });
  revalidatePath("/admin/parametres");
  return { ok: true };
}
