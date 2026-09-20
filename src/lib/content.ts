/**
 * Contenu éditable du site Association Al Nissa.
 *
 * Les valeurs par défaut ci-dessous sont utilisées tant qu'aucune modification
 * n'a été enregistrée depuis l'espace d'administration (Paramètres).
 * Tout est modifiable en ligne sans toucher au code.
 *
 * ⚠️ Les coordonnées bancaires (IBAN/BIC) sont reprises du flyer « Appel aux dons ».
 *    Merci de les VÉRIFIER dans l'admin (Paramètres) avant la mise en ligne.
 */

export interface LinkItem {
  label: string;
  href: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface ActionItem {
  icon: string;
  title: string;
  description: string;
}

export interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

export interface SiteContent {
  brand: {
    name: string;
    shortName: string;
    tagline: string;
  };
  hero: {
    kicker: string;
    title: string;
    highlight: string;
    subtitle: string;
    ctaPrimary: LinkItem;
    ctaSecondary: LinkItem;
  };
  about: {
    kicker: string;
    title: string;
    paragraphs: string[];
    values: ValueItem[];
  };
  stats: {
    kicker: string;
    title: string;
    subtitle: string;
    items: StatItem[];
  };
  actions: {
    kicker: string;
    title: string;
    subtitle: string;
    items: ActionItem[];
  };
  donation: {
    kicker: string;
    title: string;
    subtitle: string;
    accountName: string;
    iban: string;
    bic: string;
    bankName: string;
    onlineUrl: string;
    onlineLabel: string;
    note: string;
    taxNote: string;
    suggestions: number[];
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    addressLyon: string;
    addressAgadir: string;
    hours: string;
  };
  socials: {
    instagram: string;
    linktree: string;
    facebook: string;
    tiktok: string;
    whatsapp: string;
  };
  bubble: {
    title: string;
    onlineLabel: string;
    messagingTitle: string;
    messagingSubtitle: string;
    soundLabel: string;
  };
  legal: {
    associationName: string;
    rna: string;
    siret: string;
    address: string;
    publisher: string;
    host: string;
  };
}

export const defaultContent: SiteContent = {
  brand: {
    name: "Association Al Nissa",
    shortName: "Al Nissa",
    tagline: "Solidarité · Partage · Humanité",
  },
  hero: {
    kicker: "Lyon & Agadir",
    title: "Ensemble, faisons",
    highlight: "la différence",
    subtitle:
      "Al Nissa agit chaque jour auprès des plus démunis : maraudes, repas chauds, colis alimentaires et visites aux personnes âgées. Un geste, un sourire, une main tendue.",
    ctaPrimary: { label: "Faire un don", href: "/faire-un-don" },
    ctaSecondary: { label: "Devenir bénévole", href: "/benevolat" },
  },
  about: {
    kicker: "Qui sommes-nous",
    title: "Une association du cœur",
    paragraphs: [
      "Al Nissa est une association solidaire présente à Lyon et à Agadir. Portée par des femmes et des bénévoles engagés, elle apporte une aide concrète, humaine et bienveillante aux personnes en situation de précarité.",
      "Chaque semaine, nos équipes sillonnent les rues pour distribuer repas, petits-déjeuners et produits de première nécessité. Chaque mois, des colis alimentaires et des kits sont remis aux familles qui en ont besoin.",
      "Au-delà de l'aide matérielle, nous créons du lien : visites aux aînés, moments de partage et événements solidaires tout au long de l'année.",
    ],
    values: [
      {
        icon: "heart",
        title: "Humanité",
        description:
          "Redonner dignité et espoir, avec respect et sans jugement, à chaque personne rencontrée.",
      },
      {
        icon: "hands",
        title: "Solidarité",
        description:
          "Agir concrètement sur le terrain, main dans la main avec nos bénévoles et nos donateurs.",
      },
      {
        icon: "share",
        title: "Partage",
        description:
          "Créer du lien, partager des sourires et des moments de chaleur humaine.",
      },
    ],
  },
  stats: {
    kicker: "Al Nissa en chiffres",
    title: "Notre impact",
    subtitle: "Intensité, engagement & générosité",
    items: [
      { value: "2 000+", label: "Repas distribués" },
      { value: "150+", label: "Maraudes réalisées" },
      { value: "80+", label: "Familles accompagnées" },
      { value: "2", label: "Villes : Lyon & Agadir" },
    ],
  },
  actions: {
    kicker: "Nos actions",
    title: "Ce que nous faisons",
    subtitle: "Une aide concrète, chaque semaine, chaque mois.",
    items: [
      {
        icon: "soup",
        title: "Maraudes & repas",
        description:
          "Distribution de repas chauds et de petits-déjeuners lors de nos maraudes, chaque semaine.",
      },
      {
        icon: "box",
        title: "Colis alimentaires",
        description:
          "Chaque mois, des colis alimentaires sont préparés et remis aux familles en difficulté.",
      },
      {
        icon: "gift",
        title: "Kits & distributions",
        description:
          "Produits d'hygiène, vêtements et kits de première nécessité distribués tout au long de l'année.",
      },
      {
        icon: "elder",
        title: "Sourire pour nos aînés",
        description:
          "Visites régulières aux personnes âgées et en EHPAD : activités, jeux et moments de partage.",
      },
      {
        icon: "water",
        title: "Distribution d'eau fraîche",
        description:
          "En période de forte chaleur, distribution d'eau fraîche aux personnes de la rue.",
      },
      {
        icon: "star",
        title: "Événements solidaires",
        description:
          "Réveillons, paniers cadeaux et temps forts pour partager la joie tout au long de l'année.",
      },
    ],
  },
  donation: {
    kicker: "Faire un don",
    title: "Votre don change des vies",
    subtitle:
      "Chaque geste compte. Votre don soutient nos actions, apporte espoir et dignité aux familles, et permet de développer de nouveaux projets.",
    accountName: "Association Al Nissa",
    iban: "FR76 2673 3000 1091 9483 2532 349",
    bic: "",
    bankName: "",
    onlineUrl: "https://www.helloasso.com/associations/association-al-nissa/adhesions/formulaire-d-adhesion",
    onlineLabel: "Faire un don sur HelloAsso",
    note: "Vous pouvez donner par virement bancaire (RIB ci-dessous), en ligne, ou nous contacter pour tout autre moyen.",
    taxNote:
      "Un reçu peut vous être délivré sur demande. Contactez-nous pour toute question relative à votre don.",
    suggestions: [10, 20, 50, 100],
  },
  contact: {
    email: "associationalnissa@gmail.com",
    phone: "06 72 14 16 73",
    whatsapp: "+33672141673",
    addressLyon: "Lyon, France",
    addressAgadir: "Agadir, Maroc",
    hours: "Maraudes : dimanche 9h & samedi 14h — départ Perrache",
  },
  socials: {
    instagram: "https://www.instagram.com/association_alnissa/",
    linktree: "https://linktr.ee/associationalnissa",
    facebook: "",
    tiktok: "",
    whatsapp: "https://wa.me/33672141673",
  },
  bubble: {
    title: "Comment nous joindre ?",
    onlineLabel: "En ligne",
    messagingTitle: "Messagerie",
    messagingSubtitle: "Écrivez-nous directement ici",
    soundLabel: "Ambiance sonore",
  },
  legal: {
    associationName: "Association Al Nissa",
    rna: "",
    siret: "",
    address: "Lyon, France",
    publisher: "Association Al Nissa",
    host: "Vercel Inc.",
  },
};

/** Fusion profonde simple (les valeurs de `override` priment). */
function deepMerge<T>(base: T, override: unknown): T {
  if (
    typeof base !== "object" ||
    base === null ||
    Array.isArray(base) ||
    typeof override !== "object" ||
    override === null ||
    Array.isArray(override)
  ) {
    return (override === undefined || override === null ? base : (override as T));
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  const ov = override as Record<string, unknown>;
  for (const key of Object.keys(ov)) {
    if (ov[key] === undefined) continue;
    out[key] = deepMerge((base as Record<string, unknown>)[key], ov[key]);
  }
  return out as T;
}

export const SITE_CONTENT_KEY = "site_content";

export function mergeContent(override: unknown): SiteContent {
  return deepMerge(defaultContent, override);
}
