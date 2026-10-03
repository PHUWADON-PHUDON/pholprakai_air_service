import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, readAdminSession } from "@/lib/adminSession";
import { getPrisma } from "@/lib/prisma";
import { parseAirModelInput } from "@/lib/airModelInput";
import { airModelInclude, serializeAirModel } from "@/lib/airModelResponse";
import { Prisma } from "../../../../generated/prisma/client";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: Request) {
  const session = readAdminSession((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ message: "กรุณาเข้าสู่ระบบ" }, { status: 401 });

  const brandId = new URL(request.url).searchParams.get("brandId");
  if (brandId && !UUID_PATTERN.test(brandId)) {
    return NextResponse.json({ message: "แบรนด์ไม่ถูกต้อง" }, { status: 400 });
  }

  const models = await getPrisma().model.findMany({
    where: brandId ? { brandId } : undefined,
    include: airModelInclude,
    orderBy: [{ brand: { name: "asc" } }, { name: "asc" }],
  });

  return NextResponse.json(models.map(serializeAirModel), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const session = readAdminSession((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ message: "กรุณาเข้าสู่ระบบ" }, { status: 401 });

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
    const model = await getPrisma().model.create({
      data: {
        ...fields,
        brand: { connect: { id: brandId } },
        system: { connect: { id: systemId } },
        images: { create: imageUrls.map((imageUrl, position) => ({ imageUrl, position })) },
      },
      include: airModelInclude,
    });
    return NextResponse.json(serializeAirModel(model), { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && ["P2003", "P2025"].includes(error.code)) {
      return NextResponse.json({ message: "ไม่พบแบรนด์หรือระบบแอร์ที่เลือก" }, { status: 400 });
    }
    throw error;
  }
}
