import { processAllLiveBlogs } from "@/lib/live/ai-editor";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  await processAllLiveBlogs();
  return Response.json({ ok: true });
}
