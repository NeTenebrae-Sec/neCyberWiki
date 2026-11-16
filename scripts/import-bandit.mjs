// Genera las notas publicables de OverTheWire Bandit a partir de los
// originales de Obsidian en `content/_WRITEUPS/OverTheWire/bandit/`.
//
// Uso:
//   npm run import:bandit
//
// El script:
//   1. Copia cada nivel a `content/notas/bandit/<n>.md`.
//   2. Añade `serie`, `orden`, `draft` y `source` al frontmatter.
//   3. Convierte los embeds `![[imagen.webp]]` en <img> con lazy loading.
//   4. Convierte los enlaces wiki de Bandit a rutas del sitio.
//   5. Demota los encabezados un nivel para que la página tenga un solo <h1>.
//   6. Copia solo las imágenes referenciadas a `public/notas/bandit/`.
//
// Los originales no se modifican. Si cambia el contenido de Obsidian, vuelve a
// ejecutar el script y revisa el diff.
import { copyFile, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const sourceDir = path.join(root, "content/_WRITEUPS/OverTheWire/bandit")
const assetsDir = path.join(sourceDir, "assets")
const outDir = path.join(root, "content/notas/bandit")
const publicDir = path.join(root, "public/notas/bandit")
const base = (process.env.NCW_BASE || "/neCyberWiki/").replace(/\/?$/, "/")
const ethicsUrl =
  "https://github.com/NeTenebrae-Sec/neCyberWiki/blob/main/content/Codigo%20de%20conducta.md"

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "")

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
    const src = `${base}notas/bandit/${encodeURIComponent(resolved)}`
    return `![OTW Bandit ${level} — captura ${index}](${src})`
  })
}

const replaceWikiLinks = (markdown) =>
  markdown.replace(/\[\[([^\]]+)\]\]/g, (_match, rawName) => {
    const target = rawName.trim()
    const bandit = target.match(/^Bandit Level\s+(\d+)$/i)
    if (bandit) {
      return `[Bandit Level ${bandit[1]}](${base}notas/bandit/${bandit[1]}/)`
    }
    if (/^Ética en la Ciberseguridad$/i.test(target)) {
      return `[Ética en la Ciberseguridad](${ethicsUrl})`
    }
    return target
  })

const parseTitle = (frontmatter) => {
  const raw = frontmatter.match(/^title:\s*(.+)$/m)?.[1]?.trim()
  if (!raw) return "OTW Bandit"
  try {
    return JSON.parse(raw)
  } catch {
    return raw.replace(/^["']|["']$/g, "")
  }
}

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
    const title = parseTitle(frontmatter)
    const relativeSource = path
      .relative(root, path.join(sourceDir, file))
      .split(path.sep)
      .join("/")
    const extra = [
      'serie: "bandit"',
      `orden: ${level}`,
      "draft: false",
      `source: ${JSON.stringify(relativeSource)}`,
    ].join("\n")

    const transformed = [
      "---",
      frontmatter,
      extra,
      "---",
      "",
      replaceWikiLinks(replaceImages(normalizeHeadings(replaceCallouts(body)), level, usedAssets, assetByNorm)),
      "",
    ].join("\n")

    await writeFile(path.join(outDir, `${level}.md`), transformed, "utf8")
    console.log(`  ✓ ${file} → content/notas/bandit/${level}.md`)
  }

  for (const asset of [...usedAssets].sort()) {
    await copyFile(path.join(assetsDir, asset), path.join(publicDir, asset))
  }

  console.log(`\nBandit: ${sourceFiles.length} notas, ${usedAssets.size} imágenes copiadas.`)
  if (assetFiles.length !== usedAssets.size) {
    console.log(`  (${assetFiles.length - usedAssets.size} imágenes del archivo no se usan)`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
