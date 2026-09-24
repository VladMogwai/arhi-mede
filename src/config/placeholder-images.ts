/**
 * Stock photos from Pexels (free for commercial use, attribution not required).
 * They only show how the layout works with good photography: every one is rendered with an
 * "example photo" badge and must be replaced with the studio's own pictures before launch.
 * Photo pages: https://www.pexels.com/photo/<id>/
 */
export const placeholderPhotos = {
  hero: 7031604, // wood and glass house with a lawn
  landscape: 37179496, // Carpathian mountains in Romania, spring
  studio: 36809500, // studio wall with sketches and models
  sketch: 6614748, // architectural sketches in a notebook
  plans: 5476051, // pencil on drawings
} as const;

/** Extra gallery pictures per project category, appended after the studio's own photos. */
export const placeholderGalleries: Record<string, number[]> = {
  "constructii-noi": [7031405, 32934164, 8925427, 7031414],
  "consolidari-si-reabilitari-de-cladiri-existente": [16690918, 38130080, 14351885],
  "amenajare-interioara": [15758636, 12277197, 11664583, 34549311],
  studii: [36809500, 4458193, 5476051],
};

const widths = [640, 1280, 1920];

export function pexelsUrl(id: number, width: number): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}

export function pexelsSrcSet(id: number): string {
  return widths.map((width) => `${pexelsUrl(id, width)} ${width}w`).join(", ");
}
