// Datos derivados del catálogo. La fuente de verdad son las colecciones de
// contenido (`cursos`, `notas`) y los manifiestos de `src/data/`.
// Este módulo se ejecuta en build; no manda JavaScript al navegador.
import { getCollection } from "astro:content"
import { CATEGORIAS, type CategoriaModulo } from "../data/categorias"
import { cursos, type CursoInfo } from "../data/cursos"
import { SERIES, type SerieInfo } from "../data/series"
import {
  formatTotalMin,
  groupSyllabus,
  normalizeLesson,
  totalSyllabusMin,
  type ModuleGroup,
  type SyllabusLesson,
} from "./syllabus"

export interface CursoPublicado extends CursoInfo {
  lecciones: SyllabusLesson[]
  modulos: ModuleGroup[]
  totalMin: number
  duracion: string
  videos: number
  publicadoEn: Date | null
}

export interface SerieConNotas extends SerieInfo {
  notas: number
}

export interface CategoriaConContenido extends CategoriaModulo {
  cursos: CursoPublicado[]
  series: SerieConNotas[]
  notas: number
}

export async function getCursosPublicados(): Promise<CursoPublicado[]> {
  const entradas = await getCollection("cursos", ({ data }) => !data.draft)

  const publicados = cursos
    .map((info) => {
      const propias = entradas.filter((entrada) => entrada.data.curso === info.slug)
      const lecciones = propias
        .map((entrada) => normalizeLesson(entrada.id, entrada.data))
        .sort((a, b) => a.orden - b.orden)
      const modulos = groupSyllabus(lecciones)
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

export async function getSeriesConNotas(): Promise<SerieConNotas[]> {
  const notas = await getCollection("notas", ({ data }) => !data.draft)

  return SERIES.map((serie) => ({
    ...serie,
    notas: notas.filter((nota) => nota.data.serie === serie.slug).length,
  }))
}

export async function getCategoriasConContenido(): Promise<CategoriaConContenido[]> {
  const [cursosPublicados, notas] = await Promise.all([
    getCursosPublicados(),
    getCollection("notas", ({ data }) => !data.draft),
  ])

  const series = SERIES.map((serie) => ({
    ...serie,
    notas: notas.filter((nota) => nota.data.serie === serie.slug).length,
  }))

  return CATEGORIAS.map((categoria) => ({
    ...categoria,
    cursos: cursosPublicados.filter((curso) => curso.categoria === categoria.id),
    series: series.filter((serie) => serie.categoria === categoria.id),
    notas: notas.filter((nota) => nota.data.module === categoria.id).length,
  }))
}

// Texto de formato para las fichas de curso. No presenta videos que aún no
// existen: si `videos` es 0, la ficha dice explícitamente "guía escrita".
export function formatoCurso(curso: CursoPublicado): string {
  if (curso.videos > 0) {
    return `${curso.lecciones.length} lecciones · ${curso.videos} de ${curso.lecciones.length} videos`
  }
  return `${curso.lecciones.length} lecciones · guía escrita`
}
