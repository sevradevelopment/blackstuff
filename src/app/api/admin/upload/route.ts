import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import sharp from "sharp";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Fail puudub" }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { error: "Lubatud: JPG, PNG, WebP, GIF, AVIF" },
        { status: 400 },
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Fail on liiga suur (max 8 MB)" },
        { status: 400 },
      );
    }

    const folder = form.get("folder");
    const dirName =
      typeof folder === "string" && /^[a-z0-9_-]+$/i.test(folder)
        ? folder
        : "general";

    const buf = Buffer.from(await file.arrayBuffer());
    const id = nanoid(10);
    const outDir = path.join(process.cwd(), "public", "uploads", dirName);
    await fs.mkdir(outDir, { recursive: true });

    const filename = `${id}.webp`;
    const outPath = path.join(outDir, filename);

    await sharp(buf)
      .rotate()
      .resize({ width: 2560, height: 2560, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 88 })
      .toFile(outPath);

    const url = `/uploads/${dirName}/${filename}`;
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json(
      { error: "Üleslaadimine ebaõnnestus" },
      { status: 500 },
    );
  }
}
