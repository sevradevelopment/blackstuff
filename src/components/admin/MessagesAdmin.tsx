"use client";

import { useRouter } from "next/navigation";

type Msg = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  message: string;
};

export function MessagesAdmin({ messages }: { messages: Msg[] }) {
  const router = useRouter();

  async function remove(id: string) {
    if (!confirm("Kustuta sõnum?")) return;
    await fetch("/api/admin/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-forest">Sõnumid</h1>
      <p className="mt-2 text-sm text-charcoal/60">
        Kontaktivormi kaudu saadetud kirjad.
      </p>

      {messages.length === 0 ? (
        <p className="mt-8 text-charcoal/60">Sõnumeid pole.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {messages.map((m) => (
            <li
              key={m.id}
              className="rounded-2xl border border-forest/10 bg-ivory p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-forest">{m.name}</p>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-sm text-charcoal/65 underline-offset-2 hover:underline"
                  >
                    {m.email}
                  </a>
                  <p className="mt-1 text-xs text-charcoal/50">
                    {new Date(m.createdAt).toLocaleString("et-EE")}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-sm text-red-700 hover:underline"
                  onClick={() => void remove(m.id)}
                >
                  Kustuta
                </button>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm text-charcoal/80">
                {m.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
