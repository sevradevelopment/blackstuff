export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Black Stuff Eesti",
        legalName: "Blackstuff OÜ",
        url: "https://blackstuff.ee",
        logo: "https://blackstuff.ee/brand/logo.webp",
        email: "info@blackstuff.ee",
        telephone: "+37258144423",
        address: {
          "@type": "PostalAddress",
          addressCountry: "EE",
        },
      }}
    />
  );
}

export function ProductJsonLd({
  product,
}: {
  product: {
    name: string;
    description: string;
    image: string;
    price: number;
    slug: string;
    stock: number;
  };
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: `https://blackstuff.ee${product.image}`,
        sku: product.slug,
        brand: { "@type": "Brand", name: "Black Stuff" },
        offers: {
          "@type": "Offer",
          url: `https://blackstuff.ee/e-pood/${product.slug}`,
          priceCurrency: "EUR",
          price: product.price.toFixed(2),
          availability:
            product.stock > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        },
      }}
    />
  );
}
