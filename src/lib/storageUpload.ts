import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function imageExtension(bytes: Uint8Array) {
  if (bytes.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((byte, index) => bytes[index] === byte)) return "png";
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes.length >= 6 && ["GIF87a", "GIF89a"].includes(String.fromCharCode(...bytes.slice(0, 6)))) return "gif";
  if (bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP") return "webp";
  return null;
}

export async function uploadImageToStorage(request: Request, folder: "brands" | "models") {
  if (Number(request.headers.get("content-length")) > MAX_IMAGE_SIZE + 100_000) {
    return NextResponse.json({ message: "รูปภาพต้องมีขนาดไม่เกิน 5 MB" }, { status: 413 });
  }

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return NextResponse.json({ message: "ไฟล์รูปภาพไม่ถูกต้อง" }, { status: 400 });
  }
  const file = data.get("file");
  if (!(file instanceof File) || file.size === 0 || file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json({ message: "กรุณาเลือกรูปภาพขนาดไม่เกิน 5 MB" }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const extension = imageExtension(bytes);
  if (!extension) return NextResponse.json({ message: "รองรับเฉพาะ PNG, JPG, GIF และ WebP" }, { status: 400 });

  const baseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;
  if (!baseUrl || !secretKey || !bucket) {
    return NextResponse.json({ message: "ยังไม่ได้ตั้งค่า Supabase Storage" }, { status: 503 });
  }

  const path = `${folder}/${randomUUID()}.${extension}`;
  let upload: Response;
  try {
    upload = await fetch(`${baseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${path}`, {
      method: "POST",
      headers: {
        apikey: secretKey,
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": extension === "jpg" ? "image/jpeg" : `image/${extension}`,
        "cache-control": "3600",
      },
      body: bytes,
      cache: "no-store",
      signal: AbortSignal.timeout(3 * 60 * 1000),
    });
  } catch (error) {
    console.error("Image upload request failed", error);
    return NextResponse.json({ message: "เชื่อมต่อ Storage ไม่สำเร็จ" }, { status: 502 });
  }
  if (!upload.ok) {
    console.error("Image upload failed", upload.status);
    return NextResponse.json({ message: "อัปโหลดรูปภาพไม่สำเร็จ กรุณาตรวจสอบ Storage bucket" }, { status: 502 });
  }

  const url = `${baseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${path}`;
  return NextResponse.json({ url }, { status: 201 });
}
