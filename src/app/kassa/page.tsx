import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";
import { getSiteContent } from "@/lib/db";
import { isMontonioConfigured } from "@/lib/montonio";

export const metadata: Metadata = {
  title: "Kassa",
  description: "Black Stuff Eesti kassa – Montonio makse.",
};

export default async function CheckoutPage() {
  const site = await getSiteContent();
  const montonioReady = isMontonioConfigured();

  return (
    <div className="container-page py-12 md:py-16">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm uppercase tracking-[0.18em] text-clay">Kassa</p>
        <h1 className="font-display mt-2 text-4xl text-forest md:text-5xl">
          Tellimuse vormistamine
        </h1>
        <p className="mt-3 text-sm text-charcoal/65">
          {montonioReady
            ? "Turvaline makse Montonio kaudu (pangalink või kaart)."
            : "Montonio ühendus ootab API võtmeid — seni saab tellimuse jätta arvena."}
        </p>
      </div>
      <CheckoutForm
        freeShippingFrom={site.freeShippingFrom}
        montonioReady={montonioReady}
      />
    </div>
  );
}
