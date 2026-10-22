import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { getPage } from "@/lib/db";

export const metadata: Metadata = {
  title: "Edasimüüjad",
  description: "Black Stuff toodete edasimüüjad Eestis ja veebis.",
};

const stores = [
  {
    city: "Tallinn",
    places: ["Tervisetooted", "Januski Shop", "Hobukeskus", "Heatunde MTÜ"],
  },
  { city: "Tartu", places: ["Ratsane"] },
  {
    city: "Pärnu",
    places: ["Mahe Mandala", "Riiamarii", "Riia kirbukas", "Hobuhooldus"],
  },
  { city: "Kuressaare", places: ["Saarte Sahver", "4Käppa"] },
];

const online = [
  "cbd.ee",
  "vanglaplaneet.ee",
  "iluversum.ee",
  "loodusilu.ee",
  "hobukeskus.ee",
  "kassidkoerad.ee",
  "internetshop.ee",
  "heatunde.eu",
  "boostyourself.ee",
  "hobuhooldus.ee",
  "alogo.ee",
];

export default async function ResellersPage() {
  const page = await getPage("edasimuujad");

  return (
    <div className="container-page py-12 md:py-16">
      <Reveal>
        <p className="text-sm uppercase tracking-[0.18em] text-clay">
          Edasimüüjad
        </p>
        <h1 className="font-display mt-2 text-4xl text-forest md:text-6xl">
          {page?.title || "Kust osta"}
        </h1>
        <p className="mt-5 max-w-2xl whitespace-pre-line text-lg text-charcoal/75">
          {page?.body ||
            "Black Stuffi tooteid leiad valitud poodidest üle Eesti ning partnerite e-poodidest."}
        </p>
      </Reveal>

      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {stores.map((group, i) => (
          <Reveal key={group.city} delay={i * 50}>
            <div className="rounded-2xl border border-forest/10 bg-cream px-6 py-7">
              <h2 className="font-display text-3xl text-forest">{group.city}</h2>
              <ul className="mt-4 space-y-2 text-charcoal/75">
                {group.places.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-14">
          <h2 className="font-display text-3xl text-forest">Internetis</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {online.map((site) => (
              <a
                key={site}
                href={`https://${site}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-forest/15 bg-ivory px-4 py-2 text-sm text-forest transition hover:bg-sand"
              >
                {site}
              </a>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-14 rounded-2xl bg-sand/60 px-6 py-8 text-center md:px-10">
          <p className="font-display text-2xl text-forest md:text-3xl">
            Eelistad tellida otse?
          </p>
          <Link href="/e-pood" className="btn btn-primary mt-6">
            Ava e-pood
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
