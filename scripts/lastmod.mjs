// ตั้งวันที่ lastmod ของหน้าที่ระบุเป็นวันนี้ (เวลาไทย)
// ใช้: npm run lastmod -- /services/air-cleaning /btu-calculator
import { readFileSync, writeFileSync } from "node:fs";

const file = new URL("../src/lib/lastmod.ts", import.meta.url);
const paths = process.argv.slice(2);
if (!paths.length) {
  console.error("ระบุ path ด้วย เช่น: npm run lastmod -- /services/air-cleaning");
  process.exit(1);
}

const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bangkok" }).format(new Date());
let src = readFileSync(file, "utf8");

for (const p of paths) {
  const re = new RegExp(`("${p.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}":\\s*")\\d{4}-\\d{2}-\\d{2}(")`);
  if (re.test(src)) {
    src = src.replace(re, `$1${today}$2`);
    console.log(`✓ ${p} → ${today}`);
  } else {
    src = src.replace(/(\n};)/, `\n  "${p}": "${today}",$1`);
    console.log(`+ ${p} → ${today} (เพิ่มใหม่)`);
  }
}
writeFileSync(file, src);
