# neCyberWiki

Archivo personal de aprendizaje sobre Linux, redes y ciberseguridad, en español. Cursos guiados,
notas de laboratorio, bitácora y un roadmap público. Sin cuentas, sin backend y con el progreso
guardado en el navegador.

- **Sitio:** <https://netenebraes.github.io/neCyberWiki/>
- **Stack:** Astro 7, Tailwind CSS 4, TypeScript y JavaScript vanilla.
- **Contenido:** Markdown validado en build con Content Collections.
- **Buscador:** Pagefind con componentes oficiales en el header y en `/buscar/`; el índice se genera
  en el `postbuild`.
- **Perfil:** Almacén local con exportar, importar y borrar.

Estado actual: Tanda 3 (bitácora definitiva, roadmap, buscador Pagefind) en revisión. La
comunidad de YouTube, el release y la QA final llegan en la Tanda 4.

## Arranque

```bash
npm install
npm run dev
```

El buscador no existe en `astro dev` porque Pagefind indexa el HTML construido. Para probarlo:

```bash
npm run build
npm run preview
```

`npm run build` ejecuta `astro build` y después el `postbuild` con Pagefind. No hay que lanzar
`pagefind` a mano ni versionar `public/pagefind/`.

## Scripts

| Script                  | Qué hace                                          |
| ----------------------- | ------------------------------------------------- |
| `npm run dev`           | Servidor de desarrollo de Astro.                  |
| `npm run build`         | Genera el sitio estático y el índice Pagefind.    |
| `npm run preview`       | Sirve `dist/` para probar el build real.          |
| `npm run check`         | Comprueba tipos y contenido de Astro.             |
| `npm run lint`          | ESLint sobre Astro, TS y JS.                      |
| `npm test`              | Tests unitarios con el runner de Node.            |
| `npm run import:bandit` | Regenera el curso Bandit desde el archivo fuente. |
| `npm run format`        | Prettier sobre todo el proyecto.                  |

Los tests de navegador con Playwright se añadirán en la Tanda 4. La verificación manual con
Playwright MCP usa una configuración local ignorada por git.

## Estructura

```text
content/
  cursos/          Cursos y lecciones en Markdown
  blog/            Entradas de la bitácora
public/
  cursos/          Imágenes de los cursos
src/
  components/      Componentes de interfaz
  data/            Categorías y cursos (roadmap en Tanda 3)
  layouts/         Shell del sitio
  lib/             Lógica pura y utilidades de build
  pages/           Rutas de Astro
  styles/          Tokens, base, patrones y shell
docs/              Documentación del proyecto
```

## Documentación

- [Producto](docs/PRODUCT.md): qué es, para quién y qué entra en el MVP.
- [Contenido](docs/CONTENT.md): cómo añadir cursos, lecciones, entradas y roadmap.
- [Arquitectura](docs/ARCHITECTURE.md): rutas, datos, búsqueda y almacenamiento local.
- [Flujo de trabajo](docs/WORKFLOW.md): tandas, preguntas y definition of done.
- [Decisiones](docs/DECISIONS.md): registro corto de acuerdos.
- [Mantenimiento](docs/MAINTENANCE.md): QA, accesibilidad, rendimiento y release.

## Licencia

El código se distribuye bajo la licencia MIT incluida en `LICENSE.txt`. El contenido editorial es
gratuito para estudio y práctica educativa. Si el proyecto te sirve, puedes apoyarlo en
[Ko-fi](https://ko-fi.com/netenebrae).
