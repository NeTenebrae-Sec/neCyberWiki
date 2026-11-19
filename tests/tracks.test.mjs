// Unit tests de rutas adaptables (FN-03) — node --experimental-strip-types --test
import test from "node:test"
import assert from "node:assert/strict"
import {
  ARRANQUES,
  DIFICULTADES,
  ENTORNOS,
  buscarRuta,
  combinarConfig,
  leccionEnRuta,
  normalizarConfig,
  ordenarPorRuta,
  progresoKey,
  rutaKey,
} from "../src/lib/tracks.ts"

const ruta = (dificultad, entorno, arranque, lecciones = []) => ({
  dificultad,
  entorno,
  arranque,
  lecciones,
})

const leccion = (variante, entorno = "ambos", arranque = "ambos") => ({
  variante,
  entorno,
  arranque,
})

const rutas = [
  ruta("facil", "hardware", "solo", ["1.1", "1.2", "1.3"]),
  ruta("facil", "vm", "solo", ["1.1", "1.2", "1.4"]),
  ruta("avanzada", "hardware", "dualboot", ["2.5", "2.6", "2.8"]),
]

test("los ejes exponen sus valores canónicos", () => {
  assert.deepEqual(DIFICULTADES, ["facil", "avanzada"])
  assert.deepEqual(ENTORNOS, ["vm", "hardware"])
  assert.deepEqual(ARRANQUES, ["solo", "dualboot"])
})

test("normalizarConfig aplica el default fácil/hardware/solo", () => {
  assert.deepEqual(normalizarConfig(), {
    dificultad: "facil",
    entorno: "hardware",
    arranque: "solo",
  })
  assert.deepEqual(normalizarConfig({ dificultad: "avanzada" }), {
    dificultad: "avanzada",
    entorno: "hardware",
    arranque: "solo",
  })
})

test("normalizarConfig descarta valores inválidos", () => {
  assert.deepEqual(normalizarConfig({ dificultad: "media", entorno: "nube", arranque: "raid" }), {
    dificultad: "facil",
    entorno: "hardware",
    arranque: "solo",
  })
})

test("normalizarConfig fuerza solo cuando el entorno es VM", () => {
  assert.deepEqual(normalizarConfig({ entorno: "vm", arranque: "dualboot" }), {
    dificultad: "facil",
    entorno: "vm",
    arranque: "solo",
  })
})

test("rutaKey normaliza antes de componer la clave", () => {
  assert.equal(rutaKey(), "facil-hardware-solo")
  assert.equal(
    rutaKey({ dificultad: "avanzada", arranque: "dualboot" }),
    "avanzada-hardware-dualboot",
  )
  assert.equal(rutaKey({ entorno: "vm", arranque: "dualboot" }), "facil-vm-solo")
})

test("buscarRuta compara la configuración normalizada", () => {
  assert.equal(buscarRuta(rutas), rutas[0])
  assert.equal(buscarRuta(rutas, { entorno: "vm", arranque: "dualboot" }), rutas[1])
  assert.equal(buscarRuta(rutas, { dificultad: "avanzada", arranque: "dualboot" }), rutas[2])
  assert.equal(buscarRuta(rutas, { dificultad: "avanzada" }), undefined)
})

test("leccionEnRuta incluye las comunes en cualquier ruta", () => {
  const comun = leccion("comun")
  assert.equal(leccionEnRuta(comun), true)
  assert.equal(leccionEnRuta(comun, { dificultad: "avanzada", entorno: "vm" }), true)
  assert.equal(leccionEnRuta(comun, { arranque: "dualboot" }), true)
})

test("leccionEnRuta filtra por dificultad", () => {
  assert.equal(leccionEnRuta(leccion("facil")), true)
  assert.equal(leccionEnRuta(leccion("avanzada")), false)
  assert.equal(leccionEnRuta(leccion("avanzada"), { dificultad: "avanzada" }), true)
})

test("leccionEnRuta filtra por entorno", () => {
  assert.equal(leccionEnRuta(leccion("comun", "hardware")), true)
  assert.equal(leccionEnRuta(leccion("comun", "vm")), false)
  assert.equal(leccionEnRuta(leccion("comun", "hardware"), { entorno: "vm" }), false)
  assert.equal(leccionEnRuta(leccion("comun", "vm"), { entorno: "vm" }), true)
})

test("leccionEnRuta filtra por arranque y VM nunca admite dual boot", () => {
  assert.equal(leccionEnRuta(leccion("comun", "ambos", "dualboot")), false)
  assert.equal(leccionEnRuta(leccion("comun", "ambos", "dualboot"), { arranque: "dualboot" }), true)
  assert.equal(
    leccionEnRuta(leccion("comun", "ambos", "dualboot"), { entorno: "vm", arranque: "dualboot" }),
    false,
  )
  assert.equal(leccionEnRuta(leccion("comun", "hardware", "solo"), { entorno: "vm" }), false)
})

test("ordenarPorRuta respeta el orden explícito (2.4 antes de 2.3)", () => {
  const rutaDual = ruta("facil", "hardware", "dualboot", ["2.1", "2.2", "2.4", "2.3", "3.1"])
  const lecciones = [
    { numero: "2.3", title: "Escritorio" },
    { numero: "2.4", title: "Dual boot" },
    { numero: "2.1", title: "Disco" },
    { numero: "2.2", title: "Sistema base" },
    { numero: "3.1", title: "Primer arranque" },
  ]
  const antes = [...lecciones]

  const ordenadas = ordenarPorRuta(lecciones, rutaDual)

  assert.deepEqual(
    ordenadas.map((l) => l.numero),
    ["2.1", "2.2", "2.4", "2.3", "3.1"],
  )
  assert.deepEqual(lecciones, antes)
})

test("ordenarPorRuta deja al final las lecciones fuera de ruta", () => {
  const rutaFacil = ruta("facil", "hardware", "solo", ["1.1", "1.2"])
  const lecciones = [{ numero: "9.9" }, { numero: "1.2" }, { numero: "" }, { numero: "1.1" }, {}]

  assert.deepEqual(
    ordenarPorRuta(lecciones, rutaFacil).map((l) => l.numero ?? "sin-numero"),
    ["1.1", "1.2", "9.9", "", "sin-numero"],
  )
})

test("progresoKey separa la dificultad y conserva la clave base", () => {
  assert.equal(progresoKey("arch-linux"), "ncw:progress:arch-linux")
  assert.equal(progresoKey("arch-linux", "facil"), "ncw:progress:arch-linux:facil")
  assert.equal(progresoKey("arch-linux", "avanzada"), "ncw:progress:arch-linux:avanzada")
})

test("combinarConfig: la query gana a storage; storage gana al default", () => {
  const base = { dificultad: "facil", entorno: "hardware", arranque: "solo" }
  const storage = { dificultad: "avanzada", arranque: "dualboot" }
  const query = { dificultad: "facil" }

  assert.deepEqual(combinarConfig(base, storage, query), {
    dificultad: "facil",
    entorno: "hardware",
    arranque: "dualboot",
  })
  assert.deepEqual(combinarConfig(base, storage), {
    dificultad: "avanzada",
    entorno: "hardware",
    arranque: "dualboot",
  })
})

test("combinarConfig ignora capas undefined y claves ausentes", () => {
  assert.deepEqual(combinarConfig(undefined, { entorno: "vm" }, undefined), { entorno: "vm" })
  assert.deepEqual(combinarConfig(undefined), {})
  assert.deepEqual(combinarConfig({}, { dificultad: undefined }), {})
})
