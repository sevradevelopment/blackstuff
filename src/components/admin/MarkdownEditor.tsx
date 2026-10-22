"use client";

import { useRef, useState } from "react";

type Props = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  folder?: string;
  minHeight?: string;
  hint?: string;
};

export function MarkdownEditor({
  label = "Sisu",
  value,
  onChange,
  folder = "blog",
  minHeight = "16rem",
  hint,
}: Props) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  function wrap(before: string, after = before) {
    const el = taRef.current;
    if (!el) {
      onChange(value + before + after);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);
    const next =
      value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + before.length + selected.length;
      el.setSelectionRange(pos, pos);
    });
  }

  function insertAtCursor(text: string) {
    const el = taRef.current;
    if (!el) {
      onChange(value + (value.endsWith("\n") || !value ? "" : "\n") + text);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const prefix =
      start > 0 && value[start - 1] !== "\n" ? "\n\n" : start > 0 ? "\n" : "";
    const next = value.slice(0, start) + prefix + text + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + prefix.length + text.length;
      el.setSelectionRange(pos, pos);
    });
  }

  async function uploadImage(file: File) {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Üleslaadimine ebaõnnestus");
        return;
      }
      insertAtCursor(`![pilt](${data.url})`);
    } finally {
      setBusy(false);
    }
  }

  const tools: { label: string; run: () => void }[] = [
    { label: "H2", run: () => insertAtCursor("## Pealkiri") },
    { label: "H3", run: () => insertAtCursor("### Alampealkiri") },
    { label: "Paks", run: () => wrap("**") },
    { label: "Link", run: () => wrap("[", "](https://)") },
    {
      label: "Nimekiri",
      run: () => insertAtCursor("- punkt üks\n- punkt kaks"),
    },
  ];

  return (
    <div>
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <label className="label mb-0">{label}</label>
        <div className="flex flex-wrap gap-1">
          {tools.map((t) => (
            <button
              key={t.label}
              type="button"
              className="rounded-lg border border-forest/15 bg-ivory px-2 py-1 text-xs text-charcoal/70 hover:bg-sand"
              onClick={t.run}
            >
              {t.label}
            </button>
          ))}
          <button
            type="button"
            disabled={busy}
            className="rounded-lg border border-forest/15 bg-forest px-2 py-1 text-xs text-ivory hover:opacity-90 disabled:opacity-60"
            onClick={() => fileRef.current?.click()}
          >
            {busy ? "Laen…" : "+ Pilt"}
          </button>
        </div>
      </div>
      {hint ? <p className="mb-2 text-xs text-charcoal/50">{hint}</p> : null}
      <textarea
        ref={taRef}
        className="input font-mono text-sm leading-relaxed"
        style={{ minHeight }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void uploadImage(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
