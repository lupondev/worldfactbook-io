import { createHash } from "crypto";

import { prisma } from "@/lib/prisma";

export type DecisionSource = "ICTY" | "IRMCT";
export type DecisionType = "Judgment" | "Sentence" | "Appeal" | "Decision";

export type IctyDecisionSeed = {
  source: DecisionSource;
  caseId: string;
  defendant: string;
  date: string;
  type: DecisionType;
  pdfUrl: string;
  title?: string;
};

const BIH_PRIORITY_DEFENDANTS = new Set([
  "Radovan Karadžić",
  "Ratko Mladić",
  "Momčilo Krajišnik",
  "Radoslav Brđanin",
  "Biljana Plavšić",
  "Duško Tadić",
  "Milorad Stakić",
  "Radislav Krstić",
  "Stanislav Galić",
  "Goran Hadžić",
  "Vojislav Šešelj",
  "Zdravko Tolimir",
]);

function toSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 140);
}

function mapType(raw: string): DecisionType {
  const value = raw.toLowerCase();
  if (value.includes("appeal")) return "Appeal";
  if (value.includes("sentence")) return "Sentence";
  if (value.includes("judgment")) return "Judgment";
  return "Decision";
}

function parseDate(raw: string): Date | null {
  const d = new Date(raw);
  return Number.isFinite(d.getTime()) ? d : null;
}

async function putToBlobIfAvailable(filename: string, body: Buffer, contentType: string): Promise<string | null> {
  try {
    const mod = (await import("@vercel/blob")) as { put: (name: string, data: Buffer, opts: { access: "public"; contentType: string }) => Promise<{ url: string }> };
    const out = await mod.put(filename, body, { access: "public", contentType });
    return out.url;
  } catch {
    return null;
  }
}

async function fetchPdfBytes(url: string): Promise<{ bytes: Buffer; deferred: boolean }> {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`pdf_fetch_failed_${res.status}`);
  const arr = await res.arrayBuffer();
  const bytes = Buffer.from(arr);
  const deferred = bytes.length > 50 * 1024 * 1024;
  return { bytes, deferred };
}

export async function ingestIctyDecision(seed: IctyDecisionSeed): Promise<{ created: boolean; id: string }> {
  const caseKey = `${seed.source}:${seed.caseId}`;
  const existing = await prisma.decision.findFirst({
    where: { source: seed.source, sourceCaseId: seed.caseId },
    select: { id: true },
  });
  if (existing) return { created: false, id: existing.id };

  const pdfMeta = await fetchPdfBytes(seed.pdfUrl);
  const pdfHash = createHash("sha256").update(pdfMeta.bytes).digest("hex");
  const blobUrl = await putToBlobIfAvailable(`${toSlug(caseKey)}.pdf`, pdfMeta.bytes, "application/pdf");
  const title = seed.title?.trim() || `${seed.defendant} — ${seed.caseId}`;
  const slug = toSlug(`${seed.source}-${seed.caseId}-${seed.defendant}`);
  const created = await prisma.decision.create({
    data: {
      title,
      slug,
      source: seed.source,
      sourceCaseId: seed.caseId,
      defendant: seed.defendant,
      decisionDate: parseDate(seed.date),
      decisionType: seed.type,
      pdfUrl: seed.pdfUrl,
      pdfHash,
      pdfBlobUrl: blobUrl || seed.pdfUrl,
      extractDeferred: pdfMeta.deferred,
      trustStatus: "ai_generated",
      impactScore: BIH_PRIORITY_DEFENDANTS.has(seed.defendant) ? 95 : 70,
    },
    select: { id: true },
  });
  return { created: true, id: created.id };
}

export async function crawlIctyCasesPage(source: DecisionSource): Promise<IctyDecisionSeed[]> {
  const baseUrl = source === "ICTY" ? "https://www.icty.org/en/cases" : "https://www.irmct.org/en/cases";
  const html = await fetch(baseUrl).then((r) => r.text());
  const rows = Array.from(html.matchAll(/(IT-\d{2}-\d+(?:\/\d+)?(?:-[A-Z])?)/g)).map((m) => m[1]);
  const uniqueCaseIds = Array.from(new Set(rows));
  return uniqueCaseIds.map((caseId) => ({
    source,
    caseId,
    defendant: caseId,
    date: new Date().toISOString().slice(0, 10),
    type: mapType("decision"),
    pdfUrl: `https://www.irmct.org/sites/default/files/case-documents/${encodeURIComponent(caseId)}.pdf`,
    title: `${source} ${caseId}`,
  }));
}

export async function ingestBihPriorityDecisions(list: IctyDecisionSeed[]): Promise<{ inserted: number; skipped: number }> {
  let inserted = 0;
  let skipped = 0;
  for (const item of list) {
    if (!BIH_PRIORITY_DEFENDANTS.has(item.defendant)) {
      skipped++;
      continue;
    }
    const result = await ingestIctyDecision(item);
    if (result.created) inserted++;
    else skipped++;
  }
  return { inserted, skipped };
}
