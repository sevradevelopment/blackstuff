import { cache } from "react";
import { promises as fs } from "fs";
import path from "path";
import type {
  BlogPost,
  Category,
  CmsPage,
  Database,
  Order,
  Product,
  SiteContent,
} from "./types";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

/** Process-level cache — avoids re-reading/parsing db.json on every admin nav */
let memCache: { mtimeMs: number; data: Database } | null = null;

async function readDb(): Promise<Database> {
  const stat = await fs.stat(DB_PATH);
  if (memCache && memCache.mtimeMs === stat.mtimeMs) {
    return memCache.data;
  }
  const raw = await fs.readFile(DB_PATH, "utf8");
  const data = JSON.parse(raw) as Database;
  memCache = { mtimeMs: stat.mtimeMs, data };
  return data;
}

/** Request-scoped cache — same render tree shares one disk read */
export const getDb = cache(async (): Promise<Database> => readDb());

async function writeDb(db: Database): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
  const stat = await fs.stat(DB_PATH);
  memCache = { mtimeMs: stat.mtimeMs, data: db };
}

export const getPublishedProducts = cache(async (): Promise<Product[]> => {
  const db = await getDb();
  return db.products.filter((p) => p.published);
});

export const getProductBySlug = cache(
  async (slug: string): Promise<Product | null> => {
    const db = await getDb();
    return db.products.find((p) => p.slug === slug && p.published) ?? null;
  },
);

export const getAllProducts = cache(async (): Promise<Product[]> => {
  const db = await getDb();
  return db.products;
});

export async function getProductById(id: string): Promise<Product | null> {
  const db = await readDb();
  return db.products.find((p) => p.id === id) ?? null;
}

export async function upsertProduct(product: Product): Promise<Product> {
  const db = await readDb();
  const idx = db.products.findIndex((p) => p.id === product.id);
  if (idx >= 0) db.products[idx] = product;
  else db.products.push(product);
  await writeDb(db);
  return product;
}

export async function deleteProduct(id: string): Promise<void> {
  const db = await readDb();
  db.products = db.products.filter((p) => p.id !== id);
  await writeDb(db);
}

export async function getOrders(): Promise<Order[]> {
  const db = await readDb();
  return [...db.orders].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  );
}

export async function createOrder(
  order: Order,
  opts?: { reserveStock?: boolean },
): Promise<Order> {
  const db = await readDb();
  db.orders.unshift(order);
  if (opts?.reserveStock !== false && order.paymentStatus !== "pending") {
    for (const item of order.items) {
      const product = db.products.find((p) => p.id === item.productId);
      if (product) product.stock = Math.max(0, product.stock - item.quantity);
    }
  }
  await writeDb(db);
  return order;
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"],
): Promise<Order | null> {
  const db = await readDb();
  const order = db.orders.find((o) => o.id === id);
  if (!order) return null;
  order.status = status;
  await writeDb(db);
  return order;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const db = await readDb();
  return db.orders.find((o) => o.id === id) ?? null;
}

export async function updateOrder(
  id: string,
  patch: Partial<Order>,
): Promise<Order | null> {
  const db = await readDb();
  const order = db.orders.find((o) => o.id === id);
  if (!order) return null;
  const becamePaid =
    patch.paymentStatus === "paid" && order.paymentStatus !== "paid";
  Object.assign(order, patch);
  if (becamePaid) {
    for (const item of order.items) {
      const product = db.products.find((p) => p.id === item.productId);
      if (product) product.stock = Math.max(0, product.stock - item.quantity);
    }
  }
  await writeDb(db);
  return order;
}

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const db = await getDb();
  return db.siteContent;
});

export async function updateSiteContent(
  content: SiteContent,
): Promise<SiteContent> {
  const db = await readDb();
  db.siteContent = content;
  await writeDb(db);
  return content;
}

export const getCategories = cache(async () => {
  const db = await getDb();
  return db.categories;
});

export async function upsertCategory(category: Category): Promise<Category> {
  const db = await readDb();
  const idx = db.categories.findIndex((c) => c.id === category.id);
  if (idx >= 0) db.categories[idx] = category;
  else db.categories.push(category);
  await writeDb(db);
  return category;
}

export async function deleteCategory(id: string): Promise<void> {
  const db = await readDb();
  const inUse = db.products.some((p) => p.categoryId === id);
  if (inUse) {
    throw new Error("Kategooriat kasutavad tooted – ei saa kustutada.");
  }
  db.categories = db.categories.filter((c) => c.id !== id);
  await writeDb(db);
}

export const getPages = cache(async (): Promise<Record<string, CmsPage>> => {
  const db = await getDb();
  return db.pages ?? {};
});

export const getPage = cache(async (slug: string): Promise<CmsPage | null> => {
  const db = await getDb();
  return db.pages?.[slug] ?? null;
});

export async function updatePages(
  pages: Record<string, CmsPage>,
): Promise<Record<string, CmsPage>> {
  const db = await readDb();
  db.pages = pages;
  await writeDb(db);
  return pages;
}

export async function upsertPage(
  slug: string,
  page: CmsPage,
): Promise<CmsPage> {
  const db = await readDb();
  if (!db.pages) db.pages = {};
  db.pages[slug] = page;
  await writeDb(db);
  return page;
}

export async function getContactMessages() {
  const db = await readDb();
  return db.contactMessages ?? [];
}

export async function deleteContactMessage(id: string): Promise<void> {
  const db = await readDb();
  db.contactMessages = db.contactMessages.filter((m) => m.id !== id);
  await writeDb(db);
}

function sortBlogPosts(posts: BlogPost[]) {
  return [...posts].sort(
    (a, b) =>
      b.publishedAt.localeCompare(a.publishedAt) ||
      a.title.localeCompare(b.title, "et"),
  );
}

export const getBlogPosts = cache(async () => {
  const db = await getDb();
  return sortBlogPosts(db.blogPosts.filter((p) => p.published));
});

export const getAllBlogPosts = cache(async () => {
  const db = await getDb();
  return sortBlogPosts(db.blogPosts);
});

export const getBlogPost = cache(async (slug: string) => {
  const db = await getDb();
  return db.blogPosts.find((p) => p.slug === slug && p.published) ?? null;
});

export async function upsertBlogPost(post: BlogPost): Promise<BlogPost> {
  const db = await readDb();
  const idx = db.blogPosts.findIndex((p) => p.id === post.id);
  if (idx >= 0) db.blogPosts[idx] = post;
  else db.blogPosts.push(post);
  await writeDb(db);
  return post;
}

export async function deleteBlogPost(id: string): Promise<void> {
  const db = await readDb();
  db.blogPosts = db.blogPosts.filter((p) => p.id !== id);
  await writeDb(db);
}

export async function addContactMessage(input: {
  name: string;
  email: string;
  message: string;
  id: string;
}) {
  const db = await readDb();
  db.contactMessages.unshift({
    ...input,
    createdAt: new Date().toISOString(),
  });
  await writeDb(db);
}

export async function getAdmin() {
  const db = await readDb();
  return db.admin;
}
