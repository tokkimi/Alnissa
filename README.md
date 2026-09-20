# 🤍 Association Al Nissa — Site & Espace d'administration

Site web complet de l'**Association Al Nissa** (Lyon & Agadir) : un site public
moderne et un espace d'administration **méga-complet** pour gérer dons, donateurs,
messagerie, bénévoles, campagnes et planning.

> *Solidarité · Partage · Humanité*

---

## ✨ Ce que contient le projet

### Site public
- **Accueil** : hero avec le logo, chiffres d'impact, valeurs, actions, planning, appel aux dons, réseaux.
- **Nos actions** : maraudes, repas, colis, visites aux aînés, distributions d'eau, événements.
- **Faire un don** : impact du don, don en ligne, **RIB/IBAN avec copie en un clic**, dons en nature.
- **Bénévolat** : présentation + formulaire de candidature.
- **Contact** : coordonnées + formulaire (arrive dans la messagerie de l'admin).
- **Mentions légales**.
- **Bulle de contact déployable** (en bas à droite, sur toutes les pages) avec :
  - ✉️ **Envoyer un courriel**
  - 💬 **Messagerie interne** (les messages arrivent dans l'admin)
  - 🔊 **Bouton de son** (ambiance sonore douce)
  - Le logo + « Faire un don & contact » + pastille « en ligne »
  - Accès rapide Instagram / WhatsApp / téléphone

### Espace d'administration (`/admin`)
- **Tableau de bord** : total collecté, dons de l'année/mois, graphique des 8 derniers mois, répartition par campagne, derniers dons, messagerie, alerte reçus fiscaux.
- **Dons** : ajout/modification/suppression, filtres (méthode, statut, campagne), reçus fiscaux, dons récurrents, **export CSV**.
- **Donateurs** : fiche complète, historique des dons, total donné, étiquettes, particuliers/entreprises, **export CSV**.
- **Messagerie** : tous les messages du site, statuts (nouveau/lu/répondu/archivé), favoris, notes internes, réponse par e-mail.
- **Bénévoles** : suivi des candidatures et statuts.
- **Campagnes** : projets de collecte avec objectifs et progression.
- **Planning** : maraudes, distributions et événements affichés sur le site.
- **Paramètres** : modifiez **tout le contenu du site sans toucher au code** (textes, chiffres, RIB, contact, réseaux, bulle, mentions légales), changez le mot de passe, gérez les abonnés.

Le **logo de l'association est conservé tel quel** (simplement recadré proprement sur son disque rose).

---

## 🚀 Démarrage rapide (en local)

Prérequis : **Node.js 18+**.

```bash
# 1. Installer les dépendances
npm install

# 2. Créer le fichier d'environnement
cp .env.example .env
#    (adaptez les valeurs — voir ci-dessous)

# 3. Créer la base de données + données de départ
npm run setup

# 4. Lancer le site
npm run dev
```

Le site est disponible sur **http://localhost:3000**
L'administration sur **http://localhost:3000/admin**

### 🔑 Identifiants administrateur par défaut

Ils sont définis dans le fichier `.env` :

| Champ | Valeur par défaut |
|-------|-------------------|
| E-mail | `associationalnissa@gmail.com` |
| Mot de passe | `AlNissa2026!` |

> ⚠️ **Changez le mot de passe** dès la première connexion :
> `Admin → Paramètres → Sécurité`.

---

## ⚠️ À vérifier avant la mise en ligne

- **Coordonnées bancaires (IBAN / BIC)** : l'IBAN affiché a été repris du flyer
  « Appel aux dons ». **Vérifiez-le et corrigez-le si besoin** dans
  `Admin → Paramètres → Dons / RIB`. C'est le compte qui recevra les dons.
- **Lien de don en ligne** : par défaut le Linktree. Remplacez-le par votre page
  HelloAsso / plateforme de dons si vous en avez une (même écran).
- **Mentions légales** : complétez le RNA / SIRET si vous le souhaitez
  (`Admin → Paramètres → Légal`).
- **Données de démonstration** : quelques donateurs, dons, messages et bénévoles
  « d'exemple » sont créés pour que l'admin ne soit pas vide. Vous pouvez les
  supprimer un par un, ou tout réinitialiser avec `npm run db:reset`.

---

## 🎨 Personnalisation

Presque tout le contenu se modifie depuis **Admin → Paramètres** :
marque & slogan, page d'accueil, textes « à propos », chiffres d'impact,
actions, RIB, contact, réseaux sociaux, textes de la bulle, mentions légales.

Aucune connaissance technique n'est nécessaire : on modifie, on enregistre,
le site se met à jour immédiatement.

---

## 🧰 Scripts utiles

| Commande | Rôle |
|----------|------|
| `npm run dev` | Lancer le site en développement |
| `npm run build` | Construire la version de production |
| `npm run start` | Lancer la version de production |
| `npm run setup` | Créer la base + données de départ |
| `npm run db:seed` | (Re)insérer les données de départ |
| `npm run db:reset` | ⚠️ Réinitialiser entièrement la base |
| `npm run db:studio` | Explorer la base de données (Prisma Studio) |
| `npm run logo:build` | Régénérer le logo à partir de `public/logo-source.jpg` |

---

## 🗄️ Base de données

- **En local / auto-hébergement** : SQLite (fichier `prisma/dev.db`), aucune configuration.
- **En production** (Vercel, etc.) : PostgreSQL recommandé.
  👉 Voir **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

---

## 🛠️ Technologies

Next.js 15 · React 19 · TypeScript · Prisma · Tailwind CSS 4 · iron-session.

---

Fait avec ♥ pour la solidarité.
