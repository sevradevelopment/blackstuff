"use client";

import { useEffect, useRef } from "react";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  /** Kept for API compat; staggered delays are capped so nothing “pops” in sequence. */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const safeDelay = Math.min(delay, 40);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("visible");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          io.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={safeDelay ? { transitionDelay: `${safeDelay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
