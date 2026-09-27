/**
 * Stock photos from Pexels (free for commercial use, attribution not required).
 * They only show how the layout works with good photography: every one is rendered with an
 * "example photo" badge and must be replaced with the studio's own pictures before launch.
 * Photo pages: https://www.pexels.com/photo/<id>/
 */
/** Home hero slideshow, in order. */
export const heroSlides = [
  18121478, // gabled house with a green roof in a mountain valley
  2581922, // black timber house with a grass roof by the sea
  27582249, // farmhouses in a green valley under low clouds
  32934164, // dark timber facade with a blue window
];

export const placeholderPhotos = {
  landscape: 37179496, // Carpathian mountains in Romania, spring
  studio: 36809500, // studio wall with sketches and models
  sketch: 6614748, // architectural sketches in a notebook
  plans: 5476051, // pencil on drawings
} as const;

/** Per ARHI MEDE direction (content/pillars slug): a cover first, then gallery pictures. */
export const pillarPhotos: Record<string, number[]> = {
  architecture: [30484316, 3298918, 15022526], // timber-clad house; terracotta facade; concrete and wood
  research: [7505175, 4977410, 7504591], // material library; stone samples; wood samples
  heritage: [17581797, 36054139, 38056460], // scaffolded facade; tower under restoration; timber frame
  "interior-design": [3964535, 39801593, 18891789], // timber-panelled hall; wooden ceiling; stair light
  materials: [39084066, 36110291, 27850966], // salvaged bricks on a pallet; weathered timber; stacked wood
  elements: [39583824, 14566982, 9811929], // reclaimed doors; painted doors; shutters on a brick wall
  design: [7109998, 6790066, 37498655], // planing timber; furniture workshop; rustic chairs
  education: [7883875, 9618119, 4499431], // timber section model; making a model; drawing on cardboard
};

/** Header pictures of the two division pages. */
export const divisionPhotos = {
  arhi: 18891783, // concrete stair with a timber handrail in sunlight
  mede: 36110291, // weathered reclaimed timber
} as const;

/** About page. */
export const aboutPhotos = [7883882, 5367677]; // architectural model; reclaimed timber posts

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
