"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/store/cart";

const shippingMethods = [
  { id: "omniva", label: "Omniva pakiautomaat", price: 3.5 },
  { id: "smartpost", label: "SmartPost / Montonio pakiautomaat", price: 3.5 },
  { id: "courier", label: "Kuller koju", price: 5.9 },
];

export function CheckoutForm({
  freeShippingFrom,
  montonioReady,
}: {
  freeShippingFrom: number;
  montonioReady: boolean;
}) {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const cartTotal = subtotal();
  const [shippingId, setShippingId] = useState(shippingMethods[0].id);
  const [payment, setPayment] = useState<"montonio" | "montonio-card" | "invoice">(
    montonioReady ? "montonio" : "invoice",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shipping = shippingMethods.find((s) => s.id === shippingId)!;
  const shippingCost = cartTotal >= freeShippingFrom ? 0 : shipping.price;
  const total = cartTotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className="rounded-2xl bg-sand/50 px-6 py-16 text-center">
        <p className="font-display text-3xl text-forest">Ostukorv on tühi</p>
        <Link href="/e-pood" className="btn btn-primary mt-6">
          Avasta tooteid
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            email: fd.get("email"),
            phone: fd.get("phone"),
            firstName: fd.get("firstName"),
            lastName: fd.get("lastName"),
          },
          shippingAddress: {
            street: fd.get("street"),
            city: fd.get("city"),
            postalCode: fd.get("postalCode"),
            country: "Eesti",
          },
          shippingMethod: shipping.label,
          shippingCost,
          paymentMethod: payment,
          notes: fd.get("notes") || "",
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Tellimuse salvestamine ebaõnnestus");

      if (data.paymentUrl) {
        clear();
        window.location.href = data.paymentUrl as string;
        return;
      }

      clear();
      router.push(`/kassa/kinnitus?order=${data.order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Viga");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 sm:gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-5 sm:space-y-8">
        <section className="rounded-2xl bg-white/70 p-4 ring-1 ring-forest/10 sm:p-6">
          <h2 className="font-display text-xl text-forest sm:text-2xl">Kontaktandmed</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="firstName">Eesnimi</label>
              <input className="input" id="firstName" name="firstName" required />
            </div>
            <div>
              <label className="label" htmlFor="lastName">Perekonnanimi</label>
              <input className="input" id="lastName" name="lastName" required />
            </div>
            <div>
              <label className="label" htmlFor="email">E-post</label>
              <input className="input" id="email" name="email" type="email" required />
            </div>
            <div>
              <label className="label" htmlFor="phone">Telefon</label>
              <input className="input" id="phone" name="phone" type="tel" required />
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white/70 p-4 ring-1 ring-forest/10 sm:p-6">
          <h2 className="font-display text-xl text-forest sm:text-2xl">Tarneaadress</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="street">Tänav / maja</label>
              <input className="input" id="street" name="street" required />
            </div>
            <div>
              <label className="label" htmlFor="city">Linn</label>
              <input className="input" id="city" name="city" required />
            </div>
            <div>
              <label className="label" htmlFor="postalCode">Postiindeks</label>
              <input className="input" id="postalCode" name="postalCode" required />
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white/70 p-4 ring-1 ring-forest/10 sm:p-6">
          <h2 className="font-display text-xl text-forest sm:text-2xl">Tarneviis</h2>
          <div className="mt-4 space-y-3">
            {shippingMethods.map((m) => (
              <label
                key={m.id}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
                  shippingId === m.id
                    ? "border-forest bg-sand/40"
                    : "border-forest/15"
                }`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={shippingId === m.id}
                    onChange={() => setShippingId(m.id)}
                  />
                  <span className="leading-snug">{m.label}</span>
                </span>
                <span className="shrink-0 text-sm text-charcoal/70">
                  {cartTotal >= freeShippingFrom ? "Tasuta" : formatPrice(m.price)}
                </span>
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white/70 p-4 ring-1 ring-forest/10 sm:p-6">
          <h2 className="font-display text-xl text-forest sm:text-2xl">Makse</h2>
          <div className="mt-4 space-y-3">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                payment === "montonio"
                  ? "border-forest bg-sand/40"
                  : "border-forest/15"
              } ${!montonioReady ? "opacity-50" : ""}`}
            >
              <input
                type="radio"
                checked={payment === "montonio"}
                disabled={!montonioReady}
                onChange={() => setPayment("montonio")}
              />
              Montonio pangalink
            </label>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                payment === "montonio-card"
                  ? "border-forest bg-sand/40"
                  : "border-forest/15"
              } ${!montonioReady ? "opacity-50" : ""}`}
            >
              <input
                type="radio"
                checked={payment === "montonio-card"}
                disabled={!montonioReady}
                onChange={() => setPayment("montonio-card")}
              />
              Montonio kaardimakse
            </label>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                payment === "invoice"
                  ? "border-forest bg-sand/40"
                  : "border-forest/15"
              }`}
            >
              <input
                type="radio"
                checked={payment === "invoice"}
                onChange={() => setPayment("invoice")}
              />
              Arve e-postiga
            </label>
          </div>
          <div className="mt-4 rounded-xl bg-clay/10 px-4 py-3 text-sm text-charcoal/75">
            {montonioReady
              ? "Makse toimub turvaliselt Montonio kaudu. Pärast makset suunatakse sind tagasi poodi."
              : "Montonio võtmed puuduvad (.env). Praegu saab jätta tellimuse arvena; lisa võtmed Partner Systemist."}
          </div>
          <div className="mt-4">
            <label className="label" htmlFor="notes">Märkus (valikuline)</label>
            <textarea className="input min-h-24" id="notes" name="notes" />
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-2xl bg-sand/60 p-4 sm:p-6 lg:sticky lg:top-28">
        <h2 className="font-display text-xl text-forest sm:text-2xl">Tellimuse kokkuvõte</h2>
        <ul className="mt-5 space-y-4">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-ivory">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-contain p-1"
                  sizes="64px"
                  quality={95}
                />
              </div>
              <div className="min-w-0 flex-1 text-sm">
                <p className="line-clamp-2 text-forest">{item.name}</p>
                <p className="text-charcoal/60">
                  {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-2 border-t border-forest/10 pt-4 text-sm">
          <div className="flex justify-between">
            <span>Vahesumma</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tarne</span>
            <span>{shippingCost === 0 ? "Tasuta" : formatPrice(shippingCost)}</span>
          </div>
          <div className="flex justify-between text-base font-medium text-forest">
            <span>Kokku</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
        <button type="submit" className="btn btn-primary mt-6 w-full" disabled={loading}>
          {loading
            ? "Töötlen…"
            : payment.startsWith("montonio")
              ? "Mine maksma"
              : "Kinnita tellimus"}
        </button>
      </aside>
    </form>
  );
}
