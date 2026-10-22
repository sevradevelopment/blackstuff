"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category, Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { ImageField } from "./ImageField";

export function ProductAdmin({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function openEdit(id: string) {
    setLoadingId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/products/${id}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Laadimine ebaõnnestus");
        return;
      }
      setCreating(false);
      setEditing(data.product as Product);
    } finally {
      setLoadingId(null);
    }
  }

  async function save(product: Partial<Product> & { id?: string }) {
    setError("");
    const isNew = !product.id || creating;
    const res = await fetch(
      isNew ? "/api/admin/products" : `/api/admin/products/${product.id}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      },
    );
    if (!res.ok) {
      setError("Salvestamine ebaõnnestus");
      return;
    }
    setEditing(null);
    setCreating(false);
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Kustuta toode?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    router.refresh();
  }

  const blank: Product = {
    id: "",
    slug: "",
    name: "",
    shortDescription: "",
    description: "",
    ingredients: "",
    usage: "",
    extraInfo: "",
    price: 0,
    compareAtPrice: null,
    image: "/products/caps-90.webp",
    gallery: ["/products/caps-90.webp"],
    categoryId: categories[0]?.id || "muud",
    stock: 0,
    published: false,
    featured: false,
  };

  const formProduct = creating ? blank : editing;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-forest">Tooted</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setCreating(true);
            setEditing(null);
          }}
        >
          Lisa toode
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      {formProduct && (
        <ProductForm
          key={formProduct.id || "new"}
          product={formProduct}
          categories={categories}
          onCancel={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={save}
        />
      )}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-forest/10 bg-ivory">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-forest/10 text-charcoal/55">
            <tr>
              <th className="px-4 py-3 font-medium">Nimi</th>
              <th className="px-4 py-3 font-medium">Hind</th>
              <th className="px-4 py-3 font-medium">Ladu</th>
              <th className="px-4 py-3 font-medium">Staatus</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-forest/5">
                <td className="px-4 py-3 text-forest">{p.name}</td>
                <td className="px-4 py-3">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">
                  {p.published ? "Avalik" : "Peidetud"}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    className="mr-3 text-forest underline-offset-2 hover:underline disabled:opacity-50"
                    disabled={loadingId === p.id}
                    onClick={() => void openEdit(p.id)}
                  >
                    {loadingId === p.id ? "Laen…" : "Muuda"}
                  </button>
                  <button
                    type="button"
                    className="text-red-700 underline-offset-2 hover:underline"
                    onClick={() => remove(p.id)}
                  >
                    Kustuta
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductForm({
  product,
  categories,
  onSave,
  onCancel,
}: {
  product: Product;
  categories: Category[];
  onSave: (p: Partial<Product>) => Promise<void>;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(product);

  return (
    <form
      className="mt-6 space-y-4 rounded-2xl border border-forest/10 bg-ivory p-6"
      onSubmit={(e) => {
        e.preventDefault();
        void onSave(draft);
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Nimi"
          value={draft.name}
          onChange={(v) => setDraft({ ...draft, name: v })}
        />
        <Field
          label="Slug"
          value={draft.slug}
          onChange={(v) => setDraft({ ...draft, slug: v })}
        />
        <Field
          label="Hind (€)"
          type="number"
          value={String(draft.price)}
          onChange={(v) => setDraft({ ...draft, price: Number(v) })}
        />
        <Field
          label="Ladu"
          type="number"
          value={String(draft.stock)}
          onChange={(v) => setDraft({ ...draft, stock: Number(v) })}
        />
        <div className="md:col-span-2">
          <ImageField
            label="Tootepilt"
            value={draft.image}
            folder="products"
            onChange={(url) =>
              setDraft({ ...draft, image: url, gallery: url ? [url] : [] })
            }
          />
        </div>
        <div>
          <label className="label">Kategooria</label>
          <select
            className="input"
            value={draft.categoryId}
            onChange={(e) =>
              setDraft({
                ...draft,
                categoryId: e.target.value as Product["categoryId"],
              })
            }
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Field
        label="Lühikirjeldus"
        value={draft.shortDescription}
        onChange={(v) => setDraft({ ...draft, shortDescription: v })}
      />
      <div>
        <label className="label">Kirjeldus</label>
        <textarea
          className="input min-h-[6rem]"
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">Koostisosad</label>
          <textarea
            className="input min-h-[5rem]"
            value={draft.ingredients}
            onChange={(e) =>
              setDraft({ ...draft, ingredients: e.target.value })
            }
          />
        </div>
        <div>
          <label className="label">Kasutamine</label>
          <textarea
            className="input min-h-[5rem]"
            value={draft.usage}
            onChange={(e) => setDraft({ ...draft, usage: e.target.value })}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={draft.published}
            onChange={(e) =>
              setDraft({ ...draft, published: e.target.checked })
            }
          />
          Avaldatud
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!draft.featured}
            onChange={(e) =>
              setDraft({ ...draft, featured: e.target.checked })
            }
          />
          Esiletõstetud
        </label>
      </div>
      <div className="flex gap-3">
        <button type="submit" className="btn btn-primary">
          Salvesta
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Tühista
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        className="input"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={label === "Nimi" || label === "Slug"}
      />
    </div>
  );
}
