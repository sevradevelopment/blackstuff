"use client";

import { useMemo, useState } from "react";
import type { Category, Product } from "@/lib/types";
import { ProductTile } from "./ProductTile";

type SortKey = "popular" | "price-asc" | "price-desc" | "name";

export function ShopCatalog({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("popular");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filtered = useMemo(() => {
    let list = [...products];

    if (category !== "all") {
      list = list.filter((p) => p.categoryId === category);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q),
      );
    }

    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;
    if (min !== null && !Number.isNaN(min)) {
      list = list.filter((p) => p.price >= min);
    }
    if (max !== null && !Number.isNaN(max)) {
      list = list.filter((p) => p.price <= max);
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name, "et"));
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return list;
  }, [products, category, query, sort, minPrice, maxPrice]);

  return (
    <div>
      <div className="mb-6 space-y-3 rounded-2xl bg-sand/50 p-3 sm:mb-8 sm:p-5">
        <input
          className="input"
          placeholder="Otsi tooteid…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Otsi tooteid"
        />

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto] sm:gap-3">
          <select
            className="input"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sorteeri"
          >
            <option value="popular">Populaarsus</option>
            <option value="price-asc">Hind: odavamad ees</option>
            <option value="price-desc">Hind: kallimad ees</option>
            <option value="name">Nimi A–Y</option>
          </select>
          <input
            className="input"
            type="number"
            inputMode="decimal"
            min={0}
            placeholder="Min €"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            aria-label="Minimaalne hind"
          />
          <input
            className="input"
            type="number"
            inputMode="decimal"
            min={0}
            placeholder="Max €"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            aria-label="Maksimaalne hind"
          />
        </div>

        <div className="chip-scroll">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`shrink-0 rounded-full px-3.5 py-2 text-sm ${
              category === "all" ? "bg-forest text-ivory" : "bg-ivory text-forest"
            }`}
          >
            Kõik
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-sm ${
                category === c.id
                  ? "bg-forest text-ivory"
                  : "bg-ivory text-forest"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-5 text-sm text-charcoal/60">{filtered.length} toodet</p>

      {filtered.length === 0 ? (
        <p className="rounded-2xl bg-sand/40 px-6 py-14 text-center text-charcoal/65">
          Ühtegi toodet ei leitud.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
