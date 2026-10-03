import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ADMIN_SESSION_COOKIE, readAdminSession } from "@/lib/adminSession";
import AdminHeader from "./AdminHeader";
import AirModelTable from "./AirModelTable";

export const metadata: Metadata = {
  title: "ระบบจัดการ",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const username = readAdminSession((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  if (!username) redirect("/admin/login");

  return (
    <main className="min-h-dvh text-[#26323b]">
      <AdminHeader />
      <div className="mx-auto px-5 py-10 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1f303b]">ระบบจัดการ</h1>
            <p className="mt-3 text-[#52616c]">เข้าสู่ระบบในชื่อ {username}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/brands"
              className="flex h-10 items-center rounded border border-[#327db4] px-4 text-sm font-bold text-[#246b9c] hover:bg-[#e5f0f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#327db4]"
            >
              จัดการแบรนด์
            </Link>
            <Link
              href="/admin/systems"
              className="flex h-10 items-center rounded border border-[#327db4] px-4 text-sm font-bold text-[#246b9c] hover:bg-[#e5f0f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#327db4]"
            >
              จัดการระบบแอร์
            </Link>
          </div>
        </div>
        <AirModelTable />
      </div>
    </main>
  );
}
