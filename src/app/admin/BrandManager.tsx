"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { deleteBrand, getBrands, type Brand } from "@/features/brand/service";
import BrandForm from "./BrandForm";

export default function BrandManager() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Brand | null>(null);
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(null);

  const brandsQuery = useQuery({
    queryKey: ["air-brands"],
    queryFn: getBrands,
    staleTime: 60_000,
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["air-brands"] });
      queryClient.invalidateQueries({ queryKey: ["air-models"] });
      setNotice({ text: "ลบแบรนด์แล้ว", error: false });
    },
    onError: (error) => {
      const text = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ?? "ไม่สามารถเชื่อมต่อระบบได้"
        : "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง";
      setNotice({ text, error: true });
    },
  });

  function handleDelete(brand: Brand) {
    if (deleteMutation.isPending || !window.confirm(`ลบแบรนด์ ${brand.name} ใช่หรือไม่?`)) return;
    setNotice(null);
    deleteMutation.mutate(brand.id);
  }

  return (
    <section aria-labelledby="brands-title" className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dce4e9] pb-4">
        <div>
          <h2 id="brands-title" className="text-lg font-bold text-[#1f303b]">รายการแบรนด์</h2>
          <p className="mt-1 text-sm text-[#64727b]">
            {brandsQuery.isPending ? "กำลังโหลดรายการ..." : `${brandsQuery.data?.length ?? 0} แบรนด์`}
          </p>
        </div>
        <Link
          href="/admin/brands/new"
          className="flex h-10 items-center rounded bg-[#327db4] px-4 text-sm font-bold text-white hover:bg-[#246b9c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#327db4]"
        >
          เพิ่มแบรนด์
        </Link>
      </div>

      {notice && (
        <p role={notice.error ? "alert" : "status"} className={`mt-3 text-sm ${notice.error ? "text-[#a43f35]" : "text-[#24724a]"}`}>
          {notice.text}
        </p>
      )}

      {editing && (
        <div className="border-b border-[#dce4e9] py-5">
          <h3 className="mb-4 text-base font-bold text-[#1f303b]">แก้ไขแบรนด์</h3>
          <BrandForm
            key={editing.id}
            brand={editing}
            onDone={(saved) => {
              setEditing(null);
              if (saved) setNotice({ text: "แก้ไขแบรนด์แล้ว", error: false });
            }}
          />
        </div>
      )}

      {brandsQuery.isPending ? (
        <p className="py-10 text-center text-sm text-[#64727b]">กำลังโหลดแบรนด์...</p>
      ) : brandsQuery.isError ? (
        <p role="alert" className="py-10 text-center text-sm text-[#a43f35]">
          โหลดแบรนด์ไม่สำเร็จ{" "}
          <button type="button" onClick={() => brandsQuery.refetch()} className="font-bold underline">ลองอีกครั้ง</button>
        </p>
      ) : brandsQuery.data.length === 0 ? (
        <p className="py-10 text-center text-sm text-[#64727b]">ยังไม่มีแบรนด์</p>
      ) : (
        <div className="mt-4 overflow-x-auto border border-[#e1e7eb] bg-white">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead className="bg-[#f0f4f6] text-xs font-bold text-[#52616c]">
              <tr>
                <th scope="col" className="px-4 py-3">แบรนด์</th>
                <th scope="col" className="px-4 py-3 text-right">รุ่นแอร์</th>
                <th scope="col" className="px-4 py-3 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {brandsQuery.data.map((brand) => (
                <tr key={brand.id} className="border-t border-[#e9eef1] text-[#26323b]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={brand.image} alt="" loading="lazy" className="size-12 shrink-0 object-contain" />
                      <span className="font-bold">{brand.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{brand.modelCount}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button type="button" onClick={() => { setEditing(brand); setNotice(null); }} disabled={editing !== null} className="px-2 py-1 font-bold text-[#246b9c] hover:underline disabled:opacity-40">แก้ไข</button>
                    <button
                      type="button"
                      onClick={() => handleDelete(brand)}
                      disabled={brand.modelCount > 0 || editing !== null || deleteMutation.isPending}
                      title={brand.modelCount > 0 ? "ลบไม่ได้เพราะมีรุ่นแอร์ใช้งานอยู่" : "ลบแบรนด์"}
                      className="px-2 py-1 font-bold text-[#a43f35] hover:underline disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline"
                    >
                      ลบ
                    </button>
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
