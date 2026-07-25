import { info } from "./palettes.js";
import { hexToRgb } from "./color-utils.js";

function luminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function plotLtc(palette, target) {
  if (!Array.isArray(palette) || palette.length === 0) {
    throw new Error("palette must be a non-empty array of hex colors");
  }

  const paletteName = palette._name || "Custom Palette";
  const bioInfo = info.find(i => i.palette_name === palette._name);
  const subtitle = bioInfo ? bioInfo.bio : `${palette.length} colors`;
  const n = palette.length;
  const swatchW = 80;
  const swatchH = 50;
  const labelH = 20;
  const totalH = swatchH + labelH + 30;
  const totalW = n * swatchW;

  let rects = "";
  let labels = "";

  for (let i = 0; i < n; i++) {
    const x = i * swatchW;
    const lum = luminance(palette[i]);
    const textColor = lum > 150 ? "#1A1A1A" : "#FFFFFF";
    rects += `<rect x="${x}" y="0" width="${swatchW}" height="${swatchH}" fill="${palette[i]}" stroke="white" stroke-width="1"/>`;
    labels += `<text x="${x + swatchW / 2}" y="${swatchH + 14}" text-anchor="middle" font-family="monospace" font-size="11" fill="#333">${palette[i].toUpperCase()}</text>`;
  }

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}">
  <text x="${totalW / 2}" y="${totalH - 4}" text-anchor="middle" font-family="sans-serif" font-size="12" font-style="italic" fill="#333">${subtitle}</text>
  ${rects}
  ${labels}
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
