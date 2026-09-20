# 🚀 Mise en ligne — Association Al Nissa

Ce guide explique comment publier le site en production. Le projet fonctionne
tel quel en local avec SQLite ; pour une mise en ligne durable, on utilise une
base **PostgreSQL** (les données sont ainsi conservées de façon fiable).

---

## Option recommandée : Vercel + PostgreSQL

### 1. Base de données PostgreSQL
Créez une base Postgres gratuite (au choix) :
- **Vercel Postgres** (Storage → Create → Postgres), ou
- **Neon** (https://neon.tech), ou **Supabase**, **Railway**…

Récupérez l'**URL de connexion** (elle commence par `postgres://…`).

### 2. Adapter Prisma à PostgreSQL
Dans `prisma/schema.prisma`, remplacez :

```prisma
datasource db {
  provider = "sqlite"       // ← remplacer
  url      = env("DATABASE_URL")
}
```

par :

```prisma
datasource db {
  provider = "postgresql"   // ← par ceci
  url      = env("DATABASE_URL")
}
```

### 3. Variables d'environnement (sur Vercel)
Dans **Project → Settings → Environment Variables**, ajoutez :

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | l'URL PostgreSQL de l'étape 1 |
| `SESSION_SECRET` | une longue chaîne aléatoire (voir ci-dessous) |
| `ADMIN_EMAIL` | l'e-mail du compte admin |
| `ADMIN_PASSWORD` | un mot de passe fort (à changer ensuite) |
| `NEXT_PUBLIC_SITE_URL` | l'URL finale du site (ex. `https://www.alnissa.fr`) |

Générer un `SESSION_SECRET` :
```bash
openssl rand -base64 48
```

### 4. Déployer
1. Poussez le code sur GitHub.
2. Sur Vercel : **Add New → Project**, importez le dépôt.
3. Laissez la commande de build par défaut (`npm run build`).
4. Déployez.

### 5. Initialiser la base (une seule fois)
Depuis votre machine, en pointant sur la base de production :

```bash
# .env local temporaire avec l'URL Postgres de prod
DATABASE_URL="postgres://…" npx prisma db push
DATABASE_URL="postgres://…" ADMIN_EMAIL="…" ADMIN_PASSWORD="…" npm run db:seed
```

> Le `db push` crée les tables ; le `db:seed` crée le compte admin, les
> campagnes et le planning de départ.

### 6. Nom de domaine
Dans **Project → Settings → Domains**, ajoutez votre domaine (ex. `alnissa.fr`)
et suivez les instructions DNS.

---

## Autres hébergeurs (Railway, Render, VPS…)

Le projet est une application **Next.js** standard :

```bash
npm install
npm run build
npm run start   # démarre sur le port 3000 (ou $PORT)
```

Assurez-vous simplement que :
- `DATABASE_URL` pointe vers une base **persistante** (PostgreSQL de préférence,
  ou un volume disque si vous gardez SQLite) ;
- `SESSION_SECRET` est défini (≥ 32 caractères) ;
- les tables sont créées (`prisma db push`) et le seed lancé une fois.

---

## Après la mise en ligne

1. Connectez-vous à `/admin`.
2. **Changez le mot de passe** (Paramètres → Sécurité).
3. **Vérifiez l'IBAN/BIC** (Paramètres → Dons / RIB).
4. Ajustez les textes, chiffres et coordonnées (Paramètres).
5. Supprimez les données de démonstration si besoin.

Bonne mise en ligne ! 🌸
