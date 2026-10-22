import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "./AddToCartButton";
import { OptimizedImage } from "./OptimizedImage";

export function ProductTile({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
  compact?: boolean;
}) {
  return (
    <article className="group flex h-full min-w-0 flex-col">
      <Link
        href={`/e-pood/${product.slug}`}
        className="img-zoom relative mb-3 aspect-[4/5] overflow-hidden rounded-2xl bg-sand sm:mb-4"
        prefetch
      >
        <OptimizedImage
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          className="object-contain p-4 sm:p-6"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
        />
        {product.compareAtPrice ? (
          <span className="absolute left-3 top-3 rounded-full bg-forest px-2.5 py-1 text-xs text-ivory">
            Soodustus
          </span>
        ) : null}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <Link href={`/e-pood/${product.slug}`} prefetch>
          <h3 className="font-display text-lg leading-snug text-forest sm:text-xl">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-charcoal/65">
          {product.shortDescription}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div className="min-w-0">
            <p className="text-base font-medium text-forest">
              {formatPrice(product.price)}
            </p>
            {product.compareAtPrice ? (
              <p className="text-xs text-charcoal/45 line-through">
                {formatPrice(product.compareAtPrice)}
              </p>
            ) : null}
          </div>
          <AddToCartButton
            product={product}
            className="btn btn-secondary !min-h-10 shrink-0 !px-4 !text-sm"
            label="Lisa"
          />
        </div>
      </div>
    </article>
  );
}
