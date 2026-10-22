import Link from "next/link";
import { getSiteContent } from "@/lib/db";

export async function Footer() {
  const site = await getSiteContent();

  return (
    <footer className="mt-16 border-t border-forest/10 bg-sand/50 sm:mt-24">
      <div className="container-page grid gap-10 py-12 sm:gap-12 sm:py-16 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl text-forest">Black Stuff</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-charcoal/70">
            Loodusest inspireeritud toidulisandid männikoore ja musta pässiku
            ekstraktidel. Arendatud Eestis.
          </p>
          <p className="mt-6 text-sm text-charcoal/65">
            {site.companyName}
            <br />
            Registrikood: {site.registryCode}
            <br />
            <a className="underline-offset-2 hover:underline" href={`mailto:${site.contactEmail}`}>
              {site.contactEmail}
            </a>
            <br />
            <a className="underline-offset-2 hover:underline" href={`tel:${site.contactPhone.replace(/\s/g, "")}`}>
              {site.contactPhone}
            </a>
          </p>
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-forest/70">
            Avasta
          </p>
          <ul className="mt-4 space-y-2 text-sm text-charcoal/75">
            <li><Link href="/mis-on-black-stuff" className="hover:text-forest">Mis on Black Stuff?</Link></li>
            <li><Link href="/teadus" className="hover:text-forest">Teadus</Link></li>
            <li><Link href="/e-pood" className="hover:text-forest">E-pood</Link></li>
            <li><Link href="/blogi" className="hover:text-forest">Blogi</Link></li>
            <li><Link href="/edasimuujad" className="hover:text-forest">Edasimüüjad</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-forest/70">
            Info
          </p>
          <ul className="mt-4 space-y-2 text-sm text-charcoal/75">
            <li><Link href="/meist" className="hover:text-forest">Meist</Link></li>
            <li><Link href="/kontakt" className="hover:text-forest">Kontakt</Link></li>
            <li><Link href="/tarne" className="hover:text-forest">Tarneinfo</Link></li>
            <li><Link href="/tingimused" className="hover:text-forest">Ostutingimused</Link></li>
            <li><Link href="/privaatsus" className="hover:text-forest">Privaatsus</Link></li>
            <li><Link href="/kupsised" className="hover:text-forest">Küpsised</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-forest/10">
        <div
          className="container-page flex flex-col gap-2 py-6 text-xs text-charcoal/55 md:flex-row md:items-center md:justify-between"
          style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
        >
          <p>© {new Date().getFullYear()} Black Stuff Eesti</p>
          <p className="leading-relaxed">
            Toidulisandid ei asenda mitmekesist ja tasakaalustatud toitumist ega
            tervislikku eluviisi.
          </p>
        </div>
      </div>
    </footer>
  );
}
