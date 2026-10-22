import { NextResponse } from "next/server";
import { deleteBlogPost, getAllBlogPosts, upsertBlogPost } from "@/lib/db";
import type { BlogPost } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Props) {
  const { id } = await params;
  const posts = await getAllBlogPosts();
  const post = posts.find((p) => p.id === id);
  if (!post) {
    return NextResponse.json({ error: "Ei leitud" }, { status: 404 });
  }
  return NextResponse.json({ post });
}

export async function PUT(req: Request, { params }: Props) {
  const { id } = await params;
  const posts = await getAllBlogPosts();
  const existing = posts.find((p) => p.id === id);
  if (!existing) {
    return NextResponse.json({ error: "Ei leitud" }, { status: 404 });
  }
  try {
    const body = (await req.json()) as Partial<BlogPost>;
    const post: BlogPost = {
      ...existing,
      ...body,
      id,
    };
    await upsertBlogPost(post);
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json(
      { error: "Uuendamine ebaõnnestus" },
      { status: 400 },
    );
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  const { id } = await params;
  await deleteBlogPost(id);
  return NextResponse.json({ ok: true });
}
