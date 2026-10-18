import type { Metadata } from "next";
import Link from "next/link";
import Btucal from "@/components/common/Btucal";
import BtuTable from "@/components/common/BtuTable";
import { baseBtu, fmtBtu, LOAD as BASE_LOAD, roundUpBtu } from "@/lib/btuModel";
import PageShell, { ContactCta, JsonLd } from "@/components/seo/PageShell";
import { absoluteUrl, BUSINESS_NAME, SITE_URL } from "@/lib/seo";

const title = "คำนวณ BTU แอร์ ห้องขนาดนี้ใช้แอร์กี่ BTU? พร้อมตารางและวิธีเลือก";
const description =
  "คำนวณ BTU แอร์ออนไลน์ ใส่ขนาดกว้าง ยาว สูงของห้อง รู้ทันทีว่าควรใช้แอร์กี่ BTU พร้อมตาราง BTU ตามขนาดห้อง 3x4 4x4 4x5 ปัจจัยที่ต้องเพิ่ม BTU เลือกอินเวอร์เตอร์หรือธรรมดา และวิธีประมาณค่าไฟแอร์";

const LOAD = { shade: BASE_LOAD.none, partial: BASE_LOAD.morning, sun: BASE_LOAD.afternoon };
const fmt = fmtBtu;
const calc = baseBtu;
const roundUp = roundUpBtu;

const ROOMS: [number, number, string][] = [
  [3, 3, "ห้องนอนเล็ก / ห้องทำงาน"],
  [3, 4, "ห้องนอนทั่วไป"],
  [3.5, 4, "ห้องนอนคอนโด"],
  [4, 4, "ห้องนอนใหญ่"],
  [4, 5, "ห้องนอนมาสเตอร์"],
  [5, 5, "ห้องนั่งเล่น"],
  [5, 6, "ห้องนั่งเล่นใหญ่"],
  [6, 6, "ห้องโถง / ร้านค้าเล็ก"],
];

const EXTRA_FACTORS = [
  ["คนในห้องเกิน 2 คน", "เพิ่มประมาณ 600 BTU ต่อคน"],
  ["ห้องชั้นบนสุด / ใต้หลังคา", "เพิ่มประมาณ 10–20%"],
  ["ผนังหรือกระจกรับแดดบ่ายฝั่งตะวันตก", "เพิ่มประมาณ 10–15%"],
  ["เพดานสูงกว่า 3 เมตร", "ใส่ความสูงจริงในเครื่องคำนวณ"],
  ["ห้องที่มีครัว / เตา / เครื่องใช้ไฟฟ้าร้อน", "เพิ่มประมาณ 3,000–4,000 BTU"],
  ["คอมพิวเตอร์ / ทีวีจอใหญ่ / เครื่องเกม", "เพิ่มประมาณ 300–500 BTU ต่อเครื่อง"],
  ["ห้องเปิดโล่งเชื่อมต่อห้องอื่น ไม่มีประตูกั้น", "คิดพื้นที่รวมทั้งหมด"],
];

