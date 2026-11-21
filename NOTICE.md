# Avisos y atribución — neCyberWiki

> Documento informativo, no es asesoría legal. Titular: **NeTenebrae**
> (persona física, identidad pública del proyecto). Redactado sin revisión
> profesional; los textos legales marcados como tales en `CONTRIBUTING.md`
> pueden cambiar.

## Titularidad y régimen de uso

| Obra                      | Qué incluye                                                              | Régimen                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Código del sitio          | `src/`, `scripts/`, configuración y build                                | **GPL-3.0-or-later** (ver `LICENSE.txt`) · Copyright (c) 2026 NeTenebrae                                  |
| Contenido propio          | `content/cursos/`, `content/blog/`, textos, lecciones, bitácora, roadmap | **CC BY-NC-SA 4.0** · <https://creativecommons.org/licenses/by-nc-sa/4.0/> · Copyright (c) 2026 NeTenebrae |
| Imágenes y assets propios | capturas de terminal propias y assets del sitio                          | **CC BY-NC-SA 4.0** junto al contenido                                                                     |
| Marca e identidad         | nombre «neCyberWiki», «NeTenebrae», logo, favicon e identidad visual     | **Reservados** — ninguna licencia del proyecto los concede; su uso en derivados requiere permiso           |
| `content/_WRITEUPS/`      | notas propias sobre retos de terceros                                    | **Sin licencia del proyecto** (todos los derechos reservados por defecto); ver §Terceras partes            |

## Atribución recomendada (código y contenido)

Si reutilizas material de este repositorio, incluye:

1. Enlace a la web original: <https://netenebrae-sec.github.io/neCyberWiki/>
2. Indicación de la licencia correspondiente (GPL-3.0 para código,
   CC BY-NC-SA 4.0 para contenido) y del aviso de autoría «NeTenebrae».
3. Si modificas contenido, nota de que fue modificado.
4. Como cortesía (no es una condición legal): un enlace visible a la página de
   apoyo del proyecto: <https://ko-fi.com/netenebrae>

Ejemplo:

> Basado en neCyberWiki — <https://netenebrae-sec.github.io/neCyberWiki/> —
> contenido bajo CC BY-NC-SA 4.0 · código bajo GPL-3.0-or-later · NeTenebrae.
> Modificado el AAAA-MM-DD.

## Terceras partes

### Fuentes tipográficas

Fraunces Variable, IBM Plex Sans Variable e IBM Plex Mono, distribuidas vía los
paquetes npm `@fontsource-variable/*` / `@fontsource/*` bajo **SIL Open Font
License 1.1**. El build del sitio redistribuye los archivos `.woff2`.

### Dependencias

Las dependencias npm (ver `package-lock.json`) son herramientas de build y
framework; no se publican como contenido del sitio. Mantienen sus licencias
originales (principalmente MIT, Apache-2.0, BSD, ISC; `lightningcss` bajo
MPL-2.0; los binarios nativos `@img/sharp-*` / `@img/sharp-libvips-*` bajo
LGPL-3.0-or-later; fuentes bajo OFL-1.1). Ninguna dependencia obliga a cambiar la
licencia de este repositorio.

### Plataformas y retos de terceros (`content/_WRITEUPS/`)

Notas de estudio propias (no publicadas en el sitio) sobre retos de plataformas
de terceros: **OverTheWire** (Bandit), **VulnHub** (IMF y darkhole_2) y
**PortSwigger** (Web Security Academy — SSRF). Los nombres, retos, interfaces e
imágenes de esas plataformas pertenecen a sus titulares. Este proyecto no
otorga ningún derecho sobre ese material; su presencia no implica afiliación ni
autorización. La verificación de los términos de cada plataforma está pendiente;
los assets de terceros se inventariarán antes de cualquier redistribución.

### Servicios embebidos

El sitio embebe iframes de YouTube (canal propio `@netenebrae`, vídeos propios)
y enlaza Ko-fi como vía de apoyo. Son servicios de terceros con sus propias
condiciones y tratamiento de datos; no están cubiertos por las licencias de
este repositorio.

### Material heredado del starter

`LICENSE.txt` era una licencia MIT con aviso de autoría 2021 de «jackyzha0»
(starter Quartz). Desde el 2026-11-18 este repositorio se rige por GPL-3.0 para
el código y CC BY-NC-SA 4.0 para el contenido. Quien obtuvo una copia antes de
esa fecha conserva sus derechos MIT sobre lo que recibió. No se conserva código
del starter en este repositorio.

## Historial de licencias

- Hasta 2026-11-17: `LICENSE.txt` = MIT, aviso 2021 «jackyzha0» (herencia).
- Desde 2026-11-18: **GPL-3.0-or-later** (código) + **CC BY-NC-SA 4.0**
  (contenido e imágenes propias) + marca reservada.
