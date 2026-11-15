# Game dossier (future work)

> Module: optional Ciber-RPG layer. It is **not published from `main`**; it lives
> on the `game/dossier` branch until there is a playable game.

## Status

- Design dossier and visual prototype only: bestiary, daemons, sector map, turn
  track, command console and a typing drill.
- No game engine, combat loop, save system, audio or daemon fusion.
- `main` ships without any game surface: no `/juego/` route, no navigation
  entry, no home teaser and no `game.css` import.

## Files on this branch

- `src/pages/juego/index.astro` — static dossier rendered at `/juego/`.
- `src/data/juego.ts` — manifest: 3 enemies, 2 daemons, 3 sectors and the
  micro-drill definition.
- `src/components/juego/` — `TurnTrack`, `EnemyCard`, `DaemonCard`,
  `CommandConsole` and `GameSectorMap`.
- `src/styles/game.css` — scoped under `[data-surface="game"]`; imported only by
  the dossier page.
- `src/layouts/BaseLayout.astro` — game entries in the header, drawer and footer.
- `src/pages/index.astro` — home teaser that links to the dossier.

## Contract

- Future game state uses `ncw:game:*` keys, separate from course progress
  (`ncw:progress:<slug>`). The game must not read or write course progress
  directly; use a documented adapter if a link is needed.
- The game layer stays optional: importing `game.css` or the dossier page must
  not affect public pages.
- Stack stays Astro + Tailwind 4 + vanilla JavaScript. No UI framework, backend
  or accounts.
- The dossier is honest about scope: it is a design prototype, not a playable
  game. Keep the "prototipo" label until the engine exists.

## Resume checklist

1. Merge `main` into `game/dossier` to pick up site changes.
2. Implement the engine under `src/game/` (proposed location).
3. Keep the route out of the public shell until the game is playable; the
   branch already contains the nav, footer and teaser wiring.
4. Re-run the gates and the 360/768/1440 matrix in both themes.
5. When ready, merge the branch into `main` and publish `/juego/`.

## Verify

- `npm run build` — 17 pages including `/juego/`.
- `npm run test`, `npm run check`, `npm run lint`,
  `npx prettier . --check` — green.
- `/juego/` renders in Noche and Archivo; the micro-drill accepts a correct
  answer with normalized spaces, reports failure and expires in pressure mode
  after 6 seconds; no horizontal overflow at 360/768/1440.
