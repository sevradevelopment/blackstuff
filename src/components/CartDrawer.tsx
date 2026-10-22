"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/store/cart";

export function CartDrawer() {
  const { items, isOpen, close, removeItem, setQuantity, subtotal } = useCart();
  const total = subtotal();

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[70] bg-charcoal/40 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
        aria-hidden={!isOpen}
      />

      <aside
        className={`fixed inset-y-0 right-0 z-[80] flex w-full max-w-full flex-col bg-ivory shadow-2xl transition-transform duration-200 sm:max-w-[26rem] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
        aria-hidden={!isOpen}
        aria-label="Ostukorv"
      >
        <div className="flex items-center justify-between border-b border-forest/10 px-4 py-4 sm:px-5 sm:py-5">
          <h2 className="font-display text-2xl text-forest">Ostukorv</h2>
          <button
            type="button"
            onClick={close}
            className="inline-flex h-11 min-w-11 items-center justify-center rounded-full text-sm text-charcoal/60"
          >
            Sulge
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">
          {items.length === 0 ? (
            <div className="flex h-full min-h-[16rem] flex-col items-center justify-center gap-4 px-2 text-center">
              <p className="font-display text-2xl text-forest">Korv on tühi</p>
              <p className="max-w-xs text-sm text-charcoal/65">
                Avasta loodusest inspireeritud tooted ja lisa need siia.
              </p>
              <Link href="/e-pood" onClick={close} className="btn btn-primary">
                Avasta tooteid
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3">
                  <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl bg-sand sm:h-20 sm:w-20">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/e-pood/${item.slug}`}
                      onClick={close}
                      className="line-clamp-2 text-sm font-medium leading-snug text-forest"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm text-charcoal/70">
                      {formatPrice(item.price)}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center rounded-full border border-forest/15">
                        <button
                          type="button"
                          className="flex h-10 w-10 items-center justify-center text-lg text-forest"
                          onClick={() =>
                            setQuantity(item.productId, item.quantity - 1)
                          }
                          aria-label="Vähenda kogust"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="flex h-10 w-10 items-center justify-center text-lg text-forest"
                          onClick={() =>
                            setQuantity(item.productId, item.quantity + 1)
                          }
                          aria-label="Suurenda kogust"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="min-h-10 px-2 text-xs text-clay"
                        onClick={() => removeItem(item.productId)}
                      >
                        Eemalda
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-forest/10 px-4 py-4 sm:px-5 sm:py-5">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-charcoal/70">Vahesumma</span>
              <span className="font-medium text-forest">
                {formatPrice(total)}
              </span>
            </div>
            <Link
              href="/kassa"
              onClick={close}
              className="btn btn-primary w-full"
            >
              Kassasse
            </Link>
            <p className="mt-3 text-center text-xs text-charcoal/55">
              Tasuta saatmine alates 100 €
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
