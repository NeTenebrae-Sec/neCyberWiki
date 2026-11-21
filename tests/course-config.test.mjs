// Unit tests del configurador adaptable (helpers puros) — node --experimental-strip-types --test
import test from "node:test"
import assert from "node:assert/strict"
import { primeraRutaConLeccion, resumirConfig } from "../src/lib/course-config.client.ts"
import { REGLA_DE_CAMPO, formatoDeRuta } from "../src/lib/course-config.client.ts"

const rutas = [
  { dificultad: "facil", entorno: "hardware", arranque: "solo", lecciones: ["1.1", "1.6", "2.4"] },
  { dificultad: "facil", entorno: "vm", arranque: "solo", lecciones: ["1.1", "1.4"] },
  { dificultad: "facil", entorno: "hardware", arranque: "dualboot", lecciones: ["1.1", "1.6"] },
  { dificultad: "avanzada", entorno: "hardware", arranque: "solo", lecciones: ["1.1", "2.5"] },
]

test("resumirConfig compone dificultad · entorno · arranque", () => {
  assert.equal(
    resumirConfig({ dificultad: "facil", entorno: "hardware", arranque: "solo" }),
    "Fácil · Hardware · Solo Linux",
  )
  assert.equal(
    resumirConfig({ dificultad: "avanzada", entorno: "vm", arranque: "solo" }),
    "Avanzada · VM · Solo Linux",
  )
})

test("primeraRutaConLeccion devuelve undefined si ninguna ruta incluye la lección", () => {
  assert.equal(primeraRutaConLeccion(rutas, "9.9"), undefined)
  assert.equal(primeraRutaConLeccion([], "1.6"), undefined)
})

test("primeraRutaConLeccion prefiere la dificultad de la preferencia", () => {
  const elegida = primeraRutaConLeccion(rutas, "2.4", {
    dificultad: "facil",
    entorno: "vm",
    arranque: "solo",
  })
  assert.deepEqual(elegida, rutas[0])
})

test("primeraRutaConLeccion cae a la primera candidata si ninguna comparte dificultad", () => {
  const elegida = primeraRutaConLeccion(rutas, "2.5", {
    dificultad: "facil",
    entorno: "hardware",
    arranque: "solo",
  })
  assert.deepEqual(elegida, rutas[3])
})

test("primeraRutaConLeccion con lección común elige la ruta de la dificultad preferida", () => {
  const elegida = primeraRutaConLeccion(rutas, "1.1", {
    dificultad: "avanzada",
    entorno: "hardware",
    arranque: "solo",
  })
  assert.deepEqual(elegida, rutas[3])
})

test("primeraRutaConLeccion normaliza preferencias inválidas antes de preferir", () => {
  const elegida = primeraRutaConLeccion(rutas, "2.5", { dificultad: "media" })
  // "media" normaliza a "facil"; ninguna candidata es facil, gana la primera.
  assert.deepEqual(elegida, rutas[3])
})

test("formatoDeRuta compone el copy honesto con el total de la ruta", () => {
  assert.equal(
    formatoDeRuta(14, 22),
    "14 clases en tu ruta · 22 en total · Guía escrita; video en preparación.",
  )
  assert.equal(
    formatoDeRuta(18, 22),
    "18 clases en tu ruta · 22 en total · Guía escrita; video en preparación.",
  )
})

test("REGLA_DE_CAMPO conserva el copy aprobado", () => {
  assert.equal(
    REGLA_DE_CAMPO,
    "Nada de esto toca sistemas ajenos: practica en tu VM, tu hardware o el laboratorio autorizado.",
  )
})
