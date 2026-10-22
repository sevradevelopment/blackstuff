import type { Metadata } from "next";
import { CmsBody } from "@/components/CmsBody";
import { LegalNotice } from "@/components/LegalNotice";
import { getPage } from "@/lib/db";

export const metadata: Metadata = {
  title: "Küpsised",
  description: "Black Stuff Eesti küpsiste teave.",
};

export default async function CookiesPage() {
  const page = await getPage("kupsised");
  const title = page?.title || "Küpsised";
  const body =
    page?.body ||
    "Kasutame tehnilisi küpsiseid ostukorvi ja admin-sessiooni jaoks.";

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
