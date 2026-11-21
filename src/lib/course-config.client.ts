// Configurador de curso adaptable: lee query > localStorage > default,
// pinta el estado, filtra/reordena el temario y emite `ncw:course-config`.
// La lectura de marcas por módulo usa la clave por dificultad cuando el curso
// tiene rutas (T5); sin rutas (Bandit), la clave plana.
import {
  buscarRuta,
  combinarConfig,
  leccionEnRuta,
  normalizarConfig,
  numerosVisiblesPorRuta,
  ordenarPorRuta,
  progresoKey,
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

// Copy aprobado de la ficha adaptable (T8c). «Qué necesitas» depende de
// entorno/arranque; «Qué vas a saber», de la dificultad.
export interface FichaRuta {
  necesitas: string[]
  sabes: string[]
}

const NECESITAS_SOLO = [
  "PC con 4 GB RAM",
  "20 GB de espacio libres",
  "Memoria USB 2 GB+",
  "Internet",
] as const

const NECESITAS_DUALBOOT = "Windows en UEFI/GPT y clave BitLocker"

const NECESITAS_VM = ["Una VM con 4 GB RAM", "20 GB de espacio libres", "Internet"] as const

const SABES_FACIL = [
  "La filosofía KISS",
  "Instalar Arch Linux usando archinstall",
  "Qué es un Desktop Environment",
  "Introducción a los dotfiles",
  "Qué son pacman y la AUR",
  "Configurar la swap",
  "Configurar el firewall.",
] as const

const SABES_AVANZADA = [
  "Particionar a mano y bootear manualmente",
  "mkinitcpio/systemd-boot",
  "Instalar un WM",
  "Configuración de dotfiles",
  "Troubleshooting",
] as const

export const REGLA_DE_CAMPO =
  "Nada de esto toca sistemas ajenos: practica en tu VM, tu hardware o el laboratorio autorizado."

export function fichaDeRuta(config: Partial<CursoConfig> = {}): FichaRuta {
  const { dificultad, entorno, arranque } = normalizarConfig(config)
  const necesitas =
    entorno === "vm"
      ? [...NECESITAS_VM]
      : [...NECESITAS_SOLO, ...(arranque === "dualboot" ? [NECESITAS_DUALBOOT] : [])]

  return {
    necesitas,
    sabes: [...(dificultad === "avanzada" ? SABES_AVANZADA : SABES_FACIL)],
  }
}

export function formatoDeRuta(totalRuta: number, totalCurso: number): string {
  return `${totalRuta} clases en tu ruta · ${totalCurso} en total · Guía escrita; video en preparación.`
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

const configDesdeLayers = (slug: string, search: string): CursoConfig =>
  normalizarConfig(combinarConfig(storageLayer(slug), queryLayer(search)))

// Al volver de VM a hardware, recupera el último arranque no-VM guardado.
const arranqueAlRestaurarHardware = (slug: string): CursoConfig["arranque"] => {
  const guardado = leerClave(almacenamiento(), `ncw:boot:${slug}`)
  return normalizarConfig({ entorno: "hardware", arranque: guardado as CursoConfig["arranque"] })
    .arranque
}

// Candado: en la lección (root con data-lesson-numero), las opciones del
// configurador cuya ruta excluiría la clase actual quedan deshabilitadas.
// Candidato = config vigente con ese eje pisado por el valor del radio,
// normalizado (VM fuerza arranque "solo"); si la ruta resultante no incluye
// el número de lección, la opción no es elegible. Se re-aplica en cada
// repintado (cada toggle), así la atenuación sigue a la config vigente.
function bloquearFueraDeRuta(
  root: HTMLElement,
  config: CursoConfig,
  rutas: CursoRuta[],
  numero: string,
): void {
  for (const eje of ["dificultad", "entorno", "arranque"] as const) {
    for (const input of root.querySelectorAll<HTMLInputElement>(`input[name$="-${eje}"][value]`)) {
      const capa: Record<string, string> = { ...config }
      capa[eje] = input.value
      const candidate = normalizarConfig(capa as Partial<CursoConfig>)
      const ruta = rutas.length ? buscarRuta(rutas, candidate) : undefined
      const habilitado = Boolean(ruta && ruta.lecciones.includes(numero))
      const label = input.closest(".config-option")
      if (habilitado) {
        input.disabled = false
        label?.classList.remove("is-locked")
        label?.removeAttribute("title")
        label?.removeAttribute("aria-disabled")
      } else {
        input.disabled = true
        label?.classList.add("is-locked")
        label?.setAttribute("title", "Esta clase no está en esa ruta")
        label?.setAttribute("aria-disabled", "true")
      }
    }
  }
}

function pintarConfigurador(root: HTMLElement, config: CursoConfig, rutas: CursoRuta[]): void {
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
  const diffBadge = root.querySelector<HTMLElement>("[data-diff-badge]")
  if (diffBadge)
    diffBadge.textContent =
      DIFICULTAD_LABEL[config.dificultad]?.toUpperCase() ?? config.dificultad.toUpperCase()
  const numero = root.getAttribute("data-lesson-numero")
  if (numero !== null) bloquearFueraDeRuta(root, config, rutas, numero)
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
  tieneRutas: boolean,
): string[] {
  const visiblesSlug: string[] = []
  const claveProgreso = tieneRutas ? progresoKey(slug, config.dificultad) : progresoKey(slug)
  const numerosVisibles = numerosVisiblesPorRuta(ruta)

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
      const parseado = JSON.parse(window.localStorage.getItem(claveProgreso) || "[]")
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
      const visibleNumber = numerosVisibles[item.numero] || item.numero
      item.el.setAttribute("data-numero-visible", visibleNumber)
      const numberEl = item.el.querySelector<HTMLElement>(".sy-lesson__num")
      if (numberEl) numberEl.textContent = visibleNumber
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
  for (const totalEl of doc.querySelectorAll<HTMLElement>("[data-config-total-lessons]")) {
    totalEl.textContent = `${total} ${totalEl.getAttribute("data-unidad") ?? "lecciones"}`
  }
  for (const badge of doc.querySelectorAll<HTMLElement>("[data-ficha-route-badge]")) {
    badge.textContent =
      `${ENTORNO_LABEL[config.entorno]} · ${ARRANQUE_LABEL[config.arranque]}`.toUpperCase()
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

export function limpiarEstadoPendiente(doc: Document): void {
  doc.documentElement.classList.remove("ncw-route-pending")
  doc.querySelectorAll(".sy-lessons--route-skeleton").forEach((skeleton) => skeleton.remove())
}

export function initCourseConfig(
  onChange?: (state: CourseConfigState) => void,
): CourseConfigState[] {
  if (typeof document === "undefined") return []
  const states: CourseConfigState[] = []

  const allRoots = [...document.querySelectorAll<HTMLElement>("[data-course-config]")]
  const slugs = [
    ...new Set(allRoots.map((el) => el.getAttribute("data-slug") || "").filter(Boolean)),
  ]

  for (const slug of slugs) {
    const roots = allRoots.filter((el) => el.getAttribute("data-slug") === slug)
    if (roots.length === 0) continue

    let rutas: CursoRuta[] = []
    for (const r of roots) {
      try {
        const raw = r.getAttribute("data-rutas")
        if (raw) {
          rutas = JSON.parse(raw)
          if (rutas.length) break
        }
      } catch {}
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
        for (const root of roots) {
          pintarConfigurador(root, config, rutas)
        }
        for (const b of document.querySelectorAll<HTMLElement>("[data-diff-badge]")) {
          b.textContent =
            DIFICULTAD_LABEL[config.dificultad]?.toUpperCase() ?? config.dificultad.toUpperCase()
        }
        const visibles = aplicarAlTemario(document, slug, ruta, config, rutas.length > 0)
        const state: CourseConfigState = { slug, config, ruta, visibles }
        emitir(document, state)
        onChange?.(state)
        return state
      } finally {
        // Eliminar el estado pending y los placeholders del DOM, aunque el
        // repintado encuentre datos parciales o falle una sección secundaria.
        limpiarEstadoPendiente(document)
      }
    }

    for (const root of roots) {
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

        const eje = radio.name.endsWith("-dificultad")
          ? "dificultad"
          : radio.name.endsWith("-entorno")
            ? "entorno"
            : "arranque"
        const capa: Record<string, string> = { ...previa }
        capa[eje] = radio.value

        const cambioEntorno = eje === "entorno"
        if (cambioEntorno && radio.value === "hardware" && previa?.entorno === "vm") {
          capa.arranque = arranqueAlRestaurarHardware(slug)
        }
        persistirConfig(slug, normalizarConfig(capa as Partial<CursoConfig>))
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
    }

    states.push(aplicar())
  }

  return states
}
