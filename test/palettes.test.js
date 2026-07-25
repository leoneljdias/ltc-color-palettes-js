import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  palettes, info, listPalettes,
  ltc, adjustLtc, customAdjustLtc,
  desaturateLtc, ltcCvd,
  hexToRgb, rgbToHsl, colorRamp
} from "../src/index.js";

describe("palettes", () => {
  it("has all expected palettes", () => {
    const names = listPalettes();
    const expected = [
      "paloma", "maya", "dora", "ploen", "olga", "mterese", "gaby",
      "franscoise", "fernande", "sylvie", "expevo", "minou", "kiss",
      "hat", "reading", "alger", "trio1", "trio2", "trio3", "trio4",
      "heatmap0", "pantone23", "remains", "midnight", "lincoln",
      "luminaries", "seafarer", "shuggie", "heatmap1", "heatmap2",
      "heatmap3", "casa_natal"
    ];
    assert.deepEqual(names, expected);
    assert.equal(names.length, 32);
  });

  it("paloma has correct hex values", () => {
    assert.deepEqual(palettes.paloma, ["#83AF9B", "#C8C8A9", "#F8DA8A", "#F7BF95", "#FE8CA1"]);
  });

  it("maya has correct hex values", () => {
    assert.deepEqual(palettes.maya, ["#3D5A80", "#98C1D9", "#E0FBFC", "#EE6C4D", "#293241"]);
  });

  it("casa_natal has 9 colors", () => {
    assert.equal(palettes.casa_natal.length, 9);
    assert.equal(palettes.casa_natal[0], "#245E55");
    assert.equal(palettes.casa_natal[8], "#EAE4DA");
  });

  it("info has entries for all palettes", () => {
    assert.equal(info.length, listPalettes().length);
    info.forEach(entry => {
      assert(palettes[entry.palette_name] !== undefined, `Missing palette: ${entry.palette_name}`);
      assert(typeof entry.bio === "string");
    });
  });
});

describe("ltc()", () => {
  it("returns full palette when n is omitted", () => {
    const result = ltc("paloma");
    assert.deepEqual(result, palettes.paloma);
  });

  it("returns first n colors for discrete", () => {
    const result = ltc("paloma", 3, "discrete");
    assert.deepEqual(result, ["#83AF9B", "#C8C8A9", "#F8DA8A"]);
  });

  it("interpolates for continuous", () => {
    const result = ltc("paloma", 10, "continuous");
    assert.equal(result.length, 10);
    assert.equal(result[0].toUpperCase(), "#83AF9B");
    assert.equal(result[9].toUpperCase(), "#FE8CA1");
  });

  it("interpolates for diverging", () => {
    const result = ltc("heatmap0", 15, "diverging");
    assert.equal(result.length, 15);
  });

  it("throws for unknown palette", () => {
    assert.throws(() => ltc("unknown"), /not found/);
  });

  it("throws when n > palette length for discrete", () => {
    assert.throws(() => ltc("fernande", 10, "discrete"), /greater than/);
  });
});

describe("color utils", () => {
  it("hexToRgb converts correctly", () => {
    const { r, g, b } = hexToRgb("#FF0000");
    assert.equal(r, 255); assert.equal(g, 0); assert.equal(b, 0);
  });

  it("hexToRgb handles lowercase", () => {
    const { r, g, b } = hexToRgb("#ff0000");
    assert.equal(r, 255); assert.equal(g, 0); assert.equal(b, 0);
  });

  it("colorRamp produces correct length", () => {
    const result = colorRamp(["#000", "#FFF"], 5);
    assert.equal(result.length, 5);
    assert.equal(result[0].toUpperCase(), "#000000");
    assert.equal(result[4].toUpperCase(), "#FFFFFF");
  });
});

describe("adjustLtc", () => {
  it("darkens colors with negative amount", () => {
    const maya = ltc("maya");
    const darker = adjustLtc(maya, -30);
    assert(darker[0] !== maya[0]);
    assert.equal(darker.length, maya.length);
  });

  it("lightens colors with positive amount", () => {
    const maya = ltc("maya");
    const lighter = adjustLtc(maya, 30);
    assert(lighter[0] !== maya[0]);
    assert.equal(lighter.length, maya.length);
  });

  it("accepts palette name as string", () => {
    const result = adjustLtc("maya", 20);
    assert.equal(result.length, 5);
  });

  it("adjusts specific colors with which parameter", () => {
    const maya = ltc("maya");
    const result = adjustLtc(maya, -25, [1, 4]);
    assert.notEqual(result[0], maya[0]);
    assert.equal(result[1], maya[1]);
  });
});

describe("customAdjustLtc", () => {
  it("applies per-color adjustments", () => {
    const maya = ltc("maya");
    const result = customAdjustLtc(maya, [-40, -20, 0, 20, 40]);
    assert.equal(result.length, 5);
    assert.notEqual(result[0], maya[0]);
    assert.equal(result[2], maya[2]);
  });
});

describe("desaturateLtc", () => {
  it("desaturates colors", () => {
    const lum = ltc("luminaries");
    const desat = desaturateLtc(lum, 0.5);
    assert.equal(desat.length, lum.length);
    assert(desat[0] !== lum[0]);
  });
});

describe("ltcCvd", () => {
  it("returns all four vision types", () => {
    const result = ltcCvd("maya");
    assert.ok(result.normal);
    assert.ok(result.deuteranopia);
    assert.ok(result.protanopia);
    assert.ok(result.tritanopia);
    assert.equal(result.normal.length, 5);
  });

  it("accepts severity parameter", () => {
    const result = ltcCvd("expevo", 0.6);
    assert.equal(result.normal.length, 6);
  });

  it("accepts array of hex colors", () => {
    const colors = ["#ff0000", "#00ff00", "#0000ff"];
    const result = ltcCvd(colors);
    assert.deepEqual(result.normal, colors);
  });
});

describe("edge cases", () => {
  it("singleton palette for continuous returns 1 color", () => {
    const result = ltc("trio1", 1, "continuous");
    assert.equal(result.length, 1);
  });

  it("adjust with 0 amount returns same", () => {
    const maya = ltc("maya");
    const result = adjustLtc(maya, 0);
    assert.deepEqual(result, maya);
  });

  it("desaturate with 0 amount returns same", () => {
    const maya = ltc("maya");
    const result = desaturateLtc(maya, 0);
    assert.deepEqual(result, maya);
  });

  it("CVD with severity 0 returns normal", () => {
    const result = ltcCvd("maya", 0);
    assert.deepEqual(result.deuteranopia, result.normal);
  });
});
