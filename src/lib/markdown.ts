import { marked } from "marked";

/** Content comes from the studio's own repository (via the CMS), so the HTML is trusted. */
export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, { async: false });
}
