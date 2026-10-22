import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "bs_admin_session";

function secret() {
  return new TextEncoder().encode(
    process.env.ADMIN_JWT_SECRET || "black-stuff-dev-secret-change-me",
  );
}

/** Fast cookie presence check — middleware already verified JWT for /admin/*. */
export async function hasAdminCookie(): Promise<boolean> {
  const jar = await cookies();
  return Boolean(jar.get(COOKIE)?.value);
}

export async function isAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export { COOKIE as ADMIN_COOKIE };
