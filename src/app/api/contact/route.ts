import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { z } from "zod";
import { addContactMessage } from "@/lib/db";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  message: z.string().min(5).max(5000),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    await addContactMessage({
      id: nanoid(),
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      message: body.message.trim(),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Palun kontrolli sisestatud andmeid." },
      { status: 400 },
    );
  }
}
