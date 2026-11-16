# Contenido

## Regla general

La fuente de verdad es `content/` para lecciones y entradas, y `src/data/` para metadatos de
categorías, cursos y roadmap. Los componentes no contienen contenido editorial.

## Añadir una lección

Crea un archivo en `content/cursos/<curso>/` con un nombre ordenable:

```text
content/cursos/arch-linux-facil/09-nueva-clase.md
content/cursos/bandit/19.md
```

Frontmatter mínimo del curso:

```yaml
---
title: "Nombre de la lección"
description: "Una frase que explique qué se aprende."
tags: ["linux", "ssh"]
curso: "bandit"
modulo: "primeros-pasos"
modulo_titulo: "Primeros pasos"
submodulo: ""
submodulo_titulo: ""
orden: 0
duracion: ""
nivel: "principiante"
video: ""
date: 2025-11-07
source: "content/_WRITEUPS/OverTheWire/bandit/Bandit Level 0.md"
---
```

- `orden` empieza en 0 y define la secuencia. El manifiesto decide si la interfaz numera desde 0
  (`unidad: "nivel"`, Bandit) o desde 1 (`unidad: "clase"`, Arch).
- `modulo` agrupa lecciones en el temario y debe existir en `src/data/cursos.ts`.
- `modulo_titulo` se usa como respaldo visible si el manifiesto no define el módulo.
- `video` vacío significa «guía escrita». Nunca inventes un ID.
- `duracion` vacía si no hay video. No publiques duraciones falsas.
- `source` y `date` son opcionales.
- El cuerpo puede usar Markdown normal. El índice de la lección se genera solo.
- No incluyas un `# H1`: la página ya aporta el título.

## Añadir un curso

1. Crea `content/cursos/<slug>/` con sus lecciones.
2. Añade el curso a `src/data/cursos.ts`:

```ts
{
  slug: "bandit",
  titulo: "Bandit: terminal desde cero",
  descripcion: "…",
  promesa: "…",
  nivel: "principiante",
  categoria: "linux-y-sistemas",
  unidad: "nivel",
  requisitos: ["…"],
  resultados: ["…"],
  modulos: [
    { id: "primeros-pasos", titulo: "Primeros pasos", objetivo: "…" },
  ],
  fuente: { nombre: "OverTheWire", url: "https://overthewire.org/wargames/bandit/" },
}
```

3. Comprueba que la categoría existe en `src/data/categorias.ts`.
4. Añade imágenes en `public/cursos/<slug>/`.
5. Ejecuta `npm run build`.

El curso solo aparece en el catálogo cuando tiene al menos una lección publicada. La categoría se
enciende sola cuando tiene un curso publicado.

## Añadir una entrada de bitácora

Crea `content/blog/<fecha>-<slug>.md`:

```yaml
---
title: "Título"
description: "Resumen de una frase."
tags: ["linux"]
date: 2026-11-09
draft: false
---
```

Mientras la Tanda 3 no esté cerrada, la ruta pública es `/blog/<slug>/`. La ruta definitiva será
`/bitacora/<slug>/` con una redirección desde `/blog/`. La colección interna se llama `blog` para
no romper el histórico.

## Añadir una entrada al roadmap

La Tanda 3 creará `src/data/roadmap.ts`. El formato previsto es:

```ts
{
  id: "buscador",
  date: "2026-11-15",
  title: "Buscador estático",
  summary: "Pagefind indexa cursos, lecciones, bitácora y roadmap.",
  status: "hecho",
  area: "Producto",
  link: "/buscar/",
}
```

- `status`: `hecho`, `en-curso` o `planeado`.
- Los elementos planeados no llevan fecha ni promesa de entrega.
- La home mostrará los tres más recientes.
- No inventes métricas de donaciones ni progreso económico.

## Imágenes

- Guárdalas en `public/cursos/<curso>/`.
- Usa la ruta absoluta con el base del sitio:
  `/neCyberWiki/cursos/bandit/imagen.webp`.
- El plugin `rehype-lazy-images` añade `loading="lazy"` y `decoding="async"`.
- Escribe un `alt` útil. No uses «captura 1» si puedes describir lo que se ve.

## Bandit

`content/_WRITEUPS/OverTheWire/bandit/` es el archivo original de Obsidian. La copia publicada vive
en `content/cursos/bandit/` y es la fuente canónica del sitio.

Estructura publicada:

| Módulo               | Niveles |
| -------------------- | ------- |
| `primeros-pasos`     | 0–4     |
| `busqueda-y-filtros` | 5–9     |
| `texto-y-compresion` | 10–13   |
| `redes-y-servicios`  | 14–18   |

Los archivos se llaman `0.md` a `18.md`; `orden` usa la misma numeración zero-based. Las imágenes
viven en `public/cursos/bandit/` y se referencian con `/neCyberWiki/cursos/bandit/`.

Para regenerar desde Obsidian:

```bash
npm run import:bandit
```

El script reescribe el frontmatter con el esquema de cursos, elimina los iframes de video, ajusta
las rutas y copia solo las imágenes usadas. Revisa el diff antes de publicar.

## Buscador

Pagefind indexará el HTML construido (Tanda 3). Para que una página aparezca:

- Debe tener contenido dentro de `data-pagefind-body` (lo aporta `BaseLayout`).
- El tipo se declara con `data-pagefind-meta="type"`.
- Las páginas de perfil, búsqueda y 404 se excluyen con `indexable={false}`.

Después de cambiar contenido, ejecuta `npm run build` para regenerar el índice.
