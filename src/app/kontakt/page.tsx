import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/Reveal";
import { getPage, getSiteContent } from "@/lib/db";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Võta ühendust Black Stuff Eestiga.",
};

export default async function ContactPage() {
  const [site, page] = await Promise.all([
    getSiteContent(),
    getPage("kontakt"),
  ]);

  return (
    <div className="container-page py-8 sm:py-12 md:py-16">
      <div className="grid gap-8 sm:gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.18em] text-clay">Kontakt</p>
          <h1 className="font-display mt-2 text-[1.85rem] text-forest sm:text-4xl md:text-6xl">
            {page?.title || "Kirjuta meile"}
          </h1>
          <p className="mt-4 text-base text-charcoal/75 sm:mt-5 sm:text-lg">
            {page?.body ||
              "Küsimused toodete, tellimuste või koostöö kohta – oleme ühe e-kirja kaugusel."}
          </p>

          <dl className="mt-10 space-y-5 text-sm">
            <div>
              <dt className="text-clay">Ettevõte</dt>
              <dd className="mt-1 text-forest">
                {site.companyName}
                <br />
                Registrikood: {site.registryCode}
              </dd>
            </div>
            <div>
              <dt className="text-clay">E-post</dt>
              <dd className="mt-1">
                <a
                  className="text-forest underline-offset-2 hover:underline"
                  href={`mailto:${site.contactEmail}`}
                >
                  {site.contactEmail}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-clay">Telefon</dt>
              <dd className="mt-1">
                <a
                  className="text-forest underline-offset-2 hover:underline"
                  href={`tel:${site.contactPhone.replace(/\s/g, "")}`}
                >
                  {site.contactPhone}
                </a>
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={80}>
          <div className="rounded-2xl bg-sand/40 p-4 sm:rounded-[1.5rem] sm:p-6 md:p-8">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
