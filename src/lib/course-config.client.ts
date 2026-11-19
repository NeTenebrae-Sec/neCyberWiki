// Configurador de curso adaptable: lee query > localStorage > default,
// pinta el estado, filtra/reordena el temario y emite `ncw:course-config`.
// No toca el progreso guardado: la clave actual `ncw:progress:${slug}` se
// lee solo para pintar contadores; T5 migra la clave.
import {
  buscarRuta,
  combinarConfig,
  leccionEnRuta,
  normalizarConfig,
  ordenarPorRuta,
  type CursoConfig,
  type CursoRuta,
} from "./tracks.ts"

const COURSE_CONFIG_EVENT = "ncw:course-config"
// Evento por el que la página pide aplicar una config completa (CTA «Verla en la
// ruta que sí la incluye»). No es la interacción de los radios: no restaura el
// arranque guardado, la config mandada es la elegida.
export const SET_CONFIG_EVENT = "ncw:course-config:set"

export interface CourseConfigState {
  slug: string
  config: CursoConfig
  ruta?: CursoRuta
  visibles: string[] // slugs de las lecciones de la ruta, en su orden
}

const DIFICULTAD_LABEL: Record<string, string> = { facil: "Fácil", avanzada: "Avanzada" }
const ENTORNO_LABEL: Record<string, string> = { vm: "VM", hardware: "Hardware" }
const ARRANQUE_LABEL: Record<string, string> = { solo: "Solo Linux", dualboot: "Dual boot" }

export function resumirConfig(config: CursoConfig): string {
  return [
    DIFICULTAD_LABEL[config.dificultad],
    ENTORNO_LABEL[config.entorno],
    ARRANQUE_LABEL[config.arranque],
  ].join(" · ")
}

// Primera ruta que contiene `numero` (p. ej. "1.6"), prefiriendo la de la misma
// dificultad que `preferencia`. `undefined` si ninguna ruta la incluye.
export function primeraRutaConLeccion(
  rutas: CursoRuta[],
  numero: string,
  preferencia: Partial<CursoConfig> = {},
): CursoRuta | undefined {
  const candidatas = rutas.filter((ruta) => ruta.lecciones.includes(numero))
  if (candidatas.length === 0) return undefined
  const dificultad = normalizarConfig(preferencia).dificultad
  return candidatas.find((ruta) => ruta.dificultad === dificultad) ?? candidatas[0]
}

const almacenamiento = (): Storage | null => {
  try {
    return typeof window !== "undefined" ? window.localStorage : null
  } catch {
    return null
  }
}

const leerClave = (store: Storage | null, clave: string): string | undefined => {
  try {
    return store?.getItem(clave) ?? undefined
  } catch {
    return undefined
  }
}

const escribirClave = (store: Storage | null, clave: string, valor: string): void => {
  try {
    store?.setItem(clave, valor)
  } catch {}
}

// Persiste la config efectiva. VM nunca pisa el último arranque guardado.
const persistirConfig = (slug: string, config: CursoConfig): void => {
  const store = almacenamiento()
  escribirClave(store, `ncw:difficulty:${slug}`, config.dificultad)
  escribirClave(store, `ncw:environment:${slug}`, config.entorno)
  if (config.entorno !== "vm") {
    escribirClave(store, `ncw:boot:${slug}`, config.arranque)
  }
}

const queryLayer = (search: string): Partial<CursoConfig> => {
  const params = new URLSearchParams(search)
  const capa: Record<string, string> = {}
  for (const clave of ["dificultad", "entorno", "arranque"] as const) {
    const valor = params.get(clave)
    if (valor !== null) capa[clave] = valor
  }
  return capa as Partial<CursoConfig>
}

const storageLayer = (slug: string): Partial<CursoConfig> => {
  const store = almacenamiento()
  const capa: Record<string, string> = {}
  const dificultad = leerClave(store, `ncw:difficulty:${slug}`)
  const entorno = leerClave(store, `ncw:environment:${slug}`)
  const arranque = leerClave(store, `ncw:boot:${slug}`)
  if (dificultad !== undefined) capa.dificultad = dificultad
  if (entorno !== undefined) capa.entorno = entorno
  if (arranque !== undefined) capa.arranque = arranque
  return capa as Partial<CursoConfig>
}

// Estado marcado en los radios del configurador (valores crudos).
const configDesdeRadios = (root: HTMLElement): Partial<CursoConfig> => {
  const marcado = (eje: string) =>
    root.querySelector<HTMLInputElement>(`input[name$="-${eje}"]:checked`)?.value
  const capa: Record<string, string> = {}
  for (const eje of ["dificultad", "entorno", "arranque"]) {
    const valor = marcado(eje)
    if (valor !== undefined) capa[eje] = valor
  }
  return capa as Partial<CursoConfig>
}

