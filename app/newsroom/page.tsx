import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { AutopilotStatusBar } from "@/components/newsroom/AutopilotStatusBar";
import { WatchdogStatus } from "@/components/newsroom/WatchdogStatus";

export default function NewsroomPage() {
  const todayCount = 0;
  const dailyTarget = 24;
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <h1 className="font-display text-4xl text-cream">Newsroom</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <AutopilotStatusBar isActive={false} todayCount={todayCount} dailyTarget={dailyTarget} />
          <WatchdogStatus status="healthy" checkedAt="Checking..." />
        </div>
      </main>
      <Footer />
    </>
  );
}
