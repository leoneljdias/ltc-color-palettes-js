# ltc-color-palettes-js

[![npm version](https://img.shields.io/npm/v/@leoneljdias/ltc-color-palettes-js)](https://www.npmjs.com/package/@leoneljdias/ltc-color-palettes-js)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@leoneljdias/ltc-color-palettes-js)](https://bundlephobia.com/package/@leoneljdias/ltc-color-palettes-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

A JavaScript port of [loukesio/ltc-color-palettes](https://github.com/loukesio/ltc-color-palettes), originally written in R, reimplemented in JavaScript with the same palettes and equivalent functionality. All palette designs and original artwork credit: **Loukas Theodosiou**.

📖 **Website & interactive palette explorer:** [https://leoneljdias.github.io/ltc-color-palettes-js/demo/](https://leoneljdias.github.io/ltc-color-palettes-js/demo/)

## Install

```bash
npm install @leoneljdias/ltc-color-palettes-js
```

## Usage

```js
import { ltc, listPalettes, adjustLtc, desaturateLtc, ltcCvd, plotLtc, bird } from "@leoneljdias/ltc-color-palettes-js";

// List all palettes
console.log(listPalettes());
// ["paloma", "maya", "dora", "ploen", "olga", "mterese", ...]

// Choose a palette
const alger = ltc("alger");
console.log(alger);
// ["#000000", "#1A5B5B", "#ACC8BE", "#F4AB5C", "#D1422F"]

// Continuous interpolation
const heatmap = ltc("heatmap0", 20, "continuous");

// Adjust — darken (-) or lighten (+)
const darker = adjustLtc("maya", -30);
const lighter = adjustLtc("maya", 30);

// Desaturate
const muted = desaturateLtc("luminaries", 0.6);

// Colour-vision deficiency simulation
const cvd = ltcCvd("expevo", 0.6);
// { normal: [...], deuteranopia: [...], protanopia: [...], tritanopia: [...] }

// Render palette as SVG
const svg = plotLtc(ltc("alger"));

// Bird visualization (requires >= 5 colors)
const birdSvg = bird(ltc("pantone23"));

// In a browser, render to a DOM element:
// plotLtc(ltc("alger"), "#palette-container");
// bird(ltc("pantone23"), document.getElementById("bird"));
```

## Differences from the original R package

- **Zero production dependencies.** All color conversions (RGB↔HSL, CVD simulation, interpolation) are implemented in pure JS.
- The `plot()`, `bird()`, `print()` and `ltc_cvd()` R functions produced ggplot2 objects. Their JS equivalents (`plotLtc`, `bird`, `ltcCvd`) return SVG strings (usable in Node or browser) rather than ggplot2 objects.
- The palette data and all hex values are identical to the R package version 0.4.0.
- This is **not affiliated** with the original author. It is a reimplementation in JavaScript.

## API

| JS function | R equivalent | Description |
|---|---|---|
| `ltc(name, n, type)` | `ltc()` | Get palette colors (discrete, continuous, or diverging) |
| `listPalettes()` | `names(palettes)` | List all palette names |
| `plotLtc(palette, target?)` | `plot()` | Generate SVG bar of colors |
| `bird(palette, target?)` | `bird()` | Generate SVG bird visualization |
| `adjustLtc(palette, amount, which?)` | `adjust_ltc()` | Darken/lighten colors |
| `customAdjustLtc(palette, amounts)` | `custom_adjust_ltc()` | Individual per-color adjustment |
| `desaturateLtc(palette, amount, which?)` | `desaturate_ltc()` | Reduce saturation |
| `ltcCvd(name, severity)` | `ltc_cvd()` | Simulate color-vision deficiency |

## Palettes

| Name | Colors | Inspiration |
|---|---|---|
| paloma | 5 | Daughter of Francoise Gilot and Pablo Picasso |
| maya | 5 | Daughter of Marie-Therese Walter |
| dora | 5 | French photographer, painter, and poet |
| ploen | 5 | A village in Northern Germany |
| olga | 5 | Russian ballet dancer |
| mterese | 5 | Marie-Therese Walter |
| gaby | 5 | French dancer |
| franscoise | 5 | French painter |
| fernande | 4 | French model and artist |
| sylvie | 5 | French artist and model |
| expevo | 6 | Biology palette |
| minou | 6 | Picasso's cat |
| kiss | 5 | The Kiss (Picasso, 1925) |
| hat | 10 | Woman in Hat (Picasso, 1937) |
| reading | 8 | Two Girls Reading (Picasso, 1934) |
| alger | 5 | Les femmes d'Alger (Picasso, 1955) |
| trio1–4 | 3 each | 3-variable discrete palettes |
| heatmap0 | 9 | Diverging palette for heatmaps |
| heatmap1–3 | 5 each | Diverging palettes |
| pantone23 | 5 | Pantone Soft Chaos 2023 |
| remains | 4 | The Remains of the Day |
| midnight | 4 | Midnight's Children |
| lincoln | 6 | Lincoln in the Bardo |
| luminaries | 6 | The Luminaries |
| seafarer | 5 | The Old Man and the Sea |
| shuggie | 5 | Shuggie Bain |
| casa_natal | 9 | Picasso's birthplace |

## Contributions

This is a fork/port of the original R package by **Loukas Theodosiou** ([theodosiou@evolbio.mpg.de](mailto:theodosiou@evolbio.mpg.de)). For the palettes he drew inspiration from the drawings and life of Pablo Picasso as well as from several books.

Issues and pull requests are welcome on [GitHub](https://github.com/leoneljdias/ltc-color-palettes-js).

## Roadmap

Version 0.4.0 mirrors the CRAN version of the original R package.

## License

MIT — see [LICENSE](LICENSE). Original palette designs and artwork credit: Loukas Theodosiou.
