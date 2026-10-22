import type { Metadata } from "next";
import { CmsBody } from "@/components/CmsBody";
import { LegalNotice } from "@/components/LegalNotice";
import { getPage, getSiteContent } from "@/lib/db";

export const metadata: Metadata = {
  title: "Tarneinfo",
  description: "Black Stuff Eesti tarneinfo.",
};

export default async function ShippingPage() {
  const [page, site] = await Promise.all([getPage("tarne"), getSiteContent()]);
  const title = page?.title || "Tarneinfo";
  const body =
    page?.body ||
    `## Tarneviisid\n\nEeldatud tarnekanalid Eestis: Omniva, SmartPost / Montonio pakiautomaat ja kuller.\n\n## Tasuta tarne\n\nTasuta tarne alates ${site.freeShippingFrom} €.`;

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
