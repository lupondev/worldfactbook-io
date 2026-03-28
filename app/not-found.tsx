import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-4xl text-cream">Not found</h1>
        <p className="mt-4 text-muted">That country or page is not in the database yet.</p>
        <Link className="mt-8 inline-block font-mono text-sm text-gold hover:underline" href="/rankings/">
          Browse rankings →
        </Link>
      </main>
      <Footer />
    </>
  );
}
