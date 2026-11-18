# Política de seguridad — neCyberWiki

## Alcance

Esta política cubre neCyberWiki (el sitio estático y este repositorio).

- **Sí**: problemas en la implementación publicada (XSS, fugas por terceros,
  dependencias vulnerables usadas en el sitio, build que expone datos).
- **No**: soporte de uso general, tutoriales, CTFs ni consultas sobre cómo usar el
  material educativo. Para eso están Discussions y el propio contenido.
- **No**: vulnerabilidades en servicios de terceros (YouTube, Ko-fi, GitHub,
  Pages) — repórtalas a sus respectivos canales.

## Canal privado

1. **GitHub Private Vulnerability Reporting** (preferido):
   <https://github.com/NeTenebrae-Sec/neCyberWiki/security/advisories/new>
   Crea un aviso privado sin exponer el problema públicamente. (Requiere que el
   mantenedor lo tenga activado; si no está disponible, usa la alternativa.)
2. **Correo**: `netenebrae@duck.com` — asunto con `SEGURIDAD neCyberWiki`.

No abras issues públicos con detalles de vulnerabilidades.

## Información mínima útil

- Descripción del problema y dónde reproducirlo (URL del sitio, página, componente).
- Pasos de reproducción y navegador/SO.
- Impacto estimado y, si es posible, un ejemplo mínimo.

## Qué esperar

Proyecto gratuito y voluntario, mantenido por una sola persona:

- **Mejor esfuerzo, sin SLA ni recompensa** (no hay bug bounty).
- Sin garantía de tiempo de respuesta ni de corrección.
- Si el reporte se acepta, la corrección se documenta en el changelog del repositorio
  cuando esté lista.
- No hay versiones soportadas: solo el despliegue actual de GitHub Pages y la rama
  `dev`/`main`.

## Datos en este proyecto

Sin cuentas ni backend: el progreso, el tema y el perfil del lector viven en
`localStorage` del navegador de cada visitante. Este proyecto no almacena datos
personales y por tanto no puede sufrir fugas de datos de usuarios.

## Divulgación

Tras corregir (o descartar) un reporte válido, se publicará un aviso de seguridad en
GitHub con crédito al reportante (si lo desea).
