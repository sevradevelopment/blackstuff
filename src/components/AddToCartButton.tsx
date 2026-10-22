"use client";

import { useCart } from "@/store/cart";

export function AddToCartButton({
  product,
  quantity = 1,
  className = "btn btn-primary",
  label = "Lisa ostukorvi",
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    image: string;
  };
  quantity?: number;
  className?: string;
  label?: string;
}) {
  const addItem = useCart((s) => s.addItem);

  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        addItem(
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.image,
          },
          quantity,
        )
      }
    >
      {label}
    </button>
  );
}
