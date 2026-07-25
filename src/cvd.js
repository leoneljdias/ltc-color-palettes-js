import { palettes } from "./palettes.js";
import { simulateCVD } from "./color-utils.js";

export function ltcCvd(name, severity = 1) {
  let pal;
  if (typeof name === "string" && palettes[name]) {
    pal = palettes[name];
  } else if (Array.isArray(name)) {
    pal = name;
  } else {
    throw new Error("name must be a palette name or array of hex colors");
  }

  if (severity < 0 || severity > 1) {
    throw new Error("severity must be between 0 and 1");
  }

  const result = {
    normal: [...pal],
    deuteranopia: pal.map(c => simulateCVD(c, "deutan", severity)),
    protanopia: pal.map(c => simulateCVD(c, "protan", severity)),
    tritanopia: pal.map(c => simulateCVD(c, "tritan", severity))
  };

  return result;
}
