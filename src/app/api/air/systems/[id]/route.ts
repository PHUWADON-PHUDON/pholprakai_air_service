import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Prisma } from "../../../../../../generated/prisma/client";
import { ADMIN_SESSION_COOKIE, readAdminSession } from "@/lib/adminSession";
import { getPrisma } from "@/lib/prisma";
import { parseSystemInput } from "@/lib/systemInput";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
type Context = { params: Promise<{ id: string }> };

async function authorizedId(context: Context) {
  const session = readAdminSession((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) return { error: NextResponse.json({ message: "กรุณาเข้าสู่ระบบ" }, { status: 401 }) };
  const { id } = await context.params;
  if (!UUID_PATTERN.test(id)) {
    return { error: NextResponse.json({ message: "รหัสระบบแอร์ไม่ถูกต้อง" }, { status: 400 }) };
  }
  return { id };
}

export async function PUT(request: Request, context: Context) {
  const result = await authorizedId(context);
  if (result.error) return result.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "ข้อมูลระบบแอร์ไม่ถูกต้อง" }, { status: 400 });
  }
  const input = parseSystemInput(body);
  if (!input) return NextResponse.json({ message: "กรุณากรอกชื่อระบบแอร์ไม่เกิน 500 ตัวอักษร" }, { status: 400 });

  try {
    const system = await getPrisma().system.update({ where: { id: result.id }, data: input });
    return NextResponse.json(system);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "ไม่พบระบบแอร์นี้" }, { status: 404 });
    }
    throw error;
  }
}

export async function DELETE(_request: Request, context: Context) {
  const result = await authorizedId(context);
  if (result.error) return result.error;

  const system = await getPrisma().system.findUnique({
    where: { id: result.id },
    select: { id: true, _count: { select: { models: true } } },
  });
  if (!system) return NextResponse.json({ message: "ไม่พบระบบแอร์นี้" }, { status: 404 });
  if (system._count.models > 0) {
    return NextResponse.json({ message: "ลบไม่ได้: ระบบนี้มีรุ่นแอร์ใช้งานอยู่" }, { status: 409 });
  }

  try {
    await getPrisma().system.delete({ where: { id: result.id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      return NextResponse.json({ message: "ลบไม่ได้: ระบบนี้มีรุ่นแอร์ใช้งานอยู่" }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "ไม่พบระบบแอร์นี้" }, { status: 404 });
    }
    throw error;
  }
}
