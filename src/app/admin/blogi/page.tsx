import { BlogAdmin } from "@/components/admin/BlogAdmin";
import { getAllBlogPosts } from "@/lib/db";

export default async function AdminBlogPage() {
  const posts = await getAllBlogPosts();
  /** Slim payload — full content loaded on edit */
  const list = posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    author: p.author,
    publishedAt: p.publishedAt,
    published: p.published,
    needsReview: p.needsReview,
    image: p.image,
    excerpt: "",
    content: "",
  }));
  return <BlogAdmin posts={list} />;
}
