export function isMissingTableError(error: unknown): boolean {
  const err = error as { code?: string; message?: string } | null;
  if (!err) return false;
  if (err.code === "P2021") return true;
  const msg = err.message || "";
  return msg.includes("does not exist") || msg.includes("relation") || msg.includes("not exist");
}
