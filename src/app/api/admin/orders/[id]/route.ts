import { NextResponse } from "next/server";
import { z } from "zod";
import { isAuthenticated } from "@/lib/auth";
import { updateOrderStatus } from "@/lib/db";

const schema = z.object({
  status: z.enum(["uus", "makstud", "töötlemisel", "saadetud", "tühistatud"]),
});

type Props = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Props) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = schema.parse(await req.json());
    const order = await updateOrderStatus(id, body.status);
    if (!order) {
      return NextResponse.json({ error: "Ei leitud" }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Uuendamine ebaõnnestus" }, { status: 400 });
  }
}
