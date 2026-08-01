import { Suspense } from "react";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { OdlukeListing } from "@/app/odluke/OdlukeListing";

export const dynamic = "force-static";
export const revalidate = false;

function getDiurnaBase() {
  return process.env.NEXT_PUBLIC_DIURNA_URL || "https://diurna.vercel.app";
}

export default async function OdlukePage() {
  let items: Array<{
    id?: string;
    slug?: string;
    titleBs?: string;
    summaryBs?: string[];
    whyShouldICare?: { gradjanin?: string };
    decisionType?: string;
    impactScore?: number;
    publishedAt?: string;
  }> = [];
  try {
    const res = await fetch(`${getDiurnaBase()}/api/public/decisions?site=novi.ba&minImpact=7&pageSize=24`);
    if (res.ok) {
      const payload = (await res.json()) as { items?: typeof items };
      if (Array.isArray(payload.items)) items = payload.items;
    }
  } catch {}

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <Suspense fallback={<p className="text-sm text-muted">Loading decisions…</p>}>
          <OdlukeListing items={items} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
