export type SunExposure = "none" | "morning" | "afternoon";

export const LOAD: Record<SunExposure, number> = { none: 850, morning: 950, afternoon: 1050 };
export const SUN_LABEL: Record<SunExposure, string> = {
  none: "ไม่โดนแดด",
  morning: "โดนแดดเช้า",
  afternoon: "โดนแดดบ่าย",
};

export const STANDARD_BTU = [9000, 12000, 13000, 15000, 18000, 20000, 22000, 24000, 25000, 30000, 36000, 40000];
export const PERSON_BTU = 600;
export const DEVICE_BTU = 400;

export const baseBtu = (w: number, l: number, load: number, h = 3) => w * l * (h / 3) * load;

export const requiredBtu = (r: {
  width: number; length: number; height: number; sun: SunExposure; people: number; devices: number;
}) =>
  baseBtu(r.width, r.length, LOAD[r.sun], r.height) +
  Math.max(0, r.people - 2) * PERSON_BTU +
  r.devices * DEVICE_BTU;

export const roundUpBtu = (btu: number) =>
  STANDARD_BTU.find((s) => s >= btu) ?? Math.ceil(btu / 1000) * 1000;

export const fmtBtu = (n: number) => Math.round(n).toLocaleString("en-US");
