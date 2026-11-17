// Regresiones sobre el sitio construido: el buscador de Pagefind, el índice y
// las páginas que no deben indexarse. Requieren `npm run build` previo, así que
// se marcan como omitidos si `dist/` no existe para no romper `npm test` en frío.
import test from "node:test"
import assert from "node:assert/strict"
import { access, readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { site } from "../src/data/site.ts"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dist = path.join(root, "dist")
const bundlePath = `${site.base}pagefind/`

const built = await access(path.join(dist, "index.html")).then(
  () => true,
  () => false,
)
const skip = built ? false : "requiere `npm run build` previo"

const read = (file) => readFile(path.join(dist, file), "utf8")

const htmlFiles = async (dir = dist, acc = []) => {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === "pagefind" || entry.name === "_astro") continue
      await htmlFiles(full, acc)
    } else if (entry.name.endsWith(".html")) {
      acc.push(full)
    }
  }
  return acc
}

test("el build genera el bundle y los fragmentos de Pagefind", { skip }, async () => {
  for (const file of ["pagefind/pagefind.js", "pagefind/pagefind-component-ui.js"]) {
    await assert.doesNotReject(access(path.join(dist, file)), `${file} ausente`)
  }
  const fragments = await readdir(path.join(dist, "pagefind", "fragment"))
  assert.ok(
    fragments.some((file) => file.endsWith(".pf_fragment")),
    "sin fragmentos de Pagefind",
  )
})

test("el índice solo contiene páginas con data-pagefind-body", { skip }, async () => {
  const entry = JSON.parse(await read("pagefind/pagefind-entry.json"))
  const indexable = []
  for (const file of await htmlFiles()) {
    const html = await readFile(file, "utf8")
    if (html.includes("data-pagefind-body")) {
      indexable.push(path.relative(dist, file).replace(/\\/g, "/"))
    }
  }
  const language = Object.values(entry.languages)[0]
  assert.ok(language.page_count > 0, "el índice está vacío")
  assert.equal(language.page_count, indexable.length)
})

test("el header monta la instancia header y /buscar/ no la duplica", { skip }, async () => {
  const home = await read("index.html")
  assert.match(home, /<pagefind-searchbox[^>]*instance="header"/)
  assert.match(home, /<pagefind-config[^>]*instance="header"/)
  assert.ok(home.includes(`bundle-path="${bundlePath}"`))
  assert.match(home, /data-pagefind-body/)

  const icon = home.match(/<a[^>]*id="buscar-completa"[^>]*>/)?.[0]
  assert.ok(icon, "falta el icono #buscar-completa")
  assert.ok(icon.includes(`href="${site.base}buscar/"`), "el icono no apunta a /buscar/")
  assert.ok(icon.includes('aria-label="Ver todos los resultados"'))

  const buscar = await read("buscar/index.html")
  assert.match(buscar, /<pagefind-config[^>]*instance="page"/)
  assert.ok(buscar.includes(`bundle-path="${bundlePath}"`))
  assert.doesNotMatch(buscar, /<pagefind-config[^>]*instance="header"/)
  assert.doesNotMatch(buscar, /<pagefind-searchbox[\s>]/)
  assert.doesNotMatch(buscar, /data-pagefind-body/)
})

test("/buscar/ monta la búsqueda inline y su mensaje inicial", { skip }, async () => {
  const buscar = await read("buscar/index.html")
  for (const component of [
    "pagefind-input",
    "pagefind-summary",
    "pagefind-results",
    "pagefind-keyboard-hints",
  ]) {
    assert.match(buscar, new RegExp(`<${component}[^>]*instance="page"`))
  }
  assert.match(buscar, /Escribe para buscar en cursos, lecciones y bitácora\./)
})

test("las páginas noindex no llevan data-pagefind-body", { skip }, async () => {
  for (const file of [
    "buscar/index.html",
    "perfil/index.html",
    "terminos/index.html",
    "404.html",
  ]) {
    const html = await read(file)
    assert.match(html, /<meta name="robots" content="noindex"/, `${file} sin noindex`)
    assert.doesNotMatch(html, /data-pagefind-body/, `${file} con data-pagefind-body`)
    assert.match(html, /data-pagefind-ignore="all"/, `${file} sin data-pagefind-ignore="all"`)
  }
})

test("los enlaces del inicio no duplican la barra de la base", { skip }, async () => {
  const html = await read("index.html")
  const baseSinBarra = site.base.replace(/\/$/, "")
  assert.doesNotMatch(html, new RegExp(`${baseSinBarra}//`), "enlace con barra doble en el inicio")
})

test("la portada usa el CTA de perfil y el acordeón de rutas", { skip }, async () => {
  const html = await read("index.html")
  assert.match(
    html,
    new RegExp(`href="${site.base}perfil/"[^>]*class="[^"]*header-cta[^"]*"[^>]*>`),
  )
  assert.match(html, /class="[^"]*header-cta[^"]*"[^>]*>[\s\S]*?Mi perfil/)
  assert.match(html, /Cuatro mapas para orientarte/)
  assert.match(html, /Mis últimas notas/)
  assert.equal((html.match(/class="route-group__trigger"/g) ?? []).length, 4)
  assert.equal(
    (html.match(/<button class="route-group__trigger"[^>]*aria-expanded="false"/g) ?? []).length,
    4,
  )
  assert.match(html, /aria-controls="foundations-systems-panel"/)
  assert.match(html, /Volver a los mapas/)
  assert.match(html, /Roadmap y notas de desarrollo/)
})

test("las lecciones sin video reservan el bloque multimedia", { skip }, async () => {
  const html = await read("cursos/linux-y-sistemas/arch-linux-facil/02-usb-y-arranque/index.html")
  assert.match(html, /class="player-frame"/)
  assert.match(html, /class="video-embed video-embed--empty"/)
  assert.match(html, /Video en preparación/)
  assert.match(html, /video pendiente/)
})

test("el índice no se versiona y no hay script e2e inventado", { skip }, async () => {
  await assert.rejects(access(path.join(root, "public", "pagefind")))
  const pkg = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"))
  assert.equal(pkg.scripts.postbuild, "pagefind --site dist")
  assert.equal(pkg.scripts["test:e2e"], undefined)
  assert.equal(pkg.devDependencies?.playwright, undefined)
  assert.equal(pkg.dependencies?.playwright, undefined)
})
