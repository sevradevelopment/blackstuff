import Link from "next/link";
import {
  getAllProducts,
  getCategories,
  getContactMessages,
  getOrders,
  getPages,
  getSiteContent,
} from "@/lib/db";
import { formatPrice } from "@/lib/format";

export default async function AdminHomePage() {
  const [products, orders, site, categories, pages, messages] =
    await Promise.all([
      getAllProducts(),
      getOrders(),
      getSiteContent(),
      getCategories(),
      getPages(),
      getContactMessages(),
    ]);

  const published = products.filter((p) => p.published).length;
  const lowStock = products.filter((p) => p.stock < 20).length;
  const recent = orders.slice(0, 5);
  const pendingPay = orders.filter((o) => o.paymentStatus === "pending").length;

  const sections = [
    {
      href: "/admin/tooted",
      title: "Tooted",
      desc: `${published} avaldatud · ${lowStock} madala laoseisuga`,
    },
    {
      href: "/admin/kategooriad",
      title: "Kategooriad",
      desc: `${categories.length} kategooriat`,
    },
    {
      href: "/admin/tellimused",
      title: "Tellimused",
      desc: `${orders.length} kokku · ${pendingPay} ootel makset`,
    },
    {
      href: "/admin/blogi",
      title: "Blogi",
      desc: "Artiklite lisamine ja muutmine",
    },
    {
      href: "/admin/lehed",
      title: "Lehed",
      desc: `${Object.keys(pages).length} muudetavat lehte`,
    },
    {
      href: "/admin/sisu",
      title: "Avaleht",
      desc: "Hero, kontaktandmed, tasuta tarne",
    },
    {
      href: "/admin/sonumid",
      title: "Sõnumid",
      desc: `${messages.length} kontaktivormi kirja`,
    },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-forest md:text-4xl">Ülevaade</h1>
      <p className="mt-2 text-charcoal/65">
        {site.companyName} · andmed failis{" "}
        <code className="text-sm">data/db.json</code>
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-2xl border border-forest/10 bg-ivory px-5 py-5 transition hover:border-forest/25"
          >
            <p className="font-display text-xl text-forest">{s.title}</p>
            <p className="mt-1 text-sm text-charcoal/60">{s.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl text-forest">Viimased tellimused</h2>
          <Link href="/admin/tellimused" className="text-sm text-forest underline-offset-2 hover:underline">
            Kõik
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="mt-4 text-sm text-charcoal/60">Tellimusi veel pole.</p>
        ) : (
          <ul className="mt-4 divide-y divide-forest/10 rounded-2xl border border-forest/10 bg-ivory">
            {recent.map((o) => (
              <li
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 text-sm"
              >
                <span className="font-medium text-forest">{o.id}</span>
                <span className="text-charcoal/60">{o.status}</span>
                <span>{formatPrice(o.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
