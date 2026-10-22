/** Lightweight markdown-ish body: ## headings, images, blank-line paragraphs, links. */
export function CmsBody({ body }: { body: string }) {
  const blocks = body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="prose-brand space-y-4">
      {blocks.map((block, i) => {
        const img = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (img) {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={img[2]}
              alt={img[1]}
              className="my-4 w-full rounded-2xl"
            />
          );
        }
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="font-display text-2xl text-forest">
              {block.slice(3)}
            </h2>
          );
        }
        if (block.startsWith("# ")) {
          return (
            <h2 key={i} className="font-display text-3xl text-forest">
              {block.slice(2)}
            </h2>
          );
        }
        return (
          <p key={i} className="whitespace-pre-line text-charcoal/80">
            {renderInline(block)}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|!\[[^\]]*\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const img = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (img) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={img[2]}
          alt={img[1]}
          className="my-2 inline-block max-w-full rounded-xl"
        />
      );
    }
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) {
      return (
        <a
          key={i}
          href={m[2]}
          className="underline underline-offset-2"
          target={m[2].startsWith("http") ? "_blank" : undefined}
          rel={m[2].startsWith("http") ? "noreferrer" : undefined}
        >
          {m[1]}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
