import type { Metadata } from "next";
import { CmsBody } from "@/components/CmsBody";
import { LegalNotice } from "@/components/LegalNotice";
import { getPage } from "@/lib/db";

export const metadata: Metadata = {
  title: "Privaatsuspoliitika",
  description: "Black Stuff Eesti privaatsuspoliitika.",
};

export default async function PrivacyPage() {
  const page = await getPage("privaatsus");
  const title = page?.title || "Privaatsuspoliitika";
  const body =
    page?.body ||
    "## Andmete kasutamine\n\nTöötleme tellimuste ja kontaktivormi jaoks vajalikke andmeid.";

  return (
    <div className="container-page prose-brand max-w-3xl py-12 md:py-16">
      <h1 className="font-display text-4xl text-forest md:text-5xl">{title}</h1>
      <LegalNotice />
      <div className="mt-8">
        <CmsBody body={body} />
      </div>
    </div>
  );
}
