"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { login } from "@/features/login/service";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (result) => {
      router.replace(result.redirectTo);
      router.refresh();
    },
    onError: (error) => {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        setMessage(error.response?.data?.message ?? "ไม่สามารถเชื่อมต่อระบบเข้าสู่ระบบได้");
      } else {
        setMessage("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
      }
    },
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loginMutation.isPending) return;

    const form = new FormData(event.currentTarget);
    setMessage("");
    loginMutation.mutate({
      username: String(form.get("username") ?? ""),
      password: String(form.get("password") ?? ""),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="username" className="mb-2 block text-sm font-bold text-[#33434e]">
          ชื่อผู้ใช้
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          autoFocus
          required
          placeholder="ชื่อผู้ใช้"
          onChange={() => setMessage("")}
          className="h-11 w-full rounded border border-[#cbd5dc] bg-white px-3.5 text-sm text-[#1f303b] outline-none placeholder:text-[#93a0a8] focus:border-[#327db4] focus:ring-2 focus:ring-[#327db4]/15"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-bold text-[#33434e]">
          รหัสผ่าน
        </label>
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          required
          onChange={() => setMessage("")}
          className="h-11 w-full rounded border border-[#cbd5dc] bg-white px-3.5 text-sm text-[#1f303b] outline-none focus:border-[#327db4] focus:ring-2 focus:ring-[#327db4]/15"
        />
        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm text-[#52616c]">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(event) => setShowPassword(event.target.checked)}
            className="size-4 accent-[#327db4]"
          />
          แสดงรหัสผ่าน
        </label>
      </div>

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="flex h-11 w-full items-center justify-center rounded bg-[#327db4] px-4 text-sm font-bold text-white transition-colors hover:bg-[#246b9c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#327db4] disabled:cursor-wait disabled:opacity-65"
      >
        {loginMutation.isPending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>
      {message && <p role="alert" className="text-sm text-[#a43f35]">{message}</p>}
    </form>
  );
}
