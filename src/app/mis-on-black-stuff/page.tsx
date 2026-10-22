import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { getPage, getSiteContent } from "@/lib/db";

export const metadata: Metadata = {
  title: "Mis on Black Stuff?",
  description:
    "Black Stuff – looduslik prebiootiline toidulisand männikoore ja chaga ekstraktidel.",
};

export default async function WhatIsPage() {
  const [site, page] = await Promise.all([
    getSiteContent(),
    getPage("mis-on-black-stuff"),
  ]);

  return (
    <>
      <section className="relative min-h-[52vh] overflow-hidden bg-charcoal text-ivory">
        <Image
          src="/nature/nature-2.webp"
          alt=""
          fill
          className="object-cover opacity-55"
          priority
          sizes="100vw"
          quality={95}
        />
        <div className="absolute inset-0 bg-charcoal/50" />
        <div className="container-page relative flex min-h-[52vh] flex-col justify-end pb-14 pt-24">
          <p className="text-sm uppercase tracking-[0.18em] text-sage">
            Päritolu
          </p>
          <h1 className="font-display mt-3 max-w-3xl text-4xl md:text-6xl">
            {page?.title || "Mis on Black Stuff?"}
          </h1>
        </div>
      </section>

      <section className="container-page py-16 md:py-24">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="text-lg leading-relaxed whitespace-pre-line text-charcoal/80">
                {page?.body || site.brandIntroBody}
              </p>
              <div className="prose-brand mt-8">
                <h2>Kuidas see erineb?</h2>
                <p>
                  Erinevalt paljudest turul olevatest humiin- ja fulvohappe
                  toidulisanditest, mis põhinevad mullast või määramata
                  taimsetel allikatel, töötati Black Stuffi jaoks välja
                  patenteeritud tootmismeetod fermenteeritud chaga ja
                  männikoore ekstraktil – kontrollitud koostisega segu.
                </p>
                <h2>Mida sisaldab?</h2>
                <p>
                  BLACK STUFF koosneb patenteeritud ainest HUFULAC®-ist – puu ja
                  musta pässiku (chaga) ekstrakti looduslikust ühendist, mis
                  sisaldab humiin- ja fulviinhappeid ning polüfenoole (11 454 mg
                  / 100 g).
                </p>
                <p>
                  BLACK STUFF sisaldab huumust, millest fulviinhapet ~75% ja
                  humiinhapet ~25%.
                </p>
                <h2>Kapsel või pulber?</h2>
                <p>
                  <strong>Kapsel</strong> – mugav vegan kapsel laktoosivabast
                  materjalist tempokaks eluks.
                </p>
                <p>
                  <strong>Pulber</strong> – kergelt vaniljemaitseline, vees
                  hästi lahustuv; sobib jookidesse ja toitudesse.
                </p>
              </div>
              <p className="mt-8 rounded-xl bg-sand/60 px-4 py-3 text-sm text-charcoal/70">
                Toidulisand. Ei asenda mitmekesist toitumist ega tervislikku
                eluviisi. Esitatud info põhineb ettevõtte avalikel materjalidel;
                kõik terviseväited ei kuulu Euroopa Komisjoni kinnitatud
                loetellu.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="sticky top-28 space-y-6">
                <div className="img-zoom relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                  <Image
                    src="/nature/caps-lifestyle.webp"
                    alt="Black Stuff kapslid"
                    fill
                    className="object-cover"
                    sizes="(max-width:1024px) 100vw, 40vw"
                    quality={95}
                  />
                </div>
                <Link href="/e-pood" className="btn btn-primary w-full">
                  Vaata tooteid
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
