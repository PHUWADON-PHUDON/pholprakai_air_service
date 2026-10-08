"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  createAirModel,
  getAirModel,
  updateAirModel,
  uploadAirImage,
  type AirModel,
} from "@/features/air/service";
import { getBrands, type Brand } from "@/features/brand/service";
import { getSystems, type AirSystem } from "@/features/system/service";
import type { AirModelInput } from "@/lib/airModelInput";
import { getDiscountedPrice, getDiscountPercent } from "@/lib/utils/airPricing";

type FormValues = {
  name: string;
  modelCode: string;
  brandId: string;
  systemId: string;
  btu: string;
  isSaveElectricity: boolean;
  enegyLabel: string;
  seer: string;
  priceDefault: string;
  priceInstall: string;
  stock: string;
  isOutOfStock: boolean;
  installWarranty: string;
  compressorWarrantyYears: string;
  sparePartWarrantyYears: string;
};

const DAYS_PER_YEAR = 365;
const MAX_WARRANTY_YEARS = 2_147_483_647 / DAYS_PER_YEAR;

type ImageDraft = { key: string; url: string; file: File | null };

function ImagePreview({ image, index }: { image: ImageDraft; index: number }) {
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    if (!image.file) return;
    const url = URL.createObjectURL(image.file);
    setFileUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image.file]);

  const src = image.file ? fileUrl : image.url;
  return (
    <div className="flex size-20 shrink-0 items-center justify-center border border-[#e1e7eb] bg-white text-xs text-[#64727b]">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={`ตัวอย่างรูปที่ ${index + 1}`} className="h-full w-full object-contain" />
      ) : "ยังไม่มีรูป"}
    </div>
  );
}

function initialImages(model?: AirModel): ImageDraft[] {
  return model?.imageUrls.length
    ? model.imageUrls.map((url, index) => ({ key: `existing-${index}`, url, file: null }))
    : [{ key: "new-0", url: "", file: null }];
}

function initialValues(model?: AirModel): FormValues {
  return {
    name: model?.name ?? "",
    modelCode: model?.modelCode ?? "",
    brandId: model?.brandId ?? "",
    systemId: model?.systemId ?? "",
    btu: model?.btu.toString() ?? "",
    isSaveElectricity: model?.isSaveElectricity ?? false,
    enegyLabel: model?.isSaveElectricity ? (model.enegyLabel ?? 0).toString() : "0",
    seer: model?.seer.toFixed(2) ?? "",
    priceDefault: model?.priceDefault.toFixed(2) ?? "",
    priceInstall: model?.priceInstall.toFixed(2) ?? "",
    stock: model?.stock?.toString() ?? "0",
    isOutOfStock: model?.isOutOfStock ?? false,
    installWarranty: model?.installWarranty.toString() ?? "",
    compressorWarrantyYears: model ? (model.compressorWarranty / DAYS_PER_YEAR).toString() : "",
    sparePartWarrantyYears: model ? (model.sparePartWarranty / DAYS_PER_YEAR).toString() : "",
  };
}

const inputClass = "h-10 w-full rounded border border-[#cbd5dc] bg-white px-3 text-sm text-[#26323b] focus:border-[#327db4] focus:outline-2 focus:outline-offset-2 focus:outline-[#327db4] disabled:bg-[#f0f4f6]";

