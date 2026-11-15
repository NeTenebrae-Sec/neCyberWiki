# Home (`src/pages/index.astro`)

> Module: the public entry page. It is the editorial cover of the wiki and
> the only place that mixes the course, the module index and the blog.

## Purpose

Give a first-time visitor a clear route into the material: what the site
teaches, where to start, what is already published and what the method is.
The page is built from real collections and data files — no fake telemetry,
no simulated terminal, no decorative stats.

## Files

- `src/pages/index.astro` — page structure, copy and scoped styles.
- `src/data/categorias.ts` — the eight canonical modules, levels, states,
  tags and resources rendered in the module index.
- `src/data/cursos.ts` — public metadata for the Arch Linux course.
- `src/lib/syllabus.ts` — `normalizeLesson`, `groupSyllabus`,
  `totalSyllabusMin` and `formatTotalMin` for the course card.
- `src/layouts/BaseLayout.astro` — shared shell, theme, drawer and footer.

## Structure

1. **Hero** — asymmetric 12-column layout. Left: context line, `h1`, lead
   and two CTAs. Right: course card with the real syllabus (module rows,
   lesson count, total video time) and local progress.
2. **Module index** — the eight `CATEGORIAS` as native `<details>` rows.
   Each row shows number, title, tagline, level and state; the body shows
   description, tags and resources. Modules without published material say
   "En preparación".
3. **Recent** — latest non-draft `blog` entry and three routes that already
   have material.
4. **Method** — three sequential steps: understand, reproduce, record.
5. **Limits** — permission and lab-only practice, with a link to the code of
   conduct.

## Invariants & contracts

- Exactly one `<h1>`; section headings are `<h2>` and card/step headings are
  `<h3>`.
- The page renders eight `details.module-entry` elements (RF-01).
- Course progress key: `localStorage["ncw:progress:arch-linux-facil"]`,
  stored as a JSON array of lesson slugs.
- Stable ids used by the inline script: `hero-progress`,
  `hero-progress-fill`, `hero-progress-label`, `home-continue`,
  `home-continue-text`, `home-lesson-data`.
- The progress element keeps `role="progressbar"` and updates
  `aria-valuenow` from the stored lessons; `aria-valuemax` is the real
  lesson count.
- The continue link points to the first incomplete lesson, to the course
  index when everything is complete, and to the first lesson when storage is
  empty.
- Lesson data is serialized in a `application/json` script with `<` escaped,
  so titles cannot break out of the script tag.
- The page must work without JavaScript: `<details>` is native and all
  content is server-rendered. Progress is an enhancement.
- Copy rules: no fake telemetry, no "de verdad", "sin relleno", "domina", no
  exclamation marks and no empty promises. The accent palette is cyan for
  action, green for progress/availability and violet for the blog entry.

## Verify

- `npm run build` — 16 pages, no errors.
- `npm run test`, `npm run check`, `npm run lint`,
  `npx prettier . --check` — green.
- Playwright at 1440×1000, 768×900 and 360×800 in Noche and Archivo: no
  horizontal overflow, eight accordions, first accordion opens with mouse and
  keyboard, focus ring visible.
- Seed two lesson slugs in `ncw:progress:arch-linux-facil`, reload: label
  `2 / 8`, fill `25%`, `aria-valuenow="2"` and continue link to lesson 03.
- Seed all eight: label `8 / 8`, continue link to the course index and text
  "Repasar el curso". Clear storage: `0 / 8` and "Empezar el curso".
- Light and dark themes: `meta[name="theme-color"]` follows the stored theme.
- `npm run preview -- --port 4323` — home, CSS and Fraunces `.woff2` resolve
  under `/neCyberWiki/`.
