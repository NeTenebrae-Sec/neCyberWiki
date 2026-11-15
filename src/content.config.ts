import { defineCollection } from "astro:content"
import { z } from "astro:schema"
import { glob } from "astro/loaders"

// Colección del curso piloto «Arch Linux fácil» (DM-03).
// La fuente de verdad es `content/cursos/`; los schemas fallan el build
// identificando el archivo si falta title/description (RF-10).
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
    duracion: z.string().default(""),
    nivel: z.enum(["principiante", "intermedio", "avanzado"]).default("principiante"),
    video: z.string().default(""), // ID o URL de YouTube; vacío = "video próximamente"
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
