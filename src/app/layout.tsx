import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Association Al Nissa — Solidarité · Partage · Humanité",
    template: "%s · Association Al Nissa",
  },
  description:
    "Association Al Nissa (Lyon & Agadir) : maraudes, repas chauds, colis alimentaires et visites aux personnes âgées. Ensemble, faisons la différence. Faites un don ou devenez bénévole.",
  keywords: [
    "Al Nissa",
    "association",
    "Lyon",
    "Agadir",
    "maraude",
    "solidarité",
    "don",
    "bénévolat",
    "colis alimentaire",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    title: "Association Al Nissa — Solidarité · Partage · Humanité",
    description:
      "Maraudes, repas, colis alimentaires et visites aux aînés à Lyon & Agadir. Ensemble, faisons la différence.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#f9e7e9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}
