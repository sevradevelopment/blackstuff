"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CmsPage } from "@/lib/types";
import { MarkdownEditor } from "./MarkdownEditor";

const PAGE_LABELS: Record<string, string> = {
  tarne: "Tarneinfo",
  tingimused: "Ostutingimused",
  privaatsus: "Privaatsuspoliitika",
  kupsised: "Küpsised",
  teadus: "Teadus (sissejuhatus)",
  kontakt: "Kontakt (sissejuhatus)",
  edasimuujad: "Edasimüüjad (sissejuhatus)",
  "mis-on-black-stuff": "Mis on Black Stuff? (sissejuhatus)",
};

export function PagesAdmin({
  pages,
}: {
  pages: Record<string, CmsPage>;
}) {
  const router = useRouter();
  const keys = Object.keys(pages).sort();
  const [active, setActive] = useState(keys[0] || "");
  const [draft, setDraft] = useState<CmsPage>(
    pages[keys[0]] || { title: "", body: "" },
  );
  const [msg, setMsg] = useState("");

  function select(slug: string) {
    setActive(slug);
    setDraft(pages[slug] || { title: "", body: "" });
    setMsg("");
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/pages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: active, page: draft }),
    });
    setMsg(res.ok ? "Salvestatud." : "Salvestamine ebaõnnestus.");
    if (res.ok) router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[14rem_1fr]">
      <div>
        <h1 className="font-display text-3xl text-forest">Lehed</h1>
        <p className="mt-2 text-sm text-charcoal/60">
          Muuda avalike lehtede pealkirju ja tekste. Keha toetab{" "}
          <code className="text-xs">## pealkiri</code> ja lõike.
        </p>
        <nav className="mt-6 space-y-1">
          {keys.map((slug) => (
            <button
              key={slug}
              type="button"
              onClick={() => select(slug)}
              className={`block w-full rounded-xl px-3 py-2 text-left text-sm ${
                active === slug
                  ? "bg-forest text-ivory"
                  : "text-charcoal/70 hover:bg-sand"
              }`}
            >
              {PAGE_LABELS[slug] || slug}
            </button>
          ))}
        </nav>
      </div>

      {active ? (
        <form onSubmit={onSave} className="space-y-4">
          <p className="text-xs uppercase tracking-wider text-clay">
            /{active}
          </p>
          <div>
            <label className="label">Pealkiri</label>
            <input
              className="input"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              required
            />
          </div>
          <MarkdownEditor
            label="Sisu"
            value={draft.body}
            folder="pages"
            minHeight="22rem"
            hint="## pealkiri · + Pilt sisestab pildi teksti sisse"
            onChange={(body) => setDraft({ ...draft, body })}
          />
          {msg && <p className="text-sm text-forest">{msg}</p>}
          <button type="submit" className="btn btn-primary">
            Salvesta leht
          </button>
        </form>
      ) : (
        <p className="text-charcoal/60">Lehti pole.</p>
      )}
    </div>
  );
}
