import { SignJWT, jwtVerify } from "jose";

export type MontonioConfig = {
  accessKey: string;
  secretKey: string;
  sandbox: boolean;
};

export function getMontonioConfig(): MontonioConfig | null {
  const accessKey = process.env.MONTONIO_ACCESS_KEY?.trim();
  const secretKey = process.env.MONTONIO_SECRET_KEY?.trim();
  if (!accessKey || !secretKey) return null;
  return {
    accessKey,
    secretKey,
    sandbox: process.env.MONTONIO_SANDBOX !== "false",
  };
}

export function isMontonioConfigured() {
  return getMontonioConfig() !== null;
}

function apiBase(sandbox: boolean) {
  return sandbox
    ? "https://sandbox-stargate.montonio.com/api"
    : "https://stargate.montonio.com/api";
}

function secretKey(cfg: MontonioConfig) {
  return new TextEncoder().encode(cfg.secretKey);
}

export type CreateMontonioOrderInput = {
  orderId: string;
  total: number;
  locale?: string;
  returnUrl: string;
  notificationUrl: string;
  customer: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  lineItems: { name: string; quantity: number; finalPrice: number }[];
  /** paymentInitiation | cardPayments */
  paymentMethod?: "paymentInitiation" | "cardPayments";
};

export async function createMontonioPayment(
  input: CreateMontonioOrderInput,
): Promise<{ paymentUrl: string; uuid?: string }> {
  const cfg = getMontonioConfig();
  if (!cfg) throw new Error("Montonio pole seadistatud");

  const method = input.paymentMethod ?? "paymentInitiation";
  const amount = Math.round(input.total * 100) / 100;

  const payload = {
    accessKey: cfg.accessKey,
    merchantReference: input.orderId,
    returnUrl: input.returnUrl,
    notificationUrl: input.notificationUrl,
    currency: "EUR",
    grandTotal: amount,
    locale: input.locale ?? "et",
    billingAddress: {
      firstName: input.customer.firstName,
      lastName: input.customer.lastName,
      email: input.customer.email,
      phoneNumber: input.customer.phone,
      addressLine1: input.shippingAddress.street,
      locality: input.shippingAddress.city,
      country: "EE",
      postalCode: input.shippingAddress.postalCode,
    },
    shippingAddress: {
      firstName: input.customer.firstName,
      lastName: input.customer.lastName,
      email: input.customer.email,
      phoneNumber: input.customer.phone,
      addressLine1: input.shippingAddress.street,
      locality: input.shippingAddress.city,
      country: "EE",
      postalCode: input.shippingAddress.postalCode,
    },
    lineItems: input.lineItems,
    payment: {
      method,
      methodDisplay:
        method === "cardPayments" ? "Kaardimakse" : "Pangalink / Montonio",
      methodOptions:
        method === "paymentInitiation"
          ? {
              paymentDescription: `Black Stuff tellimus ${input.orderId}`,
              preferredCountry: "EE",
            }
          : {
              preferredLocale: "et",
            },
      amount,
      currency: "EUR",
    },
  };

  const token = await new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(secretKey(cfg));

  const res = await fetch(`${apiBase(cfg.sandbox)}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: token }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    paymentUrl?: string;
    uuid?: string;
    message?: string;
    error?: string;
  };

  if (!res.ok || !data.paymentUrl) {
    throw new Error(
      data.message || data.error || `Montonio viga (${res.status})`,
    );
  }

  return { paymentUrl: data.paymentUrl, uuid: data.uuid };
}

export async function verifyMontonioOrderToken(orderToken: string) {
  const cfg = getMontonioConfig();
  if (!cfg) throw new Error("Montonio pole seadistatud");

  const { payload } = await jwtVerify(orderToken, secretKey(cfg), {
    algorithms: ["HS256"],
  });

  return payload as {
    merchantReference?: string;
    paymentStatus?: string;
    uuid?: string;
    accessKey?: string;
  };
}
