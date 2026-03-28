import { NextResponse } from "next/server";

import { API_DATA_SOURCES } from "./site";

export function jsonWithCors(data: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  headers.set("X-Data-Source", API_DATA_SOURCES);
  return NextResponse.json(data, { status: init?.status ?? 200, headers });
}

export function corsOptions() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "X-Data-Source": API_DATA_SOURCES,
    },
  });
}
