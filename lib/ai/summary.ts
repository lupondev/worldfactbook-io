import Anthropic from "@anthropic-ai/sdk";
import type { Country } from "@prisma/client";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

function fmtNum(n: number | bigint | null | undefined): string {
  if (n == null) return "n/a";
  if (typeof n === "bigint") return n.toString();
  if (Number.isNaN(n)) return "n/a";
  return String(n);
}

export async function generateCountrySummary(country: Country): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

  const anthropic = new Anthropic({ apiKey });

  const prompt = `Write a concise 3-paragraph intelligence brief for ${country.name}.

Available data:
- GDP: $${fmtNum(country.gdp)}B | Per capita: $${fmtNum(country.gdpPerCapita)}
- Population: ${fmtNum(country.population)}
- Democracy score: ${country.democracyScore ?? "n/a"}/100
- HDI rank: #${country.hdiRank ?? "n/a"}
- Region: ${country.region}

Paragraph 1: Economic overview and key indicators (2-3 sentences)
Paragraph 2: Political system and governance (2-3 sentences)
Paragraph 3: Strategic significance and outlook (2-3 sentences)

Be factual, neutral, intelligence-style writing. No fluff. Max 150 words total.`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }],
  });

  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}
