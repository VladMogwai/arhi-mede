// One-off import of the old WordPress export (content/original) into the site's content files:
//   content/projects/<slug>.json, content/team/<slug>.json, content/posts/<slug>.json
//   public/media/**.webp — de-duplicated originals, at most 2048px wide
// Files use Sveltia CMS's "single_file" i18n structure: { "ro": {...}, "en": {...} }.
// Re-running overwrites those files, so run it only before the studio starts editing in the CMS.
// Run: pnpm import:original
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ORIGINAL_DIR = path.resolve("content/original");
const SOURCE_IMAGES = path.join(ORIGINAL_DIR, "images");
const MEDIA_DIR = path.resolve("public/media");
const MAX_WIDTH = 2048;
const HASH_SIZE = 16;
const DUPLICATE_DISTANCE = 12;

type OriginalProject = { slug: string; title: string; category: { slug: string }; descriptionHtml: string; images: string[] };
type OriginalPost = { slug: string; title: string; publishedAt: string; contentHtml: string; images: string[] };
type OriginalMember = { slug: string; name: string; bioHtml: string; photo: string | null };

/** Facts that the old site kept only inside the prose (or not at all). Area and year are unknown until the studio sends them. */
const projectFacts: Record<string, { location?: string; highlights?: string[]; featured?: boolean; hiddenImages?: string[] }> = {
  "studiu-matache": { location: "București" },
  "studiu-piata-victoriei": { location: "București" },
  "studiu-bulevardul-magheru": { location: "București" },
  "amenajare-interioara-la-rasnov": { location: "Râșnov" },
  "moara-cracucenilor": { location: "Ponoarele", highlights: ["Pro Patrimonio"] },
  "gospodarie-corbi": { location: "Corbi" },
  "locuinta-in-valea-lunga": { location: "Valea Lungă" },
  "casa-pasiva-corbeanca": { location: "Corbeanca", highlights: ["Premium Passive"], featured: true },
  // The first picture of these two is the project's logo, not a photo.
  "casa-cu-soare": { highlights: ["Passivhaus", "CLT"], hiddenImages: ["2019-01-casa-cu-soare4-1ok.png"] },
  "casa-cu-cires": { highlights: ["Passivhaus"], hiddenImages: ["2019-02-casa-cu-cires2-04-20.jpg"] },
  "casa-pasiva-din-bragadiru": { location: "Bragadiru", highlights: ["Passivhaus", "CLT"] },
};

