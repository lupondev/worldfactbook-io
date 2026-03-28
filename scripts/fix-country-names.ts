import "dotenv/config";

import {
  buildRestCountryLookup,
  englishFromRestCountry,
  fetchRestCountriesNameDataset,
  matchRestCountryToDbRow,
} from "../lib/pipelines/restcountries";
import { createScriptPrismaClient } from "../lib/prisma-script";
import { slugifyCountryName } from "../lib/slugify";

const prisma = createScriptPrismaClient();

type Proposal = { name: string; officialName: string | null; baseSlug: string };

function resolveFinalSlugs(
  rows: { id: string; slug: string; ciaCode: string }[],
  proposals: Map<string, Proposal>,
): Map<string, string> {
  const rowById = new Map(rows.map((r) => [r.id, r]));
  const desired = (id: string) => proposals.get(id)?.baseSlug ?? rowById.get(id)!.slug;
  const byDesired = new Map<string, typeof rows>();
  for (const r of rows) {
    const s = desired(r.id);
    const list = byDesired.get(s) || [];
    list.push(r);
    byDesired.set(s, list);
  }
  const out = new Map<string, string>();
  for (const [s, group] of Array.from(byDesired.entries())) {
    if (group.length === 1) {
      out.set(group[0].id, s);
      continue;
    }
    const keeper = group.find((r) => r.slug === s);
    if (keeper) {
      out.set(keeper.id, s);
      for (const r of group) {
        if (r.id !== keeper.id) out.set(r.id, `${s}-${r.ciaCode}`);
      }
    } else {
      for (const r of group) out.set(r.id, `${s}-${r.ciaCode}`);
    }
  }
  const again = new Map<string, string[]>();
  for (const r of rows) {
    const fs = out.get(r.id)!;
    const list = again.get(fs) || [];
    list.push(r.id);
    again.set(fs, list);
  }
  for (const [fs, ids] of Array.from(again.entries())) {
    if (ids.length > 1) {
      for (const id of ids) {
        const row = rowById.get(id)!;
        out.set(id, `${fs}-${row.ciaCode}`);
      }
    }
  }
  return out;
}

async function main() {
  const [rows, rc] = await Promise.all([prisma.country.findMany(), fetchRestCountriesNameDataset()]);
  const lookup = buildRestCountryLookup(rc, slugifyCountryName);
  const proposals = new Map<string, Proposal>();
  let matched = 0;
  for (const r of rows) {
    const hit = matchRestCountryToDbRow(rc, lookup, {
      name: r.name,
      slug: r.slug,
      iso2: r.iso2,
      iso3: r.iso3,
    });
    if (!hit) continue;
    const en = englishFromRestCountry(hit);
    const baseSlug = slugifyCountryName(en.common) || r.ciaCode;
    proposals.set(r.id, {
      name: en.common,
      officialName: en.official !== en.common ? en.official : null,
      baseSlug,
    });
    matched += 1;
  }
  const finalSlugById = resolveFinalSlugs(rows, proposals);
  const toUpdate = rows.filter((r) => proposals.has(r.id));
  const needTempSlug = toUpdate.filter((r) => finalSlugById.get(r.id) !== r.slug);
  if (needTempSlug.length) {
    for (const r of needTempSlug) {
      await prisma.country.update({
        where: { id: r.id },
        data: { slug: `__wf__${r.id}` },
      });
    }
  }
  for (const r of toUpdate) {
    const p = proposals.get(r.id)!;
    const slug = finalSlugById.get(r.id)!;
    await prisma.country.update({
      where: { id: r.id },
      data: {
        name: p.name,
        officialName: p.officialName,
        slug,
      },
    });
  }
  process.stdout.write(
    `Matched ${matched} of ${rows.length} countries; updated ${toUpdate.length} rows (${needTempSlug.length} slug changes).\n`,
  );
}

main()
  .catch((e) => {
    process.stderr.write(String(e) + "\n");
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
