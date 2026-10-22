"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "@/store/cart";

const links = [
  { href: "/", label: "Avaleht" },
  { href: "/mis-on-black-stuff", label: "Mis on Black Stuff?" },
  { href: "/teadus", label: "Teadus" },
  { href: "/e-pood", label: "E-pood" },
  { href: "/blogi", label: "Blogi" },
  { href: "/meist", label: "Meist" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/edasimuujad", label: "Edasimüüjad" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cartOpen = useCart((s) => s.open);
  const hydrated = useCart((s) => s.hydrated);
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const badge = hydrated ? count : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      if (open) return; // don't update while menu open
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  // Hard scroll lock — keeps menu on screen on iOS while open
  useEffect(() => {
    if (!open) return;
    const y = window.scrollY;
    const { style } = document.body;
    const prev = {
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      width: style.width,
      overflow: style.overflow,
    };
    style.position = "fixed";
    style.top = `-${y}px`;
    style.left = "0";
    style.right = "0";
    style.width = "100%";
    style.overflow = "hidden";

    return () => {
      style.position = prev.position;
      style.top = prev.top;
      style.left = prev.left;
      style.right = prev.right;
      style.width = prev.width;
      style.overflow = prev.overflow;
      window.scrollTo(0, y);
    };
  }, [open]);

  if (pathname.startsWith("/admin")) return null;

  const menu =
    open && mounted
      ? createPortal(
          <div
            className="fixed inset-0 z-[200] flex flex-col bg-ivory lg:hidden"
            style={{
              paddingTop: "env(safe-area-inset-top, 0px)",
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
              height: "100dvh",
              maxHeight: "100dvh",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Menüü"
          >
            <div className="mx-auto flex h-12 w-[min(1360px,calc(100%-1.25rem))] shrink-0 items-center justify-between">
              <Image
                src="/brand/wordmark.webp"
                alt=""
                width={140}
                height={26}
                className="!h-6 !w-auto max-h-6 object-contain"
                unoptimized
              />
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-forest/20 text-forest"
                aria-label="Sulge menüü"
                onClick={() => setOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-2">
              <ul className="mx-auto max-w-md space-y-1">
                {links.map((link) => {
                  const active =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`block rounded-2xl px-4 py-3.5 text-lg ${
                          active ? "bg-sand text-forest" : "text-forest"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="shrink-0 border-t border-forest/10 px-4 py-4">
              <Link
                href="/e-pood"
                onClick={() => setOpen(false)}
                className="btn btn-primary w-full"
              >
                Ava e-pood
              </Link>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b transition-colors ${
          scrolled
            ? "border-forest/10 bg-ivory/95 backdrop-blur-md"
            : "border-transparent bg-ivory/95"
        }`}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="mx-auto flex h-12 w-[min(1360px,calc(100%-1.25rem))] items-center justify-between gap-3 sm:h-14 md:h-16">
          <Link
            href="/"
            className="relative z-50 flex h-8 items-center sm:h-9"
            aria-label="Black Stuff avaleht"
          >
            <Image
              src="/brand/wordmark.webp"
              alt="Black Stuff"
              width={160}
              height={30}
              className="!h-6 !w-auto max-h-6 object-contain object-left sm:!h-7 sm:max-h-7 md:!h-8 md:max-h-8"
              priority
              unoptimized
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.slice(0, 7).map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3 py-2 text-sm ${
                    active
                      ? "bg-sand text-forest"
                      : "text-charcoal/75 hover:text-forest"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="relative z-50 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                cartOpen();
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-forest/20 text-forest"
              aria-label="Ostukorv"
            >
              <CartIcon />
              {badge > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-forest px-1 text-[10px] text-ivory">
                  {badge}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-forest/20 text-forest lg:hidden"
              aria-label={open ? "Sulge menüü" : "Ava menüü"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>
      {menu}
    </>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 7h12l-1 12H7L6 7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 7V5a3 3 0 0 1 6 0v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
