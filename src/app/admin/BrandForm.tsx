"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { createBrand, updateBrand, uploadBrandImage, type Brand } from "@/features/brand/service";

type Props = {
  brand?: Brand;
  onDone?: (saved: boolean) => void;
};

export default function BrandForm({ brand, onDone }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState(brand?.name ?? "");
  const [image, setImage] = useState(brand?.image ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const saveMutation = useMutation({
    mutationFn: async () => {
      const imageUrl = file ? await uploadBrandImage(file) : image.trim();
      const input = { name: name.trim(), image: imageUrl };
      return brand ? updateBrand({ id: brand.id, input }) : createBrand(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["air-brands"] });
      queryClient.invalidateQueries({ queryKey: ["air-models"] });
      if (onDone) onDone(true);
      else {
        router.push("/admin/brands");
      }
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
    if (!name.trim() || (!image.trim() && !file)) {
      setMessage("กรุณากรอกชื่อและเลือกรูปภาพหรือ URL รูปภาพ");
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
      setMessage("รูปภาพต้องมีขนาดไม่เกิน 5 MB");
      return;
    }
    setMessage("");
    saveMutation.mutate();
  }

  function cancel() {
    if (onDone) onDone(false);
    else router.push("/admin/brands");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="brand-name" className="mb-1.5 block text-sm font-bold text-[#33434e]">ชื่อแบรนด์</label>
        <input
          id="brand-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={500}
          required
          autoFocus
          className="h-10 w-full rounded border border-[#cbd5dc] bg-white px-3 text-sm text-[#26323b] focus:border-[#327db4] focus:outline-2 focus:outline-offset-2 focus:outline-[#327db4]"
        />
      </div>
      <div>
        <label htmlFor="brand-image-url" className="mb-1.5 block text-sm font-bold text-[#33434e]">URL รูปภาพ</label>
        <input
          id="brand-image-url"
          type="url"
          value={image}
          onChange={(event) => setImage(event.target.value)}
          disabled={!!file}
          placeholder="https://..."
          className="h-10 w-full rounded border border-[#cbd5dc] bg-white px-3 text-sm text-[#26323b] focus:border-[#327db4] focus:outline-2 focus:outline-offset-2 focus:outline-[#327db4] disabled:bg-[#f0f4f6]"
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="brand-image-file" className="mb-1.5 block text-sm font-bold text-[#33434e]">อัปโหลดรูปภาพ</label>
        <input
          id="brand-image-file"
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="block w-full max-w-lg text-sm text-[#52616c] file:mr-3 file:rounded file:border-0 file:bg-[#e5f0f7] file:px-3 file:py-2 file:font-bold file:text-[#246b9c]"
        />
      </div>
      {message && <p role="alert" className="text-sm text-[#a43f35] sm:col-span-2">{message}</p>}
      <div className="flex items-center gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={saveMutation.isPending}
          className="h-10 rounded bg-[#327db4] px-5 text-sm font-bold text-white hover:bg-[#246b9c] disabled:cursor-wait disabled:opacity-65"
        >
          {saveMutation.isPending ? "กำลังบันทึก..." : "บันทึก"}
        </button>
        <button type="button" onClick={cancel} disabled={saveMutation.isPending} className="h-10 px-3 text-sm font-bold text-[#52616c] hover:text-[#26323b]">
          ยกเลิก
        </button>
      </div>
    </form>
  );
}
