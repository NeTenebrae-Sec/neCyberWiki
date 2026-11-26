# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.
El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y el proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.4] - 2026-11-25

### Changed

- Reestructura el hero de la portada en dos columnas con un panel de datos derivados (cursos, lecciones y categorías), CTA «Explorar cursos» hacia `#cursos`, enlaces a GitHub y YouTube, y una señal de scroll («Sigue bajando») con animación breve.
- Diferencia la portada de curso de la lección con una etiqueta de contexto reutilizable (`CURSO` / `LECCIÓN`) y una barra de estado «CURSO GRATIS» con progreso real de `localStorage`, con los conteos de lecciones y módulos bajo el título (PR #105).
- Completa las migas `Cursos / Categoría / Curso / Módulo / Lección` con `aria-current="page"` y coloca el `<h1>` de la lección antes del reproductor (PR #105).
- Sustituye la navegación inferior por una tarjeta de contexto del módulo con progreso guardado, «Volver al temario» en la primera lección y «Fin del curso» en la última (PR #105).
- Quita la versión del badge de staging en el README para no tener que actualizarlo en cada integración en `dev` (PR #105).

## [1.1.3] - 2026-11-24

### Added

- Video de introducción de «Cómo instalar Arch Linux» en el hero del curso, embebido desde YouTube con `VideoEmbed` (reproductor `youtube-nocookie`).

### Changed

- Copy del hero del curso: badge único «INTRO» y rótulo «INTRODUCCIÓN: Como funciona la neCyberWiki».

### Documentation

- Bump de versión a 1.1.3 y badge de staging actualizado en el README.

## [1.1.2] - 2026-11-24

### Added

- Integración de la navbar con el emblema de marca: SVG inline en header y drawer (`BrandMark.astro`), favicon con la marca, tokens `--header-h`, `--header-gap` y `--header-offset`, y animaciones de tema, drawer y navegación (PR #80).

### Documentation

- Botones de versión del README con las versiones desplegadas: en producción (`main`) en staging (`dev`) PR #68

## [1.1.1] - 2026-11-21

### Security

- Añade `.github/CODEOWNERS` para exigir revisión del responsable en los PRs.
- Activa la protección de `main` y `dev` con checks obligatorios, aprobación y sin force push; restringe las Actions permitidas y activa las actualizaciones de seguridad de Dependabot.

### Fixed

- Corrige el párrafo de writeups de terceros en `NOTICE.md`.
- Excluye del chequeo de enlaces los hosts que bloquean a los checkers (`gnu.org`, `polimetro.com`).

## [1.1.0] - 2026-11-21

### Added

- Curso adaptable de Arch Linux con configurador de dificultad, entorno y arranque, rutas Fácil y Avanzada y progreso por variante (#59, #61, #64).
- Publicación de `dev` como staging en `/neCyberWiki/dev/` (#63).
- Documentación de arquitectura, desarrollo, pruebas y CI/CD, además de plantillas de PR e issues renovadas (#65).
- Gobernanza legal: `TRADEMARK.md`, `LICENSE-CONTENT.md`, `CREDITS.md` y cláusula inbound en las contribuciones (#65).

### Changed

- Licencia del código migrada de AGPL-3.0 a GPL-3.0-or-later; el contenido permanece en CC BY-NC-SA 4.0 (#65).
- Los writeups salen del repositorio y pasan a vivir en el vault de Obsidian.

### Fixed

- Enlaces muertos de Bandit y normalización del formato Markdown.
- Chequeo de enlaces sobre el sitio construido: se elimina la recursión del symlink y los canonicals se resuelven contra el build; `gnu.org` se excluye por respuestas 429 y timeouts recurrentes.
- Dominio `site` y enlaces públicos apuntan a `netenebrae-sec.github.io`.

## [1.0.0] - 2026-11-18

### Added

- MVP v1 en GitHub Pages: homepage, buscador Pagefind servido desde el header, bitácora, roadmap, perfil local y aviso legal (#57).
