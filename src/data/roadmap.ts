// Roadmap público. El estado se muestra en tres grupos: hecho, en curso y planeado.
// Las entradas no prometen fechas: solo las que ya tienen fecha informativa la llevan.

export type EstadoRoadmap = "hecho" | "en-curso" | "planeado"

export interface EntradaRoadmap {
  id: string
  fecha?: string
  titulo: string
  resumen: string
  estado: EstadoRoadmap
  area: string
  enlace?: string
}

export const roadmap: EntradaRoadmap[] = [
  {
    id: "bitacora-definitiva",
    fecha: "2026-11-15",
    titulo: "Bitácora definitiva en /bitacora/",
    resumen: "La ruta definitiva para notas y artículos convive con una redirección desde /blog/.",
    estado: "hecho",
    area: "Contenido",
    enlace: "/bitacora/",
  },
  {
    id: "candado-bloqueante",
    fecha: "2026-11-15",
    titulo: "Candado legal bloqueante",
    resumen:
      "El aviso se muestra como diálogo modal salvo en /terminos/ y solo se cierra con la aceptación.",
    estado: "hecho",
    area: "Legal",
    enlace: "/terminos/",
  },
  {
    id: "perfil-local",
    fecha: "2026-11-15",
    titulo: "Perfil local completo",
    resumen: "Alias, tema, aceptación y progreso con exportar, importar y borrar en JSON.",
    estado: "hecho",
    area: "Producto",
    enlace: "/perfil/",
  },
  {
    id: "buscador-estatico",
    fecha: "2026-11-15",
    titulo: "Buscador estático con Pagefind",
    resumen: "Índice del build para cursos, lecciones, bitácora y roadmap.",
    estado: "en-curso",
    area: "Producto",
  },
  {
    id: "roadmap-publico",
    fecha: "2026-11-15",
    titulo: "Roadmap público",
    resumen: "Hecho, en curso y planeado, sin promesas de fechas.",
    estado: "hecho",
    area: "Contenido",
    enlace: "/roadmap/",
  },
  {
    id: "comunidad-youtube",
    titulo: "Comunidad en YouTube",
    resumen: "Bloque enlazado al canal. Falta publicar la URL definitiva.",
    estado: "planeado",
    area: "Comunidad",
  },
]
