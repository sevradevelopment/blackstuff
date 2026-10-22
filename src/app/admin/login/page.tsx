"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: fd.get("username"),
        password: fd.get("password"),
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Sisselogimine ebaõnnestus");
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-forest/10 bg-ivory p-8 shadow-sm"
      >
        <p className="text-sm uppercase tracking-[0.16em] text-clay">Admin</p>
        <h1 className="font-display mt-2 text-3xl text-forest">Sisselogimine</h1>
        <p className="mt-2 text-sm text-charcoal/60">
          Ainult volitatud kasutajatele.
        </p>

        <div className="mt-8 space-y-4">
          <div>
            <label className="label" htmlFor="username">
              Kasutajanimi
            </label>
            <input
              id="username"
              name="username"
              required
              className="input"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Parool
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input"
              autoComplete="current-password"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          className="btn btn-primary mt-6 w-full"
          disabled={loading}
        >
          {loading ? "Sisenen…" : "Logi sisse"}
        </button>
      </form>
    </div>
  );
}
