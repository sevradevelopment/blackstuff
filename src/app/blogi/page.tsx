import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { getBlogPosts } from "@/lib/db";

export const metadata: Metadata = {
  title: "Blogi",
  description: "Black Stuff Eesti blogi – loodus, mikrobioom ja teadlik eluviis.",
};

const PER_PAGE = 6;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("et-EE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function BlogPage({ searchParams }: Props) {
  const { page: pageRaw } = await searchParams;
  const posts = await getBlogPosts();
  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const page = Math.min(
    totalPages,
    Math.max(1, Number.parseInt(pageRaw || "1", 10) || 1),
  );
  const start = (page - 1) * PER_PAGE;
  const pagePosts = posts.slice(start, start + PER_PAGE);

  return (
    <div className="container-page py-12 md:py-16">
      <Reveal>
        <p className="text-sm uppercase tracking-[0.18em] text-clay">Blogi</p>
        <h1 className="font-display mt-2 text-4xl text-forest md:text-6xl">
          Lugemist ja tausta
        </h1>
        <p className="mt-5 max-w-2xl text-base text-charcoal/75 sm:text-lg">
          Artiklid Black Stuff Eesti avaldatud materjalide põhjal.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-10 sm:mt-14 sm:gap-12 md:grid-cols-2">
        {pagePosts.map((post) => (
          <Reveal key={post.id}>
            <article className="flex h-full flex-col">
              <Link
                href={`/blogi/${post.slug}`}
                className="relative mb-5 block aspect-[16/10] overflow-hidden rounded-2xl bg-sand"
              >
                <Image
                  src={post.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 50vw"
                  quality={95}
                />
              </Link>

              <p className="text-xs tracking-[0.04em] text-clay">
                {post.author}
                <span className="mx-2 text-charcoal/30">·</span>
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
              </p>

              <h2 className="font-display mt-2 text-xl leading-snug text-forest sm:text-2xl">
                <Link
                  href={`/blogi/${post.slug}`}
                  className="transition hover:opacity-80"
                >
                  {post.title}
                </Link>
              </h2>

              <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-charcoal/65">
                {post.excerpt}
              </p>

              <div className="mt-5">
                <Link
                  href={`/blogi/${post.slug}`}
                  className="btn btn-secondary !min-h-10 !px-5 !text-sm"
                >
                  Loe edasi
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {totalPages > 1 ? (
        <nav
          aria-label="Blogi leheküljed"
          className="mt-14 flex flex-wrap items-center justify-center gap-3 border-t border-forest/10 pt-10 sm:mt-16"
        >
          {page > 1 ? (
            <Link
              href={page === 2 ? "/blogi" : `/blogi?page=${page - 1}`}
              className="text-sm text-charcoal/60 transition hover:text-forest"
            >
              ← Eelmine
            </Link>
          ) : (
            <span className="w-20" aria-hidden />
          )}

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={n === 1 ? "/blogi" : `/blogi?page=${n}`}
                aria-current={n === page ? "page" : undefined}
                className={`flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm transition ${
                  n === page
                    ? "bg-forest text-ivory"
                    : "text-charcoal/65 hover:bg-sand hover:text-forest"
                }`}
              >
                {n}
              </Link>
            ))}
          </div>

          {page < totalPages ? (
            <Link
              href={`/blogi?page=${page + 1}`}
              className="text-sm text-charcoal/60 transition hover:text-forest"
            >
              Järgmine →
            </Link>
          ) : (
            <span className="w-20" aria-hidden />
          )}
        </nav>
      ) : null}
    </div>
  );
}
