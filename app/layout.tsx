import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Space_Mono } from "next/font/google";

import "./globals.css";

import { SITE_NAME, SITE_URL } from "@/lib/site";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — WorldFactbook.io`,
    template: `%s — ${SITE_NAME} | WorldFactbook.io`,
  },
  description:
    "Open World Factbook data for 260+ countries and territories. Geography, economy, government, military, and society — public domain intelligence with a free REST API.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "WorldFactbook.io",
    title: "WorldFactbook.io — The World Factbook, continued",
    description:
      "Live global intelligence: CIA-format country profiles, rankings, compare tool, and free JSON API.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "WorldFactbook.io",
    description: "Open World Factbook data — 260+ entities, free API.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${spaceMono.variable}`}>
      <body className="scanlines">
        {children}
      </body>
    </html>
  );
}
