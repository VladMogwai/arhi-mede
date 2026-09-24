// Exports content from the old WordPress site (arhi-mede.ro) into content/original/:
// projects, posts and team members as JSON plus their original-size images.
// Run: pnpm export:original
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { parse, type HTMLElement } from "node-html-parser";

const ORIGIN = "https://www.arhi-mede.ro";
const OUT_DIR = path.resolve("content/original");
const IMAGES_DIR = path.join(OUT_DIR, "images");

type Project = {
  slug: string;
  title: string;
  category: { slug: string; title: string };
  descriptionHtml: string;
  images: string[];
  sourceUrl: string;
};

type Post = {
  slug: string;
  title: string;
  publishedAt: string;
  contentHtml: string;
  images: string[];
  sourceUrl: string;
};

type Member = {
  slug: string;
  name: string;
  role: string;
  bioHtml: string;
  photo: string | null;
  sourceUrl: string;
};

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

async function sitemapUrls(name: string): Promise<string[]> {
  const xml = await fetchText(`${ORIGIN}/${name}-sitemap.xml`);
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

function slugFromUrl(url: string): string {
  return new URL(url).pathname.split("/").filter(Boolean).at(-1)!;
}

// WordPress serves resized copies as name-1024x768.jpg; the original is name.jpg.
function toOriginalImageUrl(url: string): string {
  return url.replace(/-\d+x\d+(\.\w+)$/, "$1");
}

// Porto lazy-loads images, so the real URL sits in data-* attributes, not in src.
function collectImageUrls(root: HTMLElement): string[] {
  const urls = root.querySelectorAll("img").flatMap((img) => {
    const candidates = [img.getAttribute("data-oi"), img.getAttribute("data-src"), img.getAttribute("src")];
    return candidates.filter((url): url is string => !!url && url.includes("/wp-content/uploads/") && !url.includes("porto_placeholders"));
  });
  return [...new Set(urls.map(toOriginalImageUrl))];
}

// Keeps only the text structure: WordPress leaves classes, inline styles and <span> wrappers from pasted Word text.
function cleanHtml(html: string): string {
  return html
    .replace(/<(\/?)span[^>]*>/g, "")
    .replace(/<(\w+)\s+(?:class|style|lang)="[^"]*"[^>]*>/g, "<$1>")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .replace(/<p>\s*<\/p>/g, "")
    .trim();
}

function contentHtml(root: HTMLElement): string {
  root.querySelectorAll("script, style, .share-links, .post-share, figure.wp-block-gallery, img").forEach((node) => node.remove());
  return cleanHtml(root.innerHTML);
}

async function downloadImage(url: string): Promise<string> {
  const fileName = decodeURIComponent(new URL(url).pathname.replace("/wp-content/uploads/", "")).replaceAll("/", "-");
  const target = path.join(IMAGES_DIR, fileName);
  const exists = await access(target).then(() => true, () => false);
  if (!exists) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${response.status} ${url}`);
    await writeFile(target, Buffer.from(await response.arrayBuffer()));
  }
  return fileName;
}

async function downloadAll(urls: string[]): Promise<string[]> {
  const fileNames: string[] = [];
  for (const url of urls) fileNames.push(await downloadImage(url));
  return fileNames;
}

async function exportProjects(): Promise<Project[]> {
  // The archive page lists projects in the order the studio chose; the sitemap does not.
  const archive = parse(await fetchText(`${ORIGIN}/portfolio/`));
  const orderedUrls = [
    ...new Set(archive.querySelectorAll("a[href*='/portfolio/']").map((a) => a.getAttribute("href")!).filter((href) => /\/portfolio\/[^/]+\/?$/.test(href))),
  ];
  // The archive is paginated, so projects beyond its first page come from the sitemap.
  const sitemapProjectUrls = (await sitemapUrls("portfolio")).filter((url) => slugFromUrl(url) !== "portfolio");
  orderedUrls.push(...sitemapProjectUrls.filter((url) => !orderedUrls.includes(url)));
  const categoryTitles = new Map(
    archive.querySelectorAll("[data-filter]").map((node) => [node.getAttribute("data-filter")!.replace(/^\./, ""), node.text.trim()]),
  );

  const projects: Project[] = [];
  for (const url of orderedUrls) {
    const article = parse(await fetchText(url)).querySelector("article.portfolio")!;
    const categorySlug = article.classList.value.find((name) => name.startsWith("portfolio_cat-"))!.replace("portfolio_cat-", "");
    const images = collectImageUrls(article);
    projects.push({
      slug: slugFromUrl(url),
      title: article.querySelector(".entry-title, .portfolio-title h2")?.text.trim() ?? slugFromUrl(url),
      category: { slug: categorySlug, title: categoryTitles.get(categorySlug) ?? categorySlug },
      descriptionHtml: contentHtml(article.querySelector(".post-content")!),
      images: await downloadAll(images),
      sourceUrl: url,
    });
    console.log(`project  ${slugFromUrl(url)} (${images.length} images)`);
  }
  return projects;
}

async function exportPosts(): Promise<Post[]> {
  const posts: Post[] = [];
  for (const url of await sitemapUrls("post")) {
    const page = parse(await fetchText(url));
    const article = page.querySelector("article.post")!;
    const images = collectImageUrls(article);
    posts.push({
      slug: slugFromUrl(url),
      title: article.querySelector(".entry-title")!.text.trim(),
      publishedAt: page.querySelector("meta[property='article:published_time']")?.getAttribute("content") ?? "",
      contentHtml: contentHtml(article.querySelector(".entry-content")!),
      images: await downloadAll(images),
      sourceUrl: url,
    });
    console.log(`post     ${slugFromUrl(url)}`);
  }
  return posts;
}

async function exportMembers(): Promise<Member[]> {
  const members: Member[] = [];
  const memberUrls = (await sitemapUrls("member")).filter((url) => slugFromUrl(url) !== "member");
  for (const url of memberUrls) {
    const article = parse(await fetchText(url)).querySelector("article.member")!;
    const [photo] = collectImageUrls(article);
    members.push({
      slug: slugFromUrl(url),
      name: article.querySelector(".entry-title")!.text.trim(),
      role: article.querySelector(".member-role")?.text.trim() ?? "",
      bioHtml: cleanHtml(article.querySelectorAll(".member-overview p").map((paragraph) => paragraph.outerHTML).join("")),
      photo: photo ? await downloadImage(photo) : null,
      sourceUrl: url,
    });
    console.log(`member   ${slugFromUrl(url)}`);
  }
  return members;
}

async function writeJson(name: string, data: unknown): Promise<void> {
  await writeFile(path.join(OUT_DIR, `${name}.json`), JSON.stringify(data, null, 2) + "\n");
}

await mkdir(IMAGES_DIR, { recursive: true });
await writeJson("projects", await exportProjects());
await writeJson("posts", await exportPosts());
await writeJson("members", await exportMembers());
