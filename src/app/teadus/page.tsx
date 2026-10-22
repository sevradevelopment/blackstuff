import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { getPage } from "@/lib/db";

export const metadata: Metadata = {
  title: "Teadus",
  description: "Black Stuff uuringute ja laboritestide ülevaade.",
};

const studies = [
  {
    title: "Uuring rasvumise, diabeedi ja seedehäirete kontekstis",
    year: "2019",
    authors: "PhD D. Babarikin, Innovaatilise Biomeditsiini Instituut",
  },
  {
    title: "Uuring vabade radikaalide kontekstis",
    year: "2019",
    authors: "Dr. Alise Silova, RSU biokeemia labor",
  },
  {
    title: "4-nädalane kuur ja seedevaevused",
    year: "2021",
    authors: "Juris Pokrotnieks & Beāte Jurševska, Riga Stradins Ülikool",
  },
  {
    title: "Uuring ADHD kontekstis lastel",
    year: "2021",
    authors: "Silvija Abele, Riga Stradins Ülikool",
  },
  {
    title: "Black Balance’i mõju hobuste maohaavanditele",
    year: "2022",
    authors: "Dana Laizane ja Nauris Laizans, Läti Maaülikool, Hobukliinik",
  },
  {
    title: "Uuring koerte terviseprobleemide kohta",
    year: "2022",
    authors: "MEDREGO LLC",
  },
];

export default async function SciencePage() {
  const page = await getPage("teadus");

  return (
    <div className="container-page py-12 md:py-16">
      <Reveal>
        <p className="text-sm uppercase tracking-[0.18em] text-clay">Teadus</p>
        <h1 className="font-display mt-2 max-w-3xl text-4xl text-forest md:text-6xl">
          {page?.title || "Faktid, mitte fantaasia"}
        </h1>
        <p className="mt-5 max-w-2xl whitespace-pre-line text-lg text-charcoal/75">
          {page?.body ||
            "Black Stuffi on uuritud ja testitud mitmes laboris ja ülikoolis. Allpool on ülevaade ettevõtte avaldatud uuringuviidetest."}
        </p>
      </Reveal>

      <div className="mt-14 space-y-4">
        {studies.map((s, i) => (
          <Reveal key={s.title} delay={i * 40}>
            <article className="grid gap-2 rounded-2xl border border-forest/10 bg-cream px-6 py-6 md:grid-cols-[5rem_1fr]">
              <p className="font-display text-2xl text-sage">{s.year}</p>
              <div>
                <h2 className="font-display text-xl text-forest md:text-2xl">
                  {s.title}
                </h2>
                <p className="mt-2 text-sm text-charcoal/65">{s.authors}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-14 rounded-2xl bg-sand/60 px-6 py-8">
          <h2 className="font-display text-2xl text-forest">Laboritulemused</h2>
          <p className="mt-3 max-w-2xl text-sm text-charcoal/70">
            Ettevõtte viidatud laboritulemused:{" "}
            <a
              className="underline underline-offset-2"
              href="https://docs.google.com/document/d/1Gm-Gyly-AuqI3oedyeEGERqCpyS5_U-fV9UWs_bvV0I/edit?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              Google Docs dokument
            </a>
            . Suur osa uuringutest on inglise või läti keeles.
          </p>
          <p className="mt-4 text-sm text-charcoal/70">
            Tootmine: Innovaatilise Biomeditsiinitehnoloogiate Instituut
            (iibt.eu), GMP standardid. Arendatud Eestis, toodetud Lätis.
          </p>
          <p className="mt-4 text-xs text-charcoal/55">
            Märkus: see leht ei esita tõendamata terviseväiteid. Toidulisandid
            ei ole ravimid.
          </p>
          <Link href="/e-pood" className="btn btn-primary mt-6">
            Vaata tooteid
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
