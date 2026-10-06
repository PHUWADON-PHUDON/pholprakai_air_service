export type AirModelInput = {
  name: string;
  modelCode: string;
  btu: number;
  isSaveElectricity: boolean;
  seer: string;
  priceInstall: string;
  priceDefault: string;
  stock: number;
  isOutOfStock: boolean;
  installWarranty: number;
  compressorWarranty: number;
  sparePartWarranty: number;
  brandId: string;
  systemId: string;
  imageUrls: string[];
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function decimal(value: unknown, integerDigits: number, positive = false): value is string {
  if (typeof value !== "string" || !new RegExp(`^(?:0|[1-9]\\d{0,${integerDigits - 1}})(?:\\.\\d{1,2})?$`).test(value)) {
    return false;
  }
  return !positive || Number(value) > 0;
}

function wholeNumber(value: unknown, positive = false): value is number {
  return typeof value === "number" && Number.isInteger(value) &&
    value >= (positive ? 1 : 0) && value <= 2_147_483_647;
}

export function parseAirModelInput(value: unknown): AirModelInput | null {
  if (typeof value !== "object" || value === null) return null;
  const input = value as Record<string, unknown>;

  if (typeof input.name !== "string" || !input.name.trim() || input.name.trim().length > 500 ||
      typeof input.modelCode !== "string" || !input.modelCode.trim() || input.modelCode.trim().length > 500 ||
      !wholeNumber(input.btu, true) || typeof input.isSaveElectricity !== "boolean" ||
      !decimal(input.seer, 3, true) || !decimal(input.priceInstall, 10) || !decimal(input.priceDefault, 10) ||
      !wholeNumber(input.stock) || typeof input.isOutOfStock !== "boolean" ||
      !wholeNumber(input.installWarranty) || !wholeNumber(input.compressorWarranty) || !wholeNumber(input.sparePartWarranty) ||
      typeof input.brandId !== "string" || !UUID_PATTERN.test(input.brandId) ||
      typeof input.systemId !== "string" || !UUID_PATTERN.test(input.systemId) ||
      !Array.isArray(input.imageUrls) || input.imageUrls.length < 1 || input.imageUrls.length > 20) {
    return null;
  }

  const imageUrls: string[] = [];
  for (const value of input.imageUrls) {
    if (typeof value !== "string" || !value.trim() || value.trim().length > 500) return null;
    const imageUrl = value.trim();
    try {
      const url = new URL(imageUrl);
      if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    } catch {
      return null;
    }
    imageUrls.push(imageUrl);
  }

  return {
    name: input.name.trim(),
    modelCode: input.modelCode.trim(),
    btu: input.btu,
    isSaveElectricity: input.isSaveElectricity,
    seer: input.seer,
    priceInstall: input.priceInstall,
    priceDefault: input.priceDefault,
    stock: input.stock,
    isOutOfStock: input.isOutOfStock,
    installWarranty: input.installWarranty,
    compressorWarranty: input.compressorWarranty,
    sparePartWarranty: input.sparePartWarranty,
    brandId: input.brandId,
    systemId: input.systemId,
    imageUrls,
  };
}
