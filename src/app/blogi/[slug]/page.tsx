import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogArticleBody } from "@/components/BlogArticleBody";
import { getBlogPost, getBlogPosts } from "@/lib/db";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Artikkel" };
  return { title: post.title, description: post.excerpt };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("et-EE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([
    getBlogPost(slug),
    getBlogPosts(),
  ]);
  if (!post) notFound();

  const index = posts.findIndex((p) => p.slug === slug);
  const newer = index > 0 ? posts[index - 1] : null;
  const older = index >= 0 && index < posts.length - 1 ? posts[index + 1] : null;

  return (
    <article className="pb-16">
      <header className="border-b border-forest/10 bg-ivory pt-10 pb-8 sm:pt-14 sm:pb-10">
        <div className="container-page max-w-3xl">
          <Link
            href="/blogi"
            className="text-sm text-charcoal/55 transition hover:text-forest"
          >
            ← Tagasi blogisse
          </Link>
          <h1 className="font-display mt-4 max-w-3xl text-2xl leading-tight text-forest sm:mt-5 sm:text-4xl md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-3 text-sm text-charcoal/60">
            {post.author}
            <span className="mx-2 opacity-40">·</span>
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
          </p>
        </div>
      </header>

      <div className="container-page prose-brand mx-auto mt-10 max-w-3xl sm:mt-12">
        {post.needsReview ? (
          <p className="mb-8 rounded-xl border border-clay/30 bg-sand/50 px-4 py-3 text-sm text-charcoal/70">
            <strong className="text-forest">Ülevaatamiseks:</strong> see artikkel
            sisaldab tervisealast sisu allikast blackstuff.ee. Kontrolli väiteid
            enne lõplikku avaldamist. Tegemist ei ole meditsiinilise nõuandega.
          </p>
        ) : null}

        <BlogArticleBody content={post.content} />

        <p className="mt-10 rounded-xl bg-sand/50 px-4 py-3 text-sm text-charcoal/65">
          Märkus: tegemist on toidulisandi ja elustiili teemalise sisuga, mitte
          meditsiinilise nõuandega. Toidulisandid ei asenda mitmekesist
          toitumist ega tervislikku eluviisi.
        </p>

        <nav
          aria-label="Artiklite navigeerimine"
          className="mt-12 grid gap-6 border-t border-forest/10 pt-10 sm:grid-cols-2"
        >
          {newer ? (
            <Link
              href={`/blogi/${newer.slug}`}
              className="group block text-left no-underline transition hover:opacity-90"
            >
              <span className="text-xs uppercase tracking-[0.14em] text-clay">
                ← Eelmine
              </span>
              <span className="font-display mt-2 block text-lg leading-snug text-forest group-hover:underline group-hover:underline-offset-4">
                {newer.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {older ? (
            <Link
              href={`/blogi/${older.slug}`}
              className="group block text-right no-underline transition hover:opacity-90 sm:col-start-2"
            >
              <span className="text-xs uppercase tracking-[0.14em] text-clay">
                Järgmine →
              </span>
              <span className="font-display mt-2 block text-lg leading-snug text-forest group-hover:underline group-hover:underline-offset-4">
                {older.title}
              </span>
            </Link>
          ) : null}
        </nav>
      </div>
    </article>
  );
}
