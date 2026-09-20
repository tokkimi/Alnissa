/**
 * Prépare le logo de l'association à partir de la capture fournie.
 * On NE MODIFIE PAS le logo : on le recadre simplement sur son disque rose
 * (en retirant le fond flou de la capture d'écran) et on le rend circulaire
 * sur fond transparent, pour un rendu net sur toutes les pages.
 */
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const SRC = path.join(process.cwd(), "public", "logo-source.jpg");
const PUBLIC = path.join(process.cwd(), "public");
const APP = path.join(process.cwd(), "src", "app");

function longestBrightRun(
  get: (i: number) => number,
  length: number,
  threshold: number,
): [number, number] {
  let bestStart = 0;
  let bestLen = 0;
  let curStart = -1;
  for (let i = 0; i < length; i++) {
    if (get(i) > threshold) {
      if (curStart === -1) curStart = i;
      const len = i - curStart + 1;
      if (len > bestLen) {
        bestLen = len;
        bestStart = curStart;
      }
    } else {
      curStart = -1;
    }
  }
  return [bestStart, bestStart + bestLen - 1];
}

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error("Source du logo introuvable :", SRC);
    process.exit(1);
  }

  const { data, info } = await sharp(SRC)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h, channels } = info;
  const brightness = (x: number, y: number) => {
    const idx = (y * w + x) * channels;
    return Math.max(data[idx], data[idx + 1], data[idx + 2]);
  };

  const THRESH = 135;
  const midY = Math.floor(h / 2);
  const midX = Math.floor(w / 2);

  const [x0, x1] = longestBrightRun((x) => brightness(x, midY), w, THRESH);
  const [y0, y1] = longestBrightRun((y) => brightness(midX, y), h, THRESH);

  let cx = (x0 + x1) / 2;
  let cy = (y0 + y1) / 2;
  let r = Math.min((x1 - x0) / 2, (y1 - y0) / 2) * 0.985;

  // Repli si la détection échoue : carré centré.
  if (!Number.isFinite(r) || r < w * 0.2) {
    const side = Math.min(w, h) * 0.9;
    r = side / 2;
    cx = w / 2;
    cy = h / 2;
    console.warn("Détection du disque incertaine — recadrage centré appliqué.");
  }

  const D = Math.floor(r * 2);
  const left = Math.max(0, Math.round(cx - r));
  const top = Math.max(0, Math.round(cy - r));
  const width = Math.min(D, w - left);
  const height = Math.min(D, h - top);

  console.log(
    `Disque détecté : centre (${Math.round(cx)}, ${Math.round(cy)}), rayon ${Math.round(r)} — recadrage ${width}x${height}`,
  );

  const square = await sharp(SRC).extract({ left, top, width, height }).toBuffer();

  const size = 640;
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`,
  );

  const circular = await sharp(square)
    .resize(size, size, { fit: "cover" })
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  // Logo principal (transparent, circulaire)
  fs.writeFileSync(path.join(PUBLIC, "logo.png"), circular);

  // Déclinaisons pour les favicons / partages
  await sharp(circular).resize(512, 512).png().toFile(path.join(PUBLIC, "logo-512.png"));
  await sharp(circular).resize(192, 192).png().toFile(path.join(PUBLIC, "logo-192.png"));
  await sharp(circular).resize(180, 180).png().toFile(path.join(APP, "apple-icon.png"));
  await sharp(circular).resize(64, 64).png().toFile(path.join(APP, "icon.png"));

  // Image de partage (Open Graph) sur fond rose poudré
  const og = await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 249, g: 231, b: 233, alpha: 1 },
    },
  })
    .composite([
      {
        input: await sharp(circular).resize(360, 360).toBuffer(),
        gravity: "center",
      },
    ])
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(PUBLIC, "og-image.png"), og);

  console.log("Logo généré : public/logo.png (+ déclinaisons et image de partage).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
