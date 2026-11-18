// Unit tests de groupSyllabus (FN-03) — node --experimental-strip-types --test
import test from "node:test"
import assert from "node:assert/strict"
import {
  groupSyllabus,
  normalizeLesson,
  parseDuracionMin,
  formatTotalMin,
  formatCapituloTime,
} from "../src/lib/syllabus.ts"

const raw = (orden, modulo, modulo_titulo, submodulo, submodulo_titulo, duracion = "8 min") => ({
  id: `cursos/demo/${String(orden + 1).padStart(2, "0")}-demo.md`,
  data: {
    title: `Lección ${orden + 1}`,
    orden,
    duracion,
    video: "",
    modulo,
    modulo_titulo,
    submodulo,
    submodulo_titulo,
    capitulos: [],
  },
})

const lessons = [
  raw(0, "a", "Alfa", "1.1", "Antes"),
  raw(1, "a", "Alfa", "1.1", "Antes"),
  raw(2, "a", "Alfa", "1.2", "Dentro"),
  raw(3, "b", "Beta", "2.1", "Base"),
].map((l) => normalizeLesson(l.id, l.data))

test("agrupa por módulo en orden de aparición y numera 1-based", () => {
  const mods = groupSyllabus(lessons)
  assert.equal(mods.length, 2)
  assert.deepEqual(
    mods.map((m) => [m.numero, m.key, m.count]),
    [
      [1, "a", 3],
      [2, "b", 1],
    ],
  )
})

test("submódulos agrupan y conservan orden", () => {
  const mods = groupSyllabus(lessons)
  assert.equal(mods[0].submodulos.length, 2)
  assert.deepEqual(
    mods[0].submodulos.map((s) => [s.numero, s.titulo, s.lecciones.length]),
    [
      ["1.1", "Antes", 2],
      ["1.2", "Dentro", 1],
    ],
  )
})

test("sin submódulos definidos → submodulos null (lista plana)", () => {
  const plain = [raw(0, "a", "Alfa", "", ""), raw(1, "a", "Alfa", "", "")].map((l) =>
    normalizeLesson(l.id, l.data),
  )
  const mods = groupSyllabus(plain)
  assert.equal(mods[0].submodulos, null)
  assert.equal(mods[0].count, 2)
})

test("lección sin submódulo dentro de módulo con submódulos → grupo General derivado", () => {
  const mixed = [raw(0, "a", "Alfa", "1.1", "Antes"), raw(1, "a", "Alfa", "", "")].map((l) =>
    normalizeLesson(l.id, l.data),
  )
  const mods = groupSyllabus(mixed)
  const direct = mods[0].submodulos.find((s) => s.key === "__direct__")
  assert.ok(direct)
  assert.equal(direct.titulo, "General")
})

test("totalMin suma minutos parseados de duracion", () => {
  const mods = groupSyllabus(lessons)
  assert.equal(mods[0].totalMin, 24)
  assert.equal(mods[1].totalMin, 8)
})

test("parseDuracionMin entiende min, h+min y basura", () => {
  assert.equal(parseDuracionMin("8 min"), 8)
  assert.equal(parseDuracionMin("1 h 20 min"), 80)
  assert.equal(parseDuracionMin("90 min"), 90)
  assert.equal(parseDuracionMin(""), 0)
  assert.equal(parseDuracionMin("pronto"), 0)
})

test("formatTotalMin y formatCapituloTime", () => {
  assert.equal(formatTotalMin(45), "45 min")
  assert.equal(formatTotalMin(60), "1 h")
  assert.equal(formatTotalMin(125), "2 h 05 min")
  assert.equal(formatTotalMin(0), "")
  assert.equal(formatCapituloTime(0), "00:00")
  assert.equal(formatCapituloTime(75), "01:15")
  assert.equal(formatCapituloTime(610), "10:10")
})
