import "server-only";
import { prisma } from "./prisma";
import { hashPassword } from "./auth";

let done = false;

/**
 * Initialise le contenu minimal en production (idempotent) :
 *  - compte administrateur (depuis ADMIN_EMAIL / ADMIN_PASSWORD)
 *  - campagnes par défaut
 *  - planning par défaut (maraudes, distribution d'eau…)
 *
 * Ne crée AUCUNE donnée fictive (donateurs, dons…). Sûr à appeler souvent :
 * chaque étape est protégée par un test d'existence.
 */
export async function ensureSeeded(): Promise<void> {
  if (done) return;
  try {
    const adminCount = await prisma.adminUser.count();
    if (adminCount === 0) {
      const email = (process.env.ADMIN_EMAIL || "associationalnissa@gmail.com")
        .trim()
        .toLowerCase();
      const password = process.env.ADMIN_PASSWORD || "AlNissa2026!";
      await prisma.adminUser.create({
        data: {
          email,
          passwordHash: await hashPassword(password),
          name: "Administration Al Nissa",
          role: "admin",
        },
      });
    }

    const campaignCount = await prisma.campaign.count();
    if (campaignCount === 0) {
      await prisma.campaign.createMany({
        data: [
          { name: "Maraudes & repas", slug: "maraudes-repas", description: "Repas chauds et petits-déjeuners distribués chaque semaine lors de nos maraudes.", color: "#e79aa8", icon: "soup", goalAmount: 5000, sortOrder: 1 },
          { name: "Colis alimentaires", slug: "colis-alimentaires", description: "Colis alimentaires remis chaque mois aux familles en difficulté.", color: "#d98aa0", icon: "box", goalAmount: 4000, sortOrder: 2 },
          { name: "Sourire pour nos aînés", slug: "sourire-pour-nos-aines", description: "Visites et activités auprès des personnes âgées et en EHPAD.", color: "#c98fb0", icon: "elder", goalAmount: 2500, sortOrder: 3 },
          { name: "Kits & distributions", slug: "kits-distributions", description: "Produits d'hygiène, vêtements et kits de première nécessité.", color: "#e6a9b4", icon: "gift", goalAmount: 3000, sortOrder: 4 },
          { name: "Événements solidaires", slug: "evenements-solidaires", description: "Réveillons, paniers cadeaux et temps forts tout au long de l'année.", color: "#d3a0c0", icon: "star", goalAmount: 6000, sortOrder: 5 },
        ],
      });
    }

    const eventCount = await prisma.eventItem.count();
    if (eventCount === 0) {
      await prisma.eventItem.createMany({
        data: [
          { title: "Maraude Sabah — petits-déjeuners", description: "Distribution de petits-déjeuners aux personnes de la rue.", type: "MARAUDE", recurrence: "WEEKLY", dayOfWeek: "Dimanche", time: "09:00", location: "Départ Perrache, Lyon", sortOrder: 1 },
          { title: "Distribution d'eau fraîche", description: "Distribution d'eau fraîche aux personnes de la rue.", type: "DISTRIBUTION", recurrence: "WEEKLY", dayOfWeek: "Samedi", time: "14:00", location: "Départ Perrache, Lyon", sortOrder: 2 },
          { title: "Colis alimentaires", description: "Préparation et distribution des colis alimentaires mensuels.", type: "COLLECTE", recurrence: "MONTHLY", location: "Lyon", sortOrder: 3 },
          { title: "Sourire pour nos aînés — visite EHPAD", description: "Visite, activités et jeux à l'EHPAD Les Coralies (Chozeau). Deux fois par mois.", type: "VISITE", recurrence: "MONTHLY", location: "EHPAD Les Coralies, Chozeau", sortOrder: 4 },
        ],
      });
    }

    done = true;
  } catch {
    // Base pas encore prête : on réessaiera au prochain appel.
  }
}
