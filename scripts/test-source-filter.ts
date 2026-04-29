import { checkSourceAllowed } from "@/lib/newsroom/source-filter";

const tests = [
  "https://www.jutarnji.hr/vijesti/svijet/iz-minute-u-minutu-15703494",
  "https://www.index.hr/vijesti/svijet/iran-trump-rat",
  "https://www.avaz.ba/vijesti/svijet/iran-konflikt",
  "https://www.klix.ba/scitech/iphone-17-review",
  "https://www.someblog.com/random",
  "https://www.reuters.com/world/middle-east/iran-crisis-2026-04-29",
  "https://www.bbc.com/news/world-asia-china-66",
  "https://www.aljazeera.com/news/2026/4/29/gaza-update",
  "https://www.index.hr/vijesti/hrvatska/zagreb-news",
  "https://www.klix.ba/vijesti/bih/sarajevo-news",
];

for (const url of tests) {
  const result = checkSourceAllowed(url);
  console.log(`[${result.allowed ? "✅ ALLOW" : "❌ BLOCK"}] ${url}`);
  console.log(`   → ${result.reason}\n`);
}
