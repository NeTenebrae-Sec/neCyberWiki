import { defineConfig } from "astro/config"
import tailwindcss from "@tailwindcss/vite"
import rehypeLazyImages from "./src/lib/rehype-lazy-images.mjs"

// https://astro.build/config
export default defineConfig({
  site: "https://netenebraes.github.io",
  base: "/neCyberWiki/",
  redirects: {
    "/categorias": "/cursos/",
    "/categorias/": "/cursos/",
  },
  markdown: {
    rehypePlugins: [rehypeLazyImages],
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
