// Series de notas. Cada serie agrupa notas de una misma plataforma o temática
// y se asocia a una categoría del catálogo.
import type { CategoriaModulo } from "./categorias"

export interface SerieInfo {
  slug: string
  titulo: string
  descripcion: string
  categoria: CategoriaModulo["id"]
  plataforma: string
  url: string
  nivel: string
}

export const SERIES: SerieInfo[] = [
  {
    slug: "bandit",
    titulo: "OverTheWire Bandit",
    descripcion:
      "Diecinueve niveles para aprender la terminal de Linux y SSH desde cero, en un entorno legal y controlado. Cada nota documenta el objetivo, los comandos y la solución paso a paso.",
    categoria: "sistemas-y-redes",
    plataforma: "OverTheWire",
    url: "https://overthewire.org/wargames/bandit/",
    nivel: "Principiante",
  },
]

export function getSerie(slug: string): SerieInfo | undefined {
  return SERIES.find((serie) => serie.slug === slug)
}
