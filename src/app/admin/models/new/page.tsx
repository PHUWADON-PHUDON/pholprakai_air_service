import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, readAdminSession } from "@/lib/adminSession";
import AdminHeader from "../../AdminHeader";
import AirModelForm from "../../AirModelForm";

export const metadata: Metadata = {
  title: "เพิ่มรุ่นแอร์",
  robots: { index: false, follow: false },
};

export default async function NewAirModelPage() {
  const session = readAdminSession((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) redirect("/admin/login");

  return (
    <main className="min-h-dvh text-[#26323b]">
      <AdminHeader />
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <nav className="text-sm text-[#52616c]">
          <Link href="/admin" className="font-bold text-[#246b9c] hover:underline">ระบบจัดการ</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <span>เพิ่มรุ่นแอร์</span>
        </nav>
        <h1 className="mt-6 mb-6 text-2xl font-bold text-[#1f303b]">เพิ่มรุ่นแอร์</h1>
        <AirModelForm />
      </div>
    </main>
  );
}
