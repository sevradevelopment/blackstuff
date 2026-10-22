import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getAllBlogPosts, upsertBlogPost } from "@/lib/db";
import type { BlogPost } from "@/lib/types";

const schema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string(),
  content: z.string(),
  image: z.string().min(1),
  author: z.string().min(1),
  publishedAt: z.string().min(1),
  published: z.boolean(),
  needsReview: z.boolean().optional(),
  sourceUrl: z.string().optional(),
});

export async function GET() {
  const posts = await getAllBlogPosts();
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const post: BlogPost = {
      id: body.id || `b-${nanoid(8)}`,
      slug: body.slug,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      image: body.image,
      author: body.author,
      publishedAt: body.publishedAt,
      published: body.published,
      needsReview: body.needsReview ?? true,
      sourceUrl: body.sourceUrl,
    };
    await upsertBlogPost(post);
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json(
      { error: "Artikli salvestamine ebaõnnestus." },
      { status: 400 },
    );
  }
}
