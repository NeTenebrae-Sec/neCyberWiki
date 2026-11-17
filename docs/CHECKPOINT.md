# Checkpoint — neCyberWiki

Fecha: 2026-11-16
Rama: `feat/mvp-v2`

## Lo hecho

- **Tanda 3** (entregada y commiteada): bitácora definitiva en `/bitacora/` con redirects desde
  `/blog/`; roadmap público en `/roadmap/` con estados hecho / en curso / planeado; buscador
  estático con Pagefind en `/buscar/`; botón «Buscar en el archivo» en el header.
- **Fix del buscador** (2026-11-16): componentes oficiales de Pagefind, instancias `header` y
  `page`, dropdown en el header con atajo `Ctrl+K`, icono que abre `/buscar/?q=`, búsqueda inline
  con prefill `?q=`, `postbuild` que genera el índice, `noindex` fuera del índice y puente de tema.
  Verificado en navegador real con Playwright MCP.
- **Cierre del fix** (2026-11-16): `tests/buscador-build.test.mjs` fija el HTML construido (índice,
  instancias, `noindex`, enlaces), `/buscar/` deja de emitir el script del header y el inicio pierde
  los enlaces con barra doble que quedaban en «Cambios».
- **Fix** (commiteado): enlaces del roadmap sin barra doble (`/neCyberWiki//bitacora/` →
  `/neCyberWiki/bitacora/`).
- **Cleanup** (commiteado): artefactos de IA, agentes, specs y capturas añadidos a `.gitignore`.

## Commits recientes

- `b6798ff` feat: bitácora definitiva, roadmap y buscador Pagefind
- `092d132` fix: enlaces del roadmap sin barra doble
- `15166c8` chore: ignorar artefactos de IA, agentes y capturas de pantalla
- `08a459b` feat: candado legal bloqueante y perfil local
- `92cbe14` feat: catálogo por categorías, Bandit como curso y rutas anidadas

## Gates

- `npm run build` ✓ — 46 páginas construidas; Pagefind indexa 42.
- `npm run check` ✓ — 0 errores.
- `npm run lint` ✓ — sin errores.
- `npm test` ✓ — 30 tests (23 de lógica + 7 sobre el build).
- `npx prettier --check .` ✓.
- `npm run test:e2e` — pendiente de la Tanda 4; el script todavía no existe.

## Verificación en navegador

- Header: 6 resultados para «arch», `Enter` abre el primero, `Escape` cierra, `Ctrl+K` enfoca.
- Icono del header: `/buscar/?q=bandit` con la consulta actual.
- `/buscar/?q=arch`: 42 resultados, input de 48 px, foco restaurado tras el aviso legal.
- Temas Noche y Archivo: dropdown y resultados legibles; sin overflow de 360 a 1440.
- Sin errores de consola ni 404 de `pagefind-component-ui.js`, `pagefind.js` o fragmentos.

## Pendiente

- **Tanda 4**: QA final, accesibilidad, rendimiento, tests E2E con Playwright y release.
- Verificar el deploy de GitHub Pages tras el push.
