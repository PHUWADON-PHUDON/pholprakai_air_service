export type BrandInput = { name: string; image: string };

export function parseBrandInput(value: unknown): BrandInput | null {
  if (typeof value !== "object" || value === null || !("name" in value) || !("image" in value)) {
    return null;
  }

  const { name, image } = value;
  if (typeof name !== "string" || typeof image !== "string") return null;

  const trimmedName = name.trim();
  const trimmedImage = image.trim();
  if (!trimmedName || trimmedName.length > 500 || !trimmedImage || trimmedImage.length > 2048) {
    return null;
  }

  try {
    const url = new URL(trimmedImage);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  } catch {
    return null;
  }

  return { name: trimmedName, image: trimmedImage };
}
