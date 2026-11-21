# Pruebas

## Tests unitarios

Los tests viven en `tests/` y usan el runner de Node con `--experimental-strip-types` (definido en el script `npm test`). Se ejecutan sobre módulos `.ts` directamente, sin compilación previa.

```bash
npm test
```

| Archivo | Cubre |
| --- | --- |
| `tests/tracks.test.mjs` | Helpers puros de rutas, configuración y orden de lecciones |
| `tests/profile.test.mjs` | Validación, exportación, importación y borrado del perfil local |
| `tests/course-config.test.mjs` | Lógica del configurador de ruta |

Los módulos bajo prueba son puros: no tocan `localStorage` ni el DOM. Reciben un objeto compatible con `localStorage` o una configuración y devuelven datos. Eso permite testearlos sin navegador.

Algunos tests dependen de un build previo (por ejemplo, los que comprueban el bundle de Pagefind). Si `dist/` no existe, se marcan como omitidos para no romper `npm test` en frío. Para ejecutarlos, corre `npm run build` antes.

## Gates

Antes de abrir un PR, todos los gates deben pasar:

```bash
npm run build
npm run check
npm run lint
npm test
npx prettier --check .
```

Los mismos gates corren en CI para cada PR y para cada push a `dev` y `main`. Consulta [`ci-cd.md`](ci-cd.md) para el detalle de los workflows.

## Verificación manual con Playwright

No hay tests de navegador automatizados integrados. La verificación visual se hace con Playwright de forma manual sobre un servidor local.

```bash
npm run build && npm run preview   # build real, con índice de búsqueda
npm run dev                        # desarrollo, genera el índice en predev
```

Comprobaciones habituales:

- **Anchos:** 390 px (móvil), 768 px (tableta) y 1280–1440 px (escritorio). Sin overflow horizontal.
- **Navegación:** migas, enlaces anterior/siguiente y temario (drawer en móvil).
- **Configurador:** cambio de dificultad/entorno/arranque, bloqueo de opciones, persistencia tras recarga y deep links por query params.
- **Progreso:** marcar una lección, cambiar de ruta y comprobar que el estado compartido/aislado es el esperado.
- **Búsqueda:** focus, `Ctrl/Cmd+K`, resultados y cierre con Escape. Solo funciona sobre build.
- **Accesibilidad:** foco visible, `aria-*` y un solo `<h1>`.

Para inspeccionar el DOM o el `localStorage` desde la consola del navegador con un agente, puedes usar las herramientas de evaluación de Playwright sobre la página abierta.

## Comprobación de enlaces

El workflow `link-check.yml` ejecuta lychee sobre los Markdown del proyecto en cada PR. Comprueba enlaces HTTP y archivos locales. Las imágenes referenciadas con rutas absolutas (`/neCyberWiki/...`) se resuelven con `--root-dir .` contra `public/`.

Los artefactos generados (`dist/`, `public/pagefind/`) están excluidos. YouTube se excluye porque bloquea a los checkers automatizados con 403.

Para ejecutarlo en local:

```bash
npx lychee --no-progress --root-dir . './**/*.md'
```
