import Image from "next/image";
import Link from "next/link";

type ProductCard = {
  slug: string;
  title: string;
  description: string;
  image: string;
};

/**
 * Lightweight article markup:
 * ## / ### headings
 * - / • bullets
 * ![alt](/path)
 * :::products / :::split / :::split-rev / :::banner / :::gallery / :::checks
 */
export function BlogArticleBody({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        if (block.type === "h2") {
          return (
            <h2
              key={i}
              className="font-display !mt-10 text-2xl text-forest sm:text-3xl"
            >
              {block.text}
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3
              key={i}
              className="font-display !mt-8 text-xl text-forest sm:text-2xl"
            >
              {block.text}
            </h3>
          );
        }
        if (block.type === "ul") {
          return (
            <ul
              key={i}
              className="list-disc space-y-1.5 pl-5 text-charcoal/80"
            >
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "checks") {
          return (
            <ul key={i} className="space-y-3">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-3 text-charcoal/80">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest text-[11px] text-ivory"
                    aria-hidden
                  >
                    ✓
                  </span>
                  <span>{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "image") {
          return (
            <figure key={i} className="my-8 overflow-hidden rounded-2xl bg-sand">
              {/* Natural aspect — don’t force 16:9/2:1 (that upscales wide banners and makes them soft) */}
              <Image
                src={block.src}
                alt={block.alt}
                width={2560}
                height={640}
                className="h-auto w-full"
                sizes="(max-width:768px) 100vw, 960px"
                quality={95}
              />
            </figure>
          );
        }
        if (block.type === "gallery") {
          return (
            <div
              key={i}
              className="my-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4"
            >
              {block.images.map((src, j) => (
                <div
                  key={j}
                  className="relative aspect-square overflow-hidden rounded-xl bg-sand"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 50vw, 20vw"
                    quality={95}
                  />
                </div>
              ))}
            </div>
          );
        }
        if (block.type === "banner") {
          return (
            <div
              key={i}
              className="relative my-10 overflow-hidden rounded-2xl"
            >
              <div className="relative min-h-[220px] sm:min-h-[280px]">
                <Image
                  src={block.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 768px"
                  quality={95}
                />
                <div className="absolute inset-0 bg-charcoal/70" />
                <div className="relative space-y-4 px-5 py-10 text-ivory/90 sm:px-10 sm:py-14">
                  {block.paragraphs.map((p, j) => (
                    <p key={j} className="text-sm leading-relaxed sm:text-base">
                      {renderInline(p)}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          );
        }
        if (block.type === "products") {
          return (
            <div
              key={i}
              className="my-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {block.products.map((p) => (
                <article
                  key={p.slug}
                  className="flex flex-col rounded-2xl bg-cream px-4 py-5 ring-1 ring-forest/10"
                >
                  <div className="relative mx-auto mb-4 aspect-square w-full max-w-[180px]">
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="180px"
                      quality={95}
                    />
                  </div>
                  <h3 className="font-display text-lg text-forest">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/65">
                    {p.description}
                  </p>
                  <Link
                    href={`/e-pood/${p.slug}`}
                    className="btn btn-secondary mt-4 !min-h-10 w-full !text-sm"
                  >
                    Tutvu tootega
                  </Link>
                </article>
              ))}
            </div>
          );
        }
        if (block.type === "split") {
          const text = (
            <div className="space-y-4">
              {block.title ? (
                <h2 className="font-display text-2xl text-forest sm:text-3xl">
                  {block.title}
                </h2>
              ) : null}
              {block.paragraphs.map((p, j) =>
                p.startsWith("- ") || p.startsWith("• ") ? (
                  <p key={j} className="pl-1 text-charcoal/80">
                    {renderInline(p.replace(/^[-•]\s*/, "• "))}
                  </p>
                ) : (
                  <p key={j} className="leading-relaxed text-charcoal/80">
                    {renderInline(p)}
                  </p>
                ),
              )}
            </div>
          );
          const img = (
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
              <Image
                src={block.image}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 40vw"
                quality={95}
              />
            </div>
          );
          return (
            <div
              key={i}
              className="my-10 grid items-center gap-8 md:grid-cols-2"
            >
              {block.reverse ? (
                <>
                  {img}
                  {text}
                </>
              ) : (
                <>
                  {text}
                  {img}
                </>
              )}
            </div>
          );
        }
        return (
          <p key={i} className="leading-relaxed text-charcoal/80">
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-medium text-forest">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "checks"; items: string[] }
  | { type: "image"; src: string; alt: string }
  | { type: "gallery"; images: string[] }
  | { type: "banner"; image: string; paragraphs: string[] }
  | { type: "products"; products: ProductCard[] }
  | {
      type: "split";
      title: string;
      paragraphs: string[];
      image: string;
      reverse?: boolean;
    };

function readUntilClose(lines: string[], start: number) {
  const out: string[] = [];
  let i = start;
  while (i < lines.length && lines[i].trim() !== ":::") {
    out.push(lines[i]);
    i += 1;
  }
  return { out, next: i + 1 };
}

function parseBlocks(content: string): Block[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (trimmed === ":::products") {
      const { out, next } = readUntilClose(lines, i + 1);
      const products: ProductCard[] = [];
      for (const row of out) {
        const t = row.trim();
        if (!t) continue;
        const [slug, title, description, image] = t.split("|");
        if (slug && title && description && image) {
          products.push({ slug, title, description, image });
        }
      }
      blocks.push({ type: "products", products });
      i = next;
      continue;
    }

    if (trimmed === ":::split" || trimmed === ":::split-rev") {
      const reverse = trimmed === ":::split-rev";
      i += 1;
      const title = lines[i]?.trim() || "";
      i += 1;
      const image = lines[i]?.trim() || "";
      i += 1;
      const { out, next } = readUntilClose(lines, i);
      blocks.push({
        type: "split",
        title: title === "-" ? "" : title,
        paragraphs: out.map((l) => l.trim()).filter(Boolean),
        image,
        reverse,
      });
      i = next;
      continue;
    }

    if (trimmed === ":::banner") {
      i += 1;
      const image = lines[i]?.trim() || "";
      i += 1;
      const { out, next } = readUntilClose(lines, i);
      blocks.push({
        type: "banner",
        image,
        paragraphs: out.map((l) => l.trim()).filter(Boolean),
      });
      i = next;
      continue;
    }

    if (trimmed === ":::gallery") {
      const { out, next } = readUntilClose(lines, i + 1);
      blocks.push({
        type: "gallery",
        images: out.map((l) => l.trim()).filter(Boolean),
      });
      i = next;
      continue;
    }

    if (trimmed === ":::checks") {
      const { out, next } = readUntilClose(lines, i + 1);
      blocks.push({
        type: "checks",
        items: out
          .map((l) => l.trim().replace(/^[-•✔️✓]\s*/, ""))
          .filter(Boolean),
      });
      i = next;
      continue;
    }

    const img = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (img) {
      blocks.push({ type: "image", alt: img[1], src: img[2] });
      i += 1;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      blocks.push({ type: "h2", text: trimmed.slice(3).trim() });
      i += 1;
      continue;
    }
    if (trimmed.startsWith("### ")) {
      blocks.push({ type: "h3", text: trimmed.slice(4).trim() });
      i += 1;
      continue;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      const items: string[] = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        if (t.startsWith("- ") || t.startsWith("• ")) {
          items.push(t.slice(2).trim());
          i += 1;
        } else break;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    const parts: string[] = [trimmed];
    i += 1;
    while (i < lines.length) {
      const t = lines[i].trim();
      if (
        !t ||
        t.startsWith("## ") ||
        t.startsWith("### ") ||
        t.startsWith("- ") ||
        t.startsWith("• ") ||
        t.startsWith("![") ||
        t.startsWith(":::")
      ) {
        break;
      }
      parts.push(t);
      i += 1;
    }
    blocks.push({ type: "p", text: parts.join(" ") });
  }

  return blocks;
}
