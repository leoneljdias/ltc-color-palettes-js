import { info } from "./palettes.js";

function svgPolygon(points, fill) {
  const pts = points.map(p => `${p.x},${p.y}`).join(" ");
  return `<polygon points="${pts}" fill="${fill}" stroke="none"/>`;
}

function svgRect(x1, y1, x2, y2, fill) {
  const w = x2 - x1, h = y2 - y1;
  return `<rect x="${x1}" y="${y1}" width="${w}" height="${h}" fill="${fill}" stroke="none"/>`;
}

export function bird(palette, target) {
  if (!Array.isArray(palette) || palette.length < 5) {
    throw new Error("Bird visualization requires at least 5 colors.");
  }

  const paletteName = palette._name || "Custom Palette";
  const bioInfo = info.find(i => i.palette_name === palette._name);
  const subtitle = bioInfo ? bioInfo.bio : `${palette.length} colors`;

  const chrom = palette;

  const body = svgRect(0, -5, 5, 12, chrom[0]);

  const shape1 = svgPolygon([
    { x: 2, y: 0 }, { x: 3, y: 2 }, { x: 3, y: 8 }, { x: 2, y: 10 }
  ], chrom[1]);

  const shape3 = svgPolygon([
    { x: 3, y: 8 }, { x: 3.22, y: 8 }, { x: 3, y: 7.33 }
  ], chrom[2]);

  const shape4 = svgPolygon([
    { x: 1.99, y: 5 }, { x: 2.5, y: 6.5 }, { x: 3.01, y: 5 },
    { x: 3.01, y: 2 }, { x: 2, y: -0.01 }, { x: 2, y: 1 }
  ], chrom[3]);

  const shape2 = svgPolygon([
    { x: 2, y: 1 }, { x: 2.5, y: 3 }, { x: 2.5, y: -2 }, { x: 2, y: -4 }
  ], chrom[4]);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="-1 -6 8 20">
  ${body}
  ${shape1}
  ${shape3}
  ${shape4}
  ${shape2}
  <text x="2.5" y="14" text-anchor="middle" font-family="sans-serif" font-size="0.8" font-style="italic" fill="#333">${subtitle}</text>
</svg>`;

  if (target) {
    if (typeof target === "string") {
      const el = document.querySelector(target);
      if (el) el.innerHTML = svg;
    } else if (target instanceof Element) {
      target.innerHTML = svg;
    }
  }

  return svg;
}
