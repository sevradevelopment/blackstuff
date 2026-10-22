import fs from "fs";
import path from "path";

const SLUGS = [
  "miks-tanapaeva-seedimine-ei-toota-nagu-peaks-ja-mida-utleb-teadus",
  "terviskorda",
  "peedi-kasulikkus-tervisele-ja-sportlikule-sooritusele",
  "parasiidid",
  "kuidas-parandada-une-kvaliteeti-looduslike-toidulisanditega",
  "sugise-ja-talve-levinumad-tervisemuudid-mis-tegelikult-tootab-immuunsuse-toetamiseks",
  "september-on-immuunsuse-test-kas-sinu-laps-on-valmis",
  "miks-tunned-vasimust-isegi-tervislikult-suues",
  "koostoo-eesti-metsa-abiks",
  "soolatuukad-ja-seedesusteem",
];

function decode(html) {
  return html
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, "„")
    .replace(/&#8221;/g, "“")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#038;/g, "&")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtml(html) {
  let t = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<\/(p|div|h[1-6]|li|tr)\s*>/gi, "\n")
    .replace(/<(br|hr)\s*\/?>/gi, "\n")
    .replace(/<\/?(ul|ol)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/\r/g, "");
  t = decode(t);
  return t
    .split("\n")
    .map((l) => l.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean)
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function excerptFrom(text, title) {
  let clean = text;
  if (title && clean.toLowerCase().startsWith(title.toLowerCase())) {
    clean = clean.slice(title.length).trim();
  }
  const first = clean.split(/\n\n+/)[0] || clean;
  return first.length > 220 ? first.slice(0, 217).trim() + "…" : first;
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download fail ${url} ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

fs.mkdirSync("public/blog", { recursive: true });

const posts = [];
for (const slug of SLUGS) {
  const url =
    "https://blackstuff.ee/wp-json/wp/v2/posts?slug=" +
    encodeURIComponent(slug) +
    "&_embed=1";
  const arr = await (await fetch(url)).json();
  if (!arr[0]) {
    console.error("MISSING", slug);
    continue;
  }
  const p = arr[0];
  const title = decode(p.title.rendered.replace(/<[^>]+>/g, "")).trim();
  const content = stripHtml(p.content.rendered);
  const excerptRaw = stripHtml(p.excerpt.rendered || "");
  let author = "Black Stuff";
  try {
    author = p._embedded.author[0].name || author;
  } catch {
    /* ignore */
  }
  let imageUrl = null;
  try {
    imageUrl = p._embedded["wp:featuredmedia"][0].source_url;
  } catch {
    /* ignore */
  }
  const ext = (imageUrl || "").split(".").pop().split("?")[0].toLowerCase();
  const fileExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext)
    ? ext === "jpeg"
      ? "jpg"
      : ext
    : "jpg";
  const localName = `${slug}.${fileExt}`;
  const localPath = path.join("public", "blog", localName);
  if (imageUrl) {
    console.log("IMG", slug, "←", imageUrl);
    await download(imageUrl, localPath);
  }
  const publishedAt = p.date.substring(0, 10);
  const excerpt = excerptRaw || excerptFrom(content, title);
  const needsReview = slug !== "koostoo-eesti-metsa-abiks";
  posts.push({
    id: `blog-${slug.slice(0, 28)}`,
    slug,
    title,
    author,
    excerpt,
    content,
    image: `/blog/${localName}`,
    publishedAt,
    published: true,
    needsReview,
    sourceUrl: p.link,
  });
  console.log(
    "OK",
    publishedAt,
    author,
    title.slice(0, 55),
    "len",
    content.length,
  );
}

posts.sort(
  (a, b) =>
    b.publishedAt.localeCompare(a.publishedAt) ||
    a.title.localeCompare(b.title, "et"),
);
fs.writeFileSync(
  "scripts/blog-import.json",
  JSON.stringify(posts, null, 2),
  "utf8",
);
console.log("Wrote", posts.length, "posts");
