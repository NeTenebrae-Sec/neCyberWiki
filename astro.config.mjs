import { defineConfig } from "astro/config"
import tailwindcss from "@tailwindcss/vite"

// https://astro.build/config
export default defineConfig({
  site: "https://netenebraes.github.io",
  base: "/neCyberWiki/",
  vite: {
    plugins: [tailwindcss()],
  },
})
