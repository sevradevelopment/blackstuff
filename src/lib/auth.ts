import { SignJWT } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getAdmin } from "./db";
import { ADMIN_COOKIE, isAuthenticated } from "./session";

const secret = () =>
  new TextEncoder().encode(
    process.env.ADMIN_JWT_SECRET || "black-stuff-dev-secret-change-me",
  );

export { isAuthenticated };

export async function verifyCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  const admin = await getAdmin();
  if (username !== admin.username) return false;
  return bcrypt.compare(password, admin.passwordHash);
}

export async function createSession(): Promise<void> {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}
