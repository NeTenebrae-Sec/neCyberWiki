# Desarrollo

Índice de la documentación técnica de neCyberWiki.

- **[Arquitectura](arquitectura.md)** — stack, estructura de fuentes, modelo de datos, rutas, búsqueda y estado local.
- **[Pruebas](testing.md)** — tests unitarios, gates, verificación manual con Playwright y comprobación de enlaces.
- **[CI y despliegue](ci-cd.md)** — workflows, producción y staging en GitHub Pages.

## Requisitos

Node 22.16 o superior. Sin backend y sin base de datos.

## Arranque rápido

```bash
npm install
npm run dev
```

El buscador se genera antes de arrancar. Para ver el build real:

```bash
npm run build && npm run preview
```

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

Las reglas de contribución y la cláusula están en [`CONTRIBUTING.md`](../CONTRIBUTING.md).
