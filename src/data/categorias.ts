// Catálogo canónico de categorías de neCyberWiki (specs/03-data-models.md §1.1).
// Las categorías son la hoja de ruta del sitio: agrupan cursos y notas publicadas,
// pero no prometen contenido que todavía no existe. Los temas listados son el
// mapa de lo que se irá trabajando en cada ruta.

export interface CategoriaModulo {
  id: string // Slug estable usado por cursos y notas (`categoria` / `module`).
  indice: string // e.g. "01"
  titulo: string
  tagline: string
  descripcion: string
  nivel:
    | "Principiante"
    | "Intermedio"
    | "Principiante a Intermedio"
    | "Intermedio a Avanzado"
    | "Todos los niveles"
    | "Especializado"
  temas: string[]
}

export const CATEGORIAS: CategoriaModulo[] = [
  {
    id: "fundamentos-y-etica",
    indice: "01",
    titulo: "Fundamentos y Ética",
    tagline: "El marco legal, la responsabilidad y los principios del hacker defensivo.",
    descripcion:
      "La técnica sin ética es peligro ciego. Esta ruta reúne los conceptos de legislación aplicable, código de conducta, divulgación responsable de vulnerabilidades y los principios de confidencialidad, integridad y disponibilidad.",
    nivel: "Todos los niveles",
    temas: [
      "Ética Hacker",
      "Marco Legal",
      "OpSec Legal",
      "Divulgación Responsable",
      "Código de Conducta",
    ],
  },
  {
    id: "sistemas-y-redes",
    indice: "02",
    titulo: "Sistemas y Redes",
    tagline: "Arquitectura Linux, administración profunda, networking TCP/IP y comandos.",
    descripcion:
      "No puedes auditar lo que no comprendes a fondo. La ruta empieza por instalar y asegurar Arch Linux, seguir con la terminal y los permisos, y continuar con redes, SSH y los servicios que sostienen un sistema.",
    nivel: "Principiante a Intermedio",
    temas: ["Arch Linux", "GNU/Linux", "Networking", "Bash", "SSH", "Pacman/AUR", "Hardening"],
  },
  {
    id: "pentesting-web",
    indice: "03",
    titulo: "Pentesting Web",
    tagline: "OWASP Top 10, explotación metodológica y remediación de fallos web.",
    descripcion:
      "Análisis de vectores de ataque web con rigor metodológico: Server-Side Request Forgery (SSRF), SQL Injection, Cross-Site Scripting (XSS), autenticación rota y APIs vulnerables en laboratorios controlados.",
    nivel: "Intermedio",
    temas: ["SSRF", "OWASP Top 10", "SQLi", "PortSwigger", "Burp Suite", "API Security"],
  },
  {
    id: "maquinas-y-ctfs",
    indice: "04",
    titulo: "Máquinas y CTFs",
    tagline: "Boot2Root, resolución de retos, evasión y escalada de privilegios real.",
    descripcion:
      "Entrenamiento práctico contra objetivos emulados: VulnHub, HackTheBox y desafíos de captura la bandera. Reconocimiento, explotación inicial y escalada de privilegios documentada paso a paso.",
    nivel: "Intermedio a Avanzado",
    temas: ["VulnHub", "Boot2Root", "CTF", "Buffer Overflow", "Privilege Escalation", "Recon"],
  },
  {
    id: "programacion",
    indice: "05",
    titulo: "Programación para Hackers",
    tagline: "Automatización con Python, Bash scripting y análisis de binarios.",
    descripcion:
      "El hacker que sabe programar construye sus propias herramientas. Esta ruta trabaja scripts para automatizar escaneos, generar payloads, analizar respuestas HTTP y entender binarios con Python y Bash.",
    nivel: "Principiante a Intermedio",
    temas: ["Python 3", "Bash Scripting", "Automation", "Sockets", "Scapy", "Exploit Dev"],
  },
  {
    id: "inteligencia-artificial",
    indice: "06",
    titulo: "Inteligencia Artificial y Seguridad",
    tagline: "Modelos locales, auditoría de agentes, prompt injection y defensa automatizada.",
    descripcion:
      "La nueva frontera: ejecución de LLMs privados en hardware local, análisis de vectores de ataque como prompt injection, exfiltración de datos y desarrollo de agentes de auditoría defensiva.",
    nivel: "Intermedio",
    temas: ["Local LLMs", "Ollama", "Prompt Injection", "Defensa con IA", "Agentes Autónomos"],
  },
  {
    id: "herramientas",
    indice: "07",
    titulo: "Herramientas de Auditoría",
    tagline: "Dominio de utilidades esenciales: Nmap, Burp Suite, Wireshark, Gobuster.",
    descripcion:
      "Manuales operacionales de las herramientas estándar del sector: configuración avanzada, flags críticas, scripts NSE de Nmap, extensiones de Burp Suite y captura de paquetes con Wireshark.",
    nivel: "Todos los niveles",
    temas: ["Nmap", "Burp Suite", "Wireshark", "Gobuster", "John the Ripper", "Metasploit"],
  },
  {
    id: "privacidad",
    indice: "08",
    titulo: "Privacidad y Seguridad Personal",
    tagline: "OpSec, anonimato, gestión criptográfica de credenciales y comunicaciones.",
    descripcion:
      "Protege tu propia huella digital: redes de anonimato, VPNs sin registros, cifrado GPG, gestión segura de contraseñas y mitigación de telemetría y rastreo en tus sistemas.",
    nivel: "Todos los niveles",
    temas: ["OpSec", "Tor Project", "GPG Cifrado", "VPNs", "Privacidad Digital", "Zero Logs"],
  },
]

export function getCategoria(id: string): CategoriaModulo | undefined {
  return CATEGORIAS.find((categoria) => categoria.id === id)
}
