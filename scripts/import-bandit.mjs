// Genera las lecciones publicables del curso Bandit a partir de los originales
// de Obsidian en `content/_WRITEUPS/OverTheWire/bandit/`.
//
// Uso:
//   npm run import:bandit
//
// El script:
//   1. Copia cada nivel a `content/cursos/bandit/<n>.md`.
//   2. Reescribe el frontmatter con el esquema de cursos (`curso`, `modulo`,
//      `orden`, `nivel`, `video`, `date`, `source`).
//   3. Convierte los embeds `![[imagen.webp]]` en imágenes con lazy loading.
//   4. Convierte los enlaces wiki de Bandit a rutas del sitio.
//   5. Demota los encabezados un nivel para que la página tenga un solo <h1>.
//   6. Copia solo las imágenes referenciadas a `public/cursos/bandit/`.
//
// Los originales no se modifican. Si cambia el contenido de Obsidian, vuelve a
// ejecutar el script y revisa el diff.
import { copyFile, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const sourceDir = path.join(root, "content/_WRITEUPS/OverTheWire/bandit")
const assetsDir = path.join(sourceDir, "assets")
const outDir = path.join(root, "content/cursos/bandit")
const publicDir = path.join(root, "public/cursos/bandit")
const base = (process.env.NCW_BASE || "/neCyberWiki/").replace(/\/?$/, "/")
const ethicsUrl =
  "https://github.com/NeTenebrae-Sec/neCyberWiki/blob/main/content/Codigo%20de%20conducta.md"

// Módulos del curso. Deben coincidir con `src/data/cursos.ts`.
const modules = [
  { id: "primeros-pasos", titulo: "Primeros pasos", levels: [0, 1, 2, 3, 4] },
  { id: "busqueda-y-filtros", titulo: "Búsqueda y filtros", levels: [5, 6, 7, 8, 9] },
  { id: "texto-y-compresion", titulo: "Texto y compresión", levels: [10, 11, 12, 13] },
  { id: "redes-y-servicios", titulo: "Redes y servicios", levels: [14, 15, 16, 17, 18] },
]

// Títulos editoriales. Si aparece un nivel nuevo sin título, se usa el fallback.
const titles = {
  0: "Nivel 0 — Conexión por SSH",
  1: "Nivel 1 — Un archivo llamado «-»",
  2: "Nivel 2 — Nombres con espacios",
  3: "Nivel 3 — Archivos ocultos",
  4: "Nivel 4 — Archivos legibles por humanos",
  5: "Nivel 5 — find con criterios combinados",
  6: "Nivel 6 — find por propietario y tamaño",
  7: "Nivel 7 — grep y la palabra millionth",
  8: "Nivel 8 — Líneas únicas con sort y uniq",
  9: "Nivel 9 — Extraer la línea que no se repite",
  10: "Nivel 10 — Base64 desde la terminal",
  11: "Nivel 11 — ROT13 con tr",
  12: "Nivel 12 — Hexdump y archivos comprimidos",
  13: "Nivel 13 — Claves privadas SSH",
  14: "Nivel 14 — nc y un servicio local",
  15: "Nivel 15 — SSL/TLS con openssl s_client",
  16: "Nivel 16 — nmap y un puerto escondido",
  17: "Nivel 17 — diff entre dos listas",
  18: "Nivel 18 — Comandos sin shell interactivo",
}

const moduleFor = (level) =>
  modules.find((modulo) => modulo.levels.includes(level)) ?? modules[modules.length - 1]

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "")

