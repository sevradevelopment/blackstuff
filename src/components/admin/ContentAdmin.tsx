"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SiteContent } from "@/lib/types";

export function ContentAdmin({ content }: { content: SiteContent }) {
  const router = useRouter();
  const [draft, setDraft] = useState(content);
  const [msg, setMsg] = useState("");

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setMsg(res.ok ? "Salvestatud." : "Salvestamine ebaõnnestus.");
    if (res.ok) router.refresh();
  }

  return (
    <form onSubmit={onSave} className="max-w-3xl space-y-4">
      <h1 className="font-display text-3xl text-forest">Veebilehe sisu</h1>
      {(
        [
          ["heroTitle", "Hero pealkiri"],
          ["heroSubtitle", "Hero alatekst"],
          ["brandIntroTitle", "Brändi tutvustuse pealkiri"],
          ["brandIntroBody", "Brändi tutvustuse tekst"],
          ["scienceBlurb", "Teaduse lühitekst"],
          ["ctaTitle", "Lõpu CTA pealkiri"],
          ["aboutBody", "Meist tekst"],
          ["contactEmail", "Kontakt e-post"],
          ["contactPhone", "Telefon"],
          ["companyName", "Ettevõtte nimi"],
          ["registryCode", "Registrikood"],
        ] as const
      ).map(([key, label]) => (
        <div key={key}>
          <label className="label">{label}</label>
          {key.includes("Body") ||
          key.includes("Subtitle") ||
          key.includes("Blurb") ? (
            <textarea
              className="input min-h-[5rem]"
              value={draft[key]}
              onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
            />
          ) : (
            <input
              className="input"
              value={draft[key]}
              onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
            />
          )}
        </div>
      ))}
      <div>
        <label className="label">Tasuta tarne alates (€)</label>
        <input
          className="input"
          type="number"
          value={draft.freeShippingFrom}
          onChange={(e) =>
            setDraft({ ...draft, freeShippingFrom: Number(e.target.value) })
          }
        />
      </div>
      {msg && <p className="text-sm text-forest">{msg}</p>}
      <button type="submit" className="btn btn-primary">
        Salvesta sisu
      </button>
    </form>
  );
}
