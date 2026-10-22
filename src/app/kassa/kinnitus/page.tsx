import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Tellimus salvestatud" };

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="container-page py-20 text-center md:py-28">
      <p className="text-sm uppercase tracking-[0.18em] text-clay">Tellimus</p>
      <h1 className="font-display mt-3 text-4xl text-forest md:text-5xl">
        Tellimus on salvestatud
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-charcoal/70">
        Täname! Sinu tellimus on vastu võetud. Võtame vajadusel ühendust
        e-posti teel.
      </p>
      {order ? (
        <p className="mt-4 text-sm text-forest">Tellimuse nr: {order}</p>
      ) : null}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/e-pood" className="btn btn-primary">
          Tagasi e-poodi
        </Link>
        <Link href="/" className="btn btn-secondary">
          Avalehele
        </Link>
      </div>
    </div>
  );
}
