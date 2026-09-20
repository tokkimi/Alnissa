/**
 * Choisit automatiquement le "provider" Prisma selon DATABASE_URL :
 *  - postgres://…  -> postgresql   (production, ex. Vercel)
 *  - mysql://…     -> mysql
 *  - sinon         -> sqlite       (local par défaut)
 *
 * Cela permet de garder SQLite en local ET PostgreSQL en production
 * à partir d'un seul schéma, sans modification manuelle.
 */
import fs from "node:fs";
import path from "node:path";

const url = process.env.DATABASE_URL || "";
let provider = "sqlite";
if (/^postgres(ql)?:\/\//i.test(url)) provider = "postgresql";
else if (/^mysql:\/\//i.test(url)) provider = "mysql";

const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
let schema = fs.readFileSync(schemaPath, "utf8");

const re = /(datasource\s+db\s*\{[^}]*?provider\s*=\s*")([^"]+)(")/s;
const match = schema.match(re);

if (match && match[2] !== provider) {
  schema = schema.replace(re, `$1${provider}$3`);
  fs.writeFileSync(schemaPath, schema);
  console.log(`[set-db-provider] provider Prisma -> ${provider}`);
} else {
  console.log(`[set-db-provider] provider Prisma déjà correct (${provider})`);
}
