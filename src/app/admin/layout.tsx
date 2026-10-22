import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { hasAdminCookie } from "@/lib/session";

const links = [
  { href: "/admin", label: "Ülevaade" },
  { href: "/admin/tooted", label: "Tooted" },
  { href: "/admin/kategooriad", label: "Kategooriad" },
  { href: "/admin/tellimused", label: "Tellimused" },
  { href: "/admin/blogi", label: "Blogi" },
  { href: "/admin/lehed", label: "Lehed" },
  { href: "/admin/sisu", label: "Avaleht" },
  { href: "/admin/sonumid", label: "Sõnumid" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await hasAdminCookie();

  if (!authed) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-sand/30">
      <div className="border-b border-forest/10 bg-ivory">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin" className="font-display text-xl text-forest" prefetch>
              Admin
            </Link>
            <nav className="flex flex-wrap gap-0.5 text-sm">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  prefetch
                  className="rounded-full px-2.5 py-1.5 text-charcoal/70 hover:bg-sand"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/" className="text-charcoal/60 hover:text-forest">
              Ava veebileht
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>
      <div className="container-page py-6">{children}</div>
    </div>
  );
}
