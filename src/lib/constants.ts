// Libellés des valeurs « enum » (stockées en texte dans SQLite).

export const DONATION_METHODS: Record<string, string> = {
  BANK_TRANSFER: "Virement bancaire",
  CARD: "Carte bancaire",
  CASH: "Espèces",
  CHECK: "Chèque",
  HELLOASSO: "HelloAsso",
  PAYPAL: "PayPal",
  OTHER: "Autre",
};

export const DONATION_STATUSES: Record<string, string> = {
  PENDING: "En attente",
  RECEIVED: "Reçu",
  REFUNDED: "Remboursé",
};

export const DONATION_FREQUENCIES: Record<string, string> = {
  MONTHLY: "Mensuel",
  QUARTERLY: "Trimestriel",
  YEARLY: "Annuel",
};

export const DONOR_TYPES: Record<string, string> = {
  INDIVIDUAL: "Particulier",
  COMPANY: "Entreprise",
};

export const MESSAGE_STATUSES: Record<string, string> = {
  NEW: "Nouveau",
  READ: "Lu",
  REPLIED: "Répondu",
  ARCHIVED: "Archivé",
};

export const MESSAGE_CHANNELS: Record<string, string> = {
  BUBBLE: "Bulle de contact",
  CONTACT: "Formulaire contact",
  EMAIL: "E-mail",
};

export const VOLUNTEER_STATUSES: Record<string, string> = {
  NEW: "Nouveau",
  CONTACTED: "Contacté",
  ACTIVE: "Actif",
  INACTIVE: "Inactif",
};

export const EVENT_TYPES: Record<string, string> = {
  MARAUDE: "Maraude",
  DISTRIBUTION: "Distribution",
  VISITE: "Visite",
  COLLECTE: "Collecte",
  EVENT: "Événement",
};

export const EVENT_RECURRENCES: Record<string, string> = {
  WEEKLY: "Chaque semaine",
  MONTHLY: "Chaque mois",
  ONCE: "Ponctuel",
};

export function label(map: Record<string, string>, key: string): string {
  return map[key] ?? key;
}
