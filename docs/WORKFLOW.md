# Flujo de trabajo

## Cuándo usar el flujo 10 + 5

Solo para cambios que afectan alcance, modelo de datos, navegación o experiencia principal.

1. La persona responsable describe la idea.
2. El agente reformula el objetivo en tres bullets.
3. Hace **máximo 10 preguntas**. Cada una con una opción recomendada primero.
4. La persona responde; puede contestar `1a 2b 3: …` o `todo recomendado`.
5. El agente hace **máximo 5 preguntas de cierre**.
6. El agente escribe un brief de 12 líneas.
7. Implementa.
8. Pasa los gates.
9. Entrega un handoff de 5 bullets y espera aprobación.

Para cambios pequeños (texto, un enlace, un estilo puntual) no hay interrogatorio: brief de tres
líneas y ejecución.

## Brief de tanda

```md
## Tanda N — Nombre

Objetivo:

- …
  Entregables:
- …
  Fuera de alcance:
- …
  Tests:
- …
  Criterio de aprobación:
- …
```

## Ahorro de tokens

- No repetir el contexto completo: la memoria vive en `docs/DECISIONS.md`.
- Preguntar solo lo que cambie una decisión. Si la respuesta está en los docs, no preguntar.
- Ofrecer opciones cerradas con una recomendación.
- Leer archivos dirigidos, no todo el repositorio.
- Escribir documentos de una página, no specs de cientos de líneas.
- Un brief por tanda. Un handoff por tanda.
- Si no hay dudas, decirlo y avanzar.
- No generar código de relleno ni comentarios obvios.

## Tandas

| Tanda | Objetivo                                  |
| ----- | ----------------------------------------- |
| 0     | Documentación nueva y limpieza.           |
| 1     | Categorías, cursos y Bandit.              |
| 2     | Shell, candado legal y perfil.            |
| 3     | Páginas, roadmap, comunidad y buscador.   |
| 4     | QA, accesibilidad, rendimiento y release. |

Cada tanda se aprueba antes de empezar la siguiente.

## Definition of done

- `npm run build` genera el sitio y el índice de búsqueda.
- `npm run check` sin errores.
- `npm run lint` sin errores.
- `npm test` en verde.
- `npm run test:e2e` en verde.
- `npx prettier --check .` en verde.
- Sin overflow horizontal en 360, 768 y 1440.
- Navegación completa con teclado y foco visible.
- Documentación actualizada si cambió una ruta, un dato o un flujo.
- Sin contenido, fechas, métricas ni videos inventados.

## Git

- Una rama por tanda o por cambio coherente.
- Commits pequeños y descriptivos.
- No mezclar limpieza masiva con cambios funcionales.
- Antes de reescribir, crear una rama de respaldo.
- No commitear archivos privados, capturas temporales ni artefactos de build.

## Handoff

```md
## Handoff

- Hecho:
- Tests:
- Pendiente:
- Riesgos:
- Siguiente:
```
