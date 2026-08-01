export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://tumairservice.com";

export const BUSINESS_NAME = "พลประกาย แอร์ เซอร์วิส";
export const PHONE_DISPLAY = "098-267-1789";
export const PHONE_E164 = "+66982671789";
export const LINE_ID = "@064pjnra";
export const EMAIL = "tumairservice.chon@gmail.com";

export const SERVICE_AREAS = [
  "เมืองชลบุรี",
  "เสม็ด",
  "บางแสน",
  "ห้วยกะปิ",
  "อมตะ",
  "ศรีราชา",
  "ชลบุรีและพื้นที่ใกล้เคียง",
];

export const PRIMARY_DESCRIPTION =
  "พลประกาย แอร์ เซอร์วิส ร้านแอร์ชลบุรี ให้บริการล้างแอร์ ติดตั้งแอร์ใหม่ ย้ายแอร์ เช็ครั่ว เติมน้ำยา และวิเคราะห์อาการเสีย โดยช่างผ่านมาตรฐานฝีมือแรงงานแห่งชาติ";

export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
