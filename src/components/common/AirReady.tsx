"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import ImageGallery from "react-image-gallery";
import type { ImageGalleryRef } from "react-image-gallery";
import "react-image-gallery/styles/image-gallery.css";
import {
  getCatalogFilters,
  getCatalogPage,
  type CatalogFilters,
  type CatalogItem,
  type CatalogPage,
  type CatalogParams,
} from "@/features/air/service";
import { formatWarranty } from "@/lib/utils/formatWarranty";
import { getDiscountPercent } from "@/lib/utils/airPricing";
import ChevronLeft from "../icons/ChevronLeft";
import ChevronRight from "../icons/ChevronRight";
import Chat from "../icons/Chat";

const leftNavClass =
    "absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center text-[20px] transition-colors cursor-pointer disabled:opacity-30";

const rightNavClass =
  "absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center text-[20px] transition-colors cursor-pointer disabled:opacity-30";
const numberFormat = new Intl.NumberFormat("th-TH");
const priceFormat = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

function columnCount() {
  if (window.innerWidth >= 1280) return 4;
  if (window.innerWidth >= 768) return 3;
  if (window.innerWidth >= 640) return 2;
  return 1;
}

function ProductImage({ item, src = item.imageUrl }: { item: CatalogItem; src?: string }) {
  const [failed, setFailed] = useState(false);

  return failed ? (
    <div className="flex h-full items-center justify-center bg-[#f5f7f8] px-5 text-center text-sm font-bold text-[#75818a]">
      {item.brandName}
    </div>
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`${item.brandName} ${item.name}`}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-full w-full object-contain"
    />
  );
}

function BrandLogo({ item }: { item: CatalogItem }) {
  const [failed, setFailed] = useState(false);
  let logoUrl = item.brandImageUrl;

  try {
    const url = new URL(logoUrl);
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
      logoUrl = `${url.pathname}${url.search}`;
    }
  } catch {
    // Relative storage URLs already point to the current site.
  }

  return failed || !item.brandImageUrl ? (
    <span>
      {item.brandName}
    </span>
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoUrl}
      alt={`โลโก้ ${item.brandName}`}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="w-full h-full object-contain"
    />
  );
}

