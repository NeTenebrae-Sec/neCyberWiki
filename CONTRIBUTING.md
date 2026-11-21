# Cómo contribuir a neCyberWiki

¡Gracias por tu interés! neCyberWiki es una bitácora pública de aprendizaje libre sobre Linux, redes, programación y ciberseguridad, en español.

> Las contribuciones las revisa e integra únicamente el mantenedor.

## Antes de empezar

- Errores y tareas concretas: abre un **[Issue](https://github.com/NeTenebrae-Sec/neCyberWiki/issues)**.
- Dudas, ideas y propuestas generales: usa **[Discussions](https://github.com/NeTenebrae-Sec/neCyberWiki/discussions)**.
- Vulnerabilidades o problemas de seguridad: **no** abras un issue público; usa el canal privado definido en [`SECURITY.md`](SECURITY.md).
- Propuestas de contenido en Discussions: si son solo ideas o esquemas, no requieren la cláusula inbound. Si quieres que un texto tuyo se integre tal cual, muévelo a un PR (la cláusula solo se aplica al abrir un Pull Request).

## Qué puedes aportar

- **Código**: componentes Astro, estilos, build, búsqueda, etc.
- **Contenido**: cursos y lecciones (Markdown en `content/`).
- **Correcciones**: erratas, enlaces rotos, typos, documentación.

Ramas: `feat/<slug>` o `fix/<slug>` desde `dev`.

## Reglas del proyecto

- **Contenido educativo y legal.** Todo el material describe técnicas para practicar **solo** en entornos propios, laboratorios o escenarios autorizados. No se admite material que facilite, incluya o fomente su uso indebido en entornos no autorizados.
- **Material de terceros: prohibido**, salvo que declares expresamente su origen y la autorización en el PR (ver [Cláusula inbound para contribuciones](#cláusula-inbound-para-contribuciones)).

## Antes de abrir el PR

Instala con `npm install` y arranca con `npm run dev`. El buscador se genera antes de arrancar, así que la primera vez tarda un poco más. Para el resto de comandos y la estructura del repositorio: [`docs/desarrollo.md`](docs/desarrollo.md).

Ejecuta los gates y asegúrate de que pasan: `npm run build`, `npm run check`, `npm run lint`, `npm test` y `npx prettier --check .`.

## Atribución que se espera de ti (y de tus reutilizadores)

Al reutilizar material del proyecto, se espera que:

1. Enlaces a la web original: `https://netenebrae-sec.github.io/neCyberWiki/`.
2. Indiques la licencia (GPL-3.0-or-later para código, CC BY-NC-SA 4.0 para contenido).
3. Señales las modificaciones, si las hubo.
4. Como cortesía, no obligación, enlaces visibles a <https://ko-fi.com/netenebrae>.

## Proceso de revisión

- El mantenedor revisa e integra los cambios propuestos, por mejor esfuerzo.
- Expectativas honestas: proyecto gratuito y voluntario. **Sin SLA, sin garantía de respuesta ni de plazo de integración**.
- Pueden solicitarse cambios en tu aporte, separados por tipo de contribución.
- Si un PR se cierra sin integrar, la razón queda documentada en el propio PR.
- Un PR cerrado sin integrar no transfiere ningún derecho sobre lo propuesto, salvo lo ya publicado en versiones integradas.

## Cláusula inbound para contribuciones

Cuando abres un Pull Request con el checkbox de aceptación marcado, declaras y aceptas lo siguiente:

1. **Licencia pública de tu aporte (outbound).** Tu aporte se publica bajo el régimen de este repositorio:
   1. **[GPL-3.0-or-later](LICENSE.txt)** si es código.
   2. **[CC BY-NC-SA 4.0](LICENSE-CONTENT.md)** si es contenido editorial o imágenes propias.
2. **Material de terceros.** Tu aporte no incluye material de terceros sin autorización. Si lo incluye, declara su origen, autor y licencia en la descripción del PR. Sin esa declaración, el aporte se rechaza.
3. **Derecho a licenciar.** Si tu aporte proviene de un empleo o encargo, confirmas que tienes derecho a licenciarlo y que no lo reclama tu empleador o cliente.
4. **Atribución veraz.** Atribuyes tu autoría de forma veraz. Los cambios posteriores de otras personas quedan documentados en el historial de git.

En resumen: tu aporte se publica bajo una licencia abierta y conservas tu autoría. Sirve para que lo que aquí se enseña siga siendo accesible y gratuito para quien quiera aprender. Si no puedes licenciarlo o incluye material ajeno sin autorización, no lo envíes.

## Conducta y seguridad

- Código de conducta: [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).
- Seguridad: [`SECURITY.md`](SECURITY.md), reporta por canal privado.
- El nombre y la identidad están reservados: [`TRADEMARK.md`](TRADEMARK.md).
- Los aportes aceptados se licencian bajo el régimen indicado. Los ya publicados no se retiran, porque las licencias concedidas son irrevocables para esas versiones.
