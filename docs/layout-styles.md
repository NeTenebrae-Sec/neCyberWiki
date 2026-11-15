# Layout & visual system (`src/layouts/BaseLayout.astro`, `src/styles/global.css`)

> Module: the shared site shell (header, mobile drawer, footer) and the
> editorial design system used by every page.

## Purpose

Provide one persistent shell and one token set for the whole site. Pages only
render their own content; navigation, theme persistence, local course
progress, the mobile drawer and the footer live here.

The visual direction is editorial-technical: Bricolage Grotesque for display,
IBM Plex Sans for body copy, IBM Plex Mono for metadata and code. The original
cyan/phosphor-green/violet palette is preserved; hierarchy comes from type,
rules and spacing rather than fake HUD telemetry.

## Files

- `src/layouts/BaseLayout.astro` — HTML document, theme bootstrap, header,
  mobile drawer, footer and the inline scripts for theme, drawer and global
  progress. Props: `titulo` (required), `descripcion` (optional).
- `src/styles/global.css` — Tailwind import, font imports, design tokens,
  dark/light themes, editorial primitives and all shared component styles.
- `src/data/site.ts` — site name, description, base path, social links and
  Ko-fi/Giscus configuration.

## Invariants & contracts

- Palette values must not change in the dark theme:
  `--bg #030608`, `--accent #22d9f2`, `--accent-green #6bff72`,
  `--accent-violet #9d6bff`.
- Font families are exposed as `--font-display`, `--font-body` and
  `--font-mono`; pages must use these tokens instead of hard-coded families.
- Theme key: `localStorage["ncw-theme"]` (`dark` | `light`), applied to
  `<html data-theme>`. The inline head script prevents a flash of the wrong
  theme.
- Course progress key: `localStorage["ncw:progress:<slug>"]`. The shell only
  reads `ncw:progress:arch-linux-facil` to fill the drawer progress block.
- Stable DOM ids used by the inline scripts: `theme-toggle`,
  `open-sidebar-btn`, `close-sidebar-btn`, `lateral-sidebar`,
  `lateral-overlay`, `mobile-progress-label`, `mobile-progress-fill`.
- `<main>` must not create a stacking context (no `z-index`); fixed drawers
  inside pages rely on it.
- All internal URLs use `site.base` (`/neCyberWiki/`) so preview and GitHub
  Pages resolve assets correctly.
- No fake telemetry, "system online" labels or exclamation marks in shell
  copy.

## Verify

- `npm run build` — 16 pages, no errors.
- `npm run check` — 0 errors.
- `npm run lint` and `npx prettier . --check` — clean.
- Live: Playwright at 360×800 and 1440×1000; no horizontal overflow, drawer
  opens/closes, theme survives a reload, progress label reflects storage.
- `npm run preview -- --port 4323` — CSS and font files resolve under
  `/neCyberWiki/_astro/`.
