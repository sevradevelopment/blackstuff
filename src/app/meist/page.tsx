import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { getSiteContent } from "@/lib/db";

export const metadata: Metadata = {
  title: "Meist",
  description: "Black Stuff Eesti – ettevõtte taust, väärtused ja meeskond.",
};

const team = [
  {
    name: "Sven",
    role: "Strateegilise visiooni meister",
    email: "sven@blackstuff.ee",
    phone: "+372 5323 3238",
  },
  {
    name: "Olar",
    role: "Müügimaailma maestro",
    email: "olar@blackstuff.ee",
    phone: "+372 5561 1619",
  },
];

export default async function AboutPage() {
  const site = await getSiteContent();

  return (
    <div>
      <section className="relative overflow-hidden bg-forest text-ivory">
        <div className="container-page grid gap-10 py-16 md:grid-cols-2 md:py-24">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.18em] text-sage">Meist</p>
            <h1 className="font-display mt-3 text-4xl md:text-6xl">
              Kvaliteet, teadlikkus ja hea tuju
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/75 md:text-lg">
              {site.aboutBody}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <div className="img-zoom relative aspect-[4/5] overflow-hidden rounded-[1.5rem] md:aspect-[5/6]">
              <Image
                src="/nature/nature-2.webp"
                alt="Loodus ja rahulik atmosfäär"
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
                quality={95}
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-page py-16 md:py-24">
        <Reveal>
          <h2 className="font-display text-3xl text-forest md:text-4xl">
            Meie väärtused
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Looduslik koostis",
              text: "Tooted tuginevad männikoore ja musta pässiku ekstraktidele – fulviin- ja humiinhapped, polüfenoolid ning ligniinid.",
            },
            {
              title: "Teaduspõhine arendus",
              text: "Koostöö Innovaatilise Biomeditsiinitehnoloogia Instituudiga (IIBT) ja uuringud mitmes laboris ning ülikoolis.",
            },
            {
              title: "Eesti juured",
              text: "Black Stuff sündis Eestis. Blackstuff OÜ toob selle kvaliteedi eestlasteni.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <div className="border-t border-forest/15 pt-5">
                <h3 className="font-display text-2xl text-forest">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                  {item.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-sand/40 py-16 md:py-20">
        <div className="container-page">
          <Reveal>
            <h2 className="font-display text-3xl text-forest md:text-4xl">
              Meeskond
            </h2>
            <p className="mt-3 max-w-xl text-charcoal/70">
              Kontaktid ettevõtte avaldatud andmete põhjal.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {team.map((person, i) => (
              <Reveal key={person.name} delay={i * 60}>
                <div className="rounded-2xl bg-ivory px-6 py-7">
                  <p className="font-display text-3xl text-forest">{person.name}</p>
                  <p className="mt-1 text-sm text-clay">{person.role}</p>
                  <p className="mt-4 text-sm text-charcoal/70">
                    <a className="hover:underline" href={`mailto:${person.email}`}>
                      {person.email}
                    </a>
                    <br />
                    <a
                      className="hover:underline"
                      href={`tel:${person.phone.replace(/\s/g, "")}`}
                    >
                      {person.phone}
                    </a>
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <Reveal>
          <div className="rounded-[2rem] bg-forest px-8 py-12 text-ivory md:px-12">
            <h2 className="font-display text-3xl md:text-4xl">Asutus</h2>
            <p className="mt-4 text-ivory/75">
              {site.companyName} · Registrikood {site.registryCode}
              <br />
              {site.contactEmail} · {site.contactPhone}
            </p>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ivory/65">
              Tootmine: Innovaatilise Biomeditsiinitehnoloogiate Instituut (IIBT)
              GMP-tavadega. Uuringud muu hulgas Hamiltoni ja Auctoritase laborites
              ning Riia Stradiņši Meditsiiniülikoolis.
            </p>
            <Link href="/kontakt" className="btn btn-light mt-8">
              Võta ühendust
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
