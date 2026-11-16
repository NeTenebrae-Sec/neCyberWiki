# Arquitectura

## Stack

- Astro 7 con salida estática.
- Tailwind CSS 4 mediante el plugin de Vite.
- TypeScript y JavaScript vanilla. Sin React, Vue ni Svelte.
- Content Collections con `glob` y schemas Zod.
- Pagefind para búsqueda estática (pendiente, Tanda 3).
- GitHub Pages bajo `/neCyberWiki/`.

## Estado por tanda

| Tanda | Alcance                                         | Estado      |
| ----- | ----------------------------------------------- | ----------- |
| 0     | Documentación y limpieza.                       | Hecha       |
| 1     | Categorías, cursos, Bandit y rutas anidadas.    | En revisión |
| 2     | Shell, candado legal bloqueante y perfil local. | Pendiente   |
| 3     | Bitácora, roadmap, comunidad, Ko-fi y Pagefind. | Pendiente   |
| 4     | QA, accesibilidad, rendimiento, E2E y release.  | Pendiente   |

La tabla de rutas distingue lo que ya existe de lo que forma parte del MVP pero aún no se
implementa. No se documenta como disponible algo que el build todavía no genera.

## Rutas

| Ruta                                     | Página                         | Estado    |
| ---------------------------------------- | ------------------------------ | --------- |
| `/`                                      | Portada.                       | Hecha     |
| `/cursos/`                               | Índice de categorías.          | Hecha     |
| `/cursos/<categoria>/`                   | Cursos de una categoría.       | Hecha     |
| `/cursos/<categoria>/<curso>/`           | Portada del curso.             | Hecha     |
| `/cursos/<categoria>/<curso>/<leccion>/` | Lección.                       | Hecha     |
| `/blog/`                                 | Índice de la bitácora.         | Temporal  |
| `/blog/<slug>/`                          | Entrada de la bitácora.        | Temporal  |
| `/terminos/`                             | Términos y uso legal.          | Hecha     |
| `/buscar/`                               | Buscador.                      | Pendiente |
| `/bitacora/`                             | Índice definitivo de bitácora. | Pendiente |
| `/bitacora/<slug>/`                      | Entrada definitiva.            | Pendiente |
| `/roadmap/`                              | Cambios y planes.              | Pendiente |
| `/perfil/`                               | Perfil local.                  | Pendiente |

Redirecciones activas:

- `/categorias/` → `/cursos/`
- `/certificados/` → `/cursos/`
- `/notas/` → `/cursos/`
- `/notas/bandit/` → `/cursos/linux-y-sistemas/bandit/`
- `/notas/bandit/<n>/` → `/cursos/linux-y-sistemas/bandit/<n>/`
- `/cursos/arch-linux-facil/` → `/cursos/linux-y-sistemas/arch-linux-facil/`
- `/cursos/arch-linux-facil/<leccion>/` → `/cursos/linux-y-sistemas/arch-linux-facil/<leccion>/`

Redirecciones previstas para la Tanda 3:

- `/blog/` → `/bitacora/`
- `/blog/<slug>/` → `/bitacora/<slug>/`

Los destinos de `astro.config.mjs` incluyen la base `/neCyberWiki/`. Sin ella, el redirect genera
una URL rota en GitHub Pages.

## Datos

```text
src/data/categorias.ts   Taxonomía canónica (8 categorías)
src/data/cursos.ts       Metadatos editoriales de cada curso
src/data/roadmap.ts      Roadmap público (pendiente, Tanda 3)
src/lib/catalog.ts       Deriva cursos publicados y categorías con contenido
src/lib/syllabus.ts      Agrupa lecciones en módulos y submódulos
src/lib/profile.ts       Lógica pura del perfil local (pendiente, Tanda 2)
```

La fuente de lecciones es `content/cursos/`. Un curso solo aparece si tiene lecciones publicadas.
Una categoría se enciende si tiene al menos un curso publicado. La disponibilidad se calcula; no se
declara a mano.

El manifiesto `cursos.ts` declara `unidad`:

- `"clase"`: la interfaz numera desde 1 y muestra «Clase».
- `"nivel"`: la interfaz respeta la numeración desde 0 y muestra «Nivel» (Bandit).

## Colecciones

### `cursos`

- `title`, `description`, `tags`
- `curso`, `modulo`, `modulo_titulo`
- `submodulo`, `submodulo_titulo`
- `orden`, `duracion`, `nivel`, `video`
- `source` (opcional), `date` (opcional), `draft`

### `blog`

- `title`, `description`, `tags`, `date`, `draft`

No existe una colección `notas`. Bandit vive en `content/cursos/bandit/` y se publica como curso.

## Búsqueda

Pagefind indexará `dist/` después de `astro build` (Tanda 3).

- `BaseLayout` pondrá `data-pagefind-body` en el contenido principal.
- `data-pagefind-meta="type"` identificará curso, lección, bitácora, roadmap o página.
- `indexable={false}` excluirá perfil, búsqueda, 404 y gate legal.
- La UI vivirá en `src/pages/buscar.astro` y cargará `pagefind.js` en cliente.
- El índice se generará con `pagefind --site dist`.
- En desarrollo no habrá índice; habrá que usar `npm run build && npm run preview`.

## Almacenamiento local

| Clave                  | Contenido                                | Estado    |
| ---------------------- | ---------------------------------------- | --------- |
| `ncw-theme`            | `dark` o `light`.                        | En uso    |
| `ncw:progress:<curso>` | Array de slugs de lecciones completadas. | En uso    |
| `ncw:modules:<curso>`  | Módulos abiertos del temario.            | En uso    |
| `ncw:legal:v1`         | Fecha ISO de aceptación del aviso legal. | En uso    |
| `ncw:profile:name`     | Alias local opcional.                    | Pendiente |

No hay cookies, cuentas ni llamadas a un backend.

## Candado legal

Estado actual (Tanda 1): el diálogo existe, guarda `ncw:legal:v1` y puede cerrarse con Escape, con
la X o con un clic fuera.

Estado objetivo (Tanda 2): `BaseLayout` renderiza un `<dialog>` bloqueante salvo en `/terminos/`.

- Se abre con `showModal()` si no hay aceptación guardada.
- No tiene botón de cierre.
- `cancel` se intercepta para que Escape no lo cierre.
- El clic en el backdrop no lo cierra.
- El botón «Acepto y entro» guarda la fecha y cierra.
- La página de términos ofrece el mismo botón para aceptar y volver.

## Perfil

`/perfil/` leerá las claves `ncw:*`, mostrará el resumen y permitirá (Tanda 2):

- Exportar un JSON versionado con alias, tema, aceptación y progreso.
- Importar un JSON validado y reemplazar los datos locales.
- Borrar los datos y recargar.

La lógica pura vivirá en `src/lib/profile.ts` para poder testearla sin navegador.

## Accesibilidad y rendimiento

- Un solo `<h1>` por página.
- Foco visible y navegación por teclado.
- `aria-current`, `aria-live` y `aria-pressed` donde corresponde.
- Imágenes con `alt`, `loading="lazy"` y `decoding="async"`.
- Sin JS de terceros. Ko-fi y YouTube son enlaces.
- Presupuesto: sin overflow horizontal en 360 px, sin fuentes ni widgets externos.
