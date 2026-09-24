// Generates responsive copies of every image in public/media (the originals the CMS commits)
// and src/generated/media.json with their dimensions, so pages can render srcset without layout shift.
// Both outputs are git-ignored and rebuilt before `next dev` / `next build`.
// Run: pnpm build:media
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const MEDIA_DIR = path.resolve("public/media");
const MANIFEST_PATH = path.resolve("src/generated/media.json");
const WIDTHS = [640, 1280];
/** Generated copies are named "<name>-<width>.webp" next to the original. */
const VARIANT_PATTERN = /-\d+\.webp$/;

type MediaEntry = { width: number; height: number; widths: number[] };

async function listOriginals(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  const nested = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return listOriginals(fullPath);
      return /\.(webp|jpe?g|png)$/i.test(entry.name) && !VARIANT_PATTERN.test(entry.name) ? [fullPath] : [];
    }),
  );
  return nested.flat();
}

function variantPath(file: string, width: number): string {
  return file.replace(/\.\w+$/, `-${width}.webp`);
}

async function isUpToDate(original: string, variant: string): Promise<boolean> {
  const [source, target] = await Promise.all([stat(original), stat(variant).catch(() => null)]);
  return !!target && target.mtimeMs >= source.mtimeMs;
}

const manifest: Record<string, MediaEntry> = {};
for (const file of await listOriginals(MEDIA_DIR)) {
  const { width = 0, height = 0 } = await sharp(file).metadata();
  const widths = WIDTHS.filter((w) => w < width);
  for (const w of widths) {
    const target = variantPath(file, w);
    if (!(await isUpToDate(file, target))) await sharp(file).resize({ width: w }).webp({ quality: 78 }).toFile(target);
  }
  const publicPath = "/" + path.relative(path.resolve("public"), file).split(path.sep).join("/");
  manifest[publicPath] = { width, height, widths };
}

await mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
console.log(`media: ${Object.keys(manifest).length} images`);