function ProductCard({ item, onOpen }: { item: CatalogItem; onOpen: () => void }) {
  const hasDiscount = item.priceDefault > item.priceInstall && item.priceDefault > 0;
  const discount = hasDiscount
    ? Number(getDiscountPercent(item.priceDefault.toFixed(2), item.priceInstall.toFixed(2)))
    : 0;
  const displayDiscount = Math.trunc(discount);

  return (
    <article className="relative">
      <p className={`
        absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden w-full font-bold text-white text-[20px] p-[5px_10px] text-center z-1 bg-gray-500/90
        ${item.isOutOfStock ? "!block":item.stock <= 0 && "!block"}
        `}>
        สินค้าหมด
      </p>
      <div className={`${item.isOutOfStock ? "grayscale":item.stock <= 0 && "grayscale"}`}>
        <div className="relative flex min-w-0 h-[400px] flex-col p-4 overflow-hidden rounded-[8px] border-2 border-[#dedede] text-[#373737] transition-colors hover:border-[#75a4bd]">
          <div
            aria-hidden="true"
            className={`
                absolute left-0 top-0 -z-1 w-full h-[500px]
            `}
            style={{
                backgroundImage: "url('/wave_background_pattern.svg')",
                backgroundPosition: "center",
                backgroundSize: "cover",
                opacity: "0.5"
            }}
          />
          <span 
            className={`
              absolute z-1 p-[5px] left-0 top-0 block border w-[80px] h-[40px] bg-[#dedede]/60 border-transparent border-b-[#dedede] border-r-[#dedede]
              ${!item.isSaveElectricity && "rounded-br-[8px]"}
            `}>
            <BrandLogo item={item} />
          </span>
          {item.isSaveElectricity &&
            <span className="absolute z-1 p-[5px] left-0 top-[40px] block border w-[80px] h-[40px] bg-[#dedede]/60 border-transparent border-b-[#dedede] border-r-[#dedede] rounded-br-[8px]">
              <img
                src={"/logo/number5.png"}
                alt={`โลโก้ ประหยัดไฟเบอร์ 5`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain"
              />
            </span>
          }
          {displayDiscount > 0 &&
            <div className={`border border-transparent border-b-[#dedede] border-l-[#dedede] bg-yellow-400 absolute z-1 p-[5px] right-0 top-0 block w-[72px] h-[40px] text-center text-white rounded-bl-[8px]`}>
              <p className="text-[14px] mt-[-6px]">ลด</p>
              <p className="mt-[-5px] font-bold">{displayDiscount}%</p>
            </div>
          }
          <div className="relative h-[45%] shrink-0 mb-3 overflow-hidden">
            <ProductImage item={item} />
            {/* <div className="absolute left-0 top-2 flex max-w-[60%] flex-col items-start gap-1 text-xs font-bold text-white">
              <span className="max-w-full bg-[#78aa22] px-1.5 py-1">พร้อมติดตั้ง</span>
              {item.isSaveElectricity && <span className="max-w-full bg-[#f28b00] px-1.5 py-1">ประหยัดไฟ</span>}
            </div> */}
            {/* {discount > 0 && (
              <span className="absolute right-2 top-2 rounded-[3px] bg-[#f00] px-2 py-1 text-base font-bold text-white">
                -{discount}%
              </span>
            )} */}
          </div>
          <div className="flex min-h-0 flex-1 flex-col items-center text-center">
            <h3 title={item.name} className="w-full line-clamp-2 text-[18px] font-bold leading-[1.35] [overflow-wrap:anywhere]">
              {item.name}
            </h3>
            <p className="mt-3 max-w-full text-base font-bold text-[#3988c2] font-bold">SKU : {item.modelCode}</p>
            <p className="mt-1 max-w-full text-sm text-[#3988c2] font-black">
              {item.systemName} · {numberFormat.format(item.btu)} BTU
            </p>
            <p className="mt-[15px] font-bold">พร้อมติดตั้ง</p>
            <div className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0">
              {hasDiscount && (
                <span className="text-[15px] font-semibold text-red-500 line-through">
                  {priceFormat.format(item.priceDefault)}
                </span>
              )}
              <span className="text-[21px] font-bold text-green">
                {priceFormat.format(item.priceInstall)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpen}
            aria-label={`ดูรายละเอียด ${item.name}`}
            className="absolute inset-0 z-10 cursor-pointer rounded-[8px] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#327db4]"
          />
        </div>
      </div>
    </article>
  );
}

function ProductDetail({ item, onClose }: { item: CatalogItem; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const galleryRef = useRef<ImageGalleryRef>(null);
  const [showLineQr, setShowLineQr] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const imageUrls = useMemo(
    () => item.imageUrls.length ? item.imageUrls : [item.imageUrl],
    [item.imageUrls, item.imageUrl],
  );
  const galleryItems = useMemo(
    () => imageUrls.map((url) => ({ original: url })),
    [imageUrls],
  );
  const hasDiscount = item.priceDefault > item.priceInstall && item.priceDefault > 0;
  const warranties = [
    ["รับประกันงานติดตั้ง", item.installWarranty],
    ["รับประกันคอมเพรสเซอร์", item.compressorWarranty],
    ["รับประกันอะไหล่", item.sparePartWarranty],
  ] as const;

  const message = [
    `สนใจแอร์ ${item.name}`,
    `รหัสรุ่น: ${item.modelCode}`,
    `ขนาด: ${item.btu.toLocaleString()} BTU`,
    `ราคาพร้อมติดตั้ง: ${item.priceInstall.toLocaleString()} บาท`,
  ].join("\n");
  const lineUrl = `https://line.me/R/oaMessage/${encodeURIComponent("@064pjnra")}/?${encodeURIComponent(message)}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="air-detail-title"
      onClose={onClose}
      onCancel={(event) => {
        if (showLineQr) {
          event.preventDefault();
          setShowLineQr(false);
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
      className="fixed inset-0 m-auto flex h-[90dvh] max-h-[90dvh] w-[min(94vw,880px)] flex-col overflow-hidden rounded-[8px] border border-[#d8e1e5] bg-white p-0 text-[#26323b] shadow-xl backdrop:bg-black/60"
    >
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#e1e6e9] bg-white px-5 py-3">
        <span className="flex h-8 w-28 items-center"><BrandLogo item={item} /></span>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="ปิดรายละเอียด"
          className="flex size-9 shrink-0 items-center justify-center rounded-[4px] text-2xl leading-none text-[#52616c] hover:bg-[#eef2f4] focus-visible:outline-2 focus-visible:outline-[#327db4]"
        >
          ×
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain md:grid md:grid-cols-2 md:gap-8 md:overflow-hidden">
        <div className="mb-6 min-w-0 p-5 md:pr-0 md:mb-0">
          <div className="relative w-full h-[200px] overflow-hidden rounded-[4px] md:aspect-square [&_.image-gallery]:h-full [&_.image-gallery-content]:h-full [&_.image-gallery-slide-wrapper]:h-full [&_.image-gallery-swipe]:h-full [&_.image-gallery-slides]:h-full [&_.image-gallery-slides-container]:h-full [&_.image-gallery-slide]:h-full">
            <ImageGallery
              ref={galleryRef}
              items={galleryItems}
              showPlayButton={false}
              showFullscreenButton={false}
              showThumbnails={false}
              autoPlay={false}
              onBeforeSlide={setActiveImage}
              renderItem={(galleryItem) => <ProductImage item={item} src={galleryItem.original} />}
              renderLeftNav={(onClick, disabled) => (
                <button
                    type="button"
                    aria-label="รูปก่อนหน้า"
                    disabled={disabled}
                    onClick={(event) => {
                        
                        onClick(event);
                    }}
                    className={leftNavClass}
                >
                  <ChevronLeft color="white"/>
                </button>
              )}
              renderRightNav={(onClick, disabled) => (
                <button
                    type="button"
                    aria-label="รูปถัดไป"
                    disabled={disabled}
                    onClick={(event) => {
                        onClick(event);
                    }}
                    className={rightNavClass}
                >
                  <ChevronRight color="white"/>
                </button>
              )}
            />
          </div>
          {imageUrls.length > 1 && (
            <div className="mt-3 flex justify-center flex gap-2 overflow-x-auto pb-1" aria-label="รูปสินค้า">
              {imageUrls.map((url, index) => (
                <button key={`${url}-${index}`} type="button" onClick={() => galleryRef.current?.slideToIndex(index)} aria-label={`ดูรูปที่ ${index + 1}`} aria-pressed={index === activeImage} className={`size-14 shrink-0 overflow-hidden rounded-[4px] border-2 bg-white ${index === activeImage ? "border-[#327db4]" : "border-[#d8e1e5]"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" loading="lazy" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="min-w-0 md:min-h-0 md:overflow-y-auto md:overscroll-contain p-5 md:pl-0">
          <div>
            <p className="text-sm font-semibold text-[#3988c2]">{item.brandName} · {item.systemName}</p>
            <p className="text-[20px] text-red-500 font-bold">
              {item.isOutOfStock ? "สินค้าหมด":item.stock <= 0 && "สินค้าหมด"}
            </p>
          </div>
          <h2 id="air-detail-title" className="mt-2 text-xl font-bold leading-snug [overflow-wrap:anywhere] sm:text-2xl">
            {item.name}
          </h2>
          <p className="mt-2 text-sm text-[#64727b]">SKU: {item.modelCode}</p>
          <div className="mt-5 flex justify-between items-center gap-x-3 gap-y-1 border-y border-[#e1e6e9] py-4">
            <div className="flex flex-wrap items-baseline">
              {hasDiscount && <span className="text-base text-[#88939a] line-through">{priceFormat.format(item.priceDefault)}</span>}
              <span className="text-2xl font-bold text-[#18834a]">{priceFormat.format(item.priceInstall)}</span>
              <span className="w-full text-xs text-[#64727b]">ราคาพร้อมติดตั้ง</span>
            </div>
            <div>
                  <a 
                      href={lineUrl}
                      onClick={(event) => {
                        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
                          || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
                        if (!isMobile) {
                          event.preventDefault();
                          setShowLineQr(true);
                        }
                      }}
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-green w-[100px] p-[8px_10px] rounded-[6px] cursor-pointer hover:bg-green/90"
                  >
                      <Chat color="white"/>
                      <p className="text-white font-bold">สนใจ</p>
                  </a>
              </div>
          </div>
          <h3 className="mt-5 text-base font-bold">รายละเอียดสินค้า</h3>
          <dl className="mt-2 divide-y divide-[#edf0f2] text-sm">
            <div className="flex justify-between gap-4 py-2"><dt className="text-[#64727b]">จำนวน</dt><dd className="text-right font-semibold">{item.isOutOfStock ? "0":item.stock <= 0 ? "0":item.stock}</dd></div>
            <div className="flex justify-between gap-4 py-2"><dt className="text-[#64727b]">ขนาดทำความเย็น</dt><dd className="text-right font-semibold">{numberFormat.format(item.btu)} BTU</dd></div>
            <div className="flex justify-between gap-4 py-2"><dt className="text-[#64727b]">ระบบ</dt><dd className="text-right font-semibold">{item.systemName}</dd></div>
            <div className="flex justify-between gap-4 py-2"><dt className="text-[#64727b]">ค่า SEER</dt><dd className="text-right font-semibold">{item.seer > 0 ? numberFormat.format(item.seer) : "ยังไม่ระบุ"}</dd></div>
            <div className="flex justify-between gap-4 py-2"><dt className="text-[#64727b]">ประหยัดไฟ</dt><dd className="text-right font-semibold">{item.isSaveElectricity ? "ใช่" : "ไม่ใช่"}</dd></div>
            {warranties.map(([label, days]) => (
              <div key={label} className="flex justify-between gap-4 py-2">
                <dt className="text-[#64727b]">{label}</dt>
                <dd className="text-right font-semibold">{days > 0 ? formatWarranty(days) : "ยังไม่ระบุ"}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      {showLineQr && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 overflow-y-auto bg-white p-6 text-center">
          <button
            type="button"
            onClick={() => setShowLineQr(false)}
            aria-label="ปิด QR LINE"
            className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-[4px] text-2xl text-[#52616c] hover:bg-[#eef2f4]"
          >
            ×
          </button>
          <h3 className="text-lg font-bold">สแกนด้วย LINE บนมือถือ</h3>
          <QRCodeSVG value={lineUrl} size={240} marginSize={2} className="max-w-full" />
          <p className="max-w-sm text-sm text-[#52616c]">เปิดแชตกับร้านพร้อมข้อความแอร์รุ่น {item.modelCode} แล้วกดส่งใน LINE</p>
        </div>
      )}
    </dialog>
  );
}

export default function AirReady({
  initialCatalog,
  initialFilters,
}: {
  initialCatalog?: CatalogPage;
  initialFilters?: CatalogFilters;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(4);
  const [page, setPage] = useState(1);
  const [brandId, setBrandId] = useState("");
  const [systemId, setSystemId] = useState("");
  const [btu, setBtu] = useState("");
  const [sort, setSort] = useState<CatalogParams["sort"]>("name");
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

  useEffect(() => {
    let currentColumns = columnCount();
    setColumns(currentColumns);
    const update = () => {
      const nextColumns = columnCount();
      if (nextColumns !== currentColumns) {
        currentColumns = nextColumns;
        setColumns(nextColumns);
        setPage(1);
      }
    };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const limit = columns * 2;
  const activeSystemId = columns === 1 ? "" : systemId;
  const activeSort = columns === 1 ? "name" : sort;
  const params: CatalogParams = { brandId, systemId: activeSystemId, btu, sort: activeSort, page, limit };
  const initialPage = initialCatalog && !brandId && !activeSystemId && !btu && activeSort === "name" && page === 1 && limit <= 8
    ? {
        ...initialCatalog,
        items: initialCatalog.items.slice(0, limit),
        totalPages: Math.max(1, Math.ceil(initialCatalog.total / limit)),
      }
    : undefined;
  const filtersQuery = useQuery({
    queryKey: ["air-catalog-filters"],
    queryFn: getCatalogFilters,
    initialData: initialFilters,
    staleTime: 60_000,
  });
  const catalogQuery = useQuery({
    queryKey: ["air-catalog", brandId, activeSystemId, btu, activeSort, page, limit],
    queryFn: () => getCatalogPage(params),
    initialData: initialPage,
    staleTime: 30_000,
    retry: 1,
  });

  function changePage(nextPage: number) {
    setPage(nextPage);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const data = catalogQuery.data;
  const currentPage = data?.page ?? page;
  const totalPages = data?.totalPages ?? 1;
  const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 3));
  const pageNumbers = Array.from(
    { length: Math.min(4, totalPages) },
    (_, index) => startPage + index,
  );

  return (
    <div ref={sectionRef} className="scroll-mt-20">
      <div className="grid gap-3 py-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="catalog-brand" className="mb-1 block text-xs font-bold text-[#52616c]">แบรนด์</label>
          <select id="catalog-brand" value={brandId} onChange={(event) => { setBrandId(event.target.value); setPage(1); }} className="w-full bg-white/5 border border-text/20 rounded-[8px] px-3 py-2 text-[14px] focus:outline-none">
            <option value="">ทั้งหมด</option>
            {filtersQuery.data?.brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
          </select>
        </div>
        <div className="hidden sm:block">
          <label htmlFor="catalog-system" className="mb-1 block text-xs font-bold text-[#52616c]">ระบบแอร์</label>
          <select id="catalog-system" value={systemId} onChange={(event) => { setSystemId(event.target.value); setPage(1); }} className="w-full bg-white/5 border border-text/20 rounded-[8px] px-3 py-2 text-[14px] focus:outline-none">
            <option value="">ทั้งหมด</option>
            {filtersQuery.data?.systems.map((system) => <option key={system.id} value={system.id}>{system.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="catalog-btu" className="mb-1 block text-xs font-bold text-[#52616c]">ขนาด BTU</label>
          <select id="catalog-btu" value={btu} onChange={(event) => { setBtu(event.target.value); setPage(1); }} className="w-full bg-white/5 border border-text/20 rounded-[8px] px-3 py-2 text-[14px] focus:outline-none">
            <option value="">ทั้งหมด</option>
            {filtersQuery.data?.btus.map((size) => <option key={size} value={size}>{numberFormat.format(size)} BTU</option>)}
          </select>
        </div>
        <div className="hidden sm:block">
          <label htmlFor="catalog-sort" className="mb-1 block text-xs font-bold text-[#52616c]">เรียงตาม</label>
          <select id="catalog-sort" value={sort} onChange={(event) => { setSort(event.target.value as CatalogParams["sort"]); setPage(1); }} className="w-full bg-white/5 border border-text/20 rounded-[8px] px-3 py-2 text-[14px] focus:outline-none">
            <option value="name">ชื่อรุ่น</option>
            <option value="price-asc">ราคาต่ำไปสูง</option>
            <option value="price-desc">ราคาสูงไปต่ำ</option>
            <option value="btu-asc">BTU ต่ำไปสูง</option>
          </select>
        </div>
      </div>

      {filtersQuery.isError && <p role="alert" className="mt-3 text-sm text-[#a43f35]">โหลดตัวกรองไม่สำเร็จ</p>}

      {catalogQuery.isError ? (
        <div role="alert" className="py-12 text-center text-sm text-[#a43f35]">
          <p>โหลดรายการแอร์ไม่สำเร็จ</p>
          <button type="button" onClick={() => catalogQuery.refetch()} className="mt-2 font-bold underline">ลองอีกครั้ง</button>
        </div>
      ) : !data ? (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4" aria-label="กำลังโหลดรายการแอร์">
          {Array.from({ length: limit }, (_, index) => <div key={index} className="h-[400px] animate-pulse rounded-[4px] bg-[#eef2f4]" />)}
        </div>
      ) : data.items.length === 0 ? (
        <p className="py-12 text-center text-sm text-[#64727b]">ไม่พบรุ่นแอร์ที่ตรงกับตัวกรอง</p>
      ) : (
        <>
          {/* <p className="mt-4 text-sm text-[#64727b]" aria-live="polite">
            {numberFormat.format(data.total)} รุ่นแอร์
          </p> */}
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {data.items.map((item) => <ProductCard key={item.id} item={item} onOpen={() => setSelectedItem(item)} />)}
          </div>
          {totalPages > 1 && (
            <nav aria-label="หน้ารายการแอร์" className="mt-7 flex flex-wrap items-center justify-center gap-2">
              <button type="button" onClick={() => changePage(currentPage - 1)} disabled={currentPage <= 1} className="h-10 rounded-[4px] border border-[#cdd7dd] px-3 text-sm text-[#327db4] disabled:cursor-not-allowed disabled:opacity-40">
                <ChevronLeft color="#327db4"/>
              </button>
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => changePage(pageNumber)}
                  aria-current={pageNumber === currentPage ? "page" : undefined}
                  className={`size-10 rounded-[4px] border text-sm font-bold ${pageNumber === currentPage ? "border-[#327db4] bg-[#327db4] text-white" : "border-[#cdd7dd] text-[#327db4] hover:bg-[#eef5f9]"}`}
                >
                  {numberFormat.format(pageNumber)}
                </button>
              ))}
              <button type="button" onClick={() => changePage(currentPage + 1)} disabled={currentPage >= totalPages} className="h-10 rounded-[4px] border border-[#cdd7dd] px-3 text-sm text-[#327db4] disabled:cursor-not-allowed disabled:opacity-40">
                <ChevronRight color="#327db4"/>
              </button>
            </nav>
          )}
        </>
      )}
      {selectedItem && <ProductDetail item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
}
