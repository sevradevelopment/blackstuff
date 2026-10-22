import { NextResponse } from "next/server";
import { getSiteContent, updateSiteContent } from "@/lib/db";
import type { SiteContent } from "@/lib/types";

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json({ content });
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as SiteContent;
    const content = await updateSiteContent(body);
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ error: "Salvestamine ebaõnnestus" }, { status: 400 });
  }
}
