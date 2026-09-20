/**
 * Crée / met à jour les tables en base au moment du build,
 * UNIQUEMENT si une base PostgreSQL (ou MySQL) est configurée.
 *
 * - En local (SQLite) : ne fait rien (les tables sont gérées via `npm run setup`).
 * - En production (Vercel + Postgres) : exécute `prisma db push` pour créer
 *   automatiquement les tables au premier déploiement.
 *
 * Non bloquant : si la base n'est pas joignable, le build continue
 * (le site public reste en ligne ; réessai au prochain déploiement).
 */
import { execSync } from "node:child_process";

const url = process.env.DATABASE_URL || "";
const isRemote = /^(postgres(ql)?|mysql):\/\//i.test(url);

if (!isRemote) {
  console.log("[db-deploy] Pas de base distante configurée — étape ignorée.");
  process.exit(0);
}

try {
  console.log("[db-deploy] prisma db push (création des tables)…");
  execSync("prisma db push --skip-generate", { stdio: "inherit" });
  console.log("[db-deploy] Tables synchronisées.");
} catch (e) {
  console.warn("[db-deploy] Échec de la synchronisation (le build continue).", e?.message || e);
}
