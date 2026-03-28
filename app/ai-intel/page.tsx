import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Intel - WorldFactbook.io",
  description:
    "Section-aware Q&A over World Factbook JSON and merged open datasets — coming soon on WorldFactbook.io.",
  alternates: { canonical: "/ai-intel/" },
  openGraph: {
    title: "AI Intel | WorldFactbook.io",
    description: "Structured country intelligence with citations.",
    url: `${SITE_URL}/ai-intel/`,
  },
};

export default function AiIntelPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <h1 className="font-display text-4xl text-gold">AI Intel</h1>
        <p className="mt-4 text-muted">
          We are wiring Claude-powered answers that respect CIA section boundaries and cite the underlying JSON nodes.
          Until the endpoint is live, use the{" "}
          <Link className="text-gold hover:underline" href="/api/v1/countries/">
            free REST API
          </Link>{" "}
          or full{" "}
          <Link className="text-gold hover:underline" href="/countries/bosnia-and-herzegovina/">
            country profiles
          </Link>
          .
        </p>
      </main>
      <Footer />
    </>
  );
}
