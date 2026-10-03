import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, readAdminSession } from "@/lib/adminSession";
import { getPrisma } from "@/lib/prisma";
import { parseSystemInput } from "@/lib/systemInput";

export async function GET() {
  const session = readAdminSession((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ message: "กรุณาเข้าสู่ระบบ" }, { status: 401 });

  const systems = await getPrisma().system.findMany({
    select: { id: true, name: true, _count: { select: { models: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(systems.map((system) => ({
    id: system.id,
    name: system.name,
    modelCount: system._count.models,
  })), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const session = readAdminSession((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ message: "กรุณาเข้าสู่ระบบ" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "ข้อมูลระบบแอร์ไม่ถูกต้อง" }, { status: 400 });
  }
  const input = parseSystemInput(body);
  if (!input) return NextResponse.json({ message: "กรุณากรอกชื่อระบบแอร์ไม่เกิน 500 ตัวอักษร" }, { status: 400 });

  const system = await getPrisma().system.create({ data: input });
  return NextResponse.json({ ...system, modelCount: 0 }, { status: 201 });
}
