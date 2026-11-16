// Taxonomía pública del archivo. Las ocho categorías existen desde el inicio,
// pero solo se encienden las que tienen cursos publicados. La disponibilidad
// se deriva de `src/lib/catalog.ts`; no se declara a mano.

export interface CategoriaInfo {
  id: string // Slug estable usado por cursos y rutas.
  indice: string // e.g. "01"
  titulo: string
  tagline: string
  descripcion: string
  nivel: string
  temas: string[]
}

export const CATEGORIAS: CategoriaInfo[] = [
  {
    id: "fundamentos-y-etica",
    indice: "01",
    titulo: "Fundamentos y Ética",
    tagline: "El marco legal, la responsabilidad y los principios del trabajo defensivo.",
    descripcion:
      "Antes de ejecutar un comando conviene entender el contexto: permisos, alcance, divulgación responsable y las reglas que separan una auditoría de un delito.",
    nivel: "Todos los niveles",
    temas: ["Ética", "Marco legal", "Divulgación responsable", "Código de conducta"],
  },
  {
    id: "linux-y-sistemas",
    indice: "02",
    titulo: "Linux y Sistemas",
    tagline: "Terminal, permisos, servicios y administración de sistemas GNU/Linux.",
    descripcion:
      "La base de todo lo demás. Instalar un sistema, moverse por la terminal, entender permisos y servicios, y practicar en laboratorios legales.",
    nivel: "Principiante a intermedio",
    temas: ["Arch Linux", "Terminal", "Bash", "SSH", "Permisos", "Pacman"],
  },
  {
    id: "redes-y-servicios",
    indice: "03",
    titulo: "Redes y Servicios",
    tagline: "TCP/IP, resolución de nombres, servicios expuestos y diagnóstico de red.",
    descripcion:
      "Cómo viaja una petición, qué hace un puerto y cómo leer el estado de una red sin adivinar. La ruta se irá construyendo con laboratorios propios.",
    nivel: "Principiante a intermedio",
    temas: ["TCP/IP", "DNS", "HTTP", "Puertos", "Diagnóstico"],
  },
  {
    id: "programacion-y-automatizacion",
    indice: "04",
    titulo: "Programación y Automatización",
    tagline: "Scripts pequeños para tareas repetitivas, análisis y herramientas propias.",
    descripcion:
      "Programar no es un adorno: es la diferencia entre repetir cien comandos y escribir una herramienta que los haga por ti. Enfoque práctico y sin frameworks innecesarios.",
    nivel: "Principiante a intermedio",
    temas: ["Bash", "Python", "Automatización", "Sockets", "Herramientas"],
  },
  {
    id: "pentesting-web",
    indice: "05",
    titulo: "Pentesting Web",
    tagline: "Metodología, OWASP y laboratorios controlados de seguridad web.",
    descripcion:
      "Entender la web desde el fallo y desde la defensa: autenticación, inyección, control de acceso y APIs. Siempre sobre entornos propios o autorizados.",
    nivel: "Intermedio",
    temas: ["OWASP", "SQLi", "XSS", "SSRF", "APIs"],
  },
  {
    id: "maquinas-y-ctfs",
    indice: "06",
    titulo: "Máquinas y CTFs",
    tagline: "Reconocimiento, explotación y escalada documentados paso a paso.",
    descripcion:
      "Retos y máquinas de práctica para construir metodología: enumerar, entender, explotar y escribir lo aprendido. Nada fuera de plataformas legales.",
    nivel: "Intermedio a avanzado",
    temas: ["Reconocimiento", "Privilege escalation", "Boot2Root", "CTF"],
  },
  {
    id: "ia-y-seguridad",
    indice: "07",
    titulo: "IA y Seguridad",
    tagline: "Modelos locales, agentes y los límites de confiar en una máquina.",
    descripcion:
      "Una ruta en preparación sobre ejecución local de modelos, prompt injection, exposición de datos y defensa asistida. Sin humo y sin prometer magia.",
    nivel: "Intermedio",
    temas: ["Modelos locales", "Prompt injection", "Agentes", "Privacidad"],
  },
  {
    id: "privacidad-y-opsec",
    indice: "08",
    titulo: "Privacidad y OpSec",
    tagline: "Reducir huella, proteger credenciales y ordenar la operación diaria.",
    descripcion:
      "Higiene digital aplicada: contraseñas, cifrado, respaldos, telemetría y hábitos. Menos herramientas milagrosas y más decisiones sostenibles.",
    nivel: "Todos los niveles",
    temas: ["OpSec", "Cifrado", "Contraseñas", "Respaldos", "Telemetría"],
  },
]

export function getCategoria(id: string): CategoriaInfo | undefined {
  return CATEGORIAS.find((categoria) => categoria.id === id)
}
