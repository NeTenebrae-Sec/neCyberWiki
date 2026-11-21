import { defineConfig } from "astro/config"
import tailwindcss from "@tailwindcss/vite"
import rehypeLazyImages from "./src/lib/rehype-lazy-images.mjs"

const base = process.env.PUBLIC_NCW_BASE || "/neCyberWiki/"

// Mapa de slugs antiguos (curso `arch-linux-facil`) a los nuevos del curso adaptable.
const archLecciones = {
  "01-que-es-arch-linux": "que-es-arch-linux",
  "02-usb-y-arranque": "crear-usb-instalacion",
  "03-archiso-red-y-ssh": "archiso-terminal-teclado-red",
  "04-archinstall-disco": "archinstall-disco-sistema-base",
  "05-archinstall-escritorio": "archinstall-escritorio-perfil",
  "06-primer-arranque-y-gnome": "primer-arranque-update",
  "07-pacman-aur-zram": "pacman-instalar-buscar-mantener",
  "08-seguridad-home-dotfiles": "ufw-dns",
}

const archRedirects = Object.fromEntries(
  ["/cursos/arch-linux-facil", "/cursos/linux-y-sistemas/arch-linux-facil"].flatMap((prefijo) => [
    [prefijo, `${base}cursos/linux-y-sistemas/arch-linux/`],
    ...Object.entries(archLecciones).map(([antiguo, nuevo]) => [
      `${prefijo}/${antiguo}`,
      `${base}cursos/linux-y-sistemas/arch-linux/${nuevo}/`,
    ]),
  ]),
)

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
