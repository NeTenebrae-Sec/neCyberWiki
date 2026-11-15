# Course player & syllabus (`/cursos/<slug>/`, `/cursos/<slug>/<leccion>/`)

> Module: the course index page, the lesson (video) page and the shared
> syllabus accordion. Behavior described as of the "4-level hierarchy"
> change (Curso → Módulo → Submódulo → Lección).

## Purpose

Render the course catalog and every course lesson with the 4-level
hierarchy, Código Facilito-style player UX: sticky player header with live
progress, collapsible module/submodule accordion, video chapters with
timestamps, local progress persisted in `localStorage` (no accounts), and
mobile-first navigation (FAB + drawer).

## Files

- `src/lib/syllabus.ts` — pure logic (FN-03): `normalizeLesson`,
  `groupSyllabus`, `parseDuracionMin`, `formatTotalMin`, `formatCapituloTime`.
  No UI, no Node APIs. Covered by `tests/syllabus.test.mjs`.
- `src/components/CourseModuleList.astro` — shared accordion. Props:
  `modules` (from `groupSyllabus`), `slug`, `base`, `current?` (lesson slug,
  for the lesson page), `variant` (`"sidebar"` compact rows with inline
  chapters / `"page"` large rows with per-module progress bar).
- `src/pages/cursos/[slug]/index.astro` — course home: hero with promesa,
  stats chips (lecciones, módulos, ~video minutes), progress card, CTA
  "Continuar donde lo dejaste" (client-side, reads `ncw:progress:<slug>` and
  points to the first uncompleted lesson), requirements aside, page-variant
  syllabus.
- `src/pages/cursos/[slug]/[leccion].astro` — player: sticky header
  (breadcrumb, module/submodule crumbs, live progress bar, mobile "Temario"
  button), video card, lesson header (module/submodule chips, prev/next),
  written guide, prev/next cards, Giscus, sidebar/drawer syllabus.
- `src/components/VideoEmbed.astro` — YouTube embed with `enablejsapi=1&rel=0`
  (required for chapter seeking) and `id="lesson-video"`. Empty `video`
  renders the "Video en producción" placeholder.
- `src/styles/syllabus.css` — `.sy-*` accordion system, `.temario` drawer /
  sticky sidebar (mobile drawer; `lg:` sticky, `max-height: calc(100vh - 7.5rem)`),
  `.fab-temario`.

## Invariants & contracts

- DM-03 frontmatter (`specs/03-data-models.md`): `modulo` is now the module
  slug _within the course_; `modulo_titulo`, `submodulo`, `submodulo_titulo`,
  `capitulos: [{t (seconds, int ≥ 0), titulo}]` are optional. Empty
  `submodulo` ⇒ the lesson renders directly under the module. Module numbers
  derive from first appearance (1-based); submodule numbers come from the
  `submodulo` field as authored (e.g. `"2.2"`).
- Progress storage: `localStorage["ncw:progress:<slug>"]` = JSON array of
  lesson file slugs. Module open/closed state:
  `localStorage["ncw:modules:<slug>"]` = JSON array of open module keys.
  Clearing browser storage resets progress (accepted, documented).
- Chapter seeking posts `{event:"command",func:"seekTo",args:[t,true]}` to
  `iframe#lesson-video`; chapters are disabled when the lesson has no `video`
  yet (all pilot episodes are "video en producción").
- `<details>`/`<summary>` accordion (native disclosure): keyboard and screen
  reader accessible without JS; JS only persists state + syncs progress.
- Stacking rule: `<main>` must NOT create a stacking context (no `z-index`).
  The mobile drawer/overlay are `position: fixed` inside `<main>`; any z-index
  on `<main>` would cap them below the site header (`--z-header`, 50). Sidebars
  that must paint above page chrome (`.temario` at `--z-drawer` 80,
  `.temario-overlay` at 70, `.fab-temario` at 65) rely on this.

## Chapters: how to add them

Video chapters are **not invented**: timestamps must come from the recorded
episode. When available, add to the lesson frontmatter:

```yaml
capitulos:
  - { t: 0, titulo: "Introducción" }
  - { t: 74, titulo: "Descargar la ISO" }
```

They render in the sidebar with `mm:ss` labels and seek the player on click.
On the index page they show as a "N capítulos" meta hint per lesson.

## Verify

- `npm run build` — 16 pages, no errors.
- `npm run check` — 0 errors (was 3 pre-existing type errors in
  `src/data/categorias.ts`, now fixed by widening the `nivel` union).
- `npm test` — `tests/syllabus.test.mjs`, 7/7.
- Live: dev server + Playwright at 360px, 768px and 1440px (RNF-04) in Noche
  and Archivo, sidebar drawer/FAB at 360px, accordion toggle, chapters click
  (needs a published `video` to observe seeking).
