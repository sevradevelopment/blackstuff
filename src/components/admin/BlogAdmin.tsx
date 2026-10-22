"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BlogPost } from "@/lib/types";
import { ImageField } from "./ImageField";
import { MarkdownEditor } from "./MarkdownEditor";

export function BlogAdmin({ posts }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function openEdit(id: string) {
    setLoadingId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/blog/${id}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Laadimine ebaõnnestus");
        return;
      }
      setCreating(false);
      setEditing(data.post as BlogPost);
    } finally {
      setLoadingId(null);
    }
  }

  async function save(post: Partial<BlogPost> & { id?: string }) {
    setError("");
    const isNew = !post.id || creating;
    const res = await fetch(
      isNew ? "/api/admin/blog" : `/api/admin/blog/${post.id}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
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
    if (!confirm("Kustuta artikkel?")) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    router.refresh();
  }

  const blank: BlogPost = {
    id: "",
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    image: "",
    author: "Sven",
    publishedAt: new Date().toISOString().slice(0, 10),
    published: false,
    needsReview: true,
  };

  const formPost = creating ? blank : editing;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-forest">Blogi</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setCreating(true);
            setEditing(null);
          }}
        >
          Lisa artikkel
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      {formPost && (
        <BlogForm
          key={formPost.id || "new"}
          post={formPost}
          onCancel={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={save}
        />
      )}

      <ul className="mt-8 divide-y divide-forest/10 rounded-2xl border border-forest/10 bg-ivory">
        {posts.map((p) => (
          <li
            key={p.id}
            className="flex flex-wrap items-start justify-between gap-3 px-4 py-4 sm:px-5"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-forest">{p.title}</p>
              <p className="mt-1 text-xs text-charcoal/55">
                {p.author} · {p.publishedAt} · /{p.slug}
                {p.needsReview ? " · ülevaatamiseks" : ""}
                {!p.published ? " · peidetud" : ""}
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <button
                type="button"
                className="text-forest underline-offset-2 hover:underline disabled:opacity-50"
                disabled={loadingId === p.id}
                onClick={() => void openEdit(p.id)}
              >
                {loadingId === p.id ? "Laen…" : "Muuda"}
              </button>
              <button
                type="button"
                className="text-red-700 underline-offset-2 hover:underline"
                onClick={() => void remove(p.id)}
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

function BlogForm({
  post,
  onCancel,
  onSave,
}: {
  post: BlogPost;
  onCancel: () => void;
  onSave: (p: BlogPost) => void;
}) {
  const [draft, setDraft] = useState(post);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof BlogPost>(key: K, value: BlogPost[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  return (
    <form
      className="mt-6 space-y-4 rounded-2xl border border-forest/10 bg-ivory p-4 sm:p-6"
      onSubmit={(e) => {
        e.preventDefault();
        setSaving(true);
        void Promise.resolve(onSave(draft)).finally(() => setSaving(false));
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="label">Pealkiri</span>
          <input
            className="input mt-1"
            value={draft.title}
            onChange={(e) => {
              const title = e.target.value;
              set("title", title);
              if (!post.id) {
                set(
                  "slug",
                  title
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, ""),
                );
              }
            }}
            required
          />
        </label>
        <label className="block text-sm">
          <span className="label">Slug</span>
          <input
            className="input mt-1"
            value={draft.slug}
            onChange={(e) => set("slug", e.target.value)}
            required
          />
        </label>
        <label className="block text-sm">
          <span className="label">Autor</span>
          <input
            className="input mt-1"
            value={draft.author}
            onChange={(e) => set("author", e.target.value)}
            required
          />
        </label>
        <label className="block text-sm">
          <span className="label">Kuupäev (YYYY-MM-DD)</span>
          <input
            className="input mt-1"
            value={draft.publishedAt}
            onChange={(e) => set("publishedAt", e.target.value)}
            required
          />
        </label>
      </div>

      <ImageField
        label="Kaanepilt"
        value={draft.image}
        folder="blog"
        onChange={(url) => set("image", url)}
      />

      <label className="block text-sm">
        <span className="label">Lühitutvustus</span>
        <textarea
          className="input mt-1 min-h-20"
          value={draft.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
        />
      </label>

      <MarkdownEditor
        label="Sisu"
        value={draft.content}
        folder="blog"
        minHeight="20rem"
        hint="Lisa pilt nupuga „+ Pilt“. Markdown: ## pealkiri, ![alt](/tee)"
        onChange={(v) => set("content", v)}
      />

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={draft.published}
            onChange={(e) => set("published", e.target.checked)}
          />
          Avaldatud
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!draft.needsReview}
            onChange={(e) => set("needsReview", e.target.checked)}
          />
          Vajab terviseväidete ülevaatust
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Salvestan…" : "Salvesta"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Tühista
        </button>
      </div>
    </form>
  );
}
