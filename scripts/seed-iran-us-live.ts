import { prisma } from "@/lib/prisma";

async function main() {
  const existing = await prisma.liveBlog.findUnique({ where: { slug: "iran-us-rat-live" } });
  if (existing) {
    process.stdout.write(`SKIPPED existing ${existing.id}\n`);
    return;
  }
  const created = await prisma.liveBlog.create({
    data: {
      siteId: "cmo429ixr0002cczvb1mleuu9",
      slug: "iran-us-rat-live",
      title: "Iran-US rat: LIVE",
      subtitle: "Sve dogadjaje vezane uz rat SAD-a i Izraela protiv Irana",
      description: "Live blog sa najnovijim vijestima, izjavama i analizama o sukobu na Bliskom Istoku",
      templateType: "crisis",
      status: "live",
      startedAt: new Date(),
      aiEditorEnabled: true,
      aiTopics: [
        "Iran",
        "Tehran",
        "Iranske",
        "Iranski",
        "Trump Iran",
        "Hormuz",
        "Hormuska",
        "Israel Iran",
        "Izrael Iran",
        "IRGC",
        "Revolucionarna garda",
        "Khamenei",
        "Pezeshkian",
        "naftn",
        "sankcije Iran",
        "Bliski Istok",
        "Bliskom Istoku",
      ],
    },
  });
  process.stdout.write(`CREATED ${created.id}\n`);
}

main().catch((err) => {
  process.stderr.write(`${String(err)}\n`);
  process.exit(1);
});
