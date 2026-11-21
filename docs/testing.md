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

El workflow `link-check.yml` ejecuta lychee sobre el **sitio construido** (`dist/**/*.html`) en cada PR, no sobre los Markdown fuente: así se evitan falsos positivos de sintaxis Obsidian y de rutas relativas al source. Antes de chequear se prepara un árbol temporal:

1. copia de `dist/`;
2. los canonicals absolutos `https://netenebrae-sec.github.io/neCyberWiki/...` se reescriben a `/neCyberWiki/...` para resolverlos contra el build, no contra el sitio desplegado (que puede no tener aún las rutas de la rama);
3. symlink `neCyberWiki -> site` como directorio **hermano**, para resolver `/neCyberWiki/...` con `--root-dir` sin recursar.

YouTube y `polimetro.com` se excluyen porque bloquean a los checkers con 403, y `gnu.org` porque responde 429 o timeout a los runners de forma sostenida (dos enlaces en `bandit/17.md` y `bandit/18.md`). El 429 de otros hosts se acepta porque es rate limiting, no un enlace muerto. Un enlace realmente roto se corrige, nunca se ignora ni se desactiva el gate.

Para reproducirlo en local con la misma versión de lychee que CI (v0.24.2):

```bash
CHECK_ROOT=/tmp/ncw-linkcheck
rm -rf "$CHECK_ROOT" && mkdir -p "$CHECK_ROOT"
cp -R dist "$CHECK_ROOT/site"
ln -s "$CHECK_ROOT/site" "$CHECK_ROOT/neCyberWiki"
find "$CHECK_ROOT/site" -name '*.html' -print0 \
  | xargs -0 sed -i 's#https://netenebrae-sec\.github\.io/neCyberWiki#/neCyberWiki#g'
lychee --no-progress --root-dir "$CHECK_ROOT" --index-files index.html \
  --exclude 'youtube\.com' --exclude 'www\.gnu\.org' \
  --exclude 'www\.polimetro\.com' \
  --accept '100..=103, 200..=299, 429' \
  "$CHECK_ROOT/site/**/*.html"
```
