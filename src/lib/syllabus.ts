// Agrupación jerárquica del temario: Curso → Módulo → Submódulo → Lección.
// Función pura (FN-03): sin dependencias de UI ni de Node/Astro.
// La usan la página índice del curso y el sidebar de la lección.

export interface Capitulo {
  t: number // segundos desde el inicio del video
  titulo: string
}

export interface SyllabusLesson {
  slug: string // nombre del archivo sin extensión
  title: string
  orden: number
  duracion: string
  video: string
  modulo: string
  moduloTitulo: string
  submodulo: string // "" = la lección cuelga directo del módulo
  submoduloTitulo: string
  numero: string // Número visible ("1.1"); "" = derivar de `orden`
  variante: "comun" | "facil" | "avanzada"
  entorno: "ambos" | "hardware" | "vm"
  arranque: "ambos" | "solo" | "dualboot"
  prerrequisitos: string[] // IDs de lección ("1.1"), no slugs
  estado: "publicada" | "en-construccion"
  capitulos: Capitulo[]
}

export interface SubmoduleGroup {
  key: string // etiqueta `submodulo` o "__direct__" para las que no traen
  numero: string // etiqueta visible: "1.1" o derivada "{modulo}.{n}"
  titulo: string // `submodulo_titulo` o "Submódulo {numero}" / "General"
  lecciones: SyllabusLesson[]
}

export interface ModuleGroup {
  key: string // slug del módulo (frontmatter `modulo`)
  numero: number // 1-based según orden de aparición
  titulo: string // `modulo_titulo` o "Módulo {n}"
  objetivo?: string // Objetivo declarado en `src/data/cursos.ts`
  lecciones: SyllabusLesson[] // todas las del módulo (ordenadas)
  count: number
  totalMin: number // suma de minutos parseados de `duracion` ("" → 0)
  submodulos: SubmoduleGroup[] | null // null = ninguna lección define submódulo
}

// "8 min" → 8 · "1 h 20 min" → 80 · "" → 0
export function parseDuracionMin(duracion: string): number {
  if (!duracion) return 0
  const horas = /(\d+)\s*h/i.exec(duracion)?.[1]
  const mins = /(\d+)\s*min/i.exec(duracion)?.[1]
  if (horas || mins) {
    return (horas ? parseInt(horas, 10) * 60 : 0) + (mins ? parseInt(mins, 10) : 0)
  }
  const solo = /(\d+)/.exec(duracion)?.[1]
  return solo ? parseInt(solo, 10) : 0
}

// Normaliza una entrada de la colección `cursos` a SyllabusLesson.
// `id` es el id del glob loader, p. ej. "cursos/arch-linux-facil/01-...md".
export function normalizeLesson(
  id: string,
  data: {
    title: string
    orden: number
    duracion?: string
    video?: string
    modulo?: string
    modulo_titulo?: string
    submodulo?: string
    submodulo_titulo?: string
    numero?: string
    variante?: "comun" | "facil" | "avanzada"
    entorno?: "ambos" | "hardware" | "vm"
    arranque?: "ambos" | "solo" | "dualboot"
    prerrequisitos?: string[]
    estado?: "publicada" | "en-construccion"
    capitulos?: Capitulo[]
  },
): SyllabusLesson {
  return {
    slug: id.split("/").pop()!.replace(/\.md$/, ""),
    title: data.title,
    orden: data.orden,
    duracion: data.duracion ?? "",
    video: data.video ?? "",
    modulo: data.modulo || "general",
    moduloTitulo: data.modulo_titulo ?? "",
    submodulo: data.submodulo ?? "",
    submoduloTitulo: data.submodulo_titulo ?? "",
    numero: data.numero ?? "",
    variante: data.variante ?? "comun",
    entorno: data.entorno ?? "ambos",
    arranque: data.arranque ?? "ambos",
    prerrequisitos: Array.isArray(data.prerrequisitos) ? data.prerrequisitos : [],
    estado: data.estado ?? "publicada",
    capitulos: Array.isArray(data.capitulos) ? data.capitulos : [],
  }
}

export function groupSyllabus(lecciones: SyllabusLesson[]): ModuleGroup[] {
  const sorted = [...lecciones].sort((a, b) => a.orden - b.orden)
  const modules: ModuleGroup[] = []
  const byKey = new Map<string, ModuleGroup>()

  for (const l of sorted) {
    let mod = byKey.get(l.modulo)
    if (!mod) {
      const numero = modules.length + 1
      mod = {
        key: l.modulo,
        numero,
        titulo: l.moduloTitulo || `Módulo ${numero}`,
        lecciones: [],
        count: 0,
        totalMin: 0,
        submodulos: null,
      }
      byKey.set(l.modulo, mod)
      modules.push(mod)
    }
    if (mod.titulo === `Módulo ${mod.numero}` && l.moduloTitulo) {
      mod.titulo = l.moduloTitulo
    }
    mod.lecciones.push(l)
    mod.count += 1
    mod.totalMin += parseDuracionMin(l.duracion)
  }

  for (const mod of modules) {
    const hasSub = mod.lecciones.some((l) => l.submodulo)
    if (!hasSub) continue

    const groups: SubmoduleGroup[] = []
    const bySub = new Map<string, SubmoduleGroup>()

    for (const l of mod.lecciones) {
      const key = l.submodulo || "__direct__"
      let g = bySub.get(key)
      if (!g) {
        const idx = groups.length + 1
        const numero = l.submodulo || `${mod.numero}.${idx}`
        g = {
          key,
          numero,
          titulo: l.submoduloTitulo || (l.submodulo ? `Submódulo ${l.submodulo}` : "General"),
          lecciones: [],
        }
        bySub.set(key, g)
        groups.push(g)
      }
      if (l.submoduloTitulo && g.titulo === `Submódulo ${g.numero}`) {
        g.titulo = l.submoduloTitulo
      }
      g.lecciones.push(l)
    }
    mod.submodulos = groups
  }

  return modules
}

export function totalSyllabusMin(modules: ModuleGroup[]): number {
  return modules.reduce((acc, m) => acc + m.totalMin, 0)
}

// 75 → "75 min" · 125 → "2 h 05 min"
export function formatTotalMin(total: number): string {
  if (total <= 0) return ""
  if (total < 60) return `${total} min`
  const h = Math.floor(total / 60)
  const m = total % 60
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")} min`
}

// 75 → "01:15" (para capítulos)
export function formatCapituloTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds))
  const mm = Math.floor(s / 60)
  const ss = s % 60
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`
}
