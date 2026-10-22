"use client";

import { useRef, useState } from "react";

type Props = {
  label?: string;
  value: string;
  folder?: string;
  onChange: (url: string) => void;
};

export function ImageField({
  label = "Pilt",
  value,
  folder = "general",
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Üleslaadimine ebaõnnestus");
        return;
      }
      onChange(data.url as string);
    } catch {
      setError("Üleslaadimine ebaõnnestus");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="label">{label}</label>
      <div className="mt-1 flex flex-wrap items-start gap-4">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) void upload(file);
          }}
          className="relative flex h-28 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-forest/25 bg-sand/40 text-xs text-charcoal/55 transition hover:border-forest/40 disabled:opacity-60"
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{busy ? "Laen…" : "Lohista / vali"}</span>
          )}
        </button>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            className="input text-sm"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/uploads/…"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-secondary !min-h-9 !px-3 !text-xs"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              {busy ? "Laen…" : "Laadi pilt üles"}
            </button>
            {value ? (
              <button
                type="button"
                className="text-xs text-red-700 hover:underline"
                onClick={() => onChange("")}
              >
                Eemalda
              </button>
            ) : null}
          </div>
          {error ? <p className="text-xs text-red-700">{error}</p> : null}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
