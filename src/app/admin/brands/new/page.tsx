import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, readAdminSession } from "@/lib/adminSession";
import AdminHeader from "../../AdminHeader";
import BrandForm from "../../BrandForm";

export const metadata: Metadata = {
  title: "เพิ่มแบรนด์",
  robots: { index: false, follow: false },
};

export default async function NewBrandPage() {
  const username = readAdminSession((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  if (!username) redirect("/admin/login");

  return (
    <main className="min-h-dvh text-[#26323b]">
      <AdminHeader />
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <nav className="text-sm text-[#52616c]">
          <Link href="/admin" className="font-bold text-[#246b9c] hover:underline">ระบบจัดการ</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <Link href="/admin/brands" className="font-bold text-[#246b9c] hover:underline">แบรนด์</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <span>เพิ่มแบรนด์</span>
        </nav>
        <h1 className="mt-6 text-2xl font-bold text-[#1f303b]">เพิ่มแบรนด์</h1>
        <div className="mt-6 max-w-3xl border-t border-[#dce4e9] pt-6">
          <BrandForm />
        </div>
      </div>
    </main>
  );
}
