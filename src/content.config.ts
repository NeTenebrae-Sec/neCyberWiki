import { defineCollection } from "astro:content"
import { z } from "astro:schema"
import { glob } from "astro/loaders"

// Lecciones de curso. La fuente de verdad es `content/cursos/`; los schemas
// fallan el build identificando el archivo si falta un campo obligatorio.
// Los metadatos editoriales del curso viven en `src/data/cursos.ts`.
const cursos = defineCollection({
  loader: glob({ pattern: "cursos/**/*.md", base: "./content" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    curso: z.string(),
    modulo: z.string(),
    modulo_titulo: z.string().default(""),
    submodulo: z.string().default(""),
    submodulo_titulo: z.string().default(""),
    capitulos: z.array(z.object({ t: z.number().int().min(0), titulo: z.string() })).default([]),
    orden: z.number().int().min(0),
    // Metadatos del curso adaptable: todos con default para no romper las
    // lecciones antiguas de Bandit ni el Arch monolítico.
    numero: z.string().default(""), // Número visible ("1.1"); vacío = derivar de `orden`.
    variante: z.enum(["comun", "facil", "avanzada"]).default("comun"),
    entorno: z.enum(["ambos", "hardware", "vm"]).default("ambos"),
    arranque: z.enum(["ambos", "solo", "dualboot"]).default("ambos"),
    prerrequisitos: z.array(z.string()).default([]), // IDs de lección ("1.1"), no slugs.
    estado: z.enum(["publicada", "en-construccion"]).default("publicada"),
    duracion: z.string().default(""),
    nivel: z.enum(["principiante", "intermedio", "avanzado"]).default("principiante"),
    video: z.string().default(""), // ID o URL de YouTube; vacío = guía escrita.
    source: z.string().optional(), // Procedencia editorial, si existe.
    draft: z.boolean().default(false),
    date: z.date().optional(),
  }),
})

const blog = defineCollection({
  loader: glob({ pattern: "blog/**/*.md", base: "./content" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    date: z.date(),
    draft: z.boolean().default(false),
  }),
})

export const collections = { cursos, blog }