const parseScalar = (frontmatter, key) => {
  const raw = frontmatter.match(new RegExp(`^${key}:[ \\t]*(.+)$`, "m"))?.[1]?.trim()
  if (!raw) return ""
  try {
    return JSON.parse(raw)
  } catch {
    return raw.replace(/^["']|["']$/g, "")
  }
}

const parseTags = (frontmatter) => {
  const lines = frontmatter.split(/\r?\n/)
  const index = lines.findIndex((line) => /^tags:/.test(line))
  if (index === -1) return []

  const inline = lines[index].replace(/^tags:[ \t]*/, "").trim()
  if (inline) {
    try {
      const parsed = JSON.parse(inline)
      if (Array.isArray(parsed)) return parsed
    } catch {
      return inline
        .replace(/^\[|\]$/g, "")
        .split(",")
        .map((tag) => tag.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean)
    }
  }

  const tags = []
  for (const line of lines.slice(index + 1)) {
    const match = line.match(/^\s+-\s+(.+)$/)
    if (!match) break
    tags.push(match[1].trim().replace(/^["']|["']$/g, ""))
  }
  return tags
}

const normalizeHeadings = (markdown) => {
  const lines = markdown.split("\n")
  const levels = []
  let inFence = false

  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const match = line.match(/^(#{1,6})\s+/)
    if (match) levels.push(match[1].length)
  }

  if (!levels.length) return markdown

  // La página ya aporta el <h1>. El encabezado más alto de la nota pasa a h2
  // para que el índice y la jerarquía empiecen en el nivel correcto.
  const delta = 2 - Math.min(...levels)
  if (delta === 0) return markdown

  inFence = false
  return lines
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence
        return line
      }
      if (inFence) return line
      const match = line.match(/^(#{1,6})(\s+.*)$/)
      if (!match) return line
      const level = Math.min(6, Math.max(1, match[1].length + delta))
      return `${"#".repeat(level)}${match[2]}`
    })
    .join("\n")
}

const replaceCallouts = (markdown) =>
  markdown.replace(/^> \[!DANGER\][^\n]*$/gm, "> **Aviso ético.**")

const replaceImages = (markdown, level, usedAssets, assetByNorm) => {
  let index = 0
  return markdown.replace(/!\[\[([^\]]+)\]\]/g, (_match, rawName) => {
    index += 1
    const requested = rawName.trim()
    const filename = requested.split("/").pop() || requested
    const resolved = assetByNorm.get(normalize(filename))

    if (!resolved) {
      console.warn(`  ! imagen no encontrada: ${requested}`)
      return `<!-- imagen no encontrada: ${requested} -->`
    }

    usedAssets.add(resolved)
    const src = `${base}cursos/bandit/${encodeURIComponent(resolved)}`
    return `![OTW Bandit ${level} — captura ${index}](${src})`
  })
}

const replaceWikiLinks = (markdown) =>
  markdown.replace(/\[\[([^\]]+)\]\]/g, (_match, rawName) => {
    const target = rawName.trim()
    const bandit = target.match(/^Bandit Level\s+(\d+)$/i)
    if (bandit) {
      return `[Bandit Level ${bandit[1]}](${base}cursos/linux-y-sistemas/bandit/${bandit[1]}/)`
    }
    if (/^Ética en la Ciberseguridad$/i.test(target)) {
      return `[Ética en la Ciberseguridad](${ethicsUrl})`
    }
    return target
  })

const stripVideo = (markdown) =>
  markdown.replace(/### Video Explicativo\s*\n<iframe[\s\S]*?<\/iframe>\s*\n?/g, "")

const main = async () => {
  await rm(outDir, { recursive: true, force: true })
  await rm(publicDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })
  await mkdir(publicDir, { recursive: true })

  const assetFiles = (await readdir(assetsDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
  const assetByNorm = new Map(assetFiles.map((file) => [normalize(file), file]))

  const sourceFiles = (await readdir(sourceDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && /^Bandit Level \d+\.md$/.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]))

  const usedAssets = new Set()

  for (const file of sourceFiles) {
    const level = Number(file.match(/\d+/)[0])
    const raw = await readFile(path.join(sourceDir, file), "utf8")
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
    if (!match) {
      console.warn(`  ! sin frontmatter válido: ${file}`)
      continue
    }

    const [, frontmatter, body] = match
    const modulo = moduleFor(level)
    const relativeSource = path.relative(root, path.join(sourceDir, file)).split(path.sep).join("/")

    const description = parseScalar(frontmatter, "description")
    const tags = parseTags(frontmatter)
    const date = parseScalar(frontmatter, "date") || "2025-01-01"

    const transformedBody = stripVideo(
      replaceWikiLinks(
        replaceImages(normalizeHeadings(replaceCallouts(body)), level, usedAssets, assetByNorm),
      )
        .replaceAll("/neCyberWiki/notas/bandit/", "/neCyberWiki/cursos/bandit/")
        .replace(/\n-{3,}\n-{3,}\n/g, "\n---\n"),
    )
      .replaceAll("/neCyberWiki/notas/bandit/", "/neCyberWiki/cursos/bandit/")
      .replace(/\n-{3,}\n-{3,}\n/g, "\n---\n")
      .replaceAll("Aqui se presenta", "Aquí se presenta")
      .replaceAll("\u200b", "")

    const transformed = [
      "---",
      `title: ${JSON.stringify(titles[level] ?? `Nivel ${level} — OverTheWire Bandit`)}`,
      `description: ${JSON.stringify(description)}`,
      `tags: [${tags.map((tag) => JSON.stringify(tag)).join(", ")}]`,
      'curso: "bandit"',
      `modulo: ${JSON.stringify(modulo.id)}`,
      `modulo_titulo: ${JSON.stringify(modulo.titulo)}`,
      `orden: ${level}`,
      'nivel: "principiante"',
      'video: ""',
      `date: ${date}`,
      `source: ${JSON.stringify(relativeSource)}`,
      "---",
      "",
      transformedBody,
      "",
    ].join("\n")

    await writeFile(path.join(outDir, `${level}.md`), transformed, "utf8")
    console.log(`  ✓ ${file} → content/cursos/bandit/${level}.md`)
  }

  for (const asset of [...usedAssets].sort()) {
    await copyFile(path.join(assetsDir, asset), path.join(publicDir, asset))
  }

  console.log(`\nBandit: ${sourceFiles.length} niveles, ${usedAssets.size} imágenes copiadas.`)
  if (assetFiles.length !== usedAssets.size) {
    console.log(`  (${assetFiles.length - usedAssets.size} imágenes del archivo no se usan)`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
