import { CategoriesAdmin } from "@/components/admin/CategoriesAdmin";
import { getCategories } from "@/lib/db";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  return <CategoriesAdmin categories={categories} />;
}
