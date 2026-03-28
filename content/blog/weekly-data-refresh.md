---
title: "How weekly data refresh works"
date: "2026-03-22"
description: "A concise overview of how WorldFactbook.io aggregates World Bank, IMF, UN, and Freedom House metrics into country rows."
slug: "weekly-data-refresh"
tags:
  - data
  - methodology
---

Country pages combine a **baseline narrative structure** (geography, government, military, and similar sections) with **numeric indicators** that we refresh on a schedule.

## Pipeline outline

1. **Core profile JSON** — sourced from the open Factbook JSON corpus.
2. **Macro series** — World Bank and IMF series matched by ISO codes where possible.
3. **Governance and rights** — Freedom House and related indices where we have a confident country match.

## Why matches sometimes fail

Some Factbook entities are **territories, dependencies, or disputed regions** without a clean ISO mapping. In those cases headline metrics may show as em dashes (—) until we add a manual mapping.

| Source        | Typical use        |
| ------------- | ------------------ |
| World Bank    | GDP, population    |
| IMF           | Growth, debt       |
| Freedom House | Democracy score  |

> We log source sync timestamps on the site so you can see when a row was last touched.

If you spot a systematic mismatch, open an issue on the project repository with the **country slug** and the field you care about.
