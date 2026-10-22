import { ProductAdmin } from "@/components/admin/ProductAdmin";
import { getAllProducts, getCategories } from "@/lib/db";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);
  /** Slim list — long text fields loaded when editing */
  const list = products.map((p) => ({
    ...p,
    description: "",
    ingredients: "",
    usage: "",
    extraInfo: "",
    shortDescription: p.shortDescription.slice(0, 80),
  }));
  return <ProductAdmin products={list} categories={categories} />;
}
