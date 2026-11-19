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

const comunFinal = ["3.1", "3.2", "3.3", "3.4", "3.5", "3.6"]

export const cursos: CursoInfo[] = [
  {
    slug: "arch-linux",
    titulo: "Cómo instalar Arch Linux",
    descripcion:
      "Curso adaptable: elige dificultad, entorno y arranque, y el temario se reorganiza. Veintidós lecciones únicas, de la ISO al primer update, con archinstall o instalación manual.",
    promesa:
      "Instala Arch Linux a tu manera: fácil con archinstall o manual, en VM o hardware, solo Linux o dual boot.",
    nivel: "principiante",
    categoria: "linux-y-sistemas",
    unidad: "clase",
    requisitos: [
      "Un PC o una máquina virtual con al menos 4 GB de RAM y 20 GB de disco",
      "USB de 8 GB o más si instalas en hardware real",
      "Conexión a internet durante la instalación",
      "Respaldo de lo importante",
      "Para dual boot: Windows en UEFI/GPT y la clave de BitLocker a mano",
    ],
    resultados: [
      "Instalar Arch Linux con archinstall o a mano, en VM o hardware.",
      "Elegir y dejar funcionando un escritorio (GNOME o BSPWM).",
      "Moverte con pacman, el AUR y ZRAM sin miedo.",
      "Dejar el sistema actualizado, con firewall y backups.",
    ],
    modulos: [
      {
        id: "preparacion",
        titulo: "Preparación",
        objetivo: "Entender qué es Arch y preparar ISO, medio de arranque, firmware y disco.",
      },
      {
        id: "instalacion",
        titulo: "Instalación",
        objetivo:
          "Instalar el sistema base y el escritorio por la ruta elegida, incluido dual boot.",
      },
      {
        id: "configuracion",
        titulo: "Configuración",
        objetivo: "Dejar el sistema actualizado, seguro y mantenible.",
      },
    ],
    rutas: [
      {
        dificultad: "facil",
        entorno: "hardware",
        arranque: "solo",
        lecciones: ["1.1", "1.2", "1.3", "1.5", "1.7", "2.1", "2.2", "2.3", ...comunFinal],
      },
      {
        dificultad: "facil",
        entorno: "vm",
        arranque: "solo",
        lecciones: ["1.1", "1.2", "1.4", "1.7", "2.1", "2.2", "2.3", ...comunFinal],
      },
      {
        dificultad: "facil",
        entorno: "hardware",
        arranque: "dualboot",
        lecciones: [
          "1.1",
          "1.2",
          "1.3",
          "1.5",
          "1.6",
          "1.7",
          "2.1",
          "2.2",
          "2.4",
          "2.3",
          ...comunFinal,
        ],
      },
      {
        dificultad: "avanzada",
        entorno: "hardware",
        arranque: "solo",
        lecciones: [
          "1.1",
          "1.2",
          "1.3",
          "1.5",
          "1.7",
          "2.1",
          "2.5",
          "2.6",
          "2.7",
          "2.9",
          ...comunFinal,
        ],
      },
      {
        dificultad: "avanzada",
        entorno: "vm",
        arranque: "solo",
        lecciones: ["1.1", "1.2", "1.4", "1.7", "2.1", "2.5", "2.6", "2.7", "2.9", ...comunFinal],
      },
      {
        dificultad: "avanzada",
        entorno: "hardware",
        arranque: "dualboot",
        lecciones: [
          "1.1",
          "1.2",
          "1.3",
          "1.5",
          "1.6",
          "1.7",
          "2.1",
          "2.5",
          "2.6",
          "2.7",
          "2.8",
          "2.9",
          ...comunFinal,
        ],
      },
    ] satisfies CursoRuta[],
    hero: {
      copy: [
        "En este curso aprenderás a instalar Arch Linux desde cero y dejarlo funcional, seguro y usable.",
        "Elige dificultad, entorno y arranque: el temario se reorganiza. Las lecciones comunes se quedan; las específicas aparecen o desaparecen.",
        "No necesitas cuenta: tu progreso se guarda en este navegador.",
      ],
      cta: "Elige tu ruta y empieza por la lección 1.1",
      video: "",
    },
    videoPendiente: true,
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
