"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { deleteAirModel, getAirModels, type AirModel } from "@/features/air/service";
import { getBrands } from "@/features/brand/service";
import { formatWarranty } from "@/lib/utils/formatWarranty";

const numberFormat = new Intl.NumberFormat("th-TH");
const priceFormat = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

export default function AirModelTable() {
  const [brandId, setBrandId] = useState("");
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const brandsQuery = useQuery({
    queryKey: ["air-brands"],
    queryFn: getBrands,
    staleTime: 60_000,
    retry: false,
  });
  const modelsQuery = useQuery({
    queryKey: ["air-models", brandId],
    queryFn: () => getAirModels(brandId || undefined),
    staleTime: 30_000,
    retry: false,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteAirModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["air-models"] });
      queryClient.invalidateQueries({ queryKey: ["air-brands"] });
      queryClient.invalidateQueries({ queryKey: ["air-systems"] });
      setMessage("");
    },
    onError: (error) => {
      setMessage(axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ?? "ลบรุ่นแอร์ไม่สำเร็จ"
        : "ลบรุ่นแอร์ไม่สำเร็จ");
    },
  });

  function handleDelete(model: AirModel) {
    if (deleteMutation.isPending || !window.confirm(`ลบรุ่นแอร์ ${model.name} ใช่หรือไม่?`)) return;
    setMessage("");
    deleteMutation.mutate(model.id);
  }

  return (
    <section aria-labelledby="air-models-title" className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#dce4e9] pb-4">
        <div>
          <h2 id="air-models-title" className="text-lg font-bold text-[#1f303b]">รุ่นแอร์</h2>
          <p className="mt-1 text-sm text-[#64727b]" aria-live="polite">
            {modelsQuery.isPending ? "กำลังโหลดรายการ..." : `${numberFormat.format(modelsQuery.data?.length ?? 0)} รายการ`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="brand-filter" className="text-sm font-bold text-[#33434e]">แบรนด์</label>
            <select
              id="brand-filter"
              value={brandId}
              onChange={(event) => setBrandId(event.target.value)}
              className="h-10 min-w-40 rounded border border-[#cbd5dc] bg-white px-3 text-sm text-[#26323b] focus:border-[#327db4] focus:outline-2 focus:outline-offset-2 focus:outline-[#327db4]"
            >
              <option value="">ทั้งหมด</option>
              {brandsQuery.data?.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>
          <Link href="/admin/models/new" className="flex h-10 items-center rounded bg-[#327db4] px-4 text-sm font-bold text-white hover:bg-[#246b9c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#327db4]">
            เพิ่มรุ่นแอร์
          </Link>
        </div>
      </div>

      {message && <p role="alert" className="mt-3 text-sm text-[#a43f35]">{message}</p>}

      {brandsQuery.isError && (
        <p role="alert" className="mt-3 text-sm text-[#a43f35]">
          โหลดรายชื่อแบรนด์ไม่สำเร็จ{" "}
          <button type="button" onClick={() => brandsQuery.refetch()} className="font-bold underline">ลองอีกครั้ง</button>
        </p>
      )}

      {modelsQuery.isPending ? (
        <p className="py-12 text-center text-sm text-[#64727b]">กำลังโหลดข้อมูลรุ่นแอร์...</p>
      ) : modelsQuery.isError ? (
        <div role="alert" className="py-12 text-center text-sm text-[#a43f35]">
          โหลดข้อมูลรุ่นแอร์ไม่สำเร็จ{" "}
          <button type="button" onClick={() => modelsQuery.refetch()} className="font-bold underline">ลองอีกครั้ง</button>
        </div>
      ) : modelsQuery.data.length === 0 ? (
        <p className="py-12 text-center text-sm text-[#64727b]">
          {brandId ? "ไม่มีรุ่นแอร์ในแบรนด์นี้" : "ยังไม่มีข้อมูลรุ่นแอร์"}
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto border border-[#e1e7eb] bg-white">
          <table className="w-full min-w-[1440px] border-collapse text-left text-sm">
            <thead className="bg-[#f0f4f6] text-xs font-bold text-[#52616c]">
              <tr>
                <th scope="col" className="px-4 py-3">รุ่นแอร์</th>
                <th scope="col" className="px-4 py-3">แบรนด์ / ระบบ</th>
                <th scope="col" className="px-4 py-3 text-right">BTU</th>
                <th scope="col" className="px-4 py-3 text-right">SEER</th>
                <th scope="col" className="px-4 py-3 text-center">ประหยัดไฟ</th>
                <th scope="col" className="px-4 py-3 text-right">ราคาปกติ</th>
                <th scope="col" className="px-4 py-3 text-right">ราคาพร้อมติดตั้ง</th>
                <th scope="col" className="px-4 py-3 text-right">สต็อก (เครื่อง)</th>
                <th scope="col" className="px-4 py-3">สถานะสินค้า</th>
                <th scope="col" className="px-4 py-3">รับประกัน</th>
                <th scope="col" className="px-4 py-3 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {modelsQuery.data.map((model) => (
                <tr key={model.id} className="border-t border-[#e9eef1] align-top text-[#26323b]">
                  <td className="min-w-64 px-4 py-3">
                    <div className="flex items-start gap-3">
                      {model.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={model.imageUrl} alt="" loading="lazy" className="size-12 shrink-0 object-contain" />
                      )}
                      <div className="min-w-0">
                        <div className="font-bold">{model.name}</div>
                        <div className="mt-0.5 text-xs text-[#64727b]">{model.modelCode}</div>
                        <div className="mt-0.5 text-xs text-[#64727b]">{model.imageUrls.length} รูป</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{model.brand.name}</div>
                    <div className="mt-0.5 text-xs text-[#64727b]">{model.system.name}</div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{numberFormat.format(model.btu)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{model.seer.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    {model.isSaveElectricity ? (
                      <>
                        <div>ใช่</div>
                        <div className="mt-0.5 whitespace-nowrap text-xs text-[#64727b]">{(model.enegyLabel ?? 0) > 0 ? `${model.enegyLabel} ดาว` : "ไม่มีดาว"}</div>
                      </>
                    ) : "ไม่ใช่"}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{priceFormat.format(model.priceDefault)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{priceFormat.format(model.priceInstall)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{numberFormat.format(model.stock)}</td>
                  <td className={`px-4 py-3 whitespace-nowrap font-semibold ${model.isOutOfStock ? "text-[#a43f35]" : "text-[#18834a]"}`}>
                    {model.isOutOfStock ? "สินค้าหมด" : "พร้อมจำหน่าย"}
                  </td>
                  <td className="px-4 py-3 text-xs leading-5 text-[#52616c]">
                    <div>ติดตั้ง {formatWarranty(model.installWarranty)}</div>
                    <div>คอมเพรสเซอร์ {formatWarranty(model.compressorWarranty)}</div>
                    <div>อะไหล่ {formatWarranty(model.sparePartWarranty)}</div>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link href={`/admin/models/${model.id}/edit`} className="px-2 py-1 font-bold text-[#246b9c] hover:underline">แก้ไข</Link>
                    <button type="button" onClick={() => handleDelete(model)} disabled={deleteMutation.isPending} className="px-2 py-1 font-bold text-[#a43f35] hover:underline disabled:opacity-40">ลบ</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
