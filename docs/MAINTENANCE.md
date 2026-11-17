# Mantenimiento

## Antes de publicar

```bash
npm run build   # astro build + postbuild: índice Pagefind
npm run check
npm run lint
npm test
npx prettier --check .
```

`npm run test:e2e` se añadirá en la Tanda 4; hoy no existe como script y no debe inventarse.

El build debe generar `dist/pagefind/pagefind.js` y terminar con `Indexed 42 pages` (el número crece
con el contenido). Si no existe, el buscador no funcionará.

`tests/buscador-build.test.mjs` valida el HTML construido: bundle e índice de Pagefind, instancias
`header`/`page`, páginas `noindex` fuera del índice y enlaces sin barra doble. Necesita `dist/`; si
no existe, esos casos se omiten y el resto de `npm test` sigue corriendo.

## QA manual

Probar en 360, 768 y 1440, en tema Noche y Archivo:

- [ ] Portada, catálogo, categoría, curso, lección, bitácora, roadmap, perfil, términos y 404.
- [ ] Sin scroll horizontal.
- [ ] Header, drawer y footer sin enlaces muertos.
- [ ] Teclado: Tab, Enter, Escape y foco visible.
- [ ] Candado legal: bloquea, no se cierra por accidente y acepta correctamente.
- [ ] Buscador: dropdown del header, `Enter` en el primer resultado, icono a `/buscar/?q=`, consulta
      con resultados, consulta vacía y estado sin resultados.
- [ ] Buscador: instancia `page` en `/buscar/` con `?q=` y foco tras aceptar el aviso legal.
- [ ] Buscador: sin 404 de `pagefind-component-ui.js`, `pagefind.js` ni fragmentos en la consola/red.
- [ ] Header: buscador visible a 1100 px y oculto a 1024 px, sin overflow.
- [ ] Perfil: exportar, borrar e importar.
- [ ] Progreso: marcar lección, recargar y comprobar persistencia.
- [ ] Redirects antiguos.

## Accesibilidad

- Un `<h1>` por página.
- Contraste AA en ambos temas.
- Imágenes con `alt` descriptivo.
- Formularios con `<label>`.
- Resultados de búsqueda y cambios de progreso con `aria-live` cuando corresponda.
- Diálogos con foco atrapado y sin cierre accidental.
- `prefers-reduced-motion` respetado.

## Rendimiento

- Sin fuentes externas ni widgets de terceros.
- Imágenes en WebP y con `loading="lazy"`.
- El índice de Pagefind se carga solo al buscar.
- Evitar JS de cliente que no sea necesario.
- Revisar el peso de `public/cursos/` antes de añadir capturas.

## Contenido

- No publicar videos, fechas, métricas ni certificados que no existan.
- Revisar los enlaces oficiales de los laboratorios.
- Censurar contraseñas y datos sensibles.
- Actualizar el roadmap cuando cambie el estado de una tanda.
- Si se reimporta Bandit, revisar el diff y las rutas de las imágenes.

## Búsqueda

- Ejecutar `npm run build` después de cambiar contenido: el `postbuild` regenera el índice.
- No versionar `public/pagefind/`; el índice vive solo en `dist/pagefind/`.
- Comprobar que las páginas nuevas tienen `data-pagefind-body` y que las `noindex` no lo llevan.
- Excluir perfil, búsqueda, 404 y gate legal.
- Si se cambia el base path, actualizar `bundle-path` en las dos instancias (`header` y `page`), no
  un `baseUrl` global.
- Para QA en navegador se puede usar Playwright MCP con configuración local al proyecto en
  `.opencode/opencode.jsonc` (ignorado por git); no se modifica la configuración global.

## Release

1. Pasar todos los gates.
2. Revisar el diff.
3. Actualizar `docs/DECISIONS.md` si cambió una decisión.
4. Actualizar `docs/ROADMAP` público si la tanda cambió el estado del proyecto.
5. Hacer commit y push.
6. Verificar el deploy de GitHub Pages.
7. Abrir la URL publicada y repetir el QA mínimo.
