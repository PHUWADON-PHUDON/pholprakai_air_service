import Link from "next/link";
import Snowflake from "@/components/icons/Snowflake";
import { BUSINESS_NAME } from "@/lib/seo";
import LogoutButton from "./LogoutButton";

export default function AdminHeader() {
  return (
    <header className="border-b border-[#e4e9ed] bg-white">
      <div className="mx-auto flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 text-[#246b9c]">
          <Snowflake color="currentColor" />
          <span className="truncate text-base font-bold sm:text-lg">{BUSINESS_NAME}</span>
        </Link>
        <LogoutButton />
      </div>
    </header>
  );
}
