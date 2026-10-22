import { NextResponse } from "next/server";
import { updateOrder } from "@/lib/db";
import { verifyMontonioOrderToken } from "@/lib/montonio";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      orderToken?: string;
      refundToken?: string;
    };

    if (body.refundToken) {
      // Refunds: acknowledge; full refund handling can be extended later
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (!body.orderToken) {
      return NextResponse.json({ error: "Missing orderToken" }, { status: 400 });
    }

    const payload = await verifyMontonioOrderToken(body.orderToken);
    const orderId = payload.merchantReference;
    if (!orderId) {
      return NextResponse.json({ error: "No merchantReference" }, { status: 400 });
    }

    const status = (payload.paymentStatus || "").toLowerCase();
    if (status === "paid") {
      await updateOrder(orderId, {
        status: "makstud",
        paymentStatus: "paid",
        isDemo: false,
        montonioUuid: payload.uuid,
      });
    } else if (status === "abandoned" || status === "cancelled") {
      await updateOrder(orderId, { paymentStatus: "cancelled" });
    } else if (status.includes("fail") || status === "voided") {
      await updateOrder(orderId, { paymentStatus: "failed" });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }
}