export default function AirModelForm({ modelId }: { modelId?: string }) {
  const brandsQuery = useQuery({ queryKey: ["air-brands"], queryFn: getBrands, staleTime: 60_000, retry: false });
  const systemsQuery = useQuery({ queryKey: ["air-systems"], queryFn: getSystems, staleTime: 60_000, retry: false });
  const modelQuery = useQuery({
    queryKey: ["air-model", modelId],
    queryFn: () => getAirModel(modelId!),
    enabled: !!modelId,
    retry: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Initialize editable state only after the entry fetch has refreshed cached data.
  if (brandsQuery.isPending || systemsQuery.isPending || (modelId && (modelQuery.isPending || modelQuery.isFetching))) {
    return <p className="py-10 text-sm text-[#64727b]">กำลังโหลดข้อมูล...</p>;
  }
  if (brandsQuery.isError || systemsQuery.isError || (modelId && modelQuery.isError)) {
    const notFound = modelId && axios.isAxiosError(modelQuery.error) && modelQuery.error.response?.status === 404;
    return (
      <div role="alert" className="py-10 text-sm text-[#a43f35]">
        <p>{notFound ? "ไม่พบรุ่นแอร์นี้" : "โหลดข้อมูลสำหรับแบบฟอร์มไม่สำเร็จ"}</p>
        <Link href="/admin" className="mt-2 inline-block font-bold text-[#246b9c] hover:underline">กลับไปรายการรุ่นแอร์</Link>
      </div>
    );
  }

  return (
    <AirModelFields
      key={modelId ?? "new"}
      model={modelId ? modelQuery.data : undefined}
      brands={brandsQuery.data}
      systems={systemsQuery.data}
    />
  );
}

function AirModelFields({ model, brands, systems }: { model?: AirModel; brands: Brand[]; systems: AirSystem[] }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<FormValues>(() => initialValues(model));
  const [discountPercent, setDiscountPercent] = useState(() => model
    ? getDiscountPercent(model.priceDefault.toFixed(2), model.priceInstall.toFixed(2))
    : "0");
  const [images, setImages] = useState<ImageDraft[]>(() => initialImages(model));
  const [message, setMessage] = useState("");
  const nextImageKey = useRef(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function changeDefaultPrice(priceDefault: string) {
    setValues((current) => ({
      ...current,
      priceDefault,
      priceInstall: getDiscountedPrice(priceDefault, discountPercent) ?? current.priceInstall,
    }));
  }

  function changeDiscountPercent(percent: string) {
    setDiscountPercent(percent);
    setValues((current) => ({
      ...current,
      priceInstall: getDiscountedPrice(current.priceDefault, percent) ?? current.priceInstall,
    }));
  }

  function changeInstallPrice(priceInstall: string) {
    setDiscountPercent(getDiscountPercent(values.priceDefault, priceInstall));
    setField("priceInstall", priceInstall);
  }

  function updateImage(key: string, url: string) {
    setImages((current) => current.map((image) => image.key === key ? { ...image, url, file: null } : image));
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImages((current) => {
      const next = [...current];
      [next[index], next[index + direction]] = [next[index + direction], next[index]];
      return next;
    });
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const imageUrls = await Promise.all(images.map(async (image) => {
        if (!image.file) return image.url.trim();
        const url = await uploadAirImage(image.file);
        setImages((current) => current.map((entry) => entry.key === image.key ? { ...entry, url, file: null } : entry));
        return url;
      }));
      const input: AirModelInput = {
        name: values.name.trim(),
        modelCode: values.modelCode.trim(),
        brandId: values.brandId,
        systemId: values.systemId,
        btu: Number(values.btu),
        isSaveElectricity: values.isSaveElectricity,
        enegyLabel: values.isSaveElectricity ? Number(values.enegyLabel) : 0,
        seer: values.seer,
        priceDefault: values.priceDefault,
        priceInstall: values.priceInstall,
        stock: Number(values.stock),
        isOutOfStock: values.isOutOfStock,
        installWarranty: Number(values.installWarranty),
        compressorWarranty: Math.round(Number(values.compressorWarrantyYears) * DAYS_PER_YEAR),
        sparePartWarranty: Math.round(Number(values.sparePartWarrantyYears) * DAYS_PER_YEAR),
        imageUrls,
      };
      return model ? updateAirModel({ id: model.id, input }) : createAirModel(input);
    },
    onSuccess: (savedModel) => {
      queryClient.setQueryData(["air-model", savedModel.id], savedModel);
      queryClient.invalidateQueries({ queryKey: ["air-models"] });
      queryClient.invalidateQueries({ queryKey: ["air-catalog"] });
      queryClient.invalidateQueries({ queryKey: ["air-brands"] });
      queryClient.invalidateQueries({ queryKey: ["air-systems"] });
      router.push("/admin");
    },
    onError: (error) => {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        setMessage(error.response?.data?.message ?? "ไม่สามารถเชื่อมต่อระบบได้");
      } else {
        setMessage("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
      }
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saveMutation.isPending) return;
    if (!values.brandId || !values.systemId || images.length === 0 || images.some((image) => !image.url.trim() && !image.file)) {
      setMessage("กรุณาเลือกแบรนด์ ระบบแอร์ และใส่รูปภาพให้ครบทุกช่อง");
      return;
    }
    if (images.some((image) => image.file && image.file.size > 5 * 1024 * 1024)) {
      setMessage("รูปภาพต้องมีขนาดไม่เกิน 5 MB");
      return;
    }
    setMessage("");
    saveMutation.mutate();
  }

  if (brands.length === 0 || systems.length === 0) {
    return (
      <div className="space-y-3 border-t border-[#dce4e9] py-6 text-sm text-[#52616c]">
        {brands.length === 0 && <p>ยังไม่มีแบรนด์ <Link href="/admin/brands/new" className="font-bold text-[#246b9c] hover:underline">เพิ่มแบรนด์</Link></p>}
        {systems.length === 0 && <p>ยังไม่มีระบบแอร์ <Link href="/admin/systems/new" className="font-bold text-[#246b9c] hover:underline">เพิ่มระบบแอร์</Link></p>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8 border-t border-[#dce4e9] pt-6">
      <fieldset>
        <legend className="mb-4 text-base font-bold text-[#1f303b]">ข้อมูลรุ่นแอร์</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="air-name" className="mb-1.5 block text-sm font-bold text-[#33434e]">ชื่อรุ่น</label>
            <input id="air-name" value={values.name} onChange={(event) => setField("name", event.target.value)} maxLength={500} required autoFocus className={inputClass} />
          </div>
          <div>
            <label htmlFor="air-code" className="mb-1.5 block text-sm font-bold text-[#33434e]">รหัสรุ่น</label>
            <input id="air-code" value={values.modelCode} onChange={(event) => setField("modelCode", event.target.value)} maxLength={500} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="air-brand" className="mb-1.5 block text-sm font-bold text-[#33434e]">แบรนด์</label>
            <select id="air-brand" value={values.brandId} onChange={(event) => setField("brandId", event.target.value)} required className={inputClass}>
              <option value="">เลือกแบรนด์</option>
              {brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="air-system" className="mb-1.5 block text-sm font-bold text-[#33434e]">ระบบแอร์</label>
            <select id="air-system" value={values.systemId} onChange={(event) => setField("systemId", event.target.value)} required className={inputClass}>
              <option value="">เลือกระบบแอร์</option>
              {systems.map((system) => <option key={system.id} value={system.id}>{system.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="air-btu" className="mb-1.5 block text-sm font-bold text-[#33434e]">BTU</label>
            <input id="air-btu" type="number" min="1" max="2147483647" step="1" value={values.btu} onChange={(event) => setField("btu", event.target.value)} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="air-seer" className="mb-1.5 block text-sm font-bold text-[#33434e]">SEER</label>
            <input id="air-seer" type="number" min="0.01" max="999.99" step="0.01" value={values.seer} onChange={(event) => setField("seer", event.target.value)} required className={inputClass} />
          </div>
          <label htmlFor="air-save-electricity" className="flex items-center gap-2 text-sm font-bold text-[#33434e] sm:col-span-2">
            <input id="air-save-electricity" type="checkbox" checked={values.isSaveElectricity} onChange={(event) => {
              const checked = event.target.checked;
              setValues((current) => ({ ...current, isSaveElectricity: checked, enegyLabel: checked ? current.enegyLabel : "0" }));
            }} className="size-4 accent-[#327db4]" />
            ประหยัดไฟ
          </label>
          {values.isSaveElectricity && (
            <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
              <div className="min-w-40 flex-1 sm:max-w-xs">
                <label htmlFor="air-energy-label" className="mb-1.5 block text-sm font-bold text-[#33434e]">จำนวนดาวฉลากประหยัดไฟ</label>
                <select id="air-energy-label" value={values.enegyLabel} onChange={(event) => setField("enegyLabel", event.target.value)} required className={inputClass}>
                  <option value="0">0 ดาว (ไม่มีดาว)</option>
                  {[1, 2, 3, 4, 5].map((stars) => <option key={stars} value={stars}>{stars} ดาว</option>)}
                </select>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/logo/energy-label-${values.enegyLabel}-stars.png`} alt={`ฉลากประหยัดไฟเบอร์ 5 ${values.enegyLabel} ดาว`} className="size-24 shrink-0 object-contain" />
            </div>
          )}
        </div>
      </fieldset>

      <fieldset className="border-t border-[#dce4e9] pt-6">
        <legend className="text-base font-bold text-[#1f303b]">ราคาและการรับประกัน</legend>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="air-price-default" className="mb-1.5 block text-sm font-bold text-[#33434e]">ราคาปกติ (บาท)</label>
            <input id="air-price-default" type="number" min="0" max="9999999999.99" step="0.01" value={values.priceDefault} onChange={(event) => changeDefaultPrice(event.target.value)} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="air-discount-percent" className="mb-1.5 block text-sm font-bold text-[#33434e]">ส่วนลด (%)</label>
            <input id="air-discount-percent" type="number" min="0" max="100" step="0.01" value={discountPercent} onChange={(event) => changeDiscountPercent(event.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="air-price-install" className="mb-1.5 block text-sm font-bold text-[#33434e]">ราคาพร้อมติดตั้ง (บาท)</label>
            <input id="air-price-install" type="number" min="0" max="9999999999.99" step="0.01" value={values.priceInstall} onChange={(event) => changeInstallPrice(event.target.value)} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="air-warranty-install" className="mb-1.5 block text-sm font-bold text-[#33434e]">รับประกันติดตั้ง (วัน)</label>
            <input id="air-warranty-install" type="number" min="0" max="2147483647" step="1" value={values.installWarranty} onChange={(event) => setField("installWarranty", event.target.value)} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="air-warranty-compressor" className="mb-1.5 block text-sm font-bold text-[#33434e]">รับประกันคอมเพรสเซอร์ (ปี)</label>
            <input id="air-warranty-compressor" type="number" min="0" max={MAX_WARRANTY_YEARS} step="any" value={values.compressorWarrantyYears} onChange={(event) => setField("compressorWarrantyYears", event.target.value)} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="air-warranty-parts" className="mb-1.5 block text-sm font-bold text-[#33434e]">รับประกันอะไหล่ (ปี)</label>
            <input id="air-warranty-parts" type="number" min="0" max={MAX_WARRANTY_YEARS} step="any" value={values.sparePartWarrantyYears} onChange={(event) => setField("sparePartWarrantyYears", event.target.value)} required className={inputClass} />
          </div>
        </div>
      </fieldset>

      <fieldset className="border-t border-[#dce4e9] pt-6">
        <legend className="text-base font-bold text-[#1f303b]">สต็อกสินค้า</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="air-stock" className="mb-1.5 block text-sm font-bold text-[#33434e]">จำนวนสต็อก (เครื่อง)</label>
            <input id="air-stock" type="number" min="0" max="2147483647" step="1" value={values.stock} onChange={(event) => setField("stock", event.target.value)} required className={inputClass} />
          </div>
          <label htmlFor="air-out-of-stock" className="flex items-center gap-2 text-sm font-bold text-[#33434e]">
            <input id="air-out-of-stock" type="checkbox" checked={values.isOutOfStock} onChange={(event) => setField("isOutOfStock", event.target.checked)} className="size-4 accent-[#327db4]" />
            สินค้าหมด
          </label>
        </div>
      </fieldset>

      <fieldset className="border-t border-[#dce4e9] pt-6">
        <legend className="text-base font-bold text-[#1f303b]">รูปภาพ</legend>
        <div className="space-y-3">
          {images.map((image, index) => (
            <div key={image.key} className="flex flex-wrap items-center gap-3 border-b border-[#e9eef1] py-3">
              <ImagePreview image={image} index={index} />
              <div className="min-w-48 flex-1">
                <label htmlFor={`air-image-url-${image.key}`} className="mb-1.5 block text-sm font-bold text-[#33434e]">
                  {index === 0 ? "รูปหลัก" : `รูปที่ ${index + 1}`}
                </label>
                {image.file ? (
                  <p className="truncate text-sm text-[#52616c]" title={image.file.name}>{image.file.name}</p>
                ) : (
                  <input id={`air-image-url-${image.key}`} type="url" value={image.url} onChange={(event) => updateImage(image.key, event.target.value)} maxLength={500} placeholder="https://..." required className={inputClass} />
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0 || saveMutation.isPending} aria-label={`เลื่อนรูปที่ ${index + 1} ขึ้น`} className="size-9 rounded border border-[#cbd5dc] text-[#52616c] disabled:opacity-30">↑</button>
                <button type="button" onClick={() => moveImage(index, 1)} disabled={index === images.length - 1 || saveMutation.isPending} aria-label={`เลื่อนรูปที่ ${index + 1} ลง`} className="size-9 rounded border border-[#cbd5dc] text-[#52616c] disabled:opacity-30">↓</button>
                <button type="button" onClick={() => setImages((current) => current.filter((entry) => entry.key !== image.key))} disabled={saveMutation.isPending} aria-label={`ลบรูปที่ ${index + 1}`} className="size-9 rounded border border-[#cbd5dc] text-[#a43f35] disabled:opacity-30">×</button>
              </div>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button type="button" onClick={() => {
              const image = { key: `new-${nextImageKey.current++}`, url: "", file: null };
              setImages((current) => [...current, image]);
            }} disabled={images.length >= 20 || saveMutation.isPending} className="h-10 rounded border border-[#327db4] px-4 text-sm font-bold text-[#246b9c] disabled:opacity-40">เพิ่ม URL รูป</button>
            <label htmlFor="air-image-file" className="text-sm font-bold text-[#33434e]">เพิ่มไฟล์รูป</label>
            <input
              ref={fileInputRef}
              id="air-image-file"
              type="file"
              multiple
              accept="image/png,image/jpeg,image/gif,image/webp"
              disabled={images.length >= 20 || saveMutation.isPending}
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []).slice(0, 20 - images.length + (images.length === 1 && !images[0].url && !images[0].file ? 1 : 0));
                const drafts = files.map((file) => ({ key: `new-${nextImageKey.current++}`, url: "", file }));
                if (images.length === 1 && !images[0].url && !images[0].file && drafts.length) {
                  setImages([{ ...images[0], file: drafts[0].file }, ...drafts.slice(1)]);
                } else {
                  setImages((current) => [...current, ...drafts]);
                }
                event.target.value = "";
              }}
              className="block max-w-full text-sm text-[#52616c] file:mr-3 file:rounded file:border-0 file:bg-[#e5f0f7] file:px-3 file:py-2 file:font-bold file:text-[#246b9c]"
            />
          </div>
          <p className="text-xs text-[#64727b]">รูปแรกใช้เป็นรูปหลัก สูงสุด 20 รูปต่อรุ่น ไฟล์ละไม่เกิน 5 MB</p>
        </div>
      </fieldset>

      {message && <p role="alert" className="text-sm text-[#a43f35]">{message}</p>}
      <div className="flex items-center gap-3 border-t border-[#dce4e9] pt-6">
        <button type="submit" disabled={saveMutation.isPending} className="h-10 rounded bg-[#327db4] px-5 text-sm font-bold text-white hover:bg-[#246b9c] disabled:cursor-wait disabled:opacity-65">
          {saveMutation.isPending ? "กำลังบันทึก..." : "บันทึก"}
        </button>
        <button type="button" onClick={() => router.push("/admin")} disabled={saveMutation.isPending} className="h-10 px-3 text-sm font-bold text-[#52616c] hover:text-[#26323b] disabled:opacity-65">ยกเลิก</button>
      </div>
    </form>
  );
}
