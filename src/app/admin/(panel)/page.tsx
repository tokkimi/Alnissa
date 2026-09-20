import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatEuro, formatDate, initials } from "@/lib/format";
import { DONATION_METHODS, MESSAGE_CHANNELS, label } from "@/lib/constants";
import { PageTitle, StatCard, Badge } from "../components/ui";
import { BarChart, HBars } from "../components/Charts";
import { Icon } from "../../components/Icons";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const eightMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 7, 1);

  const [
    totalAgg,
    yearAgg,
    monthAgg,
    donationsCount,
    donorsCount,
    newMessages,
    volunteersActive,
    receiptsPending,
    recentDonations,
    recentMessages,
    campaigns,
    periodDonations,
  ] = await Promise.all([
    prisma.donation.aggregate({ _sum: { amount: true }, where: { status: "RECEIVED" } }),
    prisma.donation.aggregate({ _sum: { amount: true }, where: { status: "RECEIVED", date: { gte: startOfYear } } }),
    prisma.donation.aggregate({ _sum: { amount: true }, where: { status: "RECEIVED", date: { gte: startOfMonth } } }),
    prisma.donation.count(),
    prisma.donor.count(),
    prisma.message.count({ where: { status: "NEW" } }),
    prisma.volunteer.count({ where: { status: "ACTIVE" } }),
    prisma.donation.count({ where: { status: "RECEIVED", receiptIssued: false } }),
    prisma.donation.findMany({ take: 6, orderBy: { date: "desc" }, include: { donor: true, campaign: true } }),
    prisma.message.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.campaign.findMany(),
    prisma.donation.findMany({
      where: { status: "RECEIVED", date: { gte: eightMonthsAgo } },
      select: { amount: true, date: true, campaignId: true },
    }),
  ]);

  // Série mensuelle (8 mois)
  const monthFmt = new Intl.DateTimeFormat("fr-FR", { month: "short" });
  const months: { key: string; label: string; value: number }[] = [];
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: monthFmt.format(d).replace(".", ""),
      value: 0,
    });
  }
  for (const don of periodDonations) {
    const d = new Date(don.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = months.find((m) => m.key === key);
    if (bucket) bucket.value += don.amount;
  }

  // Répartition par campagne
  const campaignTotals = campaigns
    .map((c) => ({
      label: c.name,
      color: c.color,
      value: periodDonations.filter((d) => d.campaignId === c.id).reduce((s, d) => s + d.amount, 0),
    }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value);

  const totalAmount = totalAgg._sum.amount ?? 0;

  return (
    <>
      <PageTitle
        title="Tableau de bord"
        subtitle="Vue d'ensemble de l'activité de l'association"
        icon="dashboard"
        action={
          <Link href="/admin/dons" className="btn btn-primary">
            <Icon name="plus" width={18} height={18} />
            Enregistrer un don
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon="euro" label="Total collecté" value={formatEuro(totalAmount)} sub={`${donationsCount} don${donationsCount > 1 ? "s" : ""} au total`} />
        <StatCard icon="trend" label="Cette année" value={formatEuro(yearAgg._sum.amount ?? 0)} sub={`Ce mois : ${formatEuro(monthAgg._sum.amount ?? 0)}`} />
        <StatCard icon="users" label="Donateurs" value={String(donorsCount)} sub="Fichier donateurs" />
        <StatCard icon="inbox" label="Messages non lus" value={String(newMessages)} sub={`${volunteersActive} bénévole${volunteersActive > 1 ? "s" : ""} actif${volunteersActive > 1 ? "s" : ""}`} />
      </div>

      {receiptsPending > 0 && (
        <Link
          href="/admin/dons"
          className="mt-4 flex items-center gap-3 rounded-2xl bg-amber-100/80 px-5 py-3.5 text-amber-800 transition hover:bg-amber-100"
        >
          <Icon name="receipt" width={20} height={20} />
          <span className="text-sm font-medium">
            {receiptsPending} don{receiptsPending > 1 ? "s" : ""} en attente de reçu fiscal.
          </span>
          <span className="ml-auto text-sm font-semibold">Gérer →</span>
        </Link>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="glass-card p-6 lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-2xl text-plum">Dons des 8 derniers mois</h2>
            <Badge variant="rose">{formatEuro(months.reduce((s, m) => s + m.value, 0))}</Badge>
          </div>
          <BarChart data={months} />
        </div>

        <div className="glass-card p-6">
          <h2 className="mb-4 font-display text-2xl text-plum">Par campagne</h2>
          {campaignTotals.length ? (
            <HBars data={campaignTotals} />
          ) : (
            <p className="text-sm text-muted">Aucune donnée sur la période.</p>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Derniers dons */}
        <div className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl text-plum">Derniers dons</h2>
            <Link href="/admin/dons" className="text-sm font-medium text-rose-600 hover:underline">
              Tout voir
            </Link>
          </div>
          <div className="space-y-2">
            {recentDonations.length === 0 && <p className="text-sm text-muted">Aucun don enregistré.</p>}
            {recentDonations.map((d) => (
              <div key={d.id} className="flex items-center gap-3 rounded-2xl bg-white/60 px-3 py-2.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-100 text-sm font-bold text-rose-600">
                  {d.donor ? initials(d.donor.firstName, d.donor.lastName) : "€"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-plum">
                    {d.anonymous ? "Don anonyme" : d.donor ? `${d.donor.firstName} ${d.donor.lastName}` : "Donateur inconnu"}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {formatDate(d.date)} · {label(DONATION_METHODS, d.method)}
                    {d.campaign ? ` · ${d.campaign.name}` : ""}
                  </p>
                </div>
                <span className="font-display text-xl text-plum">{formatEuro(d.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Derniers messages */}
        <div className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl text-plum">Messagerie</h2>
            <Link href="/admin/messages" className="text-sm font-medium text-rose-600 hover:underline">
              Tout voir
            </Link>
          </div>
          <div className="space-y-2">
            {recentMessages.length === 0 && <p className="text-sm text-muted">Aucun message.</p>}
            {recentMessages.map((m) => (
              <Link
                key={m.id}
                href="/admin/messages"
                className="flex items-start gap-3 rounded-2xl bg-white/60 px-3 py-2.5 transition hover:bg-white"
              >
                <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${m.status === "NEW" ? "bg-rose-500" : "bg-plum/20"}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-plum">{m.name}</p>
                    <span className="shrink-0 text-xs text-muted">{formatDate(m.createdAt)}</span>
                  </div>
                  <p className="truncate text-xs text-muted">{m.body}</p>
                  <div className="mt-1">
                    <Badge variant={m.status === "NEW" ? "rose" : "gray"}>{label(MESSAGE_CHANNELS, m.channel)}</Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
