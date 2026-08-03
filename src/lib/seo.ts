export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://ppkair.com";

export const BUSINESS_NAME = "พลประกาย แอร์ เซอร์วิส";
export const PHONE_DISPLAY = "098-267-1789";
export const PHONE_E164 = "+66982671789";
export const LINE_ID = "@064pjnra";
export const EMAIL = "tumairservice.chon@gmail.com";

export const SERVICE_AREAS = [
  "อำเภอเมืองชลบุรี",
  "เสม็ด",
  "บ้านปึก",
  "อ่างศิลา",
  "ห้วยกะปิ",
  "บ้านสวน",
  "บางปลาสร้อย",
  "บางทราย",
  "และพื้นที่ใกล้เคียง",
];

export const PRIMARY_DESCRIPTION =
  "พลประกาย แอร์ เซอร์วิส ร้านแอร์ชลบุรี ให้บริการล้างแอร์ ติดตั้งแอร์ใหม่ ล้างแอร์ ย้ายแอร์ ตรวจเช็คระบบน้ำยา ซ่อมแอร์ วิเคราะห์อาการเสีย โดยช่างผ่านการทดสอบมาตรฐานฝีมือแรงงานแห่งชาติ สาขาช่างเครื่องปรับอากาศ และ ช่างไฟฟ้าภายในอาคาร";

export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
