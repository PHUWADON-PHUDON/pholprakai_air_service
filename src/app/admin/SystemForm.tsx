"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createSystem, updateSystem, type AirSystem } from "@/features/system/service";

type Props = {
  system?: AirSystem;
  onDone?: (saved: boolean) => void;
};

export default function SystemForm({ system, onDone }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState(system?.name ?? "");
  const [message, setMessage] = useState("");

  const saveMutation = useMutation({
    mutationFn: () => system
      ? updateSystem({ id: system.id, name: name.trim() })
      : createSystem(name.trim()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["air-systems"] });
      queryClient.invalidateQueries({ queryKey: ["air-models"] });
      if (onDone) onDone(true);
      else router.push("/admin/systems");
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
    if (!name.trim()) {
      setMessage("กรุณากรอกชื่อระบบแอร์");
      return;
    }
    setMessage("");
    saveMutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <div>
        <label htmlFor="system-name" className="mb-1.5 block text-sm font-bold text-[#33434e]">ชื่อระบบแอร์</label>
        <input
          id="system-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={500}
          required
          autoFocus
          className="h-10 w-full rounded border border-[#cbd5dc] bg-white px-3 text-sm text-[#26323b] focus:border-[#327db4] focus:outline-2 focus:outline-offset-2 focus:outline-[#327db4]"
        />
      </div>
      {message && <p role="alert" className="text-sm text-[#a43f35]">{message}</p>}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saveMutation.isPending}
          className="h-10 rounded bg-[#327db4] px-5 text-sm font-bold text-white hover:bg-[#246b9c] disabled:cursor-wait disabled:opacity-65"
        >
          {saveMutation.isPending ? "กำลังบันทึก..." : "บันทึก"}
        </button>
        <button
          type="button"
          onClick={() => onDone ? onDone(false) : router.push("/admin/systems")}
          disabled={saveMutation.isPending}
          className="h-10 px-3 text-sm font-bold text-[#52616c] hover:text-[#26323b] disabled:opacity-65"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  );
}
