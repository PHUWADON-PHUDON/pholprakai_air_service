import type { CatalogFilters, CatalogPage, CatalogParams } from "@/features/air/service";
import { getPrisma } from "@/lib/prisma";

export async function getCatalogFiltersData(): Promise<CatalogFilters> {
  const prisma = getPrisma();
  const [brands, systems] = await Promise.all([
    prisma.brand.findMany({
      where: { models: { some: {} } },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.system.findMany({
      where: { models: { some: {} } },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return { brands, systems, btus: [9000, 12000, 15000, 18000] };
}

export async function getCatalogPageData(params: CatalogParams): Promise<CatalogPage> {
  const { brandId, systemId, btu, sort, page, limit } = params;
  const btuValue = Number(btu);
  const btuFilter = [9000, 12000, 15000, 18000].includes(btuValue)
    ? { gte: btuValue, lt: btuValue + 3000 }
    : btuValue;
  const where = {
    ...(brandId ? { brandId } : {}),
    ...(systemId ? { systemId } : {}),
    ...(btu ? { btu: btuFilter } : {}),
  };
  const orderBy = sort === "price-asc" ? { priceInstall: "asc" as const }
    : sort === "price-desc" ? { priceInstall: "desc" as const }
      : sort === "btu-asc" ? { btu: "asc" as const }
        : { name: "asc" as const };

  const prisma = getPrisma();
  const total = await prisma.model.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const currentPage = Math.min(page, totalPages);
  const models = await prisma.model.findMany({
    where,
    orderBy,
    skip: (currentPage - 1) * limit,
    take: limit,
    select: {
      id: true,
      name: true,
      modelCode: true,
      btu: true,
      isSaveElectricity: true,
      enegyLabel: true,
      seer: true,
      priceInstall: true,
      priceDefault: true,
      stock: true,
      isOutOfStock: true,
      installWarranty: true,
      compressorWarranty: true,
      sparePartWarranty: true,
      brand: { select: { name: true, image: true } },
      system: { select: { name: true } },
      images: { select: { imageUrl: true }, orderBy: { position: "asc" } },
    },
  });

  return {
    items: models.map((model) => ({
      id: model.id,
      name: model.name,
      modelCode: model.modelCode,
      btu: model.btu,
      isSaveElectricity: model.isSaveElectricity,
      enegyLabel: model.enegyLabel,
      seer: Number(model.seer),
      priceInstall: Number(model.priceInstall),
      priceDefault: Number(model.priceDefault),
      stock: model.stock,
      isOutOfStock: model.isOutOfStock,
      installWarranty: model.installWarranty,
      compressorWarranty: model.compressorWarranty,
      sparePartWarranty: model.sparePartWarranty,
      brandName: model.brand.name,
      brandImageUrl: model.brand.image,
      systemName: model.system.name,
      imageUrl: model.images[0]?.imageUrl ?? "",
      imageUrls: model.images.map((image) => image.imageUrl),
    })),
    total,
    page: currentPage,
    totalPages,
  };
}
