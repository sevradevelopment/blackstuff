import { ContentAdmin } from "@/components/admin/ContentAdmin";
import { getSiteContent } from "@/lib/db";

export default async function AdminContentPage() {
  const content = await getSiteContent();
  return <ContentAdmin content={content} />;
}
