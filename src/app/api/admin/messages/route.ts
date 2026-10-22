import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteContactMessage, getContactMessages } from "@/lib/db";

export async function GET() {
  const messages = await getContactMessages();
  return NextResponse.json({ messages });
}

export async function DELETE(req: Request) {
  try {
    const { id } = z.object({ id: z.string().min(1) }).parse(await req.json());
    await deleteContactMessage(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Kustutamine ebaõnnestus" }, { status: 400 });
  }
}
