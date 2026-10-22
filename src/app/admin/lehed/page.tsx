import { PagesAdmin } from "@/components/admin/PagesAdmin";
import { getPages } from "@/lib/db";

export default async function AdminPagesPage() {
  const pages = await getPages();
  return <PagesAdmin pages={pages} />;
}
