// Datos globales del sitio. Las URLs pendientes están marcadas como Q-1
// (specs/00-core-concept.md): rellenar antes del release público.
export const site = {
  nombre: "neCyberWiki",
  tagline: "Informática y ciberseguridad, gratis y sin registros",
  descripcion:
    "neCyberWiki reúne cursos, notas y artículos de informática y ciberseguridad en español. Aprendizaje 100% gratuito, sin registro, hecho por alguien que aprende contigo.",
  base: "/neCyberWiki/",
  redes: {
    github: "https://github.com/NeTenebrae-Sec/neCyberWiki",
    threads: "https://www.threads.com/@netenebrae",
    youtube: "", // pendiente Q-1
  },
  // Pendiente Q-1: URL real de Ko-fi del autor.
  koFi: "",
  // Giscus: se activa rellenando estos valores tras crear la discusión
  // en el repo (ver specs/00-core-concept.md, Q-2). Con repo vacío el
  // componente muestra un aviso de "comentarios próximamente".
  giscus: {
    repo: "",
    repoId: "",
    category: "",
    categoryId: "",
  },
}
