# Mantenimiento

## Antes de publicar

```bash
npm run build
npm run check
npm run lint
npm test
npm run test:e2e
npx prettier --check .
```

El build debe generar `dist/pagefind/pagefind.js`. Si no existe, el buscador no funcionará.

## QA manual

Probar en 360, 768 y 1440, en tema Noche y Archivo:

- [ ] Portada, catálogo, categoría, curso, lección, bitácora, roadmap, perfil, términos y 404.
- [ ] Sin scroll horizontal.
- [ ] Header, drawer y footer sin enlaces muertos.
- [ ] Teclado: Tab, Enter, Escape y foco visible.
- [ ] Candado legal: bloquea, no se cierra por accidente y acepta correctamente.
- [ ] Buscador: consulta con resultados, sin resultados y consulta vacía.
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

- Ejecutar `npm run build` después de cambiar contenido.
- Comprobar que las páginas nuevas tienen `indexable` correcto.
- Excluir perfil, búsqueda, 404 y gate legal.
- Si se cambia el base path, revisar `baseUrl` de Pagefind.

## Release

1. Pasar todos los gates.
2. Revisar el diff.
3. Actualizar `docs/DECISIONS.md` si cambió una decisión.
4. Actualizar `docs/ROADMAP` público si la tanda cambió el estado del proyecto.
5. Hacer commit y push.
6. Verificar el deploy de GitHub Pages.
7. Abrir la URL publicada y repetir el QA mínimo.
