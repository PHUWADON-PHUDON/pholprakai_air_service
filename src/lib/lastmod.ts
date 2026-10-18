export const LASTMOD: Record<string, string> = {
  "/": "2026-10-18",
  "/btu-calculator": "2026-10-18",
  "/services/air-cleaning": "2026-10-18",
  "/services/air-installation": "2026-10-18",
  "/services/air-repair": "2026-10-18",
  "/services/air-relocation": "2026-10-18",
  "/services/refrigerant-check": "2026-10-18",
  "/services/air-diagnosis": "2026-10-18",
};

const FALLBACK = "2026-10-18";

export function lastmodOf(path: string): string {
  const date = LASTMOD[path];
  if (!date && process.env.NODE_ENV !== "production") {
    console.warn(`[lastmod] ยังไม่มีวันที่ของ "${path}" ใน src/lib/lastmod.ts`);
  }
  return date ?? FALLBACK;
}
