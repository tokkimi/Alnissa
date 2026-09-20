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

const runtimeUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  "";

// Pour la création des tables, on privilégie une connexion directe (non poolée).
const pushUrl =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL_UNPOOLED ||
  runtimeUrl;

const isRemote = /^(postgres(ql)?|mysql):\/\//i.test(runtimeUrl);

if (!isRemote) {
  console.log("[db-deploy] Pas de base distante configurée — étape ignorée.");
  process.exit(0);
}

try {
  console.log("[db-deploy] prisma db push (création des tables)…");
  execSync("prisma db push --skip-generate", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: pushUrl },
  });
  console.log("[db-deploy] Tables synchronisées.");
} catch (e) {
  console.warn("[db-deploy] Échec de la synchronisation (le build continue).", e?.message || e);
}
