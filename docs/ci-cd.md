# CI y despliegue

El repositorio tiene tres workflows en `.github/workflows/`. Todos se ejecutan con el `GITHUB_TOKEN` y permisos mínimos.

## Resumen

| Workflow | Cuándo | Objetivo |
| --- | --- | --- |
| `ci.yml` | PR y push a `dev`/`main` | Ejecutar los gates del proyecto |
| `link-check.yml` | PR y disparo manual | Comprobar enlaces del sitio construido |
| `deploy.yml` | Push a `main`/`dev` y disparo manual | Publicar producción y staging en GitHub Pages |

## CI — gates

`ci.yml` instala dependencias con `npm ci` y ejecuta, en orden:

```bash
npm run check
npm run lint
npm test
npm run build
npx prettier --check .
```

Cualquier gate que falle bloquea el PR. No se desactivan gates: si falla un check, se corrige el código.

## Comprobación de enlaces

`link-check.yml` usa `lycheeverse/lychee-action@v2` (v0.24.2) sobre el sitio construido, con `fail: true`. Antes de chequear, un step prepara un árbol temporal con `dist/` copiado, canonicals propios reescritos a rutas root-relative y un symlink hermano `neCyberWiki -> site`. Opciones relevantes:

- `--root-dir <temporal>` para resolver `/neCyberWiki/...` contra el symlink.
- `--index-files index.html` para que las rutas con `/` final encuentren el `index.html`.
- `--exclude youtube\.com` porque YouTube devuelve 403 a los checkers automatizados.
- `--exclude www\.gnu\.org` porque responde 429 o timeout a los runners de forma sostenida (enlaces en `bandit/17.md` y `bandit/18.md`); no son enlaces muertos.
- `--exclude www\.polimetro\.com` porque devuelve 403 a los checkers automatizados (enlace en `bandit/14.md`).
- `--accept '100..=103, 200..=299, 429'` porque un 429 de otros hosts es rate limiting, no un enlace muerto.

Los errores se revisan en el resumen del run; un enlace muerto se corrige o se elimina, no se ignora.

## Despliegue

`deploy.yml` publica **dos versiones del mismo sitio** en un único sitio de GitHub Pages:

| Rama | URL | Base de Astro |
| --- | --- | --- |
| `main` | `https://netenebrae-sec.github.io/neCyberWiki/` | `/neCyberWiki/` |
| `dev` | `https://netenebrae-sec.github.io/neCyberWiki/dev/` | `/neCyberWiki/dev/` |

### Cómo funciona

1. Hace checkout de `main` en `site-main/` y de `dev` en `site-dev/`.
2. Instala dependencias y compila cada rama por separado. El build de `dev` recibe `PUBLIC_NCW_BASE=/neCyberWiki/dev/`, que `astro.config.mjs` y `src/data/site.ts` usan como base.
3. Ensambla un único artifact `_site/`: el build de `main` en la raíz y el de `dev` en `_site/dev/`.
4. Sube el artifact y lo publica con `actions/deploy-pages@v4` en el environment `github-pages`.

GitHub Pages solo permite un sitio por repositorio y los deployments son atómicos: cada push publica el artifact completo con las dos versiones. Por eso un push a `main` también reconstruye staging, y viceversa.

### Verificación del despliegue

Tras un push:

```bash
gh run list --workflow=deploy.yml --limit 3
curl -I https://netenebrae-sec.github.io/neCyberWiki/
curl -I https://netenebrae-sec.github.io/neCyberWiki/dev/
```

En staging, los enlaces internos, el favicon y el bundle de Pagefind deben apuntar a `/neCyberWiki/dev/`.

## Promotiones y releases

El flujo de ramas es `feature → dev → main`. Los cambios llegan a `dev` mediante PR y se promueven a `main` mediante otro PR. Los tags de versión se crean en `main` tras el merge. No se hace push, merge ni tag desde automatismos: siempre con autorización humana.
