// Rutas adaptables: cada ruta combina dificultad, entorno y arranque, y declara
// los IDs de lección en su orden. Funciones puras (FN-03): sin Astro ni Node.

export const DIFICULTADES = ["facil", "avanzada"] as const
export const ENTORNOS = ["vm", "hardware"] as const
export const ARRANQUES = ["solo", "dualboot"] as const

export type Dificultad = (typeof DIFICULTADES)[number]
export type Entorno = (typeof ENTORNOS)[number]
export type Arranque = (typeof ARRANQUES)[number]

export interface CursoConfig {
  dificultad: Dificultad
  entorno: Entorno
  arranque: Arranque
}

export interface CursoRuta extends CursoConfig {
  lecciones: string[] // IDs de lección ("1.1") en el orden de la ruta.
}

export const CONFIG_POR_DEFECTO: CursoConfig = {
  dificultad: "facil",
  entorno: "hardware",
  arranque: "solo",
}

const esDificultad = (valor: unknown): valor is Dificultad =>
  DIFICULTADES.includes(valor as Dificultad)

const esEntorno = (valor: unknown): valor is Entorno => ENTORNOS.includes(valor as Entorno)

const esArranque = (valor: unknown): valor is Arranque => ARRANQUES.includes(valor as Arranque)

// Config segura: los valores desconocidos caen al default y VM solo admite "solo".
export function normalizarConfig(config: Partial<CursoConfig> = {}): CursoConfig {
  const dificultad = esDificultad(config.dificultad)
    ? config.dificultad
    : CONFIG_POR_DEFECTO.dificultad
  const entorno = esEntorno(config.entorno) ? config.entorno : CONFIG_POR_DEFECTO.entorno
  const arranque = esArranque(config.arranque) ? config.arranque : CONFIG_POR_DEFECTO.arranque

  return {
    dificultad,
    entorno,
    arranque: entorno === "vm" ? "solo" : arranque,
  }
}

export function rutaKey(config: Partial<CursoConfig> = {}): string {
  const normalizada = normalizarConfig(config)
  return `${normalizada.dificultad}-${normalizada.entorno}-${normalizada.arranque}`
}

export function buscarRuta(
  rutas: CursoRuta[],
  config: Partial<CursoConfig> = {},
): CursoRuta | undefined {
  const key = rutaKey(config)
  return rutas.find((ruta) => rutaKey(ruta) === key)
}

export function leccionEnRuta(
  leccion: { variante: string; entorno: string; arranque: string },
  config: Partial<CursoConfig> = {},
): boolean {
  const normalizada = normalizarConfig(config)
  const varianteOk = leccion.variante === "comun" || leccion.variante === normalizada.dificultad
  const entornoOk = leccion.entorno === "ambos" || leccion.entorno === normalizada.entorno
  const arranqueOk = leccion.arranque === "ambos" || leccion.arranque === normalizada.arranque

  return varianteOk && entornoOk && arranqueOk
}

// Ordena según la secuencia explícita de la ruta. Las lecciones ajenas van al
// final y conservan su orden relativo (sort estable). No muta la entrada.
export function ordenarPorRuta<T extends { numero?: string }>(
  lecciones: T[],
  ruta: CursoRuta,
): T[] {
  const posicion = new Map(ruta.lecciones.map((id, indice) => [id, indice]))
  const rank = (leccion: T) =>
    leccion.numero ? (posicion.get(leccion.numero) ?? Infinity) : Infinity

  return [...lecciones].sort((a, b) => {
    const rankA = rank(a)
    const rankB = rank(b)
    if (rankA === rankB) return 0
    return rankA < rankB ? -1 : 1
  })
}

export function progresoKey(curso: string, dificultad?: Dificultad): string {
  return dificultad ? `ncw:progress:${curso}:${dificultad}` : `ncw:progress:${curso}`
}
