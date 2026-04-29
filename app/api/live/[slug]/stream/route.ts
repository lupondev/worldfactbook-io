import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = async () => {
        const blog = await prisma.liveBlog.findUnique({
          where: { slug: params.slug },
          include: {
            updates: {
              where: { status: "published", deletedAt: null },
              orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
              take: 200,
            },
          },
        });
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(blog || null)}\n\n`));
      };
      await send();
      const interval = setInterval(send, 15000);
      setTimeout(() => {
        clearInterval(interval);
        controller.close();
      }, 10 * 60 * 1000);
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
