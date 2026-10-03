const numberFormat = new Intl.NumberFormat("th-TH");

export function formatWarranty(days: number): string {
  if (days < 365) return `${numberFormat.format(days)} วัน`;

  const years = Math.floor(days / 365);
  const remainingDays = days % 365;
  return remainingDays === 0
    ? `${numberFormat.format(years)} ปี`
    : `${numberFormat.format(years)} ปี ${numberFormat.format(remainingDays)} วัน`;
}
