// Manifiesto editorial de cursos. Las lecciones viven en `content/cursos/` y
// los conteos se derivan en `src/lib/catalog.ts`. Aquí solo se declara lo que
// el curso promete, a quién sirve y qué necesita el lector.

import type { CursoRuta } from "../lib/tracks"
import type { CategoriaInfo } from "./categorias"

export interface CursoModulo {
  id: string // Coincide con `modulo` en el frontmatter de las lecciones.
  titulo: string
  objetivo: string
}

export interface CursoFuente {
  nombre: string
  url: string
}

// Banner común de un curso adaptable: copy editorial y CTA/video opcionales.
export interface CursoHero {
  copy: string[]
  cta?: string
  video?: string
}

export interface CursoInfo {
  slug: string
  titulo: string
  descripcion: string
  promesa: string
  nivel: "principiante" | "intermedio" | "avanzado"
  categoria: CategoriaInfo["id"]
  unidad: "clase" | "nivel" // "nivel" usa numeración desde 0 (Bandit).
  requisitos: string[]
  resultados: string[]
  modulos: CursoModulo[]
  rutas?: CursoRuta[] // Rutas adaptables; su orden manda sobre `orden`.
  hero?: CursoHero // Banner común del curso adaptable.
  videoPendiente?: boolean // true = videos aún sin publicar; no inventar IDs.
  fuente?: CursoFuente
}

export const cursos: CursoInfo[] = [
  {
    slug: "arch-linux-facil",
    titulo: "Arch Linux fácil",
    descripcion:
      "Ocho lecciones para pasar de cero a un Arch Linux con GNOME, seguro y usable. Sin asumir nada: desde descargar la ISO hasta entender pacman, el AUR y ZRAM.",
    promesa: "De cero a un Arch con GNOME, seguro y usable, entendiendo lo que haces.",
    nivel: "principiante",
    categoria: "linux-y-sistemas",
    unidad: "clase",
    requisitos: [
      "Un PC o una máquina virtual (recomendada)",
      "USB de 8 GB o más",
      "Conexión a internet",
      "Respaldo de lo importante",
    ],
    resultados: [
      "Instalar Arch Linux con GNOME en una máquina virtual o en hardware propio.",
      "Moverte con pacman y entender cuándo conviene el AUR.",
      "Dejar el sistema actualizable y respaldar tus dotfiles.",
    ],
    modulos: [
      {
        id: "fundamentos-y-preparacion",
        titulo: "Fundamentos y preparación",
        objetivo: "Entender qué es Arch y dejar el equipo listo antes de tocar el disco.",
      },
      {
        id: "instalacion-archinstall",
        titulo: "Instalación con archinstall",
        objetivo: "Instalar el sistema base y el escritorio sin saltarse pasos.",
      },
      {
        id: "tu-arch-usable",
        titulo: "Tu Arch, usable y seguro",
        objetivo: "Actualizar, instalar software y proteger una configuración que ya funciona.",
      },
    ],
  },
  {
    slug: "bandit",
    titulo: "Bandit: terminal desde cero",
    descripcion:
      "Diecinueve niveles de OverTheWire para aprender la terminal de Linux y SSH en un entorno legal y controlado. Cada nivel explica el objetivo, el comando y el razonamiento.",
    promesa: "Aprende la terminal resolviendo retos, no memorizando comandos sueltos.",
    nivel: "principiante",
    categoria: "linux-y-sistemas",
    unidad: "nivel",
    requisitos: [
      "Cliente SSH instalado (OpenSSH)",
      "Terminal en Linux, macOS o WSL",
      "Conexión a internet",
      "Navegador para consultar las reglas oficiales",
    ],
    resultados: [
      "Moverte por un sistema Linux sin depender de una interfaz gráfica.",
      "Leer archivos, permisos y nombres que el shell interpreta de forma especial.",
      "Conectarte a servicios locales y entender qué hace cada comando.",
    ],
    modulos: [
      {
        id: "primeros-pasos",
        titulo: "Primeros pasos",
        objetivo: "Conectarte por SSH y resolver los primeros retos con ls, cat y file.",
      },
      {
        id: "busqueda-y-filtros",
        titulo: "Búsqueda y filtros",
        objetivo: "Localizar archivos y líneas con find, grep, sort y uniq.",
      },
      {
        id: "texto-y-compresion",
        titulo: "Texto y compresión",
        objetivo: "Leer datos codificados o comprimidos y autenticarte con una clave SSH.",
      },
      {
        id: "redes-y-servicios",
        titulo: "Redes y servicios",
        objetivo: "Usar nc, openssl y nmap contra los servicios locales del laboratorio.",
      },
    ],
    fuente: {
      nombre: "OverTheWire",
      url: "https://overthewire.org/wargames/bandit/",
    },
  },
]

export function getCurso(slug: string): CursoInfo | undefined {
  return cursos.find((curso) => curso.slug === slug)
}
