import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Snowflake from "@/components/icons/Snowflake";
import { BUSINESS_NAME } from "@/lib/seo";
import { ADMIN_SESSION_COOKIE, readAdminSession } from "@/lib/adminSession";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบผู้ดูแล",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = readAdminSession((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  if (session) redirect("/admin");

  return (
    <main className="flex min-h-dvh flex-col text-[#26323b]">
      <header className="border-b border-[#e4e9ed] bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-2.5 text-[#246b9c] hover:text-[#164f78]">
            <Snowflake color="currentColor" />
            <span className="truncate text-base font-bold sm:text-lg">{BUSINESS_NAME}</span>
          </Link>
          <Link href="/" className="shrink-0 text-sm text-[#52616c] underline-offset-4 hover:text-[#246b9c] hover:underline">
            กลับหน้าเว็บไซต์
          </Link>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <section className="w-full max-w-[420px] rounded-md border border-[#e1e7eb] bg-white px-6 py-8 shadow-[0_12px_36px_rgba(28,49,63,0.06)] sm:px-9 sm:py-10" aria-labelledby="login-title">
          <div className="mb-8">
            <p className="mb-2 text-xs font-bold text-[#398055]">ระบบจัดการ</p>
            <h1 id="login-title" className="text-[26px] font-bold leading-tight text-[#1f303b]">
              เข้าสู่ระบบผู้ดูแล
            </h1>
          </div>
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
