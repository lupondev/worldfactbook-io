import { NextResponse } from "next/server";

type Cluster = {
  id: string;
  title: string;
  category: string;
  score: number;
  isOffTopic?: boolean;
};

const seedClusters: Cluster[] = [
  { id: "1", title: "IMF revises inflation forecast", category: "ECONOMY", score: 88 },
  { id: "2", title: "Celebrity fashion roundup", category: "OFF.TOPIC", score: 91, isOffTopic: true },
  { id: "3", title: "Regional security pact updates", category: "GOVERNMENT", score: 81 },
];

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const filtered = seedClusters.filter((item) => item.category !== "OFF.TOPIC" && !item.isOffTopic);
  return NextResponse.json({ ok: true, clusters: filtered });
}
