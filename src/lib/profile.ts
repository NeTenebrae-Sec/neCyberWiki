// Lógica pura del perfil local. No toca `window` ni `document`: recibe un
// almacenamiento compatible con localStorage para poder testearse en Node.
// El perfil nunca sale del navegador salvo que el lector exporte el JSON.

export const PROFILE_VERSION = 1
export const PROFILE_NAME_KEY = "ncw:profile:name"
export const LEGAL_KEY = "ncw:legal:v1"
export const THEME_KEY = "ncw-theme"
export const PROGRESS_PREFIX = "ncw:progress:"

export type Theme = "dark" | "light"

export interface StorageLike {
  readonly length: number
  key(index: number): string | null
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export interface ProfileData {
  version: typeof PROFILE_VERSION
  alias: string
  theme: Theme
  legalAcceptedAt: string | null
  courses: Record<string, string[]>
}

export type ProfileParseResult = { ok: true; profile: ProfileData } | { ok: false; error: string }

const MAX_ALIAS = 40
const MAX_COURSE_SLUG = 80
const MAX_LESSON_SLUG = 120
const MAX_COURSES = 60
const MAX_LESSONS_PER_COURSE = 300

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

const isTheme = (value: unknown): value is Theme => value === "dark" || value === "light"

const cleanAlias = (value: unknown): string =>
  typeof value === "string" ? value.trim().slice(0, MAX_ALIAS) : ""

const cleanSlug = (value: unknown, maxLength: number): string | null => {
  if (typeof value !== "string") return null
  const slug = value.trim()
  if (!slug || slug.length > maxLength) return null
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(slug)) return null
  return slug
}

const cleanDate = (value: unknown): string | null => {
  if (typeof value !== "string" || !value.trim()) return null
  const time = Date.parse(value)
  return Number.isFinite(time) ? new Date(time).toISOString() : null
}

const uniqueLessons = (value: unknown): string[] | null => {
  if (!Array.isArray(value)) return null
  const lessons: string[] = []
  for (const item of value) {
    const slug = cleanSlug(item, MAX_LESSON_SLUG)
    if (!slug) return null
    if (!lessons.includes(slug)) lessons.push(slug)
    if (lessons.length > MAX_LESSONS_PER_COURSE) return null
  }
  return lessons
}

const readLessons = (storage: StorageLike, course: string): string[] => {
  try {
    const raw = storage.getItem(`${PROGRESS_PREFIX}${course}`)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const lessons: string[] = []
    for (const item of parsed) {
      const slug = cleanSlug(item, MAX_LESSON_SLUG)
      if (slug && !lessons.includes(slug)) lessons.push(slug)
    }
    return lessons
  } catch {
    return []
  }
}

const storageKeys = (storage: StorageLike): string[] => {
  const keys: string[] = []
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index)
    if (key) keys.push(key)
  }
  return keys
}

export function emptyProfile(): ProfileData {
  return {
    version: PROFILE_VERSION,
    alias: "",
    theme: "dark",
    legalAcceptedAt: null,
    courses: {},
  }
}

// Reúne lo que hay guardado. `courseSlugs` añade cursos sin progreso para que
// el JSON exportado documente también los cursos vacíos.
export function collectProfile(storage: StorageLike, courseSlugs: string[] = []): ProfileData {
  const courses: Record<string, string[]> = {}
  const candidates = new Set<string>()

  for (const key of storageKeys(storage)) {
    if (key.startsWith(PROGRESS_PREFIX)) {
      candidates.add(key.slice(PROGRESS_PREFIX.length))
    }
  }
  for (const slug of courseSlugs) {
    const clean = cleanSlug(slug, MAX_COURSE_SLUG)
    if (clean) candidates.add(clean)
  }

  for (const course of [...candidates].sort()) {
    const lessons = readLessons(storage, course)
    if (lessons.length) courses[course] = lessons
  }

  let theme: Theme = "dark"
  try {
    const stored = storage.getItem(THEME_KEY)
    if (isTheme(stored)) theme = stored
  } catch {}

  let alias = ""
  let legalAcceptedAt: string | null = null
  try {
    alias = cleanAlias(storage.getItem(PROFILE_NAME_KEY))
    legalAcceptedAt = cleanDate(storage.getItem(LEGAL_KEY))
  } catch {}

  return { version: PROFILE_VERSION, alias, theme, legalAcceptedAt, courses }
}

