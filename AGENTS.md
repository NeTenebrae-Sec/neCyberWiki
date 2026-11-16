# AGENTS.md

Router para agentes. Antes de tocar código, lee:

1. `docs/WORKFLOW.md` — cómo se trabaja y cómo se ahorran tokens.
2. `docs/PRODUCT.md` — qué es el sitio y qué queda fuera del MVP.
3. `docs/ARCHITECTURE.md` — rutas, datos y almacenamiento.

## Reglas del proyecto

- El sitio es un **archivo personal de aprendizaje**, no una enciclopedia ni una academia.
- No inventes contenido, fechas, métricas, videos, certificados ni capacidades.
- Todo el contenido es educativo. La práctica ocurre en entornos propios o autorizados.
- Sin backend, sin cuentas, sin frameworks de UI. Astro + Tailwind 4 + JS vanilla.
- El progreso, el tema y el perfil viven en `localStorage`.
- No toques `game/dossier` ni material privado.
- El buscador se genera en build. `astro dev` no tiene índice.

## Flujo de una tanda

1. Objetivo en 3 bullets.
2. Máximo 10 preguntas si hay ambigüedad real.
3. Máximo 5 preguntas de cierre.
4. Brief de 12 líneas.
5. Implementar.
6. Pasar gates.
7. Handoff de 5 bullets y esperar aprobación.

Para cambios pequeños, escribe un brief de 3 líneas y ejecuta. No conviertas todo en una ceremonia.

## Gates

```bash
npm run build
npm run check
npm run lint
npm test
npm run test:e2e
npx prettier --check .
```

## Dónde vive cada cosa

- Categorías: `src/data/categorias.ts`
- Cursos: `src/data/cursos.ts` y `content/cursos/`
- Bitácora: `content/blog/`
- Roadmap: `src/data/roadmap.ts`
- Rutas: `src/pages/`
- Shell, navegación y candado legal: `src/layouts/BaseLayout.astro`
- Búsqueda: `src/pages/buscar.astro` y Pagefind en el build
