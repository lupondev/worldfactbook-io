import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function NewsroomPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <h1 className="font-display text-4xl text-cream">Newsroom</h1>
        <p className="mt-6 font-mono text-sm text-muted">Autopilot: OFF</p>
      </main>
      <Footer />
    </>
  );
}
