import "server-only";
import { cache } from "react";
import { prisma } from "./prisma";
import { mergeContent, SITE_CONTENT_KEY, type SiteContent } from "./content";

/**
 * Charge le contenu du site : valeurs par défaut fusionnées avec les
 * modifications enregistrées en base (clé `site_content`).
 * Mémoïsé par requête pour éviter les lectures multiples.
 */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  try {
    const row = await prisma.setting.findUnique({
      where: { key: SITE_CONTENT_KEY },
    });
    if (!row) return mergeContent(undefined);
    const parsed = JSON.parse(row.value);
    return mergeContent(parsed);
  } catch {
    return mergeContent(undefined);
  }
});

export async function saveSiteContent(content: SiteContent): Promise<void> {
  await prisma.setting.upsert({
    where: { key: SITE_CONTENT_KEY },
    create: { key: SITE_CONTENT_KEY, value: JSON.stringify(content) },
    update: { value: JSON.stringify(content) },
  });
}

export async function getSetting(key: string): Promise<string | null> {
  const row = await prisma.setting.findUnique({ where: { key } });
  return row?.value ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await prisma.setting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}