const faq = [
  { q: "ห้อง 3x4 เมตร ใช้แอร์กี่ BTU?", a: "ห้อง 12 ตร.ม. เพดานสูงประมาณ 3 เมตร ใช้ประมาณ 10,200–12,600 BTU แนะนำแอร์ 12,000 BTU ถ้าห้องโดนแดดมากหรือมีคนเยอะ อาจขยับเป็น 13,000 BTU" },
  { q: "ห้อง 4x4 เมตร ใช้แอร์กี่ BTU?", a: "ห้อง 16 ตร.ม. ใช้ประมาณ 13,600–16,800 BTU แนะนำแอร์ 15,000 BTU สำหรับห้องไม่โดนแดด หรือ 18,000 BTU สำหรับห้องที่โดนแดดมาก" },
  { q: "เลือกแอร์ BTU ใหญ่เกินไปได้ไหม?", a: "ไม่ควรใหญ่เกินมาก เพราะราคาเครื่องสูงขึ้น และแอร์ระบบธรรมดาจะตัดบ่อยจนห้องชื้นและเย็นไม่สม่ำเสมอ แต่ควรปัดขึ้นจากค่าที่คำนวณได้เป็นขนาดถัดไปเสมอ" },
  { q: "เลือกแอร์ BTU เล็กเกินไปจะเป็นอย่างไร?", a: "คอมเพรสเซอร์จะทำงานหนักตลอดเวลา ห้องเย็นไม่ถึงอุณหภูมิที่ตั้ง กินไฟมาก และอายุการใช้งานสั้นลง" },
  { q: "แอร์อินเวอร์เตอร์ต้องเลือก BTU ต่างจากแอร์ธรรมดาไหม?", a: "ใช้หลักคำนวณเดียวกัน แต่แอร์อินเวอร์เตอร์ปรับรอบได้ จึงยืดหยุ่นกว่าเมื่อเลือกขนาดใหญ่ขึ้นเล็กน้อย" },
  { q: "ตั้งแอร์กี่องศาประหยัดไฟที่สุด?", a: "แนะนำตั้ง 25–26 องศา ร่วมกับเปิดพัดลม ทุก 1 องศาที่ตั้งสูงขึ้นช่วยลดการทำงานของคอมเพรสเซอร์ได้" },
  { q: "แอร์เก่าเย็นไม่พอ ต้องเปลี่ยนเครื่องใหญ่ขึ้นเลยไหม?", a: "ไม่เสมอไป ควรล้างแอร์และตรวจเช็คน้ำยาก่อน เพราะแอร์ที่สกปรกหรือน้ำยาขาดจะเย็นน้อยลงมากแม้ BTU จะพอดีกับห้อง" },
];

export const metadata: Metadata = {
  title,
  description,
  keywords: ["คำนวณ btu แอร์", "แอร์กี่ btu", "ตาราง btu แอร์", "ห้อง 3x4 ใช้แอร์กี่ btu", "เลือกแอร์", "btu คืออะไร"],
  alternates: { canonical: "/btu-calculator" },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "/btu-calculator",
    siteName: BUSINESS_NAME,
    title,
    description,
    images: [{ url: absoluteUrl("/slide_images/002.png"), width: 602, height: 268, alt: "คำนวณ BTU แอร์ พลประกาย แอร์ เซอร์วิส" }],
  },
  twitter: { card: "summary_large_image", title, description, images: [absoluteUrl("/slide_images/002.png")] },
};

const H2 = ({ children }: { children: React.ReactNode }) => <h2 className="text-[24px] font-bold">{children}</h2>;
const th = "p-[8px_10px] text-left text-blue-1 border-b border-text/30";
const td = "p-[8px_10px] border-b border-text/15";

