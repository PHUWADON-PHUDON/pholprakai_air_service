import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Prisma } from "../../../../../generated/prisma/client";
import { ADMIN_SESSION_COOKIE, readAdminSession } from "@/lib/adminSession";
import { parseAirModelInput } from "@/lib/airModelInput";
import { airModelInclude, serializeAirModel } from "@/lib/airModelResponse";
import { getPrisma } from "@/lib/prisma";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
type Context = { params: Promise<{ id: string }> };

async function authorizedId(context: Context) {
  const session = readAdminSession((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) return { error: NextResponse.json({ message: "กรุณาเข้าสู่ระบบ" }, { status: 401 }) };
  const { id } = await context.params;
  if (!UUID_PATTERN.test(id)) {
    return { error: NextResponse.json({ message: "รหัสรุ่นแอร์ไม่ถูกต้อง" }, { status: 400 }) };
  }
  return { id };
}

export async function GET(_request: Request, context: Context) {
  const result = await authorizedId(context);
  if (result.error) return result.error;

  const model = await getPrisma().model.findUnique({ where: { id: result.id }, include: airModelInclude });
  if (!model) return NextResponse.json({ message: "ไม่พบรุ่นแอร์นี้" }, { status: 404 });
  return NextResponse.json(serializeAirModel(model), { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request, context: Context) {
  const result = await authorizedId(context);
  if (result.error) return result.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "ข้อมูลรุ่นแอร์ไม่ถูกต้อง" }, { status: 400 });
  }
  const input = parseAirModelInput(body);
  if (!input) return NextResponse.json({ message: "กรุณากรอกข้อมูลรุ่นแอร์ให้ครบและถูกต้อง" }, { status: 400 });

  const { brandId, systemId, imageUrls, ...fields } = input;
  try {
    const model = await getPrisma().$transaction(async (tx) => {
      const existing = await tx.model.findUnique({
        where: { id: result.id },
        select: { id: true },
      });
      if (!existing) return null;

      await tx.model.update({
        where: { id: result.id },
        data: {
          ...fields,
          brand: { connect: { id: brandId } },
          system: { connect: { id: systemId } },
        },
      });
      await tx.image.deleteMany({ where: { modelId: result.id } });
      await tx.image.createMany({
        data: imageUrls.map((imageUrl, position) => ({ modelId: result.id, imageUrl, position })),
      });
      return tx.model.findUnique({ where: { id: result.id }, include: airModelInclude });
    });
    if (!model) return NextResponse.json({ message: "ไม่พบรุ่นแอร์นี้" }, { status: 404 });
    return NextResponse.json(serializeAirModel(model));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && ["P2003", "P2025"].includes(error.code)) {
      return NextResponse.json({ message: "ไม่พบแบรนด์หรือระบบแอร์ที่เลือก" }, { status: 400 });
    }
    throw error;
  }
}

export async function DELETE(_request: Request, context: Context) {
  const result = await authorizedId(context);
  if (result.error) return result.error;

  try {
    const deleted = await getPrisma().model.deleteMany({ where: { id: result.id } });
    if (!deleted.count) return NextResponse.json({ message: "ไม่พบรุ่นแอร์นี้" }, { status: 404 });
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ message: "ไม่พบรุ่นแอร์นี้" }, { status: 404 });
    }
    throw error;
  }
}
