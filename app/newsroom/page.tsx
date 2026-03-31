import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { WatchdogStatus } from "@/components/newsroom/WatchdogStatus";

export const dynamic = "force-dynamic";

export default function NewsroomPage() {
  const todayCount = 0;
  const dailyTarget = 24;
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <h1 className="font-display text-4xl text-cream">Newsroom</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-bg4 bg-bg2/70 p-4">
            <p className="font-mono text-xs uppercase tracking-wider text-muted">AutopilotStatus</p>
            <p className="mt-2 font-display text-lg text-live">RUNNING</p>
            <p className="mt-1 font-mono text-xs text-muted">
              todayCount: {todayCount} / dailyTarget: {dailyTarget}
            </p>
          </div>
          <div className="rounded-lg border border-bg4 bg-bg2/70 p-4">
            <p className="font-mono text-xs uppercase tracking-wider text-muted">BrainStatus</p>
            <p className="mt-2 font-display text-lg text-gold">ACTIVE</p>
            <p className="mt-1 font-mono text-xs text-muted">2h reporting cadence</p>
          </div>
          <WatchdogStatus status="healthy" checkedAt={new Date().toISOString()} />
        </div>
      </main>
      <Footer />
    </>
  );
}
