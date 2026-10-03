import { NextResponse } from "next/server";
import { getCatalogFiltersData } from "@/lib/catalog";

export async function GET() {
  const filters = await getCatalogFiltersData();

  return NextResponse.json(
    filters,
    { headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=60" } },
  );
}
