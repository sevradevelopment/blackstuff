import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAllProducts, upsertProduct } from "@/lib/db";
import type { CategoryId, Product } from "@/lib/types";

const productSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  shortDescription: z.string(),
  description: z.string(),
  ingredients: z.string(),
  usage: z.string(),
  extraInfo: z.string(),
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nullable().optional(),
  image: z.string(),
  gallery: z.array(z.string()).optional(),
  categoryId: z.string().min(1),
  stock: z.number().int(),
  published: z.boolean(),
  featured: z.boolean().optional(),
  netWeight: z.string().optional(),
});

export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  try {
    const body = productSchema.parse(await req.json());
    const product: Product = {
      id: body.id || `p-${nanoid(8)}`,
      slug: body.slug,
      name: body.name,
      shortDescription: body.shortDescription,
      description: body.description,
      ingredients: body.ingredients,
      usage: body.usage,
      extraInfo: body.extraInfo,
      price: body.price,
      compareAtPrice: body.compareAtPrice ?? null,
      image: body.image,
      gallery: body.gallery?.length ? body.gallery : [body.image],
      categoryId: body.categoryId as CategoryId,
      stock: body.stock,
      published: body.published,
      featured: body.featured ?? false,
      netWeight: body.netWeight,
    };
    await upsertProduct(product);
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json(
      { error: "Toote salvestamine ebaõnnestus." },
      { status: 400 },
    );
  }
}
