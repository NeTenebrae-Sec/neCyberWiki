# Desarrollo

Guía rápida para trabajar en neCyberWiki. Para las reglas de contribución y la cláusula inbound, consulta [`CONTRIBUTING.md`](../CONTRIBUTING.md).

## Requisitos

Node 22.16 o superior. Sin backend y sin base de datos.

## Scripts

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Construye el índice de búsqueda y arranca el servidor de desarrollo. |
| `npm run build` | Genera el sitio estático y el índice Pagefind. |
| `npm run preview` | Sirve `dist/` para probar el build real. |
| `npm run check` | Comprueba tipos y contenido de Astro. |
| `npm run lint` | ESLint sobre Astro, TS y JS. |
| `npm test` | Tests unitarios con el runner de Node. |
| `npm run import:bandit` | Regenera el curso Bandit desde el archivo fuente. |
| `npm run format` | Prettier sobre todo el proyecto. |

## Gates

Antes de abrir un PR, ejecuta y haz pasar:

```bash
npm run build
npm run check
npm run lint
npm test
npx prettier --check .
```

Los mismos gates corren en CI para los PRs a `dev` y `main`.

## Pruebas

Los tests unitarios viven en `tests/` y usan el runner de Node. No hay tests de navegador automatizados integrados. La verificación con Playwright es parte del flujo local.

El buscador depende del build: `npm run dev` ejecuta un `predev` que genera el índice en `public/pagefind/`. Ese directorio está ignorado por git y refleja el último arranque. Si añades contenido, reinicia el servidor.

## Estructura

```text
content/
  cursos/          Cursos y lecciones en Markdown
  blog/            Entradas de la bitácora
public/
  cursos/          Imágenes de los cursos
src/
  components/      Componentes de interfaz
  data/            Categorías, cursos y roadmap
  layouts/         Shell del sitio
  lib/             Lógica pura y utilidades de build
  pages/           Rutas de Astro
  styles/          Tokens, base, patrones y shell
tests/             Tests unitarios
```
