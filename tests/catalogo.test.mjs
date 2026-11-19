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
  assert.equal(getCurso("arch-linux")?.unidad, "clase")
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

test("Arch Linux publica 22 clases adaptables: esquema, rutas y estados", async () => {
  const curso = getCurso("arch-linux")
  const files = await lessonFiles("arch-linux")
  assert.equal(files.length, 22)

  const modulos = new Set(curso.modulos.map((modulo) => modulo.id))
  const variantes = new Set(["comun", "facil", "avanzada"])
  const entornos = new Set(["ambos", "hardware", "vm"])
  const arranques = new Set(["ambos", "solo", "dualboot"])
  const estados = new Set(["publicada", "en-construccion"])
  const ordenes = []
  const numeros = new Set()
  const lecciones = []

  for (const file of files) {
    const fm = await frontmatter(file)
    assert.equal(scalar(fm, "curso"), "arch-linux", `${file} no declara curso`)
    assert.equal(scalar(fm, "video"), "", `${file} no debería prometer video`)
    assert.equal(scalar(fm, "duracion"), "", `${file} no debería prometer duración`)
    const modulo = scalar(fm, "modulo")
    assert.ok(modulos.has(modulo), `${file} usa un módulo no declarado: ${modulo}`)
    const orden = scalar(fm, "orden")
    assert.ok(Number.isInteger(orden) && orden >= 0, `${file} tiene un orden inválido`)
    ordenes.push(orden)

    const numero = scalar(fm, "numero")
    assert.ok(typeof numero === "string" && /^[0-9]\.[0-9]+$/.test(numero), `${file} sin número`)
    assert.equal(numeros.has(numero), false, `${file} duplica el número ${numero}`)
    numeros.add(numero)

    const variante = scalar(fm, "variante")
    assert.ok(variantes.has(variante), `${file} variante inválida: ${variante}`)
    const entorno = scalar(fm, "entorno")
    assert.ok(entornos.has(entorno), `${file} entorno inválido: ${entorno}`)
    const arranque = scalar(fm, "arranque")
    assert.ok(arranques.has(arranque), `${file} arranque inválido: ${arranque}`)
    const estado = scalar(fm, "estado")
    assert.ok(estados.has(estado), `${file} estado inválido: ${estado}`)

    const prerrequisitosLine = fm.match(/^prerrequisitos:\s*\[(.*?)\]/m)
    assert.ok(prerrequisitosLine, `${file} no declara prerrequisitos`)

    lecciones.push({ file, numero, variante, entorno, arranque, estado })
  }

  assert.deepEqual(
    ordenes.sort((a, b) => a - b),
    Array.from({ length: 22 }, (_, i) => i),
  )
  assert.equal(numeros.size, 22)

  const porNumero = new Map(lecciones.map((l) => [l.numero, l]))
  assert.equal(lecciones.filter((l) => l.estado === "publicada").length, 14)
  assert.equal(lecciones.filter((l) => l.estado === "en-construccion").length, 8)

  // Rutas adaptables: conteos, IDs existentes, sin duplicados, VM sin hardware/dualboot,
  // dual boot con 2.4 antes de 2.3 y 2.8 antes de 2.9.
  const esperadas = [
    ["facil", "hardware", "solo", 14],
    ["facil", "vm", "solo", 13],
    ["facil", "hardware", "dualboot", 16],
    ["avanzada", "hardware", "solo", 16],
    ["avanzada", "vm", "solo", 15],
    ["avanzada", "hardware", "dualboot", 18],
  ]
  assert.equal(curso.rutas?.length, 6)

  const usadas = new Set()
  for (const [dificultad, entorno, arranque, total] of esperadas) {
    const ruta = curso.rutas.find(
      (r) => r.dificultad === dificultad && r.entorno === entorno && r.arranque === arranque,
    )
    assert.ok(ruta, `Falta la ruta ${dificultad}/${entorno}/${arranque}`)
    assert.equal(ruta.lecciones.length, total, `La ruta ${dificultad}/${entorno}/${arranque}`)
    assert.equal(new Set(ruta.lecciones).size, total, "La ruta duplica lecciones")
    for (const id of ruta.lecciones) {
      assert.ok(porNumero.has(id), `La ruta referencia una lección inexistente: ${id}`)
      usadas.add(id)
      const l = porNumero.get(id)
      assert.ok(
        l.variante === "comun" || l.variante === dificultad,
        `La ruta ${dificultad} incluye ${id} de variante ${l.variante}`,
      )
      if (entorno === "vm") {
        assert.notEqual(l.entorno, "hardware", `La ruta VM incluye ${id} de hardware`)
        assert.notEqual(l.arranque, "dualboot", `La ruta VM incluye ${id} de dual boot`)
      }
    }
    if (arranque === "dualboot" && dificultad === "facil") {
      assert.ok(ruta.lecciones.indexOf("2.2") < ruta.lecciones.indexOf("2.4"))
      assert.ok(ruta.lecciones.indexOf("2.4") < ruta.lecciones.indexOf("2.3"))
    }
    if (arranque === "dualboot" && dificultad === "avanzada") {
      assert.ok(ruta.lecciones.indexOf("2.7") < ruta.lecciones.indexOf("2.8"))
      assert.ok(ruta.lecciones.indexOf("2.8") < ruta.lecciones.indexOf("2.9"))
    }
  }

  // Toda lección específica aparece al menos en una ruta; las comunes aparecen en todas.
  for (const l of lecciones) {
    if (l.variante === "comun" && l.entorno === "ambos" && l.arranque === "ambos") {
      assert.ok(usadas.has(l.numero), `La lección común ${l.numero} no aparece en ninguna ruta`)
    } else {
      assert.ok(
        usadas.has(l.numero),
        `La lección específica ${l.numero} no aparece en ninguna ruta`,
      )
    }
  }
})

test("los prerrequisitos de Arch referencian IDs existentes", async () => {
  const files = await lessonFiles("arch-linux")
  const numeros = new Set()
  const prerreqs = []

  for (const file of files) {
    const fm = await frontmatter(file)
    numeros.add(scalar(fm, "numero"))
    const line = fm.match(/^prerrequisitos:\s*\[(.*?)\]/m)
    const ids = [...line[1].matchAll(/"([0-9]\.[0-9]+)"/g)].map((m) => m[1])
    prerreqs.push([file, ids])
  }

  for (const [file, ids] of prerreqs) {
    for (const id of ids) {
      assert.ok(numeros.has(id), `${file} referencia un prerrequisito inexistente: ${id}`)
    }
  }
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
