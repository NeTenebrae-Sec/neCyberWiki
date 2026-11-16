# Arquitectura

## Stack

- Astro 7 con salida estática.
- Tailwind CSS 4 mediante el plugin de Vite.
- TypeScript y JavaScript vanilla. Sin React, Vue ni Svelte.
- Content Collections con `glob` y schemas Zod.
- Pagefind para búsqueda estática.
- GitHub Pages bajo `/neCyberWiki/`.

## Rutas

| Ruta | Página |
| --- | --- |
| `/` | Portada. |
| `/buscar/` | Buscador. |
| `/cursos/` | Índice de categorías. |
| `/cursos/<categoria>/` | Cursos de una categoría. |
| `/cursos/<categoria>/<curso>/` | Portada del curso. |
| `/cursos/<categoria>/<curso>/<leccion>/` | Lección. |
| `/bitacora/` | Índice de la bitácora. |
| `/bitacora/<slug>/` | Entrada. |
| `/roadmap/` | Cambios y planes. |
| `/perfil/` | Perfil local. |
| `/terminos/` | Términos y uso legal. |

Redirecciones:

- `/categorias/` → `/cursos/`
- `/notas/` → `/cursos/`
- `/notas/bandit/` → `/cursos/linux-y-sistemas/bandit/`
- `/notas/bandit/<n>/` → `/cursos/linux-y-sistemas/bandit/<n>/`
- `/cursos/arch-linux-facil/` → `/cursos/linux-y-sistemas/arch-linux-facil/`
- `/blog/` → `/bitacora/`
- `/blog/<slug>/` → `/bitacora/<slug>/`
- `/certificados/` → `/roadmap/`

## Datos

```text
src/data/categorias.ts   Taxonomía canónica (8 categorías)
src/data/cursos.ts       Metadatos editoriales de cada curso
src/data/roadmap.ts      Roadmap público
src/lib/catalog.ts       Deriva cursos publicados y categorías con contenido
src/lib/syllabus.ts      Agrupa lecciones en módulos y submódulos
```

La fuente de lecciones es `content/cursos/`. Un curso solo aparece si tiene lecciones publicadas.
Una categoría se enciende si tiene al menos un curso o una serie publicada.

## Colecciones

### `cursos`

- `title`, `description`, `tags`
- `curso`, `modulo`, `modulo_titulo`
- `submodulo`, `submodulo_titulo`
- `orden`, `duracion`, `nivel`, `video`
- `date`, `draft`

### `blog`

- `title`, `description`, `tags`, `date`, `draft`

## Búsqueda

Pagefind indexa `dist/` después de `astro build`.

- `BaseLayout` pone `data-pagefind-body` en el contenido principal.
- `data-pagefind-meta="type"` identifica curso, lección, bitácora, roadmap o página.
- `indexable={false}` excluye perfil, búsqueda, 404 y gate legal.
- La UI vive en `src/pages/buscar.astro` y carga `pagefind.js` en cliente.
- El índice se genera con `pagefind --site dist`.
- En desarrollo no hay índice; usa `npm run build && npm run preview`.

## Almacenamiento local

| Clave | Contenido |
| --- | --- |
| `ncw-theme` | `dark` o `light`. |
| `ncw:progress:<curso>` | Array de slugs de lecciones completadas. |
| `ncw:modules:<curso>` | Módulos abiertos del temario. |
| `ncw:legal:v1` | Fecha ISO de aceptación del aviso legal. |
| `ncw:profile:name` | Alias local opcional. |

No hay cookies, cuentas ni llamadas a un backend.

## Candado legal

`BaseLayout` renderiza un `<dialog>` bloqueante salvo en `/terminos/`.

- Se abre con `showModal()` si no hay aceptación guardada.
- No tiene botón de cierre.
- `cancel` se intercepta para que Escape no lo cierre.
- El clic en el backdrop no lo cierra.
- El botón “Acepto y entro” guarda la fecha y cierra.
- La página de términos ofrece el mismo botón para aceptar y volver.

## Perfil

`/perfil/` lee las claves `ncw:*`, muestra el resumen y permite:

- Exportar un JSON versionado con alias, tema, aceptación y progreso.
- Importar un JSON validado y reemplazar los datos locales.
- Borrar los datos y recargar.

La lógica pura vive en `src/lib/profile.ts` para poder testearla sin navegador.

## Accesibilidad y rendimiento

- Un solo `<h1>` por página.
- Foco visible y navegación por teclado.
- `aria-current`, `aria-live` y `aria-pressed` donde corresponde.
- Imágenes con `alt`, `loading="lazy"` y `decoding="async"`.
- Sin JS de terceros. Ko-fi y YouTube son enlaces.
- Presupuesto: sin overflow horizontal en 360 px, sin fuentes ni widgets externos.
