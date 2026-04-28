"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type ChartPointDaily = { date: string; count: number };
export type ChartPointBacklog = { date: string; backlog: number };

type Props = {
  dailyIngested: ChartPointDaily[];
  backlog: ChartPointBacklog[];
};

export function TrustChart({ dailyIngested, backlog }: Props) {
  const merged = dailyIngested.map((d, i) => ({
    date: d.date.slice(5),
    ingested: d.count,
    backlog: backlog[i]?.backlog ?? 0,
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-lg border border-line bg-bg2/60 p-4">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">Daily decisions ingested</p>
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={merged} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="rgba(237,231,217,0.06)" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: "var(--muted)", fontSize: 10 }} />
              <YAxis tick={{ fill: "var(--muted)", fontSize: 10 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--bg3)",
                  border: "1px solid var(--line)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "var(--cream)" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="ingested"
                name="Ingested"
                stroke="var(--live)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-lg border border-line bg-bg2/60 p-4">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">
          Validation backlog (rolling net)
        </p>
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={merged} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="rgba(237,231,217,0.06)" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: "var(--muted)", fontSize: 10 }} />
              <YAxis tick={{ fill: "var(--muted)", fontSize: 10 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--bg3)",
                  border: "1px solid var(--line)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="backlog"
                name="Backlog"
                stroke="var(--gold)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