export default function BtuPage() {
  const url = absoluteUrl("/btu-calculator");
  return (
    <PageShell crumbs={[{ name: "คำนวณ BTU", href: "/btu-calculator" }]}>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "คำนวณ BTU แอร์",
            url,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "All",
            inLanguage: "th",
            offers: { "@type": "Offer", price: "0", priceCurrency: "THB" },
            provider: { "@id": `${SITE_URL}/#local-business` },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "หน้าแรก", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "คำนวณ BTU", item: url },
            ],
          },
        ]}
      />

      <h1 className="text-[34px] font-bold text-blue-2 leading-tight max-[480px]:text-[26px]">คำนวณ BTU แอร์ ห้องของคุณควรใช้แอร์กี่ BTU</h1>
      <p className="mt-[16px] text-[17px] leading-relaxed">
        ใส่ความกว้าง ความยาว และความสูงของห้อง แล้วเลือกว่าห้องโดนแดดมากน้อยแค่ไหน ระบบจะคำนวณขนาด BTU ที่แนะนำให้ทันที
        ด้านล่างมีตาราง BTU ตามขนาดห้องยอดนิยม ปัจจัยที่ต้องเพิ่ม BTU และวิธีเลือกแอร์ให้ประหยัดไฟ
      </p>

      {/* <section className="mt-[30px] flex justify-between">
        <div className="grow-1">
          <h3 className="mt-[24px] text-[18px] font-bold">ตาราง BTU แบบคร่าวๆ ตามพื้นที่</h3>
          <div className="mt-[8px]"><BtuTable /></div>
        </div>
        <div>
          <Btucal />
        </div>
      </section> */}

      <section id="calculator" className={`
            mt-[20px] flex items-center gap-[20px] scroll-mt-[140px]
            max-[1005px]:flex-col    
        `}>
            <div>
              <h3 className="text-[18px] font-bold mb-[24px]">ตาราง BTU แบบคร่าวๆ ตามพื้นที่</h3>
              <BtuTable/> 
            </div>
            <div className="grow-1 flex justify-center">
                <Btucal/>
            </div>
      </section>

      <nav aria-label="สารบัญ" className="flex justify-around mt-[30px] p-[16px_20px] rounded-[12px] border border-text/15 max-[500px]:flex-col">
        <ul className="text-blue-2 max-[600px]:grid-cols-1">
          <li><a href="#what-is-btu" className="hover:underline">BTU คืออะไร</a></li>
          <li><a href="#room-size" className="hover:underline">ตาราง BTU ตามขนาดห้อง</a></li>
          <li><a href="#formula" className="hover:underline">สูตรคำนวณและตัวอย่าง</a></li>
          <li><a href="#factors" className="hover:underline">ปัจจัยที่ต้องเพิ่ม BTU</a></li>
        </ul>
        <ul className="text-blue-2 max-[600px]:grid-cols-1">
          <li><a href="#wrong-size" className="hover:underline">BTU มาก/น้อยเกินไปเป็นอย่างไร</a></li>
          <li><a href="#inverter" className="hover:underline">อินเวอร์เตอร์ vs ธรรมดา</a></li>
          <li><a href="#electricity" className="hover:underline">ประมาณค่าไฟแอร์</a></li>
          <li><a href="#tips" className="hover:underline">เคล็ดลับติดตั้งและใช้งาน</a></li>
        </ul>
      </nav>

      <section id="what-is-btu" className="mt-[40px] scroll-mt-[140px]">
        <H2>BTU คืออะไร?</H2>
        <p className="mt-[12px] leading-relaxed">
          BTU (British Thermal Unit) คือหน่วยวัดความร้อน แอร์ขนาด 12,000 BTU หมายถึงแอร์ที่ดึงความร้อนออกจากห้องได้ 12,000 BTU ต่อชั่วโมง
          (12,000 BTU เท่ากับ 1 ตันความเย็น) ยิ่ง BTU สูงยิ่งทำความเย็นได้มาก แต่ก็ใช้ไฟมากขึ้นและราคาสูงขึ้น
          จึงควรเลือกให้พอดีกับห้อง ไม่ใช่เลือกใหญ่ที่สุด
        </p>
      </section>

      <section id="room-size" className="mt-[40px] scroll-mt-[140px]">
        <H2>ตาราง BTU แอร์ตามขนาดห้องยอดนิยม</H2>
        <p className="mt-[8px] text-[14px] text-text/70">คำนวณที่เพดานสูง 3 เมตร และปัดขึ้นเป็นขนาดแอร์ที่มีขายทั่วไป</p>
        <div className="mt-[12px] overflow-x-auto">
          <table className="w-full min-w-[560px] text-[15px]">
            <thead>
              <tr>
                <th className={th}>ขนาดห้อง</th>
                <th className={th}>ลักษณะห้อง</th>
                <th className={th}>ไม่โดนแดด</th>
                <th className={th}>โดนแดดน้อย</th>
                <th className={th}>โดนแดดมาก</th>
              </tr>
            </thead>
            <tbody>
              {ROOMS.map(([w, l, label]) => (
                <tr key={`${w}x${l}`}>
                  <td className={td}>{w}×{l} ม. ({w * l} ตร.ม.)</td>
                  <td className={td}>{label}</td>
                  {[LOAD.shade, LOAD.partial, LOAD.sun].map((load) => (
                    <td key={load} className={`${td} font-bold`}>{fmt(roundUp(calc(w, l, load)))}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-[10px] text-[14px]">
          ห้องที่ต้องใช้เกิน 36,000 BTU เช่น ออฟฟิศหรือร้านค้าขนาดใหญ่ แนะนำแอร์แบบแขวนหรือสี่ทิศทาง หรือแบ่งติดตั้ง 2 เครื่อง เพื่อให้ลมเย็นกระจายทั่วถึง
        </p>
      </section>

      <section id="formula" className="mt-[40px] scroll-mt-[140px]">
        <H2>สูตรคำนวณ BTU แอร์ พร้อมตัวอย่าง</H2>
        <p className="mt-[12px] p-[14px_18px] rounded-[8px] bg-blue-2/5 font-bold">
          BTU = กว้าง × ยาว × (ความสูงเพดาน ÷ 3) × ค่าภาระความร้อน
        </p>
        <ul className="mt-[12px] list-disc pl-[24px] space-y-[4px]">
          <li>ห้องไม่โดนแดด (ห้องที่มีร่มเงา ห้องฝั่งทิศเหนือ): ใช้ค่า {fmt(LOAD.shade)}</li>
          <li>ห้องโดนแดดน้อย (โดนแดดช่วงเช้า): ใช้ค่า {fmt(LOAD.partial)}</li>
          <li>ห้องโดนแดดมาก (โดนแดดบ่าย ชั้นบนสุด กระจกเยอะ): ใช้ค่า {fmt(LOAD.sun)}</li>
        </ul>
        <div className="mt-[16px] p-[16px_20px] rounded-[12px] border border-text/15 leading-relaxed">
          <p className="font-bold">ตัวอย่าง: ห้องนอน 3 × 4 เมตร สูง 3 เมตร โดนแดดน้อย</p>
          <p className="mt-[6px]">3 × 4 × (3 ÷ 3) × {fmt(LOAD.partial)} = {fmt(calc(3, 4, LOAD.partial))} BTU</p>
          <p>ปัดขึ้นเป็นขนาดที่มีขาย → <b>แนะนำแอร์ {fmt(roundUp(calc(3, 4, LOAD.partial)))} BTU</b></p>
        </div>
      </section>

      <section id="factors" className="mt-[40px] scroll-mt-[140px]">
        <H2>ปัจจัยที่ทำให้ต้องเพิ่ม BTU</H2>
        <p className="mt-[8px]">สูตรด้านบนคิดจากห้องทั่วไปที่มีคน 1–2 คน ถ้าห้องของคุณมีลักษณะต่อไปนี้ ควรเพิ่ม BTU โดยประมาณ</p>
        <div className="mt-[12px] overflow-x-auto">
          <table className="w-full min-w-[480px] text-[15px]">
            <thead><tr><th className={th}>ลักษณะห้อง</th><th className={th}>ควรเพิ่ม</th></tr></thead>
            <tbody>
              {EXTRA_FACTORS.map(([k, v]) => (
                <tr key={k}><td className={td}>{k}</td><td className={td}>{v}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="wrong-size" className="mt-[40px] scroll-mt-[140px]">
        <H2>เลือก BTU ไม่พอดีกับห้อง เกิดอะไรขึ้น?</H2>
        <div className="mt-[12px] grid grid-cols-2 gap-[16px] max-[640px]:grid-cols-1">
          <div className="p-[16px_20px] rounded-[12px] border border-yellow-200 bg-yellow-50/50">
            <p className="font-bold text-yellow-700">BTU น้อยเกินไป</p>
            <ul className="mt-[8px] list-disc pl-[20px] space-y-[4px]">
              <li>ห้องเย็นช้า หรือไม่เย็นถึงอุณหภูมิที่ตั้ง</li>
              <li>คอมเพรสเซอร์ทำงานไม่หยุด ค่าไฟสูง</li>
              <li>เครื่องทำงานหนัก เสียเร็ว อายุสั้น</li>
            </ul>
          </div>
          <div className="p-[16px_20px] rounded-[12px] border border-red-200 bg-red-50/50">
            <p className="font-bold text-red-600">BTU มากเกินไป</p>
            <ul className="mt-[8px] list-disc pl-[20px] space-y-[4px]">
              <li>ราคาเครื่องและค่าติดตั้งแพงขึ้นโดยไม่จำเป็น</li>
              <li>แอร์ธรรมดาตัด-ต่อบ่อย ห้องเย็นไม่สม่ำเสมอ</li>
              <li>ดึงความชื้นออกได้ไม่ดี ห้องรู้สึกอับชื้น</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="inverter" className="mt-[40px] scroll-mt-[140px]">
        <H2>แอร์อินเวอร์เตอร์ vs แอร์ธรรมดา เลือกแบบไหนดี?</H2>
        <div className="mt-[12px] overflow-x-auto">
          <table className="w-full min-w-[520px] text-[15px]">
            <thead><tr><th className={th}></th><th className={th}>อินเวอร์เตอร์ (Inverter)</th><th className={th}>ธรรมดา (Fixed Speed)</th></tr></thead>
            <tbody>
              <tr><td className={td}>การทำงาน</td><td className={td}>ปรับรอบคอมเพรสเซอร์ตามความร้อนในห้อง</td><td className={td}>เปิด-ตัดคอมเพรสเซอร์เป็นช่วงๆ</td></tr>
              <tr><td className={td}>ค่าไฟ</td><td className={td}>ประหยัดกว่า เมื่อเปิดใช้งานนานต่อเนื่อง</td><td className={td}>สูงกว่าเมื่อเปิดนาน</td></tr>
              <tr><td className={td}>ความเย็น</td><td className={td}>อุณหภูมิคงที่ เงียบกว่า</td><td className={td}>อุณหภูมิแกว่งขึ้นลง</td></tr>
              <tr><td className={td}>ราคาเครื่อง</td><td className={td}>สูงกว่า</td><td className={td}>ถูกกว่า</td></tr>
              <tr><td className={td}>เหมาะกับ</td><td className={td}>เปิดวันละหลายชั่วโมง ห้องนอน ห้องทำงาน</td><td className={td}>เปิดไม่บ่อย หรือเปิดช่วงสั้นๆ</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-[12px] leading-relaxed">
          เวลาเลือกซื้อ ให้ดูฉลากประหยัดไฟเบอร์ 5 และค่า <b>SEER</b> บนฉลากประกอบ ค่า SEER ยิ่งสูงยิ่งประหยัดไฟ
          ถ้าเปิดแอร์ทุกวัน ส่วนต่างค่าไฟระยะยาวมักคุ้มกับราคาเครื่องที่สูงกว่า
        </p>
      </section>

      <section id="electricity" className="mt-[40px] scroll-mt-[140px]">
        <H2>วิธีประมาณค่าไฟแอร์ต่อเดือน</H2>
        <p className="mt-[12px] p-[14px_18px] rounded-[8px] bg-blue-2/5 font-bold">
          ค่าไฟ/เดือน ≈ (กำลังไฟ วัตต์ ÷ 1,000) × ชั่วโมงที่เปิดต่อวัน × 30 วัน × ค่าไฟต่อหน่วย
        </p>
        <div className="mt-[16px] p-[16px_20px] rounded-[12px] border border-text/15 leading-relaxed">
          <p className="font-bold">ตัวอย่าง: แอร์ 12,000 BTU กำลังไฟประมาณ 1,000 วัตต์ เปิดวันละ 8 ชั่วโมง</p>
          <p className="mt-[6px]">1 × 8 × 30 = 240 หน่วย × 4.20 บาท ≈ <b>1,008 บาท/เดือน</b> (กรณีคอมเพรสเซอร์ทำงานเต็มกำลังตลอด)</p>
          <p className="mt-[6px] text-[14px] text-text/70">
            ค่าจริงมักต่ำกว่านี้ เพราะคอมเพรสเซอร์ไม่ได้ทำงานเต็มกำลังตลอดเวลา โดยเฉพาะแอร์อินเวอร์เตอร์
            ดูกำลังไฟจริงได้จากฉลากหรือสเปกของรุ่น และค่าไฟต่อหน่วยจากบิลค่าไฟของคุณ
          </p>
        </div>
      </section>

      <section id="tips" className="mt-[40px] scroll-mt-[140px]">
        <H2>เคล็ดลับติดตั้งและใช้แอร์ให้เย็นและประหยัดไฟ</H2>
        <ul className="mt-[12px] space-y-[8px]">
          {[
            "ติดตั้งคอยล์เย็นให้ลมกระจายทั่วห้อง ไม่เป่าตรงหัวเตียง และไม่มีสิ่งกีดขวางหน้าเครื่อง",
            "วางคอยล์ร้อนในที่อากาศถ่ายเท ไม่โดนแดดจัดตลอดวัน และเว้นระยะด้านหลังให้ระบายความร้อนได้",
            "ปิดประตูหน้าต่างให้สนิท และใช้ม่านกันแดดในห้องที่โดนแดดบ่าย",
            "ตั้งอุณหภูมิ 25–26 องศา และเปิดพัดลมช่วยกระจายความเย็น",
            "ล้างแผ่นกรองเองทุก 2–4 สัปดาห์ และล้างแอร์ใหญ่ทุก 4–6 เดือน",
          ].map((t) => (
            <li key={t} className="flex gap-2"><span className="text-green">✓</span>{t}</li>
          ))}
        </ul>
        <p className="mt-[12px]">
          แอร์ที่สกปรกหรือน้ำยาขาดจะเย็นน้อยลงแม้ BTU จะพอดี ดูบริการ <Link href="/services/air-cleaning" className="text-blue-2 underline">ล้างแอร์ชลบุรี</Link> และ{" "}
          <Link href="/services/refrigerant-check" className="text-blue-2 underline">ตรวจเช็คน้ำยาแอร์</Link>
        </p>
      </section>

      <section className="mt-[40px]">
        <H2>คำถามที่พบบ่อย</H2>
        <div className="mt-[12px] space-y-[10px]">
          {faq.map((f) => (
            <details key={f.q} className="border border-text/20 rounded-[8px] p-[12px_16px]">
              <summary className="font-bold cursor-pointer">{f.q}</summary>
              <p className="mt-[8px]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-[40px] p-[24px] rounded-[12px] bg-blue-2/5">
        <h2 className="text-[22px] font-bold">ไม่แน่ใจว่าควรใช้กี่ BTU? ให้ช่างช่วยประเมินฟรี</h2>
        <p className="mt-[8px] mb-[16px]">
          ส่งขนาดห้องหรือรูปห้องมาทาง LINE ช่างช่วยแนะนำขนาดและรุ่นที่เหมาะสม พร้อม{" "}
          <Link href="/services/air-installation" className="text-blue-2 underline">บริการขายและติดตั้งแอร์ในชลบุรี</Link>{" "}
          หรือดู <Link href="/#air-ready" className="text-blue-2 underline">แอร์พร้อมติดตั้ง</Link>
        </p>
        <ContactCta />
      </section>
    </PageShell>
  );
}
