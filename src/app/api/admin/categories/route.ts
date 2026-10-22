import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  deleteCategory,
  getCategories,
  upsertCategory,
} from "@/lib/db";
import type { Category } from "@/lib/types";

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ categories });
}

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const id = body.id || slugify(body.slug || body.name) || nanoid(8);
    const category: Category = {
      id,
      name: body.name,
      slug: body.slug || id,
    };
    await upsertCategory(category);
    return NextResponse.json({ category });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Salvestamine ebaõnnestus" },
      { status: 400 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = schema.extend({ id: z.string().min(1) }).parse(await req.json());
    const category: Category = {
      id: body.id,
      name: body.name,
      slug: body.slug,
    };
    await upsertCategory(category);
    return NextResponse.json({ category });
  } catch {
    return NextResponse.json({ error: "Uuendamine ebaõnnestus" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = z.object({ id: z.string().min(1) }).parse(await req.json());
    await deleteCategory(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      {
        error:
          e instanceof Error ? e.message : "Kustutamine ebaõnnestus",
      },
      { status: 400 },
    );
  }
}
