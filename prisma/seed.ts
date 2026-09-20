import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(10, 0, 0, 0);
  return d;
}

async function main() {
  // ── Compte administrateur ────────────────────────────────
  const email = (process.env.ADMIN_EMAIL || "associationalnissa@gmail.com")
    .trim()
    .toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "AlNissa2026!";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      name: "Administration Al Nissa",
      role: "admin",
    },
  });
  console.log(`✔ Compte admin : ${email}`);

  // ── Campagnes / projets ──────────────────────────────────
  const campaignsData = [
    {
      name: "Maraudes & repas",
      slug: "maraudes-repas",
      description:
        "Repas chauds et petits-déjeuners distribués chaque semaine lors de nos maraudes.",
      color: "#e79aa8",
      icon: "soup",
      goalAmount: 5000,
      sortOrder: 1,
    },
    {
      name: "Colis alimentaires",
      slug: "colis-alimentaires",
      description: "Colis alimentaires remis chaque mois aux familles en difficulté.",
      color: "#d98aa0",
      icon: "box",
      goalAmount: 4000,
      sortOrder: 2,
    },
    {
      name: "Sourire pour nos aînés",
      slug: "sourire-pour-nos-aines",
      description:
        "Visites et activités auprès des personnes âgées et en EHPAD (Les Coralies, Chozeau).",
      color: "#c98fb0",
      icon: "elder",
      goalAmount: 2500,
      sortOrder: 3,
    },
    {
      name: "Kits & distributions",
      slug: "kits-distributions",
      description: "Produits d'hygiène, vêtements et kits de première nécessité.",
      color: "#e6a9b4",
      icon: "gift",
      goalAmount: 3000,
      sortOrder: 4,
    },
    {
      name: "Événements solidaires",
      slug: "evenements-solidaires",
      description: "Réveillons, paniers cadeaux et temps forts tout au long de l'année.",
      color: "#d3a0c0",
      icon: "star",
      goalAmount: 6000,
      sortOrder: 5,
    },
  ];

  const existingCampaigns = await prisma.campaign.count();
  if (existingCampaigns === 0) {
    for (const c of campaignsData) {
      await prisma.campaign.create({ data: c });
    }
    console.log(`✔ ${campaignsData.length} campagnes créées`);
  }
  const campaigns = await prisma.campaign.findMany();
  const bySlug = (s: string) => campaigns.find((c) => c.slug === s);

  // ── Planning / événements récurrents ─────────────────────
  const existingEvents = await prisma.eventItem.count();
  if (existingEvents === 0) {
    await prisma.eventItem.createMany({
      data: [
        {
          title: "Maraude Sabah — petits-déjeuners",
          description:
            "Distribution de petits-déjeuners aux personnes de la rue. Rendez-vous des bénévoles au départ.",
          type: "MARAUDE",
          recurrence: "WEEKLY",
          dayOfWeek: "Dimanche",
          time: "09:00",
          location: "Départ Perrache, Lyon",
          sortOrder: 1,
        },
        {
          title: "Distribution d'eau fraîche",
          description:
            "Distribution d'eau fraîche aux personnes de la rue, en période de forte chaleur.",
          type: "DISTRIBUTION",
          recurrence: "WEEKLY",
          dayOfWeek: "Samedi",
          time: "14:00",
          location: "Départ Perrache, Lyon",
          sortOrder: 2,
        },
        {
          title: "Colis alimentaires",
          description:
            "Préparation et distribution des colis alimentaires mensuels aux familles.",
          type: "COLLECTE",
          recurrence: "MONTHLY",
          dayOfWeek: null,
          time: null,
          location: "Lyon",
          sortOrder: 3,
        },
        {
          title: "Sourire pour nos aînés — visite EHPAD",
          description:
            "Visite, activités manuelles, jeux et ateliers créatifs à l'EHPAD Les Coralies (Chozeau). Deux fois par mois.",
          type: "VISITE",
          recurrence: "MONTHLY",
          dayOfWeek: null,
          time: null,
          location: "EHPAD Les Coralies, Chozeau",
          sortOrder: 4,
        },
      ],
    });
    console.log("✔ Planning (4 événements) créé");
  }

  // ── Données de démonstration (donateurs, dons, messages) ─
  // Créées uniquement si aucun donateur n'existe encore.
  const existingDonors = await prisma.donor.count();
  if (existingDonors === 0) {
    const donorsSeed = [
      {
        firstName: "Amina",
        lastName: "Benali",
        email: "amina.benali@example.com",
        phone: "06 12 34 56 78",
        city: "Lyon",
        postalCode: "69003",
        type: "INDIVIDUAL",
        tags: "fidèle,exemple",
        consentEmail: true,
        notes: "Donatrice de démonstration — vous pouvez la supprimer.",
      },
      {
        firstName: "Karim",
        lastName: "Haddad",
        email: "karim.haddad@example.com",
        phone: "06 98 76 54 32",
        city: "Villeurbanne",
        postalCode: "69100",
        type: "INDIVIDUAL",
        tags: "mensuel,exemple",
        consentEmail: true,
        notes: "Donateur de démonstration.",
      },
      {
        firstName: "Sofia",
        lastName: "Martin",
        email: "sofia.martin@example.com",
        city: "Lyon",
        postalCode: "69007",
        type: "INDIVIDUAL",
        tags: "exemple",
        notes: "Donatrice de démonstration.",
      },
      {
        firstName: "Boulangerie",
        lastName: "Le Fournil",
        organization: "Le Fournil Doré",
        email: "contact@lefournil.example.com",
        city: "Lyon",
        postalCode: "69002",
        type: "COMPANY",
        tags: "partenaire,entreprise,exemple",
        notes: "Partenaire de démonstration (dons en nature + financiers).",
      },
      {
        firstName: "Yasmine",
        lastName: "Roux",
        email: "yasmine.roux@example.com",
        phone: "07 11 22 33 44",
        city: "Agadir",
        country: "Maroc",
        type: "INDIVIDUAL",
        tags: "agadir,exemple",
        consentEmail: true,
        notes: "Donatrice de démonstration.",
      },
    ];

    const donors = [];
    for (const d of donorsSeed) {
      donors.push(await prisma.donor.create({ data: d }));
    }

    const maraudes = bySlug("maraudes-repas");
    const colis = bySlug("colis-alimentaires");
    const aines = bySlug("sourire-pour-nos-aines");
    const events = bySlug("evenements-solidaires");

    const donationsSeed = [
      { donor: donors[0], amount: 50, method: "BANK_TRANSFER", days: 210, campaign: maraudes, receipt: true, recNo: "2026-001" },
      { donor: donors[1], amount: 20, method: "CARD", days: 195, campaign: colis, recurring: true, freq: "MONTHLY" },
      { donor: donors[1], amount: 20, method: "CARD", days: 165, campaign: colis, recurring: true, freq: "MONTHLY" },
      { donor: donors[1], amount: 20, method: "CARD", days: 135, campaign: colis, recurring: true, freq: "MONTHLY" },
      { donor: donors[2], amount: 30, method: "HELLOASSO", days: 150, campaign: maraudes },
      { donor: donors[3], amount: 300, method: "BANK_TRANSFER", days: 120, campaign: events, receipt: true, recNo: "2026-002" },
      { donor: donors[4], amount: 40, method: "PAYPAL", days: 90, campaign: aines },
      { donor: donors[0], amount: 75, method: "BANK_TRANSFER", days: 60, campaign: aines, receipt: true, recNo: "2026-003" },
      { donor: donors[1], amount: 20, method: "CARD", days: 45, campaign: colis, recurring: true, freq: "MONTHLY" },
      { donor: donors[2], amount: 100, method: "CHECK", days: 30, campaign: events },
      { donor: donors[3], amount: 250, method: "BANK_TRANSFER", days: 20, campaign: maraudes, receipt: true, recNo: "2026-004" },
      { donor: donors[4], amount: 60, method: "CARD", days: 8, campaign: colis },
      { donor: donors[0], amount: 35, method: "CASH", days: 3, campaign: maraudes },
      { donor: donors[2], amount: 25, method: "HELLOASSO", days: 1, campaign: aines },
    ];

    for (const dn of donationsSeed) {
      await prisma.donation.create({
        data: {
          donorId: dn.donor.id,
          campaignId: dn.campaign?.id ?? null,
          amount: dn.amount,
          method: dn.method,
          status: "RECEIVED",
          date: daysAgo(dn.days),
          isRecurring: dn.recurring ?? false,
          frequency: dn.freq ?? null,
          receiptIssued: dn.receipt ?? false,
          receiptNumber: dn.recNo ?? null,
          receiptDate: dn.receipt ? daysAgo(dn.days - 2) : null,
        },
      });
    }
    console.log(`✔ ${donorsSeed.length} donateurs & ${donationsSeed.length} dons (démo) créés`);

    // Messages de démonstration (messagerie interne)
    await prisma.message.createMany({
      data: [
        {
          name: "Nadia L.",
          email: "nadia@example.com",
          subject: "Proposition de don de vêtements",
          body: "Bonjour, je souhaite donner des vêtements chauds pour l'hiver. Comment procéder ?",
          channel: "BUBBLE",
          status: "NEW",
          createdAt: daysAgo(1),
        },
        {
          name: "Entreprise Solidaire SARL",
          email: "rse@example.com",
          phone: "04 78 00 00 00",
          subject: "Partenariat entreprise",
          body: "Nous aimerions soutenir vos maraudes. Pouvons-nous convenir d'un rendez-vous ?",
          channel: "CONTACT",
          status: "READ",
          readAt: daysAgo(2),
          createdAt: daysAgo(4),
        },
        {
          name: "Mehdi",
          email: "mehdi@example.com",
          subject: "Devenir bénévole",
          body: "Bonjour, je suis disponible le dimanche matin et j'aimerais rejoindre vos maraudes.",
          channel: "BUBBLE",
          status: "REPLIED",
          readAt: daysAgo(6),
          createdAt: daysAgo(7),
        },
      ],
    });
    console.log("✔ 3 messages (démo) créés");

    // Bénévoles de démonstration
    await prisma.volunteer.createMany({
      data: [
        {
          firstName: "Leïla",
          lastName: "Amrani",
          email: "leila@example.com",
          phone: "06 55 44 33 22",
          city: "Lyon",
          availability: "Dimanche matin",
          skills: "cuisine,distribution",
          motivation: "Envie d'aider sur les maraudes.",
          status: "ACTIVE",
        },
        {
          firstName: "Thomas",
          lastName: "Girard",
          email: "thomas@example.com",
          city: "Villeurbanne",
          availability: "Samedi après-midi",
          skills: "logistique,transport",
          status: "NEW",
        },
      ],
    });
    console.log("✔ 2 bénévoles (démo) créés");

    await prisma.subscriber.createMany({
      data: [{ email: "abonne1@example.com" }, { email: "abonne2@example.com" }],
    });
  }

  // Commerçants partenaires (démo)
  const existingPartners = await prisma.foodPartner.count();
  if (existingPartners === 0) {
    await prisma.foodPartner.createMany({
      data: [
        {
          businessName: "Boulangerie Le Fournil Doré",
          businessType: "Boulangerie",
          contactName: "M. Bernard",
          phone: "04 78 11 22 33",
          address: "12 Rue de la République",
          postalCode: "69002",
          city: "Lyon",
          foodType: "Pain et viennoiseries invendus",
          frequency: "Quotidien",
          availability: "Tous les soirs après 19h30",
          status: "ACTIVE",
          notes: "Partenaire de démonstration — vous pouvez le supprimer.",
        },
        {
          businessName: "Primeur Chez Fatima",
          businessType: "Primeur",
          phone: "06 22 33 44 55",
          address: "45 Cours Gambetta",
          postalCode: "69003",
          city: "Lyon",
          foodType: "Fruits & légumes",
          frequency: "Hebdomadaire",
          availability: "Le samedi en fin de marché",
          status: "NEW",
          notes: "Proposition de démonstration.",
        },
      ],
    });
    console.log("✔ 2 commerçants partenaires (démo) créés");
  }

  console.log("\n🌸 Base de données initialisée pour l'Association Al Nissa.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
