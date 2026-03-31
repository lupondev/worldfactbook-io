import { NextResponse } from "next/server";

import { isMissingTableError } from "@/lib/api-db";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type StatusPayload = {
  isActive: boolean;
  dailyTarget: number;
  todayCount: number;
  remaining: number;
  scheduleStart: string;
  scheduleEnd: string;
  is24h: boolean;
  isWithinSchedule: boolean;
  autoPublish: boolean;
  contentStyle: string;
};

function buildFallback(): StatusPayload {
  const dailyTarget = 24;
  const todayCount = 0;
  return {
    isActive: true,
    dailyTarget,
    todayCount,
    remaining: Math.max(0, dailyTarget - todayCount),
    scheduleStart: "00:00",
    scheduleEnd: "23:59",
    is24h: true,
    isWithinSchedule: true,
    autoPublish: true,
    contentStyle: "balanced",
  };
}

export async function GET() {
  const fallback = buildFallback();
  try {
    const rows = await prisma.$queryRawUnsafe<Array<{ todayCount: number }>>(
      `select count(*)::int as "todayCount"
       from "AutopilotLog"
       where date_trunc('day',"createdAt") = date_trunc('day',now())`,
    );
    const todayCount = rows[0]?.todayCount ?? 0;
    const dailyTarget = fallback.dailyTarget;
    return NextResponse.json({
      ...fallback,
      todayCount,
      remaining: Math.max(0, dailyTarget - todayCount),
    });
  } catch (error) {
    console.error("[autopilot/status]", error);
    if (isMissingTableError(error)) {
      return NextResponse.json(fallback);
    }
    return NextResponse.json({
      ...fallback,
      error: (error as { message?: string })?.message ?? "Failed",
    });
  }
}
