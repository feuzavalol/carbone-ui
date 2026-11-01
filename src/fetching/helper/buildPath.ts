export default function buildPath(base: string, params: Record<string, string | number | null | undefined>) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== "") {
      qs.set(key, String(value));
    }
  }
  const query = qs.toString();
  return query ? `${base}?${query}` : base;
}