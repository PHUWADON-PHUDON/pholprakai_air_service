const ZERO = BigInt(0);
const CENTS_PER_BAHT = BigInt(100);
const FULL_DISCOUNT = BigInt(10000);

function parseCents(value: string): bigint | null {
  if (!/^\d{1,10}(?:\.\d{1,2})?$/.test(value)) return null;
  const [whole, fraction = ""] = value.split(".");
  return BigInt(whole) * CENTS_PER_BAHT + BigInt(fraction.padEnd(2, "0"));
}

export function getDiscountedPrice(priceDefault: string, discountPercent: string): string | null {
  const cents = parseCents(priceDefault);
  if (cents === null || !/^\d{1,3}(?:\.\d{1,2})?$/.test(discountPercent)) return null;
  const [whole, fraction = ""] = discountPercent.split(".");
  const basisPoints = BigInt(whole) * CENTS_PER_BAHT + BigInt(fraction.padEnd(2, "0"));
  if (basisPoints > FULL_DISCOUNT) return null;

  // Calculate in satang and round half up to avoid floating-point price errors.
  const discountedCents = (cents * (FULL_DISCOUNT - basisPoints) + BigInt(5000)) / FULL_DISCOUNT;
  return `${discountedCents / CENTS_PER_BAHT}.${(discountedCents % CENTS_PER_BAHT).toString().padStart(2, "0")}`;
}

export function getDiscountPercent(priceDefault: string, priceInstall: string): string {
  const defaultCents = parseCents(priceDefault);
  const installCents = parseCents(priceInstall);
  if (defaultCents === null || installCents === null || installCents > defaultCents) return "";
  if (defaultCents === ZERO) return "0";
  const basisPoints = ((defaultCents - installCents) * FULL_DISCOUNT + defaultCents / BigInt(2)) / defaultCents;
  return String(Number(basisPoints) / 100);
}
