"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";

const CartDrawer = dynamic(
  () =>
    import("@/components/CartDrawer").then((m) => ({ default: m.CartDrawer })),
  { ssr: false },
);

export function SiteShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      <a
        href="#sisu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-ivory"
      >
        Mine sisu juurde
      </a>
      {!isAdmin && <Header />}
      <main id="sisu">{children}</main>
      {!isAdmin && footer}
      {!isAdmin && <CartDrawer />}
    </>
  );
}
