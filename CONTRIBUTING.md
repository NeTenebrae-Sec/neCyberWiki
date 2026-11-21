# Cómo contribuir a neCyberWiki

¡Gracias por tu interés! neCyberWiki es una bitácora pública de aprendizaje sobre
Linux, redes y ciberseguridad, en español. Las contribuciones se revisan e integran
únicamente por parte del mantenedor (**NeTenebrae**); este documento es la referencia
para prepararlas.

## Antes de empezar

- Errores y tareas concretas: abre un **Issue**.
- Dudas, ideas y propuestas generales: usa **Discussions** del repositorio.
- Vulnerabilidades o problemas de seguridad: **no** abras un issue público; usa el
  canal privado de [`SECURITY.md`](SECURITY.md).

## Qué puedes aportar

Una contribución = **un solo tipo de cambio**, en un PR independiente:

- **Código**: componentes Astro, estilos, build, búsqueda, perfil local.
- **Contenido**: cursos, lecciones, bitácora ( Markdown en `content/` ).
- **Correcciones**: erratas, enlaces rotos, typos, documentación.

No mezcles tipos en un mismo PR (p. ej. un curso + refactor). Los commits siguen
Conventional Commits en inglés: `type(scope): resumen` (p. ej. `feat(lecciones): …`,
`fix(build): …`, `docs(contributing): …`). Ramas: `feat/<slug>` o `fix/<slug>` desde
`dev`.

## Reglas del proyecto (obligatorias)

- **Contenido educativo y legal.** Todo el material describe técnicas para practicar
  **solo** en entornos propios, laboratorios o escenarios autorizados. No se admite
  material que facilite uso indebido.
- **Sin secretos.** Nunca subas credenciales, tokens, claves ni datos privados.
- **Sin cuentas ni backend.** El progreso y el perfil viven en `localStorage`.
- **Sin material privado ni `game/dossier/`.** El repositorio no lo incluye;
  tampoco se admiten aportes derivados de él.
- **No inventar.** Fechas, métricas, certificados, vídeos o capacidades inexistentes
  no se publican. Si falta algo, se marca o se pregunta.
- **Material de terceros: prohibido** salvo que declares expresamente origen y
  autorización en el PR (ver [Cláusula inbound](#cláusula-inbound-para-contribuciones));
  los nombres e interfaces de OverTheWire, VulnHub y PortSwigger pertenecen a sus
  titulares.

## Instalación y verificación local

```bash
git clone https://github.com/NeTenebrae-Sec/neCyberWiki.git
cd neCyberWiki
npm install
npm run dev
```

Antes de abrir el PR, ejecútalo todo y asegúrate de que pasa:

```bash
npm run build        # build estático + índice Pagefind
npm run check        # tipos y contenido
npm run lint         # ESLint
npm test             # tests unitarios
npx prettier --check .
```

El buscador solo existe en el build (`postbuild`), no en `npm run dev`.

## Cláusula inbound para contribuciones

> **No revisada profesionalmente.** Redactada de buena fe; puede cambiar cuando haya
> revisión legal. Mientras tanto, abrir un PR implica aceptarla tal cual.

Al abrir un Pull Request aceptas que:

1. Tu aporte se publica bajo el régimen de este repositorio: **GPL-3.0-or-later**
   si es código; **CC BY-NC-SA 4.0** si es contenido o imágenes propias.
2. Conservas la titularidad de tu aporte. El derecho que concedes a **NeTenebrae**
   (persona física, identidad pública del proyecto) es **no exclusivo, irrevocable
   para las versiones ya publicadas y gratuito**, y te limita únicamente a lo que la
   licencia pública ya permite al resto del mundo, salvo el uso comercial en el sitio
   y sus canales (por ejemplo, comisiones de afiliado), que solicitamos expresamente
   para sostener el proyecto.
3. Tu aporte no incluye material de terceros sin autorización. Si lo incluye,
   declaras su origen y la autorización en la descripción del PR; sin declaración,
   el aporte se rechaza.
4. Tu aporte no es trabajo encargado que tu empleador reclame (si proviene de tu
   empleo o encargo, confirma que tienes derecho a licenciarlo).
5. Atribuyes tu autoría de forma veraz; cambios ajenos posteriores se documentan en
   el historial de git.

Resumen operativo: **outbound = inbound + un permiso comercial acotado al sitio para
el mantenedor**. El resto del mundo recibe tu aporte bajo la licencia pública.

## Atribución que se espera de ti (y de tus reutilizadores)

1. Enlace a la web original `https://netenebrae-sec.github.io/neCyberWiki/`.
2. Indicación de la licencia (GPL-3.0 código / CC BY-NC-SA 4.0 contenido).
3. Nota de modificaciones, si las hubo.
4. Como cortesía (no obligatorio): enlace visible a <https://ko-fi.com/netenebrae>.

## Proceso de revisión

- El mantenedor revisa e integra; no hay otros revisores ni integraciones automáticas.
- Expectativas honestas: proyecto gratuito y voluntario; **mejor esfuerzo, sin SLA
  ni garantía de respuesta ni de tiempo de integración**.
- Se puede pedir cambios, y los cambios se piden por separado por tipo de aporte.
- Si un PR se cierra sin integrar, la razón se documenta en el propio PR.

## Conducta y seguridad

- Código de conducta: [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).
- Seguridad: [`SECURITY.md`](SECURITY.md) — reporta por canal privado.
- Los aportes aceptados se licencian bajo el régimen indicado; los ya publicados no
  se re-retiran (las licencias concedidas son irrevocables para las versiones
  publicadas).
