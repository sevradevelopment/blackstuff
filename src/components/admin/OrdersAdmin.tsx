"use client";

import { useRouter } from "next/navigation";
import type { Order, OrderStatus } from "@/lib/types";
import { formatPrice } from "@/lib/format";

const statuses: OrderStatus[] = [
  "uus",
  "makstud",
  "töötlemisel",
  "saadetud",
  "tühistatud",
];

export function OrdersAdmin({ orders }: { orders: Order[] }) {
  const router = useRouter();

  async function updateStatus(id: string, status: OrderStatus) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-forest">Tellimused</h1>
      <p className="mt-2 text-sm text-charcoal/60">
        Muuda staatust pärast Montonio makset või käsitsi arvet.
      </p>

      {orders.length === 0 ? (
        <p className="mt-8 text-charcoal/60">Tellimusi pole.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((o) => (
            <article
              key={o.id}
              className="rounded-2xl border border-forest/10 bg-ivory p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-forest">{o.id}</p>
                  <p className="mt-1 text-sm text-charcoal/60">
                    {new Date(o.createdAt).toLocaleString("et-EE")} ·{" "}
                    {o.customer.firstName} {o.customer.lastName} ·{" "}
                    {o.customer.email}
                  </p>
                  {o.isDemo && (
                    <span className="mt-2 inline-block rounded-full bg-sand px-2 py-0.5 text-xs text-clay">
                      Demo tellimus
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(o.total)}</p>
                  <select
                    className="input mt-2 min-h-10 py-1 text-sm"
                    value={o.status}
                    onChange={(e) =>
                      updateStatus(o.id, e.target.value as OrderStatus)
                    }
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <ul className="mt-4 space-y-1 text-sm text-charcoal/70">
                {o.items.map((i) => (
                  <li key={`${o.id}-${i.productId}`}>
                    {i.name} × {i.quantity} — {formatPrice(i.price * i.quantity)}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
