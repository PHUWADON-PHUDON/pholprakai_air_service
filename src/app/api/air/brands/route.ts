import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, readAdminSession } from "@/lib/adminSession";
import { getPrisma } from "@/lib/prisma";
import { parseBrandInput } from "@/lib/brandInput";

export async function GET() {
  const session = readAdminSession((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ message: "กรุณาเข้าสู่ระบบ" }, { status: 401 });

  const brands = await getPrisma().brand.findMany({
    select: { id: true, name: true, image: true, _count: { select: { models: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(brands.map((brand) => ({
    id: brand.id,
    name: brand.name,
    image: brand.image,
    modelCount: brand._count.models,
  })), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const session = readAdminSession((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ message: "กรุณาเข้าสู่ระบบ" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "ข้อมูลแบรนด์ไม่ถูกต้อง" }, { status: 400 });
  }
  const input = parseBrandInput(body);
  if (!input) return NextResponse.json({ message: "กรุณากรอกชื่อและ URL รูปภาพให้ถูกต้อง" }, { status: 400 });

  const brand = await getPrisma().brand.create({ data: input });
  return NextResponse.json({ ...brand, modelCount: 0 }, { status: 201 });
}
