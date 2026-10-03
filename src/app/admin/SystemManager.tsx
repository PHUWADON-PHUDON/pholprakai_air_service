"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { deleteSystem, getSystems, type AirSystem } from "@/features/system/service";
import SystemForm from "./SystemForm";

export default function SystemManager() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<AirSystem | null>(null);
  const [notice, setNotice] = useState<{ text: string; error: boolean } | null>(null);

  const systemsQuery = useQuery({
    queryKey: ["air-systems"],
    queryFn: getSystems,
    staleTime: 60_000,
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSystem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["air-systems"] });
      queryClient.invalidateQueries({ queryKey: ["air-models"] });
      setNotice({ text: "ลบระบบแอร์แล้ว", error: false });
    },
    onError: (error) => {
      const text = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ?? "ไม่สามารถเชื่อมต่อระบบได้"
        : "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง";
      setNotice({ text, error: true });
    },
  });

  function handleDelete(system: AirSystem) {
    if (deleteMutation.isPending || !window.confirm(`ลบระบบแอร์ ${system.name} ใช่หรือไม่?`)) return;
    setNotice(null);
    deleteMutation.mutate(system.id);
  }

  return (
    <section aria-labelledby="systems-title" className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dce4e9] pb-4">
        <div>
          <h2 id="systems-title" className="text-lg font-bold text-[#1f303b]">รายการระบบแอร์</h2>
          <p className="mt-1 text-sm text-[#64727b]">
            {systemsQuery.isPending ? "กำลังโหลดรายการ..." : `${systemsQuery.data?.length ?? 0} ระบบ`}
          </p>
        </div>
        <Link
          href="/admin/systems/new"
          className="flex h-10 items-center rounded bg-[#327db4] px-4 text-sm font-bold text-white hover:bg-[#246b9c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#327db4]"
        >
          เพิ่มระบบแอร์
        </Link>
      </div>

      {notice && (
        <p role={notice.error ? "alert" : "status"} className={`mt-3 text-sm ${notice.error ? "text-[#a43f35]" : "text-[#24724a]"}`}>
          {notice.text}
        </p>
      )}

      {editing && (
        <div className="border-b border-[#dce4e9] py-5">
          <h3 className="mb-4 text-base font-bold text-[#1f303b]">แก้ไขระบบแอร์</h3>
          <SystemForm
            key={editing.id}
            system={editing}
            onDone={(saved) => {
              setEditing(null);
              if (saved) setNotice({ text: "แก้ไขระบบแอร์แล้ว", error: false });
            }}
          />
        </div>
      )}

      {systemsQuery.isPending ? (
        <p className="py-10 text-center text-sm text-[#64727b]">กำลังโหลดระบบแอร์...</p>
      ) : systemsQuery.isError ? (
        <p role="alert" className="py-10 text-center text-sm text-[#a43f35]">
          โหลดระบบแอร์ไม่สำเร็จ{" "}
          <button type="button" onClick={() => systemsQuery.refetch()} className="font-bold underline">ลองอีกครั้ง</button>
        </p>
      ) : systemsQuery.data.length === 0 ? (
        <p className="py-10 text-center text-sm text-[#64727b]">ยังไม่มีระบบแอร์</p>
      ) : (
        <div className="mt-4 overflow-x-auto border border-[#e1e7eb] bg-white">
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
            <thead className="bg-[#f0f4f6] text-xs font-bold text-[#52616c]">
              <tr>
                <th scope="col" className="px-4 py-3">ชื่อระบบแอร์</th>
                <th scope="col" className="px-4 py-3 text-right">รุ่นแอร์</th>
                <th scope="col" className="px-4 py-3 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {systemsQuery.data.map((system) => (
                <tr key={system.id} className="border-t border-[#e9eef1] text-[#26323b]">
                  <td className="px-4 py-3 font-bold">{system.name}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{system.modelCount}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => { setEditing(system); setNotice(null); }}
                      disabled={editing !== null}
                      className="px-2 py-1 font-bold text-[#246b9c] hover:underline disabled:opacity-40"
                    >
                      แก้ไข
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(system)}
                      disabled={system.modelCount > 0 || editing !== null || deleteMutation.isPending}
                      title={system.modelCount > 0 ? "ลบไม่ได้เพราะมีรุ่นแอร์ใช้งานอยู่" : "ลบระบบแอร์"}
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
