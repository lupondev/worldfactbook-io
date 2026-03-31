type Props = {
  isActive: boolean;
  todayCount: number;
  dailyTarget: number;
};

export function AutopilotStatusBar({ isActive, todayCount, dailyTarget }: Props) {
  const remaining = Math.max(0, dailyTarget - todayCount);
  const stateLabel = isActive ? "ON" : "OFF";
  const stateTone = isActive ? "text-live" : "text-muted";
  return (
    <div className="rounded-lg border border-bg4 bg-bg2/70 p-4">
      <p className="font-mono text-xs uppercase tracking-wider text-muted">AutopilotStatusBar</p>
      <p className={`mt-2 font-display text-lg ${stateTone}`}>Autopilot: {stateLabel}</p>
      <p className="mt-1 font-mono text-xs text-muted">
        todayCount: {todayCount} / dailyTarget: {dailyTarget} / remaining: {remaining}
      </p>
    </div>
  );
}
