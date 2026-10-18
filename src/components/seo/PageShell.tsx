import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Chat from "@/components/icons/Chat";
import Phone from "@/components/icons/Phone";
import { LINE_ID, PHONE_DISPLAY } from "@/lib/seo";

type Crumb = { name: string; href: string };

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function ContactCta() {
  return (
    <div className="flex gap-3 flex-wrap max-[430px]:flex-col max-[430px]:items-center">
      <a
        href={`https://line.me/R/ti/p/${LINE_ID}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-green w-[200px] p-[8px_10px] rounded-[6px] hover:bg-green/90"
      >
        <Chat color="white" />
        <span className="text-white font-bold">ปรึกษาผ่าน LINE</span>
      </a>
      <a
        href={`tel:${PHONE_DISPLAY.replace(/-/g, "")}`}
        className="flex items-center justify-center gap-1 outline-2 outline-text/50 w-[200px] p-[8px_10px] rounded-[6px] hover:bg-black/5"
      >
        <Phone color="var(--text)" />
        <span className="font-bold">โทร {PHONE_DISPLAY}</span>
      </a>
    </div>
  );
}

export default function PageShell({ crumbs, children }: { crumbs: Crumb[]; children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1 w-full pt-[150px] px-[20px] pb-[50px] max-w-[1440px] mx-auto max-[420px]:pt-[90px]">
        <nav aria-label="breadcrumb" className="text-[14px] mb-[20px] text-text/70">
          <Link href="/" className="hover:underline">หน้าแรก</Link>
          {crumbs.map((c) => (
            <span key={c.href}>
              {" › "}
              <Link href={c.href} className="hover:underline">{c.name}</Link>
            </span>
          ))}
        </nav>
        {children}
      </main>
      <div id="contact-us" className="mt-[50px]">
        <Footer />
      </div>
    </div>
  );
}