const configDesdeLayers = (slug: string, search: string): CursoConfig =>
  normalizarConfig(combinarConfig(storageLayer(slug), queryLayer(search)))

// Al volver de VM a hardware, recupera el último arranque no-VM guardado.
const arranqueAlRestaurarHardware = (slug: string): CursoConfig["arranque"] => {
  const guardado = leerClave(almacenamiento(), `ncw:boot:${slug}`)
  return normalizarConfig({ entorno: "hardware", arranque: guardado as CursoConfig["arranque"] })
    .arranque
}

function pintarConfigurador(root: HTMLElement, config: CursoConfig): void {
  root.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach((radio) => {
    const eje = radio.name.endsWith("-dificultad")
      ? "dificultad"
      : radio.name.endsWith("-entorno")
        ? "entorno"
        : "arranque"
    radio.checked = radio.value === config[eje]
  })
  const boot = root.querySelector<HTMLElement>("[data-config-boot]")
  if (boot) boot.hidden = config.entorno === "vm"
  const resumen = root.querySelector<HTMLElement>("[data-config-summary]")
  if (resumen) resumen.textContent = resumirConfig(config)
}

interface LessonItem {
  el: HTMLElement
  slug: string
  numero: string
  variante: string
  entorno: string
  arranque: string
}

const rutaVisible = (
  item: LessonItem,
  ruta: CursoRuta | undefined,
  config: CursoConfig,
): boolean => (ruta ? ruta.lecciones.includes(item.numero) : leccionEnRuta(item, config))

function aplicarAlTemario(
  doc: Document,
  slug: string,
  ruta: CursoRuta | undefined,
  config: CursoConfig,
): string[] {
  const visiblesSlug: string[] = []

  for (const mod of doc.querySelectorAll<HTMLElement>("[data-syllabus] details[data-module-key]")) {
    const items: LessonItem[] = [...mod.querySelectorAll<HTMLElement>("[data-lesson-item]")].map(
      (el) => ({
        el,
        slug: el.getAttribute("data-lesson-item") ?? "",
        numero: el.getAttribute("data-numero") ?? "",
        variante: el.getAttribute("data-variante") ?? "comun",
        entorno: el.getAttribute("data-entorno") ?? "ambos",
        arranque: el.getAttribute("data-arranque") ?? "ambos",
      }),
    )

    let visibles = 0
    let done = 0
    let progreso: string[]
    try {
      const parseado = JSON.parse(window.localStorage.getItem(`ncw:progress:${slug}`) || "[]")
      progreso = Array.isArray(parseado) ? parseado : []
    } catch {
      progreso = []
    }

    for (const item of items) {
      const visible = rutaVisible(item, ruta, config)
      item.el.hidden = !visible
      if (visible) {
        visibles += 1
        if (progreso.includes(item.slug)) done += 1
        visiblesSlug.push(item.slug)
      }
    }

    // Reordenar las listas planas según la ruta (no toca submódulos).
    if (ruta) {
      const posicion = new Map(ruta.lecciones.map((id, i) => [id, i]))
      for (const lista of mod.querySelectorAll<HTMLElement>("ol.sy-lessons")) {
        const liVisibles = [...lista.querySelectorAll<HTMLElement>("li[data-lesson-item]")]
          .filter((li) => !li.hidden)
          .sort(
            (a, b) =>
              (posicion.get(a.getAttribute("data-numero") ?? "") ?? Infinity) -
              (posicion.get(b.getAttribute("data-numero") ?? "") ?? Infinity),
          )
        for (const li of liVisibles) lista.appendChild(li)
      }
    }

    mod.hidden = visibles === 0
    const countLabel = mod.querySelector<HTMLElement>("[data-module-count-label]")
    if (countLabel) countLabel.textContent = `${visibles} lecciones`
    const doneEl = mod.querySelector<HTMLElement>("[data-module-done]")
    if (doneEl) doneEl.textContent = `${done}/${visibles}`
    const fill = mod.querySelector<HTMLElement>("[data-module-fill]")
    if (fill) fill.style.width = visibles ? `${Math.round((done / visibles) * 100)}%` : "0%"
  }

  // Orden global de slugs visibles según la ruta.
  const porRuta = ruta
    ? ordenarPorRuta(
        visiblesSlug.map((slug) => ({ slug, numero: numeroDeSlug(doc, slug) })),
        ruta,
      ).map((l) => l.slug)
    : visiblesSlug

  const total = porRuta.length
  const modulosVisibles = doc.querySelectorAll<HTMLElement>(
    "[data-syllabus] details[data-module-key]:not([hidden])",
  ).length

  for (const totalEl of doc.querySelectorAll<HTMLElement>("[data-course-total]")) {
    totalEl.textContent = `${total} ${totalEl.getAttribute("data-unidad") ?? "lecciones"}`
  }
  for (const modulesEl of doc.querySelectorAll<HTMLElement>("[data-course-modules]")) {
    modulesEl.textContent = `${modulosVisibles} ${modulesEl.getAttribute("data-unidad") ?? "módulos"}`
  }
  for (const routeEl of doc.querySelectorAll<HTMLElement>("[data-course-route]")) {
    routeEl.textContent = `Ruta: ${resumirConfig(config)}`
  }
  for (const asideEl of doc.querySelectorAll<HTMLElement>("[data-course-aside-total]")) {
    asideEl.textContent = `${total} ${asideEl.getAttribute("data-unidad") ?? "lecciones"} en tu ruta`
  }
  // Hooks de la página de lección: número desnudo (el texto de alrededor lo pone el HTML).
  for (const totalEl of doc.querySelectorAll<HTMLElement>("[data-lesson-total]")) {
    totalEl.textContent = String(total)
  }
  for (const modulesEl of doc.querySelectorAll<HTMLElement>("[data-lesson-modules]")) {
    modulesEl.textContent = `${modulosVisibles} módulos`
  }

  return porRuta
}

