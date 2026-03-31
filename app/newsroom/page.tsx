import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { AutopilotStatusBar } from "@/components/newsroom/AutopilotStatusBar";
import NewsroomClient, { type NewsroomCluster } from "@/app/newsroom/NewsroomClient";
import { WatchdogStatus } from "@/components/newsroom/WatchdogStatus";

function parseClusters(payload: unknown): NewsroomCluster[] {
  const data = payload as {
    clusters?: NewsroomCluster[];
    data?: { clusters?: NewsroomCluster[] };
    items?: NewsroomCluster[];
  };
  if (Array.isArray(data?.clusters)) return data.clusters;
  if (Array.isArray(data?.data?.clusters)) return data.data.clusters;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

export const dynamic = "force-dynamic";

export default async function NewsroomPage() {
  const todayCount = 0;
  const dailyTarget = 24;
  let clusters: NewsroomCluster[] = [];
  try {
    const res = await fetch(`${process.env.SITE_URL ?? "http://localhost:3000"}/api/newsroom/clusters?timeFilter=ALL`, {
      cache: "no-store",
    });
    if (res.ok) {
      const payload = (await res.json()) as unknown;
      clusters = parseClusters(payload);
    }
  } catch {}

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <h1 className="font-display text-4xl text-cream">Newsroom</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <AutopilotStatusBar isActive={false} todayCount={todayCount} dailyTarget={dailyTarget} />
          <WatchdogStatus status="healthy" checkedAt="Checking..." />
        </div>
        <NewsroomClient initialClusters={clusters} />
      </main>
      <Footer />
    </>
  );
}
