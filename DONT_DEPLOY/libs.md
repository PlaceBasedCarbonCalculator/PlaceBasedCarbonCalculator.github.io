# Vendored libraries

Third-party libraries are served from this site rather than a public CDN. Every
file here is byte-identical to the published package, downloaded from unpkg (or
cdnjs for showdown), and committed unchanged. There is no build step on deploy.

## Why self-hosted

The usual reason to use a shared CDN, that a visitor may already hold the file
in cache from another site, stopped applying in 2020-21 when Chrome, Firefox and
Safari all partitioned the HTTP cache by top-level site. What was left was three
extra origins to resolve, connect and TLS-handshake before the map could start.
Specifically:

- **Availability.** MapLibre and PMTiles came from unpkg, a free service with no
  SLA. If it was slow or down, every map tool rendered a blank map.
- **The service worker could not cache any of it.** `sw.js` returns early for
  cross-origin requests, so the ~380KB gzipped of libraries that actually make
  the maps work were outside the cache entirely. They are now runtime-cached
  stale-while-revalidate like any other same-origin asset.
- **Consent.** `js/analytics.js` goes to some trouble not to contact Google
  before the visitor accepts cookies. unpkg, jsDelivr and cdnjs were each
  receiving every visitor's IP and referer on page load regardless.
- **Pinning.** `tippy.js@6` and `@popperjs/core@2` were floating major ranges:
  unpkg resolved them to whatever the newest 6.x / 2.x was that day, so the
  bytes shipped were never the bytes tested.

## What is here

| Directory | Version | Source | Notes |
|---|---|---|---|
| `maplibre-gl-6.4.1/` | 6.4.1 | unpkg | `.mjs`, `-worker.mjs`, `-shared.mjs`, and the CSS |
| `pmtiles-4.5.0/` | 4.5.0 | unpkg | latest release |
| `chartjs-4.4.1/` | 4.4.1 | unpkg | `chart.umd.js` |
| `showdown-2.1.0/` | 2.1.0 | cdnjs | latest release, but see below |
| `tippy-6.3.7/` | 6.3.7 | unpkg | what `@6` resolved to |
| `popperjs-2.11.8/` | 2.11.8 | unpkg | what `@2` resolved to |
| `geocoder/`, `noUiSlider_15_7_0/`, `brotli/`, `pmtiles/` | | | pre-existing, unchanged |

### MapLibre needs all four files, and three of them are not in the markup

`maplibre-gl.mjs` is the only one the HTML mentions. The other two `.mjs` files
are pulled in at runtime, so **you cannot work out the file list by grepping the
pages for what they reference** — that mistake shipped a broken map stack once
already and is worth not repeating:

- `maplibre-gl-shared.mjs` is imported statically, `from "./maplibre-gl-shared.mjs"`,
  by both of the other two modules.
- `maplibre-gl-worker.mjs` is fetched by the library at runtime for its Web
  Worker. It computes its own URL from `import.meta.url`:
  `e.endsWith('-dev.mjs') ? 'maplibre-gl-worker-dev.mjs' : 'maplibre-gl-worker.mjs'`.
  We load the production build, so only the non-dev worker is ever requested.
  Without it Firefox fails the module fetch with `NS_ERROR_CORRUPTED_CONTENT`
  (the 404 page is HTML where a module was expected), and the map never finishes
  loading in any browser.

So all four files **must stay siblings** and keep their names. The version lives
in the directory name for exactly that reason.

Note when testing: a Worker's own script fetch is made by the worker target, not
the page, so it does **not** appear in page-level devtools Network events or CDP
`Network.*` events. A missing worker is invisible to a request-level check.
Assert on the outcome instead: `map.loaded()` must become true and
`map.queryRenderedFeatures().length` must be greater than zero.

Source maps are deliberately not vendored: the four that exist come to about
6MB. Each library therefore has a `//# sourceMappingURL=` comment pointing at a
file that is not there, which browsers request only when devtools are open.

## Version status, checked 2026-09-06

Security advisories were checked against the GitHub Advisory Database.

- **maplibre-gl 6.4.1** (2026-08-18). No advisories. Deliberately *not* on the
  6.7.0 latest: the v6 major only landed on 2026-07-22 and is releasing roughly
  weekly, so 6.7.0 was four days old at the time of writing. 6.4.1 is the
  version every tool was built and tested against.
- **pmtiles 4.5.0** (2026-08-10). Latest, no advisories.
- **chart.js 4.4.1** (2023-12-04). No advisories (the prototype-pollution one
  affects < 2.9.4). It is however eleven releases behind 4.5.1, and worth
  upgrading as its own change, with the charts re-checked, rather than folded
  into the move to self-hosting.
- **showdown 2.1.0** (2022-04-21). Latest, but the project is dormant and this
  version carries **three unpatched medium advisories with no fixed release**:
  stored XSS via table header id injection, XSS via metadata title handling, and
  ReDoS in link parsing. All three need attacker-controlled markdown. Showdown
  only ever renders `manual/index.md`, which is our own content, so none is
  reachable here. If the advisory itself becomes a problem, `marked` or
  `markdown-it` are maintained replacements.
- **tippy.js 6.3.7** (2021-11-10) and **@popperjs/core 2.11.8** (2023-05-26).
  Both the latest of their line, both dormant but stable, no advisories.

## Updating

Download the exact file from the registry, drop it in a new versioned directory,
update the references, then re-check the tools. References live in the five tool
`index.html` files, `index.html` (prefetch hints), `manual/index.html`,
`reports/area-map.js` and the five `reports/*.html` report pages.

```
grep -rn "js/lib/" --include=*.html --include=*.js . | grep -v "^./legacy"
```

Checksums as committed (sha256, first 16 hex characters):

```
maplibre-gl-6.4.1/maplibre-gl.mjs          97e8b9a39ab8b823
maplibre-gl-6.4.1/maplibre-gl-shared.mjs   fcf4d81450df235d
maplibre-gl-6.4.1/maplibre-gl.css          8e2dbbab312dc576
pmtiles-4.5.0/pmtiles.js                   caf981bc46f6327e
chartjs-4.4.1/chart.umd.js                 74401d738dd3e03e
showdown-2.1.0/showdown.min.js             88eb6fbbe0c270dd
tippy-6.3.7/tippy-bundle.umd.min.js        3f0fe70eb26ccf28
popperjs-2.11.8/popper.min.js              c212f4b505a86352
```
