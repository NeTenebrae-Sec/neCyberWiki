// Tests del manifiesto editorial: categorías, cursos y coherencia con el
// contenido real de `content/cursos/`. No importa `src/lib/catalog.ts` porque
// depende de `astro:content`; aquí se valida la fuente de verdad.
import test from "node:test"
import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { CATEGORIAS } from "../src/data/categorias.ts"
import { cursos, getCurso } from "../src/data/cursos.ts"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const contentDir = path.join(root, "content/cursos")

const frontmatter = async (file) => {
  const raw = await readFile(file, "utf8")
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  assert.ok(match, `Frontmatter ausente en ${file}`)
  return match[1]
}

const scalar = (fm, key) => {
  const match = fm.match(new RegExp(`^${key}:\\s*(.+)$`, "m"))
  if (!match) return undefined
  const raw = match[1].trim()
  try {
    return JSON.parse(raw)
  } catch {
    return raw.replace(/^["']|["']$/g, "")
  }
}

const lessonFiles = async (slug) => {
  const files = (await readdir(path.join(contentDir, slug))).filter((file) => file.endsWith(".md"))
  return files.map((file) => path.join(contentDir, slug, file))
}

test("existen exactamente ocho categorías con ids e índices únicos", () => {
  assert.equal(CATEGORIAS.length, 8)
  assert.equal(new Set(CATEGORIAS.map((categoria) => categoria.id)).size, 8)
  assert.deepEqual(
    CATEGORIAS.map((categoria) => categoria.indice),
    ["01", "02", "03", "04", "05", "06", "07", "08"],
  )
  for (const categoria of CATEGORIAS) {
    assert.ok(categoria.titulo.length > 0, `Categoría sin título: ${categoria.id}`)
    assert.ok(categoria.tagline.length > 0, `Categoría sin tagline: ${categoria.id}`)
    assert.ok(categoria.temas.length > 0, `Categoría sin temas: ${categoria.id}`)
  }
})

test("los cursos publicados apuntan a categorías existentes y declaran módulos únicos", () => {
  const ids = new Set(CATEGORIAS.map((categoria) => categoria.id))
  assert.equal(cursos.length, 2)
  assert.equal(new Set(cursos.map((curso) => curso.slug)).size, cursos.length)

  for (const curso of cursos) {
    assert.ok(ids.has(curso.categoria), `${curso.slug} usa una categoría inexistente`)
    assert.equal(new Set(curso.modulos.map((modulo) => modulo.id)).size, curso.modulos.length)
    for (const modulo of curso.modulos) {
      assert.ok(modulo.titulo.length > 0, `${curso.slug}/${modulo.id} sin título`)
      assert.ok(modulo.objetivo.length > 0, `${curso.slug}/${modulo.id} sin objetivo`)
    }
  }
})

test("getCurso resuelve por slug y devuelve undefined si no existe", () => {
  assert.equal(getCurso("bandit")?.titulo, "Bandit: terminal desde cero")
  assert.equal(getCurso("arch-linux-facil")?.unidad, "clase")
  assert.equal(getCurso("no-existe"), undefined)
})

test("Bandit publica 19 niveles zero-based en los cuatro módulos declarados", async () => {
  const curso = getCurso("bandit")
  const files = await lessonFiles("bandit")
  assert.equal(files.length, 19)

  const modulos = new Set(curso.modulos.map((modulo) => modulo.id))
  const ordenes = []

  for (const file of files) {
    const fm = await frontmatter(file)
    assert.equal(scalar(fm, "curso"), "bandit", `${file} no declara curso`)
    assert.equal(scalar(fm, "video"), "", `${file} no debería prometer video`)
    const modulo = scalar(fm, "modulo")
    assert.ok(modulos.has(modulo), `${file} usa un módulo no declarado: ${modulo}`)
    const orden = scalar(fm, "orden")
    assert.ok(Number.isInteger(orden) && orden >= 0, `${file} tiene un orden inválido`)
    ordenes.push(orden)
  }

  assert.deepEqual(
    ordenes.sort((a, b) => a - b),
    Array.from({ length: 19 }, (_, i) => i),
  )
})

test("cada módulo declarado tiene al menos una lección real en Bandit", async () => {
  const curso = getCurso("bandit")
  const files = await lessonFiles("bandit")
  const usados = new Set()

  for (const file of files) {
    usados.add(scalar(await frontmatter(file), "modulo"))
  }

  for (const modulo of curso.modulos) {
    assert.ok(usados.has(modulo.id), `El módulo ${modulo.id} no tiene lecciones`)
  }
})

test("Arch Linux publica 8 clases ordenadas y sus módulos existen", async () => {
  const curso = getCurso("arch-linux-facil")
  const files = await lessonFiles("arch-linux-facil")
  assert.equal(files.length, 8)

  const modulos = new Set(curso.modulos.map((modulo) => modulo.id))
  const ordenes = []

  for (const file of files) {
    const fm = await frontmatter(file)
    assert.equal(scalar(fm, "curso"), "arch-linux-facil", `${file} no declara curso`)
    const modulo = scalar(fm, "modulo")
    assert.ok(modulos.has(modulo), `${file} usa un módulo no declarado: ${modulo}`)
    const orden = scalar(fm, "orden")
    assert.ok(Number.isInteger(orden) && orden >= 0, `${file} tiene un orden inválido`)
    ordenes.push(orden)
  }

  assert.deepEqual(
    ordenes.sort((a, b) => a - b),
    Array.from({ length: 8 }, (_, i) => i),
  )
})

test("las imágenes de Bandit apuntan a /cursos/bandit/ y existen en public", async () => {
  const files = await lessonFiles("bandit")
  const referencias = new Set()

  for (const file of files) {
    const raw = await readFile(file, "utf8")
    for (const match of raw.matchAll(/!\[[^\]]*\]\(([^)"\s]+)\)/g)) {
      const src = match[1]
      if (!src.startsWith("/neCyberWiki/cursos/bandit/")) continue
      referencias.add(src.replace("/neCyberWiki/cursos/bandit/", ""))
    }
    assert.ok(
      !raw.includes("/neCyberWiki/notas/bandit/"),
      `${file} conserva una ruta antigua de notas`,
    )
  }

  assert.ok(referencias.size > 0, "Bandit no referencia imágenes")
  for (const referencia of referencias) {
    const asset = path.join(root, "public/cursos/bandit", referencia)
    await assert.doesNotReject(readFile(asset), `Imagen ausente: ${referencia}`)
  }
})
