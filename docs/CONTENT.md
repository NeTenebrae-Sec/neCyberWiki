# Contenido

## Regla general

La fuente de verdad es `content/` para lecciones y entradas, y `src/data/` para metadatos de
categorías, cursos y roadmap. Los componentes no contienen contenido editorial.

## Añadir una lección

Crea un archivo en `content/cursos/<curso>/` con un nombre ordenable:

```text
content/cursos/bandit/00-nivel-0.md
content/cursos/bandit/01-nivel-1.md
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
---
```

- `orden` empieza en 0 y define la secuencia.
- `modulo` agrupa lecciones en el temario.
- `video` vacío significa “guía escrita”. Nunca inventes un ID.
- `duracion` vacía si no hay video. No publiques duraciones falsas.
- El cuerpo puede usar Markdown normal. El índice de la lección se genera solo.
- No incluyas un `# H1`: la página ya aporta el título.

## Añadir un curso

1. Crea `content/cursos/<slug>/` con sus lecciones.
2. Añade el curso a `src/data/cursos.ts`:

```ts
{
  slug: "bandit",
  titulo: "OverTheWire Bandit",
  descripcion: "…",
  promesa: "…",
  nivel: "principiante",
  categoria: "linux-y-sistemas",
  requisitos: ["…"],
  resultados: ["…"],
  modulos: [
    { id: "primeros-pasos", titulo: "Primeros pasos", objetivo: "…" },
  ],
  youtube: "",
}
```

3. Comprueba que la categoría existe en `src/data/categorias.ts`.
4. Añade imágenes en `public/cursos/<slug>/`.
5. Ejecuta `npm run build`.

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

La ruta pública es `/bitacora/<slug>/`. La colección interna se llama `blog` para no romper el
histórico, pero la navegación y la URL usan “bitácora”.

## Añadir una entrada al roadmap

Edita `src/data/roadmap.ts`:

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
- La home muestra los tres más recientes.
- No inventes métricas de donaciones ni progreso económico.

## Imágenes

- Guárdalas en `public/cursos/<curso>/`.
- Usa la ruta absoluta con el base del sitio:
  `/neCyberWiki/cursos/bandit/imagen.webp`.
- El plugin `rehype-lazy-images` añade `loading="lazy"` y `decoding="async"`.
- Escribe un `alt` útil. No uses “captura 1” si puedes describir lo que se ve.

## Bandit

`content/_WRITEUPS/OverTheWire/bandit/` es el archivo original de Obsidian. La copia publicada vive
en `content/cursos/bandit/` y es la fuente canónica del sitio. Si reimportas desde Obsidian, revisa
el diff antes de publicar y actualiza las rutas de las imágenes.

## Buscador

Pagefind indexa el HTML construido. Para que una página aparezca:

- Debe tener contenido dentro de `data-pagefind-body` (lo aporta `BaseLayout`).
- El tipo se declara con `data-pagefind-meta="type"`.
- Las páginas de perfil, búsqueda y 404 se excluyen con `indexable={false}`.

Después de cambiar contenido, ejecuta `npm run build` para regenerar el índice.
