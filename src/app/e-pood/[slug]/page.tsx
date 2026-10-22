import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductJsonLd } from "@/components/JsonLd";
import { ProductDetail } from "@/components/ProductDetail";
import { ProductTile } from "@/components/ProductTile";
import { getProductBySlug, getPublishedProducts } from "@/lib/db";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await getPublishedProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Toode" };
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.image }],
      type: "website",
    },
    alternates: { canonical: `/e-pood/${product.slug}` },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = (await getPublishedProducts())
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="container-page py-8 sm:py-12 md:py-16">
      <ProductJsonLd product={product} />
      <nav className="mb-8 text-sm text-charcoal/55" aria-label="Asukoht">
        <Link href="/e-pood" className="hover:text-forest">
          E-pood
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="text-forest">{product.name}</span>
      </nav>

      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="mt-20 border-t border-forest/10 pt-14 content-auto">
          <h2 className="font-display text-3xl text-forest">Seotud tooted</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductTile key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
