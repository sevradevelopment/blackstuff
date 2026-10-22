"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const fd = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          message: fd.get("message"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Saatmine ebaõnnestus");
      setStatus("ok");
      e.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Saatmine ebaõnnestus");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="label" htmlFor="name">
          Nimi
        </label>
        <input id="name" name="name" required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="email">
          E-post
        </label>
        <input id="email" name="email" type="email" required className="input" />
      </div>
      <div>
        <label className="label" htmlFor="message">
          Sõnum
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="input min-h-[9rem] py-3"
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-700">{error}</p>
      )}
      {status === "ok" && (
        <p className="text-sm text-forest">
          Aitäh! Sinu sõnum on salvestatud. Vastame esimesel võimalusel.
        </p>
      )}
      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Saadan…" : "Saada sõnum"}
      </button>
    </form>
  );
}
