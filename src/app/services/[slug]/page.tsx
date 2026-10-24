import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell, { ContactCta, JsonLd } from "@/components/seo/PageShell";
import { getService, SERVICES } from "@/lib/services";
import { lastmodOf } from "@/lib/lastmod";
import { absoluteUrl, BUSINESS_NAME, SERVICE_AREAS, SITE_URL } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  const url = `/services/${service.slug}`;
  return {
    title: service.title,
    description: service.description,
    keywords: service.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "th_TH",
      url,
      siteName: BUSINESS_NAME,
      title: service.title,
      description: service.description,
      images: [absoluteUrl(service.image)],
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();
  const url = absoluteUrl(`/services/${service.slug}`);
  const others = SERVICES.filter((s) => s.slug !== service.slug);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.name,
      dateModified: lastmodOf(`/services/${service.slug}`),
      serviceType: service.name,
      description: service.description,
      url,
      image: absoluteUrl(service.image),
      provider: { "@id": `${SITE_URL}/#local-business` },
      areaServed: SERVICE_AREAS.map((name) => ({ "@type": "Place", name })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: service.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "หน้าแรก", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: service.name, item: url },
      ],
    },
  ];

  return (
    <PageShell crumbs={[{ name: service.name, href: `/services/${service.slug}` }]}>
      <JsonLd data={jsonLd} />
      <article>
        <h1 className="text-[34px] font-bold text-blue-2 leading-tight max-[480px]:text-[26px]">{service.h1}</h1>
        <p className="mt-[8px] text-yellow-600">ช่างผ่านการทดสอบมาตรฐานฝีมือแรงงานแห่งชาติ สาขาช่างเครื่องปรับอากาศ และช่างไฟฟ้าภายในอาคาร</p>
        <div className="mt-[20px] space-y-[12px] text-[17px] leading-relaxed">
          {service.intro.map((p) => <p key={p}>{p}</p>)}
        </div>
        <div className="mt-[20px]"><ContactCta /></div>

        <Image
          src={service.image}
          alt={`${service.name}ชลบุรี ผลงาน${BUSINESS_NAME}`}
          width={960}
          height={540}
          sizes="(max-width: 960px) 100vw, 960px"
          className="mt-[30px] w-full h-auto max-h-[650px] object-cover rounded-[12px]"
        />

        <section className="mt-[40px]">
          <h2 className="text-[24px] font-bold">บริการ{service.name}ของเรามีอะไรบ้าง</h2>
          <ul className="mt-[12px] space-y-[8px]">
            {service.includes.map((i) => (
              <li key={i} className="flex gap-2"><span className="text-green">✓</span>{i}</li>
            ))}
          </ul>
        </section>

        {service.signs && (
          <section className="mt-[40px]">
            <h2 className="text-[24px] font-bold">{service.signs.heading}</h2>
            <ul className="mt-[12px] list-disc pl-[24px] space-y-[6px]">
              {service.signs.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </section>
        )}

        <section className="mt-[40px]">
          <h2 className="text-[24px] font-bold">ขั้นตอนการใช้บริการ</h2>
          <ol className="mt-[12px] list-decimal pl-[24px] space-y-[6px]">
            {service.steps.map((s) => <li key={s}>{s}</li>)}
          </ol>
        </section>

        <section className="mt-[40px]">
          <h2 className="text-[24px] font-bold">พื้นที่ให้บริการ{service.name}</h2>
          <p className="mt-[12px]">{SERVICE_AREAS.join(" · ")} จังหวัดชลบุรี</p>
        </section>

        <section className="mt-[40px]">
          <h2 className="text-[24px] font-bold">คำถามที่พบบ่อยเกี่ยวกับ{service.name}</h2>
          <div className="mt-[12px] space-y-[10px]">
            {service.faq.map((f) => (
              <details key={f.q} className="border border-text/20 rounded-[8px] p-[12px_16px]">
                <summary className="font-bold cursor-pointer">{f.q}</summary>
                <p className="mt-[8px]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-[40px] p-[24px] rounded-[12px] bg-blue-2/5">
          <h2 className="text-[22px] font-bold">สนใจ{service.name} ติดต่อ{BUSINESS_NAME}</h2>
          <p className="mt-[8px] mb-[16px]">แจ้งรายละเอียดหรือส่งรูปหน้างานทาง LINE เพื่อประเมินราคาได้เลย</p>
          <ContactCta />
        </section>

        <section className="mt-[40px]">
          <h2 className="text-[22px] font-bold">บริการอื่นๆ</h2>
          <div className="mt-[12px] flex flex-wrap gap-[10px]">
            {others.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="p-[8px_18px] border border-text/20 rounded-[30px] text-blue-2 hover:bg-blue-2/5">
                {s.name}ชลบุรี
              </Link>
            ))}
            <Link href="/btu-calculator" className="p-[8px_18px] border border-text/20 rounded-[30px] text-blue-2 hover:bg-blue-2/5">คำนวณ BTU แอร์</Link>
          </div>
        </section>
      </article>
    </PageShell>
  );
}
