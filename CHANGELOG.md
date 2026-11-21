# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.
El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y el proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
