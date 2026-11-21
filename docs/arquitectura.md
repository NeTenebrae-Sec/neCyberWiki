# Arquitectura

## Visión general

neCyberWiki es un sitio estático sin backend. Todo el contenido vive en Markdown, se transforma en HTML durante el build y se publica en GitHub Pages. El estado del lector (tema, progreso, perfil) se guarda en `localStorage`; no hay cuentas ni servidor.

```
content/  ──build──>  dist/  ──Pages──>  navegador
   │                    │
   │                    └─ pagefind (índice de búsqueda)
   └─ src/data + src/lib  (categorías, cursos, rutas, perfil)
```

## Stack

| Capa | Tecnología |
| --- | --- |
| Generación | Astro 7 con salida estática (`output: static`) |
| Estilos | Tailwind CSS 4 vía plugin de Vite + CSS propio con tokens |
| Lenguaje | TypeScript y JavaScript vanilla; sin frameworks de UI |
| Contenido | Content Collections con `glob` y esquemas Zod |
| Búsqueda | Pagefind, índice generado en `postbuild` |
| Despliegue | GitHub Pages bajo el base path `/neCyberWiki/` |

## Estructura de fuentes

```text
src/
  components/   Componentes de interfaz (Astro)
  data/         Categorías, cursos, roadmap y datos globales del sitio
  layouts/      Shell común, navegación y aviso legal
  lib/          Lógica pura: catálogo, temario, rutas y perfil
  pages/        Rutas de Astro (file-based routing)
  styles/       Tokens, base, patrones, shell y estilos de página
content/
  cursos/       Lecciones Markdown (colección `cursos`)
  blog/         Entradas de la bitácora (colección `blog`)
public/
  cursos/       Imágenes de los cursos
tests/          Tests unitarios (Node test runner)
```

## Modelo de datos

La disponibilidad se **calcula**, no se declara. Un curso aparece si tiene lecciones publicadas, y una categoría se enciende si tiene al menos un curso publicado.

| Módulo | Responsabilidad |
| --- | --- |
| `src/data/categorias.ts` | Taxonomía canónica de categorías |
| `src/data/cursos.ts` | Metadatos editoriales de cada curso |
| `src/data/roadmap.ts` | Roadmap público |
| `src/lib/catalog.ts` | Deriva cursos y categorías con contenido |
| `src/lib/syllabus.ts` | Agrupa lecciones en módulos y submódulos |
| `src/lib/tracks.ts` | Rutas por dificultad, entorno y arranque; helpers puros |
| `src/lib/profile.ts` | Lista, valida y aplica el perfil local |

`cursos.ts` declara `unidad`: `"clase"` numera desde 1, `"nivel"` respeta la numeración desde 0 (Bandit).

## Rutas

| Ruta | Página |
| --- | --- |
| `/` | Portada |
| `/cursos/` | Índice de categorías |
| `/cursos/<categoria>/` | Cursos de una categoría |
| `/cursos/<categoria>/<curso>/` | Portada del curso |
| `/cursos/<categoria>/<curso>/<leccion>/` | Lección |
| `/bitacora/` y `/bitacora/<slug>/` | Bitácora |
| `/roadmap/` | Cambios y planes |
| `/perfil/` | Perfil local |
| `/terminos/` | Términos y uso legal |

El buscador vive en el header del shell; `/buscar/` fue eliminado. Las redirecciones activas (`/categorias`, `/certificados`, `/notas`, `/blog`, rutas antiguas de Arch y Bandit) se declaran en `astro.config.mjs` e incluyen siempre el base `/neCyberWiki/`.

## Búsqueda

Se usan los componentes oficiales de Pagefind (`pagefind-component-ui`), con una instancia `header` montada por `BaseLayout`. El índice se genera en `dist/pagefind/` durante `postbuild`; `public/pagefind/` no se versiona. Las páginas con `noindex` no llevan `data-pagefind-body` y añaden `data-pagefind-ignore="all"`.

En `astro dev` no hay índice: el buscador solo se prueba con `npm run build && npm run preview` (o `npm run dev`, que ejecuta un `predev` que genera el índice antes de arrancar).

## Estado en el cliente

| Clave | Contenido |
| --- | --- |
| `ncw-theme` | `dark` o `light` |
| `ncw:progress:<curso>` | Slugs de lecciones completadas |
| `ncw:modules:<curso>` | Módulos abiertos del temario |
| `ncw:legal:v1` | Fecha ISO de aceptación del aviso legal |
| `ncw:profile:name` | Alias local opcional |

No hay cookies, cuentas ni llamadas a un backend. La lógica pura de perfil vive en `src/lib/profile.ts` y acepta un objeto compatible con `localStorage` para poder testearse sin navegador.

## Curso adaptable de Arch Linux

`src/lib/tracks.ts` define seis rutas (dificultad × entorno × arranque) y calcula para cada una la lecciones visibles y su numeración. `CourseConfig.astro` y `course-config.client.ts` pintan el configurador, filtran el temario y emiten `ncw:course-config`.

El progreso usa un bucket único por curso (`ncw:progress:arch-linux`) y IDs calificados (`slug@ruta`) para las lecciones especiales, de modo que las comunes comparten estado entre Fácil y Avanzada. El perfil deriva dos filas por dificultad.

## Accesibilidad y rendimiento

- Un solo `<h1>` por página, con foco visible y navegación por teclado.
- `aria-current`, `aria-live` y `aria-pressed` donde corresponde.
- Imágenes con `alt`, `loading="lazy"` y `decoding="async"`.
- Sin JS de terceros: Ko-fi y YouTube son enlaces.
- Sin overflow horizontal a 360 px y sin fuentes ni widgets externos.
