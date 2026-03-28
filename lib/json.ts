export function jsonSafe<T>(data: T): unknown {
  return JSON.parse(
    JSON.stringify(data, (_, v) => (typeof v === "bigint" ? v.toString() : v)),
  );
}
