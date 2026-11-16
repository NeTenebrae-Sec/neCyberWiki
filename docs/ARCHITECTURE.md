# Arquitectura

## Stack

- Astro 7 con salida estática.
- Tailwind CSS 4 mediante el plugin de Vite.
- TypeScript y JavaScript vanilla. Sin React, Vue ni Svelte.
- Content Collections con `glob` y schemas Zod.
- Pagefind para búsqueda estática. Se ejecuta tras cada build (`npx pagefind --site dist`).
- GitHub Pages bajo `/neCyberWiki/`.

## Estado por tanda

| Tanda | Alcance                                         | Estado      |
| ----- | ----------------------------------------------- | ----------- |
| 0     | Documentación y limpieza.                       | Hecha       |
| 1     | Categorías, cursos, Bandit y rutas anidadas.    | Hecha       |
| 2     | Shell, candado legal bloqueante y perfil local. | En revisión |
| 3     | Bitácora, roadmap, comunidad, Ko-fi y Pagefind. | En revisión |
| 4     | QA, accesibilidad, rendimiento, E2E y release.  | Pendiente   |

La tabla de rutas distingue lo que ya existe de lo que forma parte del MVP pero aún no se
implementa. No se documenta como disponible algo que el build todavía no genera.

## Rutas

| Ruta                                     | Página                         | Estado   |
| ---------------------------------------- | ------------------------------ | -------- |
| `/`                                      | Portada.                       | Hecha    |
| `/cursos/`                               | Índice de categorías.          | Hecha    |
| `/cursos/<categoria>/`                   | Cursos de una categoría.       | Hecha    |
| `/cursos/<categoria>/<curso>/`           | Portada del curso.             | Hecha    |
| `/cursos/<categoria>/<curso>/<leccion>/` | Lección.                       | Hecha    |
| `/blog/`                                 | Índice de la bitácora.         | Temporal |
| `/blog/<slug>/`                          | Entrada de la bitácora.        | Temporal |
| `/terminos/`                             | Términos y uso legal.          | Hecha    |
| `/buscar/`                               | Buscador.                      | Hecha    |
| `/bitacora/`                             | Índice definitivo de bitácora. | Hecha    |
| `/bitacora/<slug>/`                      | Entrada definitiva.            | Hecha    |
| `/roadmap/`                              | Cambios y planes.              | Hecha    |
| `/perfil/`                               | Perfil local.                  | Hecha    |

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
src/data/roadmap.ts      Roadmap público
src/lib/catalog.ts       Deriva cursos publicados y categorías con contenido
src/lib/syllabus.ts      Agrupa lecciones en módulos y submódulos
src/lib/profile.ts       Lógica pura del perfil local (lista, valida y aplica)
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

Pagefind está instalado (`npm i -D pagefind`) y se ejecuta tras cada build:

```bash
npm run build
npx pagefind --site dist
```

- `BaseLayout` pone `data-pagefind-body` en el contenido principal; las páginas con `noindex`
  (perfil, búsqueda, 404 y gate legal) añaden `data-pagefind-ignore`.
- `src/pages/buscar.astro` carga el UI prebuilt de Pagefind (`pagefind-component-ui`) y el trigger
  abre el modal de búsqueda.
- El índice se genera en `dist/pagefind/`; el bundle se sirve bajo la base (`/neCyberWiki/pagefind/`).
- En desarrollo no habrá índice; hay que usar `npm run build && npm run preview`.

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

Estado (Tanda 2): `BaseLayout` renderiza un `<dialog>` bloqueante salvo en `/terminos/`.

- Se abre con `showModal()` si no hay aceptación guardada.
- No tiene botón de cierre ni se acepta cierre por Escape: se intercepta `cancel` y se ignora el
  clic en el backdrop.
- El botón «Acepto y entro» guarda `ncw:legal:v1` y cierra.
- Al aceptar dispara `ncw:legal-accepted` para que otras vistas se actualicen.
- La página de términos no usa el diálogo; ofrece «Acepto y explorar los cursos».

Solo `/terminos/` funciona sin aceptación. Fuera de ella el diálogo es el primer elemento enfocado
y el contenido del fondo queda inert durante la modalidad.

## Perfil

`/perfil/` expone el estado local y permite:

- Guardar un alias opcional (`ncw:profile:name`).
- Ver tema, aceptación legal y progreso total (`ncw-theme`, `ncw:legal:v1`, `ncw:progress:<curso>`).
- Exportar un JSON versionado con alias, tema, aceptación y progreso (`serializeProfile`/`parseProfile`).
- Importar un JSON validado y reemplazar los datos locales (`applyProfile`).
- Borrar los datos y recargar (`clearProfile`).

La lógica pura vive en `src/lib/profile.ts`, que solo acepta un objeto compatible con
`localStorage` para poder testearse sin navegador.

El shell del drawer muestra ahora el curso actual de la ruta activa (bandit en curso, Arch en home)
con su progreso y un enlace de continuación. La cabecera tiene acceso directo a `/perfil/`.

## Accesibilidad y rendimiento

- Un solo `<h1>` por página.
- Foco visible y navegación por teclado.
- `aria-current`, `aria-live` y `aria-pressed` donde corresponde.
- Imágenes con `alt`, `loading="lazy"` y `decoding="async"`.
- Sin JS de terceros. Ko-fi y YouTube son enlaces.
- Presupuesto: sin overflow horizontal en 360 px, sin fuentes ni widgets externos.
