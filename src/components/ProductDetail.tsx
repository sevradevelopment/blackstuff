"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "./AddToCartButton";
import { OptimizedImage } from "./OptimizedImage";

export function ProductDetail({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(product.gallery[0] || product.image);

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
      <div>
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand sm:rounded-[1.5rem]">
          <OptimizedImage
            src={active}
            alt={product.name}
            fill
            className="object-contain p-4 sm:p-6 md:p-8"
            sizes="(max-width:1024px) 100vw, 50vw"
            priority
            quality={95}
          />
        </div>
        {product.gallery.length > 1 && (
          <div className="chip-scroll mt-3 gap-2">
            {product.gallery.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => setActive(src)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-sand sm:h-20 sm:w-20 ${
                  active === src
                    ? "ring-2 ring-forest"
                    : "ring-1 ring-transparent"
                }`}
                aria-label="Vaata galeriipilti"
              >
                <OptimizedImage
                  src={src}
                  alt=""
                  fill
                  className="object-contain p-1"
                  sizes="80px"
                  quality={95}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="min-w-0 pb-20 lg:pb-0">
        <p className="text-xs uppercase tracking-[0.16em] text-clay sm:text-sm">
          {product.categoryId}
        </p>
        <h1 className="font-display mt-2 text-[1.75rem] leading-tight text-forest sm:text-3xl md:text-5xl">
          {product.name}
        </h1>
        <div className="mt-4 flex flex-wrap items-baseline gap-3">
          <p className="text-xl font-medium text-forest sm:text-2xl">
            {formatPrice(product.price)}
          </p>
          {product.compareAtPrice ? (
            <p className="text-sm text-charcoal/45 line-through sm:text-base">
              {formatPrice(product.compareAtPrice)}
            </p>
          ) : null}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-charcoal/75 sm:mt-5 sm:text-base">
          {product.shortDescription}
        </p>

        <div className="mt-6 hidden flex-wrap items-center gap-3 sm:mt-8 lg:flex">
          <QtyControl qty={qty} setQty={setQty} />
          <AddToCartButton
            product={product}
            quantity={qty}
            className="btn btn-primary min-w-[12rem]"
          />
        </div>

        <p className="mt-3 text-xs text-charcoal/55">
          Laos: {product.stock > 0 ? `${product.stock} tk` : "hetkel otsas"}
          {product.netWeight ? ` · ${product.netWeight}` : ""}
        </p>

        <div className="mt-8 space-y-6 border-t border-forest/10 pt-6 sm:mt-10 sm:pt-8">
          <section>
            <h2 className="font-display text-xl text-forest sm:text-2xl">
              Kirjeldus
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-charcoal/75">
              {product.description}
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-forest sm:text-2xl">
              Koostisosad
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/75">
              {product.ingredients}
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-forest sm:text-2xl">
              Kasutamine
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/75">
              {product.usage}
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-forest sm:text-2xl">
              Lisainfo
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/75">
              {product.extraInfo}
            </p>
          </section>
        </div>
      </div>

      {/* Sticky mobile purchase bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-forest/10 bg-ivory/95 px-3 py-2.5 backdrop-blur-md lg:hidden"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <QtyControl qty={qty} setQty={setQty} />
          <AddToCartButton
            product={product}
            quantity={qty}
            className="btn btn-primary min-w-0 flex-1 !px-3 !text-sm"
            label="Lisa ostukorvi"
          />
        </div>
      </div>
    </div>
  );
}

function QtyControl({
  qty,
  setQty,
}: {
  qty: number;
  setQty: (fn: (q: number) => number) => void;
}) {
  return (
    <div className="inline-flex shrink-0 items-center rounded-full border border-forest/15">
      <button
        type="button"
        className="flex h-11 w-10 items-center justify-center text-lg text-forest sm:h-12 sm:w-11"
        onClick={() => setQty((q) => Math.max(1, q - 1))}
        aria-label="Vähenda"
      >
        −
      </button>
      <span className="w-8 text-center text-sm tabular-nums sm:w-10">{qty}</span>
      <button
        type="button"
        className="flex h-11 w-10 items-center justify-center text-lg text-forest sm:h-12 sm:w-11"
        onClick={() => setQty((q) => q + 1)}
        aria-label="Suurenda"
      >
        +
      </button>
    </div>
  );
}
