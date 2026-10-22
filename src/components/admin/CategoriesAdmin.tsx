"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/lib/types";

export function CategoriesAdmin({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function save(cat: Category) {
    setError("");
    const isNew = creating || !categories.some((c) => c.id === cat.id);
    const res = await fetch("/api/admin/categories", {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cat),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Salvestamine ebaõnnestus");
      return;
    }
    setDraft(null);
    setCreating(false);
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Kustuta kategooria?")) return;
    const res = await fetch("/api/admin/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Kustutamine ebaõnnestus");
      return;
    }
    router.refresh();
  }

  const form = creating
    ? { id: "", name: "", slug: "" }
    : draft;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-forest">Kategooriad</h1>
          <p className="mt-2 text-sm text-charcoal/60">
            Tootekategooriad e-poe filtrites.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setCreating(true);
            setDraft(null);
          }}
        >
          Lisa kategooria
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      {form && (
        <form
          className="mt-8 max-w-lg space-y-4 rounded-2xl border border-forest/10 bg-ivory p-6"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const name = String(fd.get("name") || "");
            const slug = String(fd.get("slug") || "");
            const id =
              String(fd.get("id") || "") ||
              slug ||
              name
                .toLowerCase()
                .replace(/[^a-z0-9õäöüšž]+/gi, "-")
                .replace(/^-|-$/g, "");
            void save({ id, name, slug: slug || id });
          }}
        >
          <h2 className="font-display text-xl text-forest">
            {creating ? "Uus kategooria" : "Muuda kategooriat"}
          </h2>
          {!creating && (
            <input type="hidden" name="id" value={form.id} />
          )}
          {creating && (
            <div>
              <label className="label">ID (valikuline)</label>
              <input
                className="input"
                name="id"
                placeholder="nt. kapslid"
                defaultValue={form.id}
              />
            </div>
          )}
          <div>
            <label className="label">Nimi</label>
            <input
              className="input"
              name="name"
              required
              defaultValue={form.name}
            />
          </div>
          <div>
            <label className="label">Slug</label>
            <input
              className="input"
              name="slug"
              required
              defaultValue={form.slug}
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary">
              Salvesta
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setCreating(false);
                setDraft(null);
              }}
            >
              Tühista
            </button>
          </div>
        </form>
      )}

      <ul className="mt-8 divide-y divide-forest/10 rounded-2xl border border-forest/10 bg-ivory">
        {categories.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
          >
            <div>
              <p className="font-medium text-forest">{c.name}</p>
              <p className="text-xs text-charcoal/55">
                id: {c.id} · slug: {c.slug}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-secondary text-sm"
                onClick={() => {
                  setCreating(false);
                  setDraft(c);
                }}
              >
                Muuda
              </button>
              <button
                type="button"
                className="text-sm text-red-700 hover:underline"
                onClick={() => void remove(c.id)}
              >
                Kustuta
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
