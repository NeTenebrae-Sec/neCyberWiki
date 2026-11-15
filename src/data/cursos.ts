// Manifiesto de cursos. La fuente de verdad de las lecciones es
// `content/cursos/`; aquí vive solo la descripción pública del curso.
export interface CursoInfo {
  slug: string
  titulo: string
  descripcion: string
  promesa: string
  nivel: "principiante" | "intermedio" | "avanzado"
  duracion: string
  lecciones: number
  requisitos: string[]
  youtube: string // ID del tráiler/intro (vacío = próximamente)
}

export const cursos: CursoInfo[] = [
  {
    slug: "arch-linux-facil",
    titulo: "Cómo instalar Arch Linux (serie «Arch Linux fácil»)",
    descripcion:
      "Ocho lecciones para pasar de cero a un Arch Linux con GNOME, seguro y usable. Sin asumir nada: desde descargar la ISO hasta entender pacman, AUR y ZRAM.",
    promesa: "De cero a un Arch con GNOME, seguro y usable, entendiendo lo que haces.",
    nivel: "principiante",
    duracion: "~75 min de video + práctica",
    lecciones: 8,
    requisitos: [
      "Un PC o una máquina virtual (recomendada)",
      "USB de 8 GB o más",
      "Conexión a internet",
      "Backup de lo importante si usarás hardware real",
    ],
    youtube: "",
  },
]

export function getCurso(slug: string): CursoInfo | undefined {
  return cursos.find((c) => c.slug === slug)
}
