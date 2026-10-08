import { Prisma } from "../../generated/prisma/client";

export const airModelInclude = {
  brand: { select: { id: true, name: true } },
  system: { select: { id: true, name: true } },
  images: { select: { imageUrl: true }, orderBy: { position: "asc" } },
} as const;

type AirModelWithRelations = Prisma.ModelGetPayload<{ include: typeof airModelInclude }>;

export function serializeAirModel(model: AirModelWithRelations) {
  return {
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
    brandId: model.brandId,
    systemId: model.systemId,
    brand: model.brand,
    system: model.system,
    imageUrl: model.images[0]?.imageUrl ?? "",
    imageUrls: model.images.map((image) => image.imageUrl),
  };
}
