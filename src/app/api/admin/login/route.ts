import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, verifyCredentials } from "@/lib/auth";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const ok = await verifyCredentials(body.username, body.password);
    if (!ok) {
      return NextResponse.json(
        { error: "Vale kasutajanimi või parool." },
        { status: 401 },
      );
    }
    await createSession();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Sisselogimine ebaõnnestus." }, { status: 400 });
  }
}
