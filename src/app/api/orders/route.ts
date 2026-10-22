import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrder, updateOrder } from "@/lib/db";
import { getSiteContent } from "@/lib/db";
import {
  createMontonioPayment,
  isMontonioConfigured,
} from "@/lib/montonio";

const schema = z.object({
  customer: z.object({
    email: z.string().email(),
    phone: z.string().min(5),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  }),
  shippingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
  }),
  shippingMethod: z.string().min(1),
  shippingCost: z.number().min(0),
  paymentMethod: z.enum(["montonio", "montonio-card", "invoice"]),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        name: z.string(),
        price: z.number().positive(),
        quantity: z.number().int().positive(),
        image: z.string(),
      }),
    )
    .min(1),
});

function siteBase(req: Request) {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (env) return env;
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const site = await getSiteContent();
    const subtotal = body.items.reduce(
      (n, i) => n + i.price * i.quantity,
      0,
    );
    const shipping =
      subtotal >= site.freeShippingFrom ? 0 : body.shippingCost;
    const total = Math.round((subtotal + shipping) * 100) / 100;
    const useMontonio =
      body.paymentMethod === "montonio" ||
      body.paymentMethod === "montonio-card";

    if (useMontonio && !isMontonioConfigured()) {
      return NextResponse.json(
        {
          error:
            "Montonio pole seadistatud. Lisa MONTONIO_ACCESS_KEY ja MONTONIO_SECRET_KEY (.env).",
        },
        { status: 503 },
      );
    }

    const orderId = `BS-${nanoid(8).toUpperCase()}`;
    const order = await createOrder({
      id: orderId,
      createdAt: new Date().toISOString(),
      status: "uus",
      items: body.items,
      subtotal,
      shipping,
      total,
      customer: body.customer,
      shippingAddress: body.shippingAddress,
      shippingMethod: body.shippingMethod,
      paymentMethod: body.paymentMethod,
      notes: body.notes,
      isDemo: !useMontonio,
      paymentStatus: useMontonio ? "pending" : undefined,
    });

    if (!useMontonio) {
      return NextResponse.json({ order, paymentUrl: null });
    }

    const base = siteBase(req);
    const lineItems = [
      ...body.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        finalPrice: Math.round(i.price * i.quantity * 100) / 100,
      })),
    ];
    if (shipping > 0) {
      lineItems.push({
        name: `Tarne: ${body.shippingMethod}`,
        quantity: 1,
        finalPrice: shipping,
      });
    }

    try {
      const { paymentUrl, uuid } = await createMontonioPayment({
        orderId: order.id,
        total,
        returnUrl: `${base}/kassa/tagasi?order=${encodeURIComponent(order.id)}`,
        notificationUrl: `${base}/api/montonio/webhook`,
        customer: body.customer,
        shippingAddress: body.shippingAddress,
        lineItems,
        paymentMethod:
          body.paymentMethod === "montonio-card"
            ? "cardPayments"
            : "paymentInitiation",
      });

      if (uuid) {
        await updateOrder(order.id, { montonioUuid: uuid });
      }

      return NextResponse.json({ order, paymentUrl });
    } catch (err) {
      await updateOrder(order.id, {
        paymentStatus: "failed",
        notes: [
          order.notes,
          `Montonio viga: ${err instanceof Error ? err.message : "tundmatu"}`,
        ]
          .filter(Boolean)
          .join("\n"),
      });
      return NextResponse.json(
        {
          error:
            err instanceof Error
              ? err.message
              : "Montonio makse loomine ebaõnnestus.",
          order,
        },
        { status: 502 },
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Palun täida kõik kohustuslikud väljad korrektselt." },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Tellimuse salvestamine ebaõnnestus." },
      { status: 500 },
    );
  }
}
