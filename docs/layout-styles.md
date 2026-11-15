# Layout & visual system (`src/layouts/BaseLayout.astro`, `src/styles/`)

> Module: the shared site shell (header, native dialog drawer, footer) and the
> «Archivo del Abismo» design system used by every page.

## Purpose

Provide one persistent shell and one token set for the whole site. Pages only
render their own content; navigation, theme persistence, course progress, the
mobile drawer and the footer live here.

The direction is a field archive printed on recovered paper and read through a
dying terminal. It has two surfaces: **Noche** (dark, default) and **Archivo**
(paper light). Fraunces Variable carries display type, IBM Plex Sans body copy,
and IBM Plex Mono metadata and code. The identity comes from dossier sheets,
cut corners, tape, stamps, the plate map and a subtle press misregistration —
not from fake HUD telemetry.

## Files

- `src/layouts/BaseLayout.astro` — HTML document, theme bootstrap, header,
  native `<dialog>` drawer, footer and the inline scripts for theme, drawer and
  global progress. Props: `titulo` (required), `descripcion` (optional).
- `src/styles/global.css` — Tailwind import, font imports and the layer order:
  `tokens → base → patterns → shell → syllabus`.
- `src/styles/tokens.css` — type, space, layout, motion and z-index tokens plus
  the Noche/Archivo palettes, grain and paper textures.
- `src/styles/base.css` — reset, typography, focus-visible, selection and prose.
- `src/styles/patterns.css` — shared primitives: sheets, dockets, stamps,
  terminal, buttons, forms, board, tags and status marks.
- `src/styles/shell.css` — header, navigation, theme switch, drawer and footer.
- `src/styles/syllabus.css` — `.sy-*` accordion, `.temario` drawer and
  `.fab-temario` (course player).
- `src/data/site.ts` — site name, description, base path, social links and
  Ko-fi/Giscus configuration.

## Invariants & contracts

- Themes: `<html data-theme="dark">` (Noche, default) and `"light"` (Archivo).
  Key: `localStorage["ncw-theme"]` (`dark` | `light`). The inline head script
  prevents a flash of the wrong theme. `meta[name="theme-color"]` follows the
  theme: `#070a08` for Noche, `#e9e1cf` for Archivo.
- Palette tokens live in `tokens.css`. Noche: `--bg #070a08`,
  `--ink #e9e4d4`, `--accent #5de4e6`, `--signal #b6f36b`,
  `--stamp #c46a45`, `--blog #b79bff`. Archivo: `--bg #e9e1cf`,
  `--ink #17140e`, `--accent #08666b`, `--signal #3f6b12`,
  `--stamp #9a4423`, `--blog #5b3fa0`. Compatibility aliases (`--border`,
  `--accent-green`, `--bg-soft`, etc.) resolve to this semantic set; new code
  should use the semantic names.
- Font families are exposed as `--font-display` (Fraunces Variable),
  `--font-body` (IBM Plex Sans) and `--font-mono` (IBM Plex Mono); pages must
  use these tokens instead of hard-coded families.
- Course progress key: `localStorage["ncw:progress:<slug>"]`. The shell only
  reads `ncw:progress:arch-linux-facil` to fill the drawer progress block.
- Stable DOM ids used by the inline scripts: `theme-toggle`,
  `open-sidebar-btn`, `close-sidebar-btn`, `lateral-sidebar`,
  `mobile-progress-label`, `mobile-progress-fill`.
- The mobile drawer is a native `<dialog id="lateral-sidebar">` opened with
  `showModal()`; `Esc`, the backdrop and the close button dismiss it and focus
  returns to the opener. The modal blocks page scroll while open.
- Header height is `4rem`; `.site-main` offsets it with `padding-top: 4rem`,
  and the course-player sticky header uses `top: 4rem`.
- `<main>` must not create a stacking context (no `z-index`); the header and
  the native dialog rely on it.
- Navigation: four header links (Inicio, Cursos, Mapa, Bitácora); the drawer
  lists `01`–`05` (the fifth is Verificar certificados); the footer repeats the
  same public destinations.
- All internal URLs use `site.base` (`/neCyberWiki/`) so preview and GitHub
  Pages resolve assets correctly.
- Motion respects `prefers-reduced-motion`; no fake telemetry, "system online"
  labels or exclamation marks in shell copy.

## Verify

- `npm run build` — 16 pages, no errors.
- `npm run test`, `npm run check`, `npm run lint`,
  `npx prettier . --check` — green.
- Live: Playwright at 360×800, 768×900 and 1440×1000 in both themes; no
  horizontal overflow, drawer opens/closes with mouse, keyboard and `Esc`,
  theme survives a reload, progress label reflects storage.
- `npm run preview -- --port 4323` — CSS and Fraunces/IBM Plex `.woff2` files
  resolve under `/neCyberWiki/_astro/`.
