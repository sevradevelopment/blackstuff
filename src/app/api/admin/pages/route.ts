import { NextResponse } from "next/server";
import { z } from "zod";
import { getPages, updatePages, upsertPage } from "@/lib/db";

const pageSchema = z.object({
  title: z.string().min(1),
  body: z.string(),
});

export async function GET() {
  const pages = await getPages();
  return NextResponse.json({ pages });
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (body.slug && body.page) {
      const page = pageSchema.parse(body.page);
      const saved = await upsertPage(String(body.slug), page);
      return NextResponse.json({ page: saved });
    }
    const pages = z.record(z.string(), pageSchema).parse(body.pages ?? body);
    const saved = await updatePages(pages);
    return NextResponse.json({ pages: saved });
  } catch {
    return NextResponse.json({ error: "Salvestamine ebaõnnestus" }, { status: 400 });
  }
}
