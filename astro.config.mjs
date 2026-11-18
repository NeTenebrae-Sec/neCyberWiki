import { defineConfig } from "astro/config"
import tailwindcss from "@tailwindcss/vite"
import rehypeLazyImages from "./src/lib/rehype-lazy-images.mjs"

const base = "/neCyberWiki/"

const archLecciones = [
  "01-que-es-arch-linux",
  "02-usb-y-arranque",
  "03-archiso-red-y-ssh",
  "04-archinstall-disco",
  "05-archinstall-escritorio",
  "06-primer-arranque-y-gnome",
  "07-pacman-aur-zram",
  "08-seguridad-home-dotfiles",
]

const archRedirects = Object.fromEntries([
  ["/cursos/arch-linux-facil", `${base}cursos/linux-y-sistemas/arch-linux-facil/`],
  ...archLecciones.map((leccion) => [
    `/cursos/arch-linux-facil/${leccion}`,
    `${base}cursos/linux-y-sistemas/arch-linux-facil/${leccion}/`,
  ]),
])

const banditRedirects = Object.fromEntries([
  ["/notas", `${base}cursos/`],
  ["/notas/bandit", `${base}cursos/linux-y-sistemas/bandit/`],
  ...Array.from({ length: 19 }, (_, nivel) => nivel).map((nivel) => [
    `/notas/bandit/${nivel}`,
    `${base}cursos/linux-y-sistemas/bandit/${nivel}/`,
  ]),
])

const blogRedirects = Object.fromEntries([
  ["/blog", `${base}bitacora/`],
  [
    "/blog/2026-11-09-arch-no-es-dificil-es-manual",
    `${base}bitacora/2026-11-09-arch-no-es-dificil-es-manual/`,
  ],
])

// https://astro.build/config
export default defineConfig({
  site: "https://netenebrae-sec.github.io",
  base,
  redirects: {
    ...archRedirects,
    ...banditRedirects,
    ...blogRedirects,
    "/categorias": `${base}cursos/`,
    "/certificados": `${base}cursos/`,
    "/certificados/verificar": `${base}cursos/`,
  },
  markdown: {
    rehypePlugins: [rehypeLazyImages],
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
