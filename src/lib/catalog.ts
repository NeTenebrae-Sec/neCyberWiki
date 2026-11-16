// Catálogo derivado del contenido. Se ejecuta en build y no manda JavaScript
// al navegador. La disponibilidad de una categoría se calcula a partir de sus
// cursos publicados: nunca se declara a mano.
import { getCollection } from "astro:content"
import { CATEGORIAS, type CategoriaInfo } from "../data/categorias"
import { cursos, type CursoInfo } from "../data/cursos"
import { site } from "../data/site"
import {
  formatTotalMin,
  groupSyllabus,
  normalizeLesson,
  totalSyllabusMin,
  type ModuleGroup,
  type SyllabusLesson,
} from "./syllabus"

export type CursoPublicado = Omit<CursoInfo, "modulos"> & {
  lecciones: SyllabusLesson[]
  modulos: ModuleGroup[]
  totalMin: number
  duracion: string
  videos: number
  publicadoEn: Date | null
}

export interface CategoriaConContenido extends CategoriaInfo {
  cursos: CursoPublicado[]
  disponible: boolean
  totalLecciones: number
}

export async function getCursosPublicados(): Promise<CursoPublicado[]> {
  const entradas = await getCollection("cursos", ({ data }) => !data.draft)

  const publicados = cursos
    .map((info) => {
      const propias = entradas.filter((entrada) => entrada.data.curso === info.slug)
      const lecciones = propias
        .map((entrada) => normalizeLesson(entrada.id, entrada.data))
        .sort((a, b) => a.orden - b.orden)
      const modulos = groupSyllabus(lecciones).map((modulo) => {
        const declarado = info.modulos.find((item) => item.id === modulo.key)
        return {
          ...modulo,
          titulo: declarado?.titulo || modulo.titulo,
          objetivo: declarado?.objetivo || "",
        }
      })
      const totalMin = totalSyllabusMin(modulos)
      const fechas = propias
        .map((entrada) => entrada.data.date)
        .filter((fecha): fecha is Date => fecha instanceof Date)
      const publicadoEn = fechas.length
        ? new Date(Math.max(...fechas.map((fecha) => fecha.getTime())))
        : null

      return {
        ...info,
        lecciones,
        modulos,
        totalMin,
        duracion: formatTotalMin(totalMin),
        videos: propias.filter((entrada) => Boolean(entrada.data.video)).length,
        publicadoEn,
      }
    })
    .filter((curso) => curso.lecciones.length > 0)

  return publicados
    .map((curso, index) => ({ curso, index }))
    .sort((a, b) => {
      const fechaA = a.curso.publicadoEn?.getTime() ?? -1
      const fechaB = b.curso.publicadoEn?.getTime() ?? -1
      return fechaB - fechaA || a.index - b.index
    })
    .map(({ curso }) => curso)
}

export async function getCursoPublicado(slug: string): Promise<CursoPublicado | undefined> {
  const publicados = await getCursosPublicados()
  return publicados.find((curso) => curso.slug === slug)
}

export async function getCategoriasConContenido(): Promise<CategoriaConContenido[]> {
  const publicados = await getCursosPublicados()

  return CATEGORIAS.map((categoria) => {
    const propios = publicados.filter((curso) => curso.categoria === categoria.id)
    return {
      ...categoria,
      cursos: propios,
      disponible: propios.length > 0,
      totalLecciones: propios.reduce((total, curso) => total + curso.lecciones.length, 0),
    }
  })
}

export function cursoUrl(
  curso: Pick<CursoPublicado, "categoria" | "slug">,
  base = site.base,
): string {
  return `${base}cursos/${curso.categoria}/${curso.slug}/`
}

export function leccionUrl(
  curso: Pick<CursoPublicado, "categoria" | "slug">,
  leccion: Pick<SyllabusLesson, "slug">,
  base = site.base,
): string {
  return `${cursoUrl(curso, base)}${leccion.slug}/`
}

// Texto honesto para las fichas: si no hay videos, lo dice.
export function formatoCurso(curso: CursoPublicado): string {
  const unidad = curso.unidad === "nivel" ? "niveles" : "lecciones"
  if (curso.videos > 0) {
    return `${curso.lecciones.length} ${unidad} · ${curso.videos} de ${curso.lecciones.length} videos`
  }
  return `${curso.lecciones.length} ${unidad} · guía escrita`
}
