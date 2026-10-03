import { NextResponse } from "next/server";
import type { CatalogParams } from "@/features/air/service";
import { getCatalogPageData } from "@/lib/catalog";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SORT_OPTIONS = ["name", "price-asc", "price-desc", "btu-asc"] as const;

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const brandId = params.get("brandId") || undefined;
  const systemId = params.get("systemId") || undefined;
  const btu = params.get("btu") || undefined;
  const page = Number(params.get("page") ?? "1");
  const limit = Number(params.get("limit") ?? "8");
  const sort = params.get("sort") ?? "name";

  if ((brandId && !UUID_PATTERN.test(brandId)) || (systemId && !UUID_PATTERN.test(systemId)) ||
      (btu && (!/^\d+$/.test(btu) || Number(btu) < 1 || Number(btu) > 2_147_483_647)) ||
      !Number.isSafeInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 8 ||
      !SORT_OPTIONS.includes(sort as typeof SORT_OPTIONS[number])) {
    return NextResponse.json({ message: "ตัวกรองไม่ถูกต้อง" }, { status: 400 });
  }

  const data = await getCatalogPageData({
    brandId: brandId ?? "",
    systemId: systemId ?? "",
    btu: btu ?? "",
    sort: sort as CatalogParams["sort"],
    page,
    limit,
  });

  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=60" },
  });
}
