// Plugin rehype mínimo: añade carga diferida y decodificación asíncrona a las
// imágenes del contenido Markdown. Evita depender de `unist-util-visit`.
const visit = (node, callback) => {
  callback(node)
  if (!Array.isArray(node.children)) return
  for (const child of node.children) visit(child, callback)
}

export default function rehypeLazyImages() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== "element" || node.tagName !== "img") return
      node.properties = node.properties || {}
      node.properties.loading = node.properties.loading || "lazy"
      node.properties.decoding = node.properties.decoding || "async"
    })
  }
}
