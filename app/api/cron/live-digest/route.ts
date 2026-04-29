import { generateHourlyDigests } from "@/lib/live/digest";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  await generateHourlyDigests();
  return Response.json({ ok: true });
}
