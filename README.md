# neCyberWiki

Archivo personal de aprendizaje sobre Linux, redes y ciberseguridad, en español. Cursos guiados,
notas de laboratorio, bitácora y un roadmap público. Sin cuentas, sin backend y con el progreso
guardado en el navegador.

- **Sitio:** <https://netenebraes.github.io/neCyberWiki/>
- **Stack:** Astro 7, Tailwind CSS 4, TypeScript y JavaScript vanilla.
- **Contenido:** Markdown validado en build con Content Collections.
- **Buscador:** Pagefind con el componente oficial en la barra del header; el índice se genera al
  arrancar el desarrollo y en el `postbuild`.
- **Perfil:** Almacén local con exportar, importar y borrar.

## Aviso legal

Todo el contenido de este repositorio tiene fines **educativos y formativos**. Las técnicas,
conceptos y ejemplos descritos deben practicarse **únicamente** en entornos controlados,
laboratorios personales o escenarios autorizados o diseñados para este propósito. El uso indebido
de la información contenida fuera de un contexto ético o legal es responsabilidad exclusiva del
usuario; los autores y contribuidores no se hacen responsables de daños, sanciones o consecuencias
derivadas de ese uso.

## Arranque

```bash
npm install
npm run dev
```

El buscador funciona también en `npm run dev`: el `predev` construye el sitio y regenera el índice
en `public/pagefind/` (ignorado por git) antes de arrancar Astro. El índice refleja el último
arranque del servidor; si añades contenido, reinicia `npm run dev`. `Ctrl/Cmd+K` enfoca la barra
del header.

`npm run build` ejecuta `astro build` y después el `postbuild` con Pagefind sobre `dist/pagefind/`.
No hay que lanzar `pagefind` a mano ni versionar el índice.

## Scripts

| Script                  | Qué hace                                                 |
| ----------------------- | -------------------------------------------------------- |
| `npm run dev`           | Construye el índice y arranca el servidor de desarrollo. |
| `npm run build`         | Genera el sitio estático y el índice Pagefind.           |
| `npm run preview`       | Sirve `dist/` para probar el build real.                 |
| `npm run check`         | Comprueba tipos y contenido de Astro.                    |
| `npm run lint`          | ESLint sobre Astro, TS y JS.                             |
| `npm test`              | Tests unitarios con el runner de Node.                   |
| `npm run import:bandit` | Regenera el curso Bandit desde el archivo fuente.        |
| `npm run format`        | Prettier sobre todo el proyecto.                         |

Los tests de navegador automatizados aún no están integrados; la verificación manual con Playwright
es parte del flujo local.

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
```

## Contribuciones

Las contribuciones son bienvenidas: corrigiendo errores, mejorando redacción, añadiendo contenido
relevante, proponiendo mejoras en estructura y navegación o reportando problemas en la pestaña
*Issues*.

Para contribuir:

```bash
git clone https://github.com/NeTenebrae-Sec/neCyberWiki.git
cd neCyberWiki
git checkout -b mejora-o-nueva-guia
```

Después, abre un [Pull Request](https://github.com/NeTenebrae-Sec/neCyberWiki/pulls) con la
descripción de tu aporte. Ten en cuenta el aviso legal:
todo el contenido es educativo y la práctica debe ocurrir en entornos propios o autorizados.

## Licencia

El código se distribuye bajo la licencia MIT incluida en `LICENSE.txt`. El contenido editorial es
gratuito para estudio y práctica educativa. Si el proyecto te sirve, puedes apoyarlo en
[Ko-fi](https://ko-fi.com/netenebrae).
