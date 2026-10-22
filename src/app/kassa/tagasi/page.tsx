import type { Metadata } from "next";
import Link from "next/link";
import { getOrderById, updateOrder } from "@/lib/db";
import { verifyMontonioOrderToken } from "@/lib/montonio";

export const metadata: Metadata = { title: "Makse tulemus" };

export default async function PaymentReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; "order-token"?: string }>;
}) {
  const params = await searchParams;
  const orderId = params.order;
  const orderToken = params["order-token"];

  let paid = false;
  let failed = false;
  let message = "Makse tulemus on kinnitamisel.";

  if (orderToken) {
    try {
      const payload = await verifyMontonioOrderToken(orderToken);
      const id = payload.merchantReference || orderId;
      const status = (payload.paymentStatus || "").toLowerCase();
      if (id && status === "paid") {
        await updateOrder(id, {
          status: "makstud",
          paymentStatus: "paid",
          isDemo: false,
          montonioUuid: payload.uuid,
        });
        paid = true;
        message = "Makse õnnestus. Täname tellimuse eest!";
      } else if (
        status === "abandoned" ||
        status === "cancelled" ||
        status.includes("fail")
      ) {
        failed = true;
        message = "Makse katkestati või ebaõnnestus. Võid proovida uuesti.";
        if (id) {
          await updateOrder(id, {
            paymentStatus: status.includes("fail") ? "failed" : "cancelled",
          });
        }
      }
    } catch {
      failed = true;
      message = "Makse kinnitamine ebaõnnestus.";
    }
  } else if (orderId) {
    const order = await getOrderById(orderId);
    if (order?.paymentStatus === "paid" || order?.status === "makstud") {
      paid = true;
      message = "Makse õnnestus. Täname tellimuse eest!";
    }
  }

  return (
    <div className="container-page py-20 text-center md:py-28">
      <p className="text-sm uppercase tracking-[0.18em] text-clay">
        {paid ? "Makstud" : failed ? "Makse" : "Ootel"}
      </p>
      <h1 className="font-display mt-3 text-4xl text-forest md:text-5xl">
        {paid ? "Tellimus on makstud" : failed ? "Makse ei õnnestunud" : "Makse töötlemisel"}
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-charcoal/70">{message}</p>
      {orderId ? (
        <p className="mt-4 text-sm text-forest">Tellimuse nr: {orderId}</p>
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
