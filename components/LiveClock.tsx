"use client";

import { useEffect, useState } from "react";

export function LiveClock() {
  const [now, setNow] = useState<string>("");

  useEffect(() => {
    const tick = () => {
      setNow(new Date().toISOString().replace("T", " ").replace(/\.\d{3}Z$/, " UTC"));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-xs text-live tabular-nums" suppressHydrationWarning>
      {now || "—"}
    </span>
  );
}
