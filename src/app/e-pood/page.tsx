import type { Metadata } from "next";
import { ShopCatalog } from "@/components/ShopCatalog";
import { getCategories, getPublishedProducts } from "@/lib/db";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "E-pood",
  description: "Black Stuff Eesti tootekataloog – kapslid, pulbrid, komplektid ja rohkem.",
  alternates: { canonical: "/e-pood" },
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getPublishedProducts(),
    getCategories(),
  ]);

  return (
    <div className="container-page py-8 sm:py-12 md:py-16">
      <div className="mb-6 max-w-2xl sm:mb-10">
        <p className="text-sm uppercase tracking-[0.18em] text-clay">E-pood</p>
        <h1 className="font-display mt-2 text-[1.85rem] leading-tight text-forest sm:text-4xl md:text-5xl">
          Loodusest inspireeritud tooted
        </h1>
        <p className="mt-3 text-sm text-charcoal/70 sm:mt-4 sm:text-base">
          Vali kapslid, pulbrid, komplektid või hooldustooted. Kõik hinnad
          põhinevad Black Stuff Eesti kataloogil.
        </p>
      </div>
      <ShopCatalog products={products} categories={categories} />
    </div>
  );
}
