import metrics from "./brand-logo-metrics.json";

type LogoMetrics = (typeof metrics)[keyof typeof metrics];

/**
 * Optical sizing for the brand wall.
 *
 * Every cell is the same 2:1 box. Logos arrive on canvases with very different amounts of transparent
 * padding (Trane's mark fills a third of its canvas height, GE's circle half its width), so sizing by
 * canvas, or scaling everything alike, cannot work. Instead each logo is sized from its *visible* bounds
 * (scripts/measure-brand-logos.mjs) with one rule per shape:
 *
 *  - an area budget, so a wide strip and a compact mark carry a similar visual weight, and
 *  - a width cap and a height cap, so nothing crowds the cell edge or its neighbours.
 *
 * Circles, squares and crests get a larger area budget than wordmarks (a round mark looks smaller than a
 * strip of the same area), and ultra-wide strips are allowed the full width because they are only a few
 * pixels tall.
 */
const CELL_ASPECT = 2; // cell width / cell height. Must match `.logo { aspect-ratio }` for brand walls.

type ShapeRule = {
  /** Visible area as a fraction of the cell area */
  area: number;
  /** Largest visible width, as a fraction of cell width */
  maxW: number;
  /** Largest visible height, as a fraction of cell height */
  maxH: number;
};

const SHAPES = {
  ultrawide: { area: 0.3, maxW: 0.84, maxH: 0.5 }, // aspect >= 7 (SkinCeuticals)
  wide: { area: 0.22, maxW: 0.76, maxH: 0.5 }, // aspect 3.2 to 7 (most HVAC and travel wordmarks)
  standard: { area: 0.24, maxW: 0.68, maxH: 0.56 }, // aspect 1.7 to 3.2 (Disney, Napoleon, Oceania)
  compact: { area: 0.3, maxW: 0.5, maxH: 0.66 }, // aspect < 1.7 (circles, squares, crests, bird marks)
} satisfies Record<string, ShapeRule>;

export type LogoShape = keyof typeof SHAPES;

export function logoShape(aspect: number): LogoShape {
  if (aspect >= 7) return "ultrawide";
  if (aspect >= 3.2) return "wide";
  if (aspect >= 1.7) return "standard";
  return "compact";
}

export type SizedLogo = {
  width: number;
  height: number;
  shape: LogoShape;
  /** CSS custom properties consumed by `.logo img` in HomePartners.module.css */
  style: Record<`--${string}`, string>;
};

/**
 * @param src    public path of the logo, as listed in brand-logo-metrics.json
 * @param weight optional nudge (1 = rule as is) for the rare mark whose density the geometry does not capture
 */
export function sizeBrandLogo(src: string, weight = 1): SizedLogo | null {
  const m = (metrics as Record<string, LogoMetrics | undefined>)[src];
  if (!m) return null;

  const rule = SHAPES[logoShape(m.aspect)];
  // visible width w (cell widths) and height w / aspect (cell widths) must satisfy:
  //   area:  w * (w / aspect) * CELL_ASPECT = rule.area   ->  w = sqrt(rule.area * aspect / CELL_ASPECT)
  //   height cap: (w / aspect) * CELL_ASPECT <= rule.maxH ->  w <= rule.maxH * aspect / CELL_ASPECT
  const byArea = Math.sqrt((rule.area * weight * m.aspect) / CELL_ASPECT);
  const byHeight = (rule.maxH * m.aspect) / CELL_ASPECT;
  const visibleWidth = Math.min(byArea, byHeight, rule.maxW);

  return {
    width: m.width,
    height: m.height,
    shape: logoShape(m.aspect),
    style: {
      // Rendered image width as a fraction of the cell: the visible width scaled back up to the canvas
      "--logo-w": String(Math.round((visibleWidth / m.inkW) * 1000) / 1000),
      // Shift that puts the visible centre, not the canvas centre, in the middle of the cell
      "--logo-dx": String(m.dx),
      "--logo-dy": String(m.dy),
    },
  };
}
