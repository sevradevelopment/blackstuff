import type { Metadata } from "next";
import { CmsBody } from "@/components/CmsBody";
import { LegalNotice } from "@/components/LegalNotice";
import { getPage } from "@/lib/db";

export const metadata: Metadata = {
  title: "Ostutingimused",
  description: "Black Stuff Eesti ostutingimused.",
};

export default async function TermsPage() {
  const page = await getPage("tingimused");
  const title = page?.title || "Ostutingimused";
  const body =
    page?.body ||
    "## 1. Üldine\n\nKäesolevad tingimused kehtivad Black Stuff Eesti e-poe ostudele.";

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