const numeroDeSlug = (doc: Document, slug: string): string =>
  doc.querySelector(`[data-lesson-item="${slug}"]`)?.getAttribute("data-numero") ?? ""

function emitir(doc: Document, state: CourseConfigState): void {
  doc.dispatchEvent(new CustomEvent(COURSE_CONFIG_EVENT, { detail: state }))
}

export function initCourseConfig(
  onChange?: (state: CourseConfigState) => void,
): CourseConfigState[] {
  if (typeof document === "undefined") return []
  const states: CourseConfigState[] = []

  for (const root of document.querySelectorAll<HTMLElement>("[data-course-config]")) {
    const slug = root.getAttribute("data-slug") ?? ""
    if (!slug) continue

    let rutas: CursoRuta[] = []
    try {
      rutas = JSON.parse(root.getAttribute("data-rutas") ?? "[]")
    } catch {
      rutas = []
    }

    const search = window.location.search
    // Query válida gana y se persiste.
    persistirConfig(slug, configDesdeLayers(slug, search))

    let previa: CursoConfig | undefined
    // Config forzada por un evento externo (CTA «Verla en la ruta…»). Gana a
    // storage y query hasta la siguiente interacción con los radios.
    let forzada: CursoConfig | undefined

    const aplicar = (): CourseConfigState => {
      try {
        const config = forzada ?? configDesdeLayers(slug, window.location.search)
        previa = config
        const ruta = rutas.length ? buscarRuta(rutas, config) : undefined
        pintarConfigurador(root, config)
        const visibles = aplicarAlTemario(document, slug, ruta, config)
        const state: CourseConfigState = { slug, config, ruta, visibles }
        emitir(document, state)
        onChange?.(state)
        return state
      } finally {
        // Retira la clase anti-parpadeo aunque falle el repintado; si no
        // estaba (config por defecto o sin JS previo), es un no-op.
        if (typeof document !== "undefined") {
          document.documentElement.classList.remove("ncw-route-pending")
        }
      }
    }

    root.addEventListener("change", (evento) => {
      const radio = evento.target as HTMLInputElement
      if (radio?.type !== "radio") return
      // Interacción del usuario: la query (deep link) deja de mandar para que
      // el clic tenga efecto; la preferencia queda en localStorage.
      forzada = undefined
      try {
        const url = new URL(window.location.href)
        for (const clave of ["dificultad", "entorno", "arranque"]) url.searchParams.delete(clave)
        window.history.replaceState(window.history.state, "", url)
      } catch {}
      // Restaurar el último arranque solo al salir de VM hacia hardware;
      // los demás cambios respetan lo que marcó el lector.
      const capa = configDesdeRadios(root)
      const cambioEntorno = (evento.target as HTMLInputElement)?.name?.endsWith("-entorno")
      if (cambioEntorno && capa.entorno === "hardware" && previa?.entorno === "vm") {
        capa.arranque = arranqueAlRestaurarHardware(slug)
      }
      persistirConfig(slug, normalizarConfig(capa))
      aplicar()
    })

    // CTA externo (página de lección): aplica la config indicada tal cual, sin
    // la restauración de arranque del listener de `change`.
    root.addEventListener(SET_CONFIG_EVENT, (evento) => {
      const detalle = (evento as CustomEvent<Partial<CursoConfig>>).detail ?? {}
      forzada = normalizarConfig(detalle)
      // La elección explícita pisa la query (deep link).
      try {
        const url = new URL(window.location.href)
        for (const clave of ["dificultad", "entorno", "arranque"]) url.searchParams.delete(clave)
        window.history.replaceState(window.history.state, "", url)
      } catch {}
      persistirConfig(slug, forzada)
      aplicar()
    })

    states.push(aplicar())
  }

  return states
}