/** Team texts that the old site did not have in a short form, plus role translations. */
const teamTexts: Record<string, Record<string, { role: string; summary: string }>> = {
  "arh-raluca-munteanu": {
    ro: { role: "Arhitect", summary: "Coordonatoarea echipei. Arhitect cu pasiune pentru mediu și patrimoniu; a realizat primele case certificate pasiv din zona Bucureștiului." },
    en: { role: "Architect", summary: "Leads the team. An architect with a passion for the environment and heritage; designed the first certified passive houses around Bucharest." },
    de: { role: "Architektin", summary: "Leitet das Team. Architektin mit Leidenschaft für Umwelt und Denkmalpflege; plante die ersten zertifizierten Passivhäuser im Raum Bukarest." },
    uk: { role: "Архітекторка", summary: "Керівниця команди. Архітекторка, захоплена довкіллям і спадщиною; створила перші сертифіковані пасивні будинки в околицях Бухареста." },
  },
  "arh-ruxandra-sacalis": {
    ro: { role: "Arhitect", summary: "Iubitoare de patrimoniu și design de produs; explorează legătura dintre identitatea locală și designul contemporan." },
    en: { role: "Architect", summary: "Passionate about heritage and product design; explores the link between local identity and contemporary design." },
    de: { role: "Architektin", summary: "Begeistert von Baukultur und Produktdesign; erforscht die Verbindung zwischen lokaler Identität und zeitgenössischem Design." },
    uk: { role: "Архітекторка", summary: "Захоплюється архітектурною спадщиною та предметним дизайном; досліджує зв’язок між місцевою ідентичністю й сучасним дизайном." },
  },
};

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/** The exported HTML only uses p, br, em/i, strong/b, a and headings, so a small converter is enough. */
function htmlToMarkdown(html: string): string {
  const markdown = html
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gs, "\n\n### $1\n\n")
    .replace(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gs, "[$2]($1)")
    .replace(/<(strong|b)>(.*?)<\/\1>/gs, (_, __, text: string) => (/\p{L}/u.test(text) ? `**${text.trim()}**` : text))
    .replace(/<(em|i)>(.*?)<\/\1>/gs, (_, __, text: string) => (/\p{L}/u.test(text) ? `*${text.trim()}*` : text))
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<\/p>/g, "\n\n")
    .replace(/<[^>]+>/g, "");
  return decodeEntities(markdown)
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function firstSentence(markdown: string, maxLength = 180): string {
  const text = markdown.replace(/[*#[\]]|\(http[^)]*\)/g, "").split("\n").find((line) => line.trim())!;
  const sentence = text.match(/^.+?[.!?](\s|$)/)?.[0].trim() ?? text;
  return sentence.length <= maxLength ? sentence : `${sentence.slice(0, maxLength).replace(/\s+\S*$/, "")}…`;
}

async function averageHash(file: string): Promise<bigint> {
  const pixels = await sharp(file).resize(HASH_SIZE, HASH_SIZE, { fit: "fill" }).grayscale().raw().toBuffer();
  const mean = pixels.reduce((sum, value) => sum + value, 0) / pixels.length;
  return [...pixels].reduce((hash, value) => (hash << 1n) | (value > mean ? 1n : 0n), 0n);
}

function hammingDistance(a: bigint, b: bigint): number {
  let diff = a ^ b;
  let count = 0;
  for (; diff; diff >>= 1n) count += Number(diff & 1n);
  return count;
}

/** The old site stored most pictures twice (name.jpg and name-2000.jpg); keep the larger copy. */
async function withoutDuplicates(sources: string[]): Promise<string[]> {
  const images = await Promise.all(
    sources.map(async (source) => {
      const file = path.join(SOURCE_IMAGES, source);
      const { width = 0, height = 1 } = await sharp(file).metadata();
      return { source, width, aspect: width / height, hash: await averageHash(file) };
    }),
  );
  const kept: typeof images = [];
  for (const image of images) {
    const index = kept.findIndex((other) => Math.abs(other.aspect - image.aspect) < 0.02 && hammingDistance(other.hash, image.hash) <= DUPLICATE_DISTANCE);
    if (index === -1) kept.push(image);
    else if (image.width > kept[index].width) kept[index] = image;
  }
  return kept.map((image) => image.source);
}

/** Converts one original to WebP and returns its public path. */
async function importImage(source: string, publicPath: string): Promise<string> {
  const target = path.join(MEDIA_DIR, publicPath.replace(/^\/media\//, ""));
  await mkdir(path.dirname(target), { recursive: true });
  await sharp(path.join(SOURCE_IMAGES, source)).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true }).webp({ quality: 82 }).toFile(target);
  return publicPath;
}

async function readJson<T>(name: string): Promise<T> {
  return JSON.parse(await readFile(path.join(ORIGINAL_DIR, `${name}.json`), "utf8"));
}

async function writeContent(folder: string, slug: string, data: unknown): Promise<void> {
  const dir = path.resolve("content", folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `${slug}.json`), JSON.stringify(data, null, 2) + "\n");
}

await rm(MEDIA_DIR, { recursive: true, force: true });
for (const folder of ["projects", "team", "posts"]) await rm(path.resolve("content", folder), { recursive: true, force: true });

const projects = await readJson<OriginalProject[]>("projects");
for (const [index, project] of projects.entries()) {
  const facts = projectFacts[project.slug] ?? {};
  const sources = (await withoutDuplicates(project.images)).filter((source) => !facts.hiddenImages?.includes(source));
  const images = await Promise.all(
    sources.map((source, i) => importImage(source, `/media/projects/${project.slug}/${String(i + 1).padStart(2, "0")}.webp`)),
  );
  const body = htmlToMarkdown(project.descriptionHtml);
  await writeContent("projects", project.slug, {
    ro: {
      title: project.title,
      category: project.category.slug,
      order: index + 1,
      featured: facts.featured ?? false,
      location: facts.location ?? "",
      year: null,
      area: null,
      highlights: facts.highlights ?? [],
      images,
      summary: firstSentence(body),
      body,
    },
  });
  console.log(`project ${project.slug}: ${images.length} images`);
}

const members = await readJson<OriginalMember[]>("members");
for (const [index, member] of members.entries()) {
  const photo = member.photo ? await importImage(member.photo, `/media/team/${member.slug}.webp`) : null;
  const texts = teamTexts[member.slug];
  await writeContent("team", member.slug, {
    ro: { name: member.name, order: index + 1, photo, ...texts.ro, bio: htmlToMarkdown(member.bioHtml) },
    ...Object.fromEntries(Object.entries(texts).filter(([locale]) => locale !== "ro")),
  });
  console.log(`member ${member.slug}`);
}

const posts = await readJson<OriginalPost[]>("posts");
for (const post of posts) {
  const [coverSource] = await withoutDuplicates(post.images);
  const cover = coverSource ? await importImage(coverSource, `/media/posts/${post.slug}.webp`) : null;
  await writeContent("posts", post.slug, {
    ro: { title: post.title, date: post.publishedAt.slice(0, 10), cover, body: htmlToMarkdown(post.contentHtml) },
  });
  console.log(`post ${post.slug}`);
}