export function serializeProfile(profile: ProfileData): string {
  return `${JSON.stringify(profile, null, 2)}\n`
}

export function parseProfile(raw: string): ProfileParseResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { ok: false, error: "El archivo no contiene JSON válido." }
  }
  return validateProfile(parsed)
}

export function validateProfile(value: unknown): ProfileParseResult {
  if (!isRecord(value)) {
    return { ok: false, error: "El perfil debe ser un objeto JSON." }
  }
  if (value.version !== PROFILE_VERSION) {
    return { ok: false, error: "La versión del perfil no es compatible." }
  }

  if (value.alias !== undefined && typeof value.alias !== "string") {
    return { ok: false, error: "El alias debe ser texto." }
  }
  if (value.theme !== undefined && !isTheme(value.theme)) {
    return { ok: false, error: "El tema debe ser «dark» o «light»." }
  }
  if (
    value.legalAcceptedAt !== undefined &&
    value.legalAcceptedAt !== null &&
    typeof value.legalAcceptedAt !== "string"
  ) {
    return { ok: false, error: "La fecha de aceptación no es válida." }
  }
  if (value.courses !== undefined && !isRecord(value.courses)) {
    return { ok: false, error: "El progreso debe ser un objeto de cursos." }
  }

  const rawCourses = isRecord(value.courses) ? value.courses : {}
  if (Object.keys(rawCourses).length > MAX_COURSES) {
    return { ok: false, error: "El perfil contiene demasiados cursos." }
  }

  const courses: Record<string, string[]> = {}
  for (const [rawCourse, rawLessons] of Object.entries(rawCourses)) {
    const course = cleanSlug(rawCourse, MAX_COURSE_SLUG)
    if (!course) return { ok: false, error: `El curso «${rawCourse}» no es válido.` }
    const lessons = uniqueLessons(rawLessons)
    if (!lessons) {
      return { ok: false, error: `El progreso de «${rawCourse}» no es una lista válida.` }
    }
    if (lessons.length) courses[course] = lessons
  }

  return {
    ok: true,
    profile: {
      version: PROFILE_VERSION,
      alias: cleanAlias(value.alias),
      theme: isTheme(value.theme) ? value.theme : "dark",
      legalAcceptedAt: cleanDate(value.legalAcceptedAt),
      courses,
    },
  }
}

// Reemplaza por completo el estado local relacionado con el perfil. Los
// módulos abiertos del temario son estado de interfaz y no se importan.
export function applyProfile(storage: StorageLike, profile: ProfileData): void {
  for (const key of storageKeys(storage)) {
    if (key.startsWith(PROGRESS_PREFIX)) storage.removeItem(key)
  }

  for (const [course, lessons] of Object.entries(profile.courses)) {
    if (lessons.length) {
      storage.setItem(`${PROGRESS_PREFIX}${course}`, JSON.stringify(lessons))
    }
  }

  if (profile.alias) storage.setItem(PROFILE_NAME_KEY, profile.alias)
  else storage.removeItem(PROFILE_NAME_KEY)

  storage.setItem(THEME_KEY, profile.theme)

  if (profile.legalAcceptedAt) storage.setItem(LEGAL_KEY, profile.legalAcceptedAt)
  else storage.removeItem(LEGAL_KEY)
}

export function clearProfile(storage: StorageLike): string[] {
  const removed = storageKeys(storage)
    .filter((key) => key === THEME_KEY || key.startsWith("ncw:"))
    .sort()

  for (const key of removed) storage.removeItem(key)
  return removed
}

export function totalLessons(profile: ProfileData): number {
  return Object.values(profile.courses).reduce((total, lessons) => total + lessons.length, 0)
}
