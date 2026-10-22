import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { deleteProduct, getProductById, upsertProduct } from "@/lib/db";
import type { Product } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Props) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    return NextResponse.json({ error: "Ei leitud" }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function PUT(req: Request, { params }: Props) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await getProductById(id);
  if (!existing) {
    return NextResponse.json({ error: "Ei leitud" }, { status: 404 });
  }
  try {
    const body = (await req.json()) as Partial<Product>;
    const product: Product = {
      ...existing,
      ...body,
      id,
      gallery: body.gallery?.length
        ? body.gallery
        : body.image
          ? [body.image]
          : existing.gallery,
    };
    await upsertProduct(product);
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Uuendamine ebaõnnestus" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await deleteProduct(id);
  return NextResponse.json({ ok: true });
}
