// Tests de la lógica pura del perfil local. Usan un almacenamiento en memoria
// para validar exportar, importar y borrar sin depender del navegador.
import test from "node:test"
import assert from "node:assert/strict"
import {
  PROFILE_NAME_KEY,
  LEGAL_KEY,
  THEME_KEY,
  PROGRESS_PREFIX,
  applyProfile,
  cleanLessonSlug,
  clearProfile,
  collectProfile,
  emptyProfile,
  expandirProgresoCompartido,
  parseProfile,
  plegarProgresoCompartido,
  purgeLegacyProgress,
  serializeProfile,
  totalLessons,
  validateProfile,
} from "../src/lib/profile.ts"

class MemoryStorage {
  #map = new Map()

  get length() {
    return this.#map.size
  }

  key(index) {
    return [...this.#map.keys()][index] ?? null
  }

  getItem(key) {
    return this.#map.has(key) ? this.#map.get(key) : null
  }

  setItem(key, value) {
    this.#map.set(key, String(value))
  }

  removeItem(key) {
    this.#map.delete(key)
  }
}

const seeded = () => {
  const storage = new MemoryStorage()
  storage.setItem(PROFILE_NAME_KEY, "  Tenebrae  ")
  storage.setItem(THEME_KEY, "light")
  storage.setItem(LEGAL_KEY, "2026-11-15T10:00:00.000Z")
  storage.setItem(
    `${PROGRESS_PREFIX}arch-linux`,
    JSON.stringify(["1-1", "1-1@facil-hardware-solo", "1-1"]),
  )
  storage.setItem(`${PROGRESS_PREFIX}bandit`, JSON.stringify(["0", "1", 3]))
  storage.setItem("otra-app", "no tocar")
  return storage
}

test("collectProfile reúne alias, tema, aceptación y progreso", () => {
  const profile = collectProfile(seeded(), ["arch-linux"])
  assert.equal(profile.version, 1)
  assert.equal(profile.alias, "Tenebrae")
  assert.equal(profile.theme, "light")
  assert.equal(profile.legalAcceptedAt, "2026-11-15T10:00:00.000Z")
  assert.deepEqual(profile.courses["arch-linux"], ["1-1", "1-1@facil-hardware-solo"])
  assert.deepEqual(profile.courses.bandit, ["0", "1"])
  assert.equal(totalLessons(profile), 4)
})

test("collectProfile ignora datos corruptos y cursos sin progreso", () => {
  const storage = new MemoryStorage()
  storage.setItem(PROGRESS_PREFIX + "bandit", "{roto")
  storage.setItem(THEME_KEY, "sepia")
  storage.setItem(LEGAL_KEY, "ayer")
  const profile = collectProfile(storage, ["bandit", "arch-linux"])
  assert.deepEqual(profile.courses, {})
  assert.equal(profile.theme, "dark")
  assert.equal(profile.legalAcceptedAt, null)
  assert.equal(profile.alias, "")
})

test("serializeProfile y parseProfile hacen ida y vuelta", () => {
  const original = collectProfile(seeded(), ["arch-linux"])
  const raw = serializeProfile(original)
  assert.ok(raw.endsWith("\n"))
  const result = parseProfile(raw)
  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.deepEqual(result.profile, original)
})

test("parseProfile rechaza JSON roto, versiones y formas inválidas", () => {
  assert.equal(parseProfile("{").ok, false)

  const version = validateProfile({ version: 99 })
  assert.equal(version.ok, false)

  const alias = validateProfile({ version: 1, alias: 42 })
  assert.equal(alias.ok, false)

  const theme = validateProfile({ version: 1, theme: "sepia" })
  assert.equal(theme.ok, false)

  const courses = validateProfile({ version: 1, courses: [] })
  assert.equal(courses.ok, false)

  const lesson = validateProfile({
    version: 1,
    courses: { bandit: ["0", "../fuera"] },
  })
  assert.equal(lesson.ok, false)
})

test("validateProfile normaliza alias, fechas y lecciones duplicadas", () => {
  const result = validateProfile({
    version: 1,
    alias: "  Ada  ",
    theme: "light",
    legalAcceptedAt: "2026-11-15T10:00:00.000Z",
    courses: { bandit: ["0", "1", "0"] },
  })
  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.equal(result.profile.alias, "Ada")
  assert.equal(result.profile.theme, "light")
  assert.deepEqual(result.profile.courses.bandit, ["0", "1"])
})

test("un perfil vacío es válido y exportable", () => {
  const profile = emptyProfile()
  const result = parseProfile(serializeProfile(profile))
  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.deepEqual(result.profile, profile)
})

test("applyProfile reemplaza el progreso anterior y respeta otras claves", () => {
  const storage = seeded()
  const profile = {
    version: 1,
    alias: "Nueva",
    theme: "dark",
    legalAcceptedAt: null,
    courses: { bandit: ["5"] },
  }
  applyProfile(storage, profile)

  assert.equal(storage.getItem(PROGRESS_PREFIX + "arch-linux"), null)
  assert.deepEqual(JSON.parse(storage.getItem(PROGRESS_PREFIX + "bandit")), ["5"])
  assert.equal(storage.getItem(PROFILE_NAME_KEY), "Nueva")
  assert.equal(storage.getItem(THEME_KEY), "dark")
  assert.equal(storage.getItem(LEGAL_KEY), null)
  assert.equal(storage.getItem("otra-app"), "no tocar")
})

test("applyProfile elimina el alias si el perfil importado no trae uno", () => {
  const storage = seeded()
  applyProfile(storage, emptyProfile())
  assert.equal(storage.getItem(PROFILE_NAME_KEY), null)
  assert.equal(storage.getItem(THEME_KEY), "dark")
  assert.equal(storage.getItem(LEGAL_KEY), null)
})

test("clearProfile borra solo las claves ncw y devuelve la lista", () => {
  const storage = seeded()
  const removed = clearProfile(storage)
  assert.deepEqual(removed, [
    "ncw-theme",
    "ncw:legal:v1",
    "ncw:profile:name",
    "ncw:progress:arch-linux",
    "ncw:progress:bandit",
  ])
  assert.equal(storage.getItem("otra-app"), "no tocar")
  assert.equal(storage.length, 1)
})

test("validateProfile acepta filas con :tag y hace round-trip", () => {
  const result = validateProfile({
    version: 1,
    courses: {
      "arch-linux:facil": ["1-1", "2-2"],
      "arch-linux:avanzada": ["2-5"],
    },
  })
  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.deepEqual(result.profile.courses["arch-linux:facil"], ["1-1", "2-2"])
  assert.deepEqual(result.profile.courses["arch-linux:avanzada"], ["2-5"])

  const round = parseProfile(serializeProfile(result.profile))
  assert.equal(round.ok, true)
  if (!round.ok) return
  assert.deepEqual(round.profile.courses, result.profile.courses)
})

test("validateProfile rechaza claves con : inválido", () => {
  for (const key of [
    ":facil",
    "a:b:c",
    "arch:BAD!",
    "",
    "arch:",
    ":",
    "arch:-facil",
    "arch:A",
    "a b:facil",
  ]) {
    const result = validateProfile({ version: 1, courses: { [key]: ["0"] } })
    assert.equal(result.ok, false, `clave rechazada: «${key}»`)
  }
})

test("collectProfile + expandir derivan dos filas desde el bucket base", () => {
  const storage = new MemoryStorage()
  storage.setItem(
    `${PROGRESS_PREFIX}arch-linux`,
    JSON.stringify([
      "1-1",
      "1-1@facil-hardware-solo",
      "2-5@avanzada-hardware-solo",
      "2-5@avanzada-hardware-dualboot",
      "3-1",
    ]),
  )
  const profile = expandirProgresoCompartido(collectProfile(storage), ["arch-linux"])
  assert.deepEqual(Object.keys(profile.courses).sort(), ["arch-linux:avanzada", "arch-linux:facil"])
  assert.deepEqual(profile.courses["arch-linux:facil"], ["1-1", "1-1@facil-hardware-solo", "3-1"])
  assert.deepEqual(profile.courses["arch-linux:avanzada"], [
    "1-1",
    "2-5@avanzada-hardware-solo",
    "2-5@avanzada-hardware-dualboot",
    "3-1",
  ])
  assert.equal(profile.courses["arch-linux"], undefined)
})

test("purgeLegacyProgress borra la clave vieja y conserva el bucket base", () => {
  const storage = new MemoryStorage()
  storage.setItem(`${PROGRESS_PREFIX}arch-linux-facil`, JSON.stringify(["01"]))
  storage.setItem(`${PROGRESS_PREFIX}arch-linux`, JSON.stringify(["1-1@facil-hardware-solo"]))
  storage.setItem(`${PROGRESS_PREFIX}arch-linux:facil`, JSON.stringify(["1-1"]))
  storage.setItem(`${PROGRESS_PREFIX}arch-linux:avanzada`, JSON.stringify(["2-5"]))
  storage.setItem("otra-app", "no tocar")

  const removed = purgeLegacyProgress(storage)
  assert.deepEqual(removed, [`${PROGRESS_PREFIX}arch-linux-facil`])
  assert.equal(storage.getItem(`${PROGRESS_PREFIX}arch-linux-facil`), null)
  // El bucket base es el progreso nuevo: no se purga.
  assert.deepEqual(JSON.parse(storage.getItem(`${PROGRESS_PREFIX}arch-linux`)), [
    "1-1@facil-hardware-solo",
  ])
  // Las filas viejas por dificultad se conservan (no se leen, no se borran).
  assert.deepEqual(JSON.parse(storage.getItem(`${PROGRESS_PREFIX}arch-linux:facil`)), ["1-1"])
  assert.deepEqual(JSON.parse(storage.getItem(`${PROGRESS_PREFIX}arch-linux:avanzada`)), ["2-5"])
  assert.equal(storage.getItem("otra-app"), "no tocar")

  // Segunda pasada: nada que borrar.
  assert.deepEqual(purgeLegacyProgress(storage), [])
})

test("applyProfile + plegar escriben un único bucket base", () => {
  const storage = seeded()
  const profile = {
    version: 1,
    alias: "Ada",
    theme: "dark",
    legalAcceptedAt: null,
    courses: {
      "arch-linux:facil": ["1-1", "1-2"],
      "arch-linux:avanzada": ["2-5@avanzada-hardware-solo"],
    },
  }
  applyProfile(storage, plegarProgresoCompartido(profile, ["arch-linux"]))

  assert.deepEqual(JSON.parse(storage.getItem(`${PROGRESS_PREFIX}arch-linux`)), [
    "1-1",
    "1-2",
    "2-5@avanzada-hardware-solo",
  ])
  assert.equal(storage.getItem(`${PROGRESS_PREFIX}arch-linux:facil`), null)
  assert.equal(storage.getItem(`${PROGRESS_PREFIX}arch-linux:avanzada`), null)
  // Las legacy no reaparecen.
  assert.equal(storage.getItem(`${PROGRESS_PREFIX}arch-linux-facil`), null)

  const exported = expandirProgresoCompartido(collectProfile(storage), ["arch-linux"])
  assert.deepEqual(exported.courses["arch-linux:facil"], ["1-1", "1-2"])
  assert.deepEqual(exported.courses["arch-linux:avanzada"], [
    "1-1",
    "1-2",
    "2-5@avanzada-hardware-solo",
  ])
})

test("totalLessons suma marcas de ambas filas", () => {
  const profile = {
    version: 1,
    alias: "",
    theme: "dark",
    legalAcceptedAt: null,
    courses: {
      "arch-linux:facil": ["1-1", "1-2"],
      "arch-linux:avanzada": ["2-5"],
      bandit: ["0"],
    },
  }
  assert.equal(totalLessons(profile), 4)
})

test("expandir comparte las comunes y aísla las especiales por dificultad", () => {
  const profile = {
    version: 1,
    alias: "",
    theme: "dark",
    legalAcceptedAt: null,
    courses: {
      "arch-linux": ["1-1", "2-5@avanzada-hardware-solo"],
      "arch-linux:facil": ["fila-vieja"],
      "arch-linux:avanzada": ["fila-vieja"],
    },
  }
  const expandido = expandirProgresoCompartido(profile, ["arch-linux"])

  // La común está en ambas filas; la especial solo en Avanzada.
  assert.deepEqual(expandido.courses["arch-linux:facil"], ["1-1"])
  assert.deepEqual(expandido.courses["arch-linux:avanzada"], ["1-1", "2-5@avanzada-hardware-solo"])
  // Las filas viejas se descartan y la entrada no se muta.
  assert.equal(expandido.courses["arch-linux"], undefined)
  assert.deepEqual(profile.courses["arch-linux:facil"], ["fila-vieja"])
})

test("plegarProgresoCompartido une base y filas en un bucket deduplicado", () => {
  const expandido = expandirProgresoCompartido(
    {
      version: 1,
      alias: "",
      theme: "dark",
      legalAcceptedAt: null,
      courses: {
        "arch-linux": ["1-1", "1-1@facil-hardware-solo", "2-5@avanzada-hardware-solo", "3-1"],
      },
    },
    ["arch-linux"],
  )
  const plegado = plegarProgresoCompartido(expandido, ["arch-linux"])

  assert.deepEqual(plegado.courses["arch-linux"], [
    "1-1",
    "1-1@facil-hardware-solo",
    "3-1",
    "2-5@avanzada-hardware-solo",
  ])
  assert.equal(plegado.courses["arch-linux:facil"], undefined)
  assert.equal(plegado.courses["arch-linux:avanzada"], undefined)
})

test("expandir y plegar conservan el mismo conjunto de marcas", () => {
  const original = {
    version: 1,
    alias: "",
    theme: "dark",
    legalAcceptedAt: null,
    courses: {
      "arch-linux": [
        "1-1",
        "1-1@facil-hardware-solo",
        "2-5@avanzada-hardware-solo",
        "2-5@avanzada-hardware-dualboot",
        "3-1",
      ],
    },
  }
  const plegado = plegarProgresoCompartido(expandirProgresoCompartido(original, ["arch-linux"]), [
    "arch-linux",
  ])
  assert.deepEqual(
    [...plegado.courses["arch-linux"]].sort(),
    [...original.courses["arch-linux"]].sort(),
  )
})

test("cleanLessonSlug acepta un único @ y el slug de curso sigue estricto", () => {
  assert.equal(
    cleanLessonSlug("particionado-manual@avanzada-hardware-dualboot", 120),
    "particionado-manual@avanzada-hardware-dualboot",
  )
  assert.equal(cleanLessonSlug("1-1", 120), "1-1")
  for (const invalid of ["@ruta", "slug@", "a@b@c", "slug@../fuera", "a b@ruta"]) {
    assert.equal(cleanLessonSlug(invalid, 120), null, `ID rechazado: «${invalid}»`)
  }
  const profile = validateProfile({
    version: 1,
    courses: { "arch-linux": ["1-1", "2-5@avanzada-hardware-solo"] },
  })
  assert.equal(profile.ok, true)
  if (!profile.ok) return
  assert.deepEqual(profile.profile.courses["arch-linux"], ["1-1", "2-5@avanzada-hardware-solo"])
})
