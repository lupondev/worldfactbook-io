import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Space_Mono } from "next/font/google";

import GoogleAnalytics from "./components/GoogleAnalytics";
import "./globals.css";

import { SITE_URL } from "@/lib/site";

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
    default: "WorldFactbook.io — AI-Powered World Factbook Alternative",
    template: `%s | WorldFactbook.io`,
  },
  description:
    "The free AI-powered replacement for the CIA World Factbook (shut down Feb 2026). 261 countries, live data from World Bank & IMF, AI country intelligence, free API. Updated weekly.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "WorldFactbook.io",
    title: "WorldFactbook.io — AI-Powered World Factbook Alternative",
    description:
      "The free AI-powered replacement for the CIA World Factbook. 261 countries, live World Bank & IMF data, AI briefs, free API. Updated weekly.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "WorldFactbook.io — AI-Powered World Factbook Alternative",
    description:
      "Free AI-powered World Factbook alternative — 261 countries, live data, AI intelligence, free API.",
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
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
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
