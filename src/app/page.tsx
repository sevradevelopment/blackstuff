import Link from "next/link";
import { OptimizedImage } from "@/components/OptimizedImage";
import { ProductTile } from "@/components/ProductTile";
import { Reveal } from "@/components/Reveal";
import { getBlogPosts, getPublishedProducts, getSiteContent } from "@/lib/db";

export const revalidate = 3600;

export default async function HomePage() {
  const [site, products, posts] = await Promise.all([
    getSiteContent(),
    getPublishedProducts(),
    getBlogPosts(),
  ]);

  const featured = products.filter((p) => p.featured).slice(0, 4);
  const blogPreview = posts.slice(0, 3);

  return (
    <>
      {/* Hero – full bleed, brand-led */}
      <section className="relative min-h-[70svh] overflow-hidden bg-charcoal text-ivory sm:min-h-[80vh] md:min-h-[88vh]">
        <OptimizedImage
          src="/nature/hero-nature.webp"
          alt="Metsane loodusmaastik – Black Stuff inspiratsioon"
          fill
          priority
          tone="dark"
          className="object-cover object-center opacity-70"
          sizes="100vw"
          quality={95}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/45 to-charcoal/25 md:bg-gradient-to-r md:from-charcoal/80 md:via-charcoal/45 md:to-transparent" />
        <div className="container-page relative flex min-h-[70svh] flex-col justify-end pb-8 pt-20 sm:min-h-[80vh] sm:pb-14 md:min-h-[88vh] md:justify-center md:pb-24">
          <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-sage sm:mb-4 sm:text-sm sm:tracking-[0.22em]">
            Black Stuff Eesti
          </p>
          <h1 className="font-display max-w-3xl text-[1.75rem] leading-[1.15] sm:text-4xl md:text-6xl lg:text-7xl">
            {site.heroTitle}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ivory/80 sm:mt-6 sm:text-base md:text-lg">
            {site.heroSubtitle}
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-3">
            <Link href="/mis-on-black-stuff" className="btn btn-light">
              Avasta Black Stuff
            </Link>
            <Link
              href="/e-pood"
              className="btn border border-ivory/35 text-ivory hover:bg-ivory/10"
            >
              Vaata tooteid
            </Link>
          </div>
        </div>
      </section>

      {/* Brand intro – asymmetric */}
      <section className="container-page py-14 sm:py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="img-zoom relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
              <OptimizedImage
                src="/nature/nature-2.webp"
                alt="Looduslik tekstuur ja mets"
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 40vw"
                quality={95}
              />
            </div>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={80}>
            <p className="text-sm uppercase tracking-[0.18em] text-clay">
              Brändi olemus
            </p>
            <h2 className="font-display mt-3 text-[1.75rem] leading-tight text-forest sm:text-3xl md:text-5xl">
              {site.brandIntroTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-charcoal/75 sm:mt-6 sm:text-base md:text-lg">
              {site.brandIntroBody}
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="border-t border-forest/15 pt-4">
                <p className="font-display text-2xl text-forest">HUFULAC®</p>
                <p className="mt-2 text-sm text-charcoal/65">
                  Patenteeritud ühend puidu ja chaga ekstraktist, rikkalikult
                  humiin- ja fulviinhappeid ning polüfenoole.
                </p>
              </div>
              <div className="border-t border-forest/15 pt-4">
                <p className="font-display text-2xl text-forest">11 454 mg</p>
                <p className="mt-2 text-sm text-charcoal/65">
                  Polüfenoole 100 g kohta – looduslik antioksüdantide allikas
                  toidulisandis.
                </p>
              </div>
            </div>
            <Link href="/mis-on-black-stuff" className="btn btn-primary mt-10">
              Loe lähemalt
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-sand/40 py-14 sm:py-20 md:py-24">
        <div className="container-page">
          <Reveal>
            <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-12 md:flex-row md:items-end">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-clay">
                  Valik
                </p>
                <h2 className="font-display mt-2 text-[1.75rem] text-forest sm:text-3xl md:text-5xl">
                  Populaarsed tooted
                </h2>
              </div>
              <Link href="/e-pood" className="btn btn-secondary self-start">
                Kogu e-pood
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
            {featured.map((product, i) => (
              <Reveal key={product.id} delay={i * 70}>
                <ProductTile product={product} priority={i < 2} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Ingredients – visual strip */}
      <section className="py-14 sm:py-20 md:py-28">
        <div className="container-page">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.18em] text-clay">
              Koostisosad
            </p>
            <h2 className="font-display mt-2 max-w-2xl text-[1.75rem] text-forest sm:text-3xl md:text-5xl">
              Looduslikud ühendid, millel tooted tuginevad
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Männikoore ekstrakt",
                text: "Polüfenoolide ja ligniinide allikas – osa Black Stuffi põhivalemist.",
                image: "/nature/nature-3.webp",
              },
              {
                title: "Musta pässik (chaga)",
                text: "Fermenteeritud chaga ekstrakt, mis sisaldab looduslikult fulvo- ja humiinaineid.",
                image: "/nature/caps-lifestyle.webp",
              },
              {
                title: "Fulviin- ja humiinhapped",
                text: "BLACK STUFF sisaldab huumust, millest fulviinhapet ~75% ja humiinhapet ~25%.",
                image: "/nature/hero-nature.webp",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 90}>
                <article className="overflow-hidden rounded-[1.25rem]">
                  <div className="img-zoom relative aspect-[5/4]">
                    <OptimizedImage
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width:768px) 100vw, 33vw"
                      quality={95}
                    />
                  </div>
                  <div className="bg-cream px-5 py-6">
                    <h3 className="font-display text-2xl text-forest">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                      {item.text}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Science band */}
      <section className="relative overflow-hidden bg-forest text-ivory">
        <div className="container-page grid items-center gap-8 py-14 sm:gap-10 sm:py-20 md:grid-cols-2 md:py-24">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.18em] text-sage">
              Teadus
            </p>
            <h2 className="font-display mt-3 text-[1.75rem] sm:text-3xl md:text-5xl">
              Faktid, mitte fantaasia
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-ivory/75">
              {site.scienceBlurb}
            </p>
            <Link href="/teadus" className="btn btn-light mt-8">
              Tutvu teadusega
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <ul className="space-y-4 text-sm text-ivory/80">
              <li className="border-l border-sage/50 pl-4">
                Uuringud Riia Stradiņši Meditsiiniülikoolis ja Läti Ülikoolis
              </li>
              <li className="border-l border-sage/50 pl-4">
                Laboritestid Hamiltoni ja Auctoritase laborites
              </li>
              <li className="border-l border-sage/50 pl-4">
                Tootmine GMP standarditele tuginevas institutsioonis (IIBT)
              </li>
              <li className="border-l border-sage/50 pl-4">
                Arendatud Eestis, toodetud Lätis
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Blog preview */}
      <section className="container-page py-14 sm:py-20 md:py-24">
        <Reveal>
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-clay">
                Blogi
              </p>
              <h2 className="font-display mt-2 text-[1.75rem] text-forest sm:text-3xl md:text-5xl">
                Lugemist ja tausta
              </h2>
            </div>
            <Link href="/blogi" className="btn btn-secondary self-start">
              Kõik artiklid
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
          {blogPreview.map((post, i) => (
            <Reveal key={post.id} delay={i * 80}>
              <Link href={`/blogi/${post.slug}`} className="group block">
                <div className="img-zoom relative mb-4 aspect-[16/10] overflow-hidden rounded-2xl">
                  <OptimizedImage
                    src={post.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 33vw"
                    quality={95}
                  />
                </div>
                <h3 className="font-display text-xl text-forest group-hover:opacity-80 sm:text-2xl">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-charcoal/65">
                  {post.excerpt}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-page pb-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.5rem] bg-sand px-5 py-12 text-center sm:rounded-[2rem] sm:px-8 sm:py-16 md:px-16 md:py-20">
            <OptimizedImage
              src="/nature/nature-3.webp"
              alt=""
              fill
              className="object-cover opacity-20"
              sizes="100vw"
              quality={95}
            />
            <div className="relative">
              <h2 className="font-display text-[1.75rem] text-forest sm:text-3xl md:text-5xl">
                {site.ctaTitle}
              </h2>
              <Link href="/e-pood" className="btn btn-primary mt-6 sm:mt-8">
                Avasta e-pood
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
