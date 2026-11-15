// Catálogo canónico de categorías y módulos de neCyberWiki (specs/03-data-models.md §1.1).
// Centraliza metadatos, iconos, estado, temas clave y recursos asociados.

export interface CategoriaRecurso {
  titulo: string
  tipo: "curso" | "writeup" | "guia" | "articulo"
  enlace?: string
  estado?: "disponible" | "proximamente"
  detalle?: string
}

export interface CategoriaModulo {
  id: string // Slug del módulo
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
  estado: "activo" | "en-preparacion"
  badgeTexto: string
  tags: string[]
  iconName: "shield" | "terminal" | "globe" | "flag" | "code" | "cpu" | "wrench" | "lock"
  recursos: CategoriaRecurso[]
}

export const CATEGORIAS: CategoriaModulo[] = [
  {
    id: "fundamentos-y-etica",
    indice: "01",
    titulo: "Fundamentos y Ética",
    tagline: "El marco legal, la responsabilidad y los principios del hacker defensivo.",
    descripcion:
      "La técnica sin ética es peligro ciego. Comprende la legislación aplicable, el código de conducta, la divulgación responsable de vulnerabilidades y los principios esenciales de confidencialidad, integridad y disponibilidad.",
    nivel: "Todos los niveles",
    estado: "activo",
    badgeTexto: "Activo · Esencial",
    tags: [
      "Ética Hacker",
      "Marco Legal",
      "OpSec Legal",
      "Divulgación Responsable",
      "Código de Conducta",
    ],
    iconName: "shield",
    recursos: [
      {
        titulo: "Código de Conducta en Ciberseguridad",
        tipo: "guia",
        detalle: "Normas de respeto, legalidad y prácticas éticas en laboratorios.",
        estado: "disponible",
      },
      {
        titulo: "Ética de la Ciberseguridad",
        tipo: "guia",
        detalle: "La técnica importa; el permiso también. Laboratorios controlados.",
        estado: "disponible",
      },
      {
        titulo: "Marco Jurídico de Seguridad Informática",
        tipo: "guia",
        detalle: "Límites operativos para auditores y entusiastas.",
        estado: "proximamente",
      },
    ],
  },
  {
    id: "sistemas-y-redes",
    indice: "02",
    titulo: "Sistemas y Redes",
    tagline: "Arquitectura Linux, administración profunda, networking TCP/IP y comandos.",
    descripcion:
      "No puedes auditar lo que no comprendes a fondo. Desde instalar y asegurar Arch Linux desde cero hasta moverte con soltura en el terminal: usuarios, puertos, paquetes pacman/AUR, ZRAM y protocolos de red.",
    nivel: "Principiante a Intermedio",
    estado: "activo",
    badgeTexto: "Activo · 8 Lecciones",
    tags: ["Arch Linux", "GNU/Linux", "Networking", "Bash", "SSH", "Pacman/AUR", "Hardening"],
    iconName: "terminal",
    recursos: [
      {
        titulo: "Curso: Cómo instalar Arch Linux (Serie Arch Linux fácil)",
        tipo: "curso",
        enlace: "cursos/arch-linux-facil/",
        detalle: "8 lecciones paso a paso: ISO, particionado UEFI, GNOME, ZRAM y hardening.",
        estado: "disponible",
      },
      {
        titulo: "OverTheWire: Bandit Wargame (Niveles 0 al 18)",
        tipo: "writeup",
        detalle: "Comandos básicos a avanzados de Linux, SSH, permisos y tuberías.",
        estado: "disponible",
      },
      {
        titulo: "Arch no es difícil: es manual",
        tipo: "articulo",
        enlace: "blog/2026-11-09-arch-no-es-dificil-es-manual/",
        detalle: "Reflexión técnica sobre el control del sistema operativo.",
        estado: "disponible",
      },
    ],
  },
  {
    id: "pentesting-web",
    indice: "03",
    titulo: "Pentesting Web",
    tagline: "OWASP Top 10, explotación metodológica y remediación de fallos web.",
    descripcion:
      "Análisis de vectores de ataque web con rigor metodológico: Server-Side Request Forgery (SSRF), SQL Injection, Cross-Site Scripting (XSS), autenticación rota y APIs vulnerables con laboratorios de PortSwigger.",
    nivel: "Intermedio",
    estado: "activo",
    badgeTexto: "Activo · Labs PortSwigger",
    tags: ["SSRF", "OWASP Top 10", "SQLi", "PortSwigger", "Burp Suite", "API Security"],
    iconName: "globe",
    recursos: [
      {
        titulo: "Server-Side Request Forgery (SSRF) - Concepto y Mecánica",
        tipo: "writeup",
        detalle: "Cómo engañar al servidor web como mensajero interno.",
        estado: "disponible",
      },
      {
        titulo: "PortSwigger Lab: SSRF con bypass de validación local",
        tipo: "writeup",
        detalle: "Resolución práctica paso a paso con evidencia.",
        estado: "disponible",
      },
      {
        titulo: "Guía de SQL Injection: Boolean Blind y Time-Based",
        tipo: "guia",
        detalle: "Identificación, verificación e impacto en motores de base de datos.",
        estado: "proximamente",
      },
    ],
  },
  {
    id: "maquinas-y-ctfs",
    indice: "04",
    titulo: "Máquinas y CTFs",
    tagline: "Boot2Root, resolución de retos, evasión y escalada de privilegios real.",
    descripcion:
      "Entrenamiento práctico contra objetivos reales emulados: VulnHub, HackTheBox y desafíos de captura la bandera (CTFs). Reconocimiento, explotación inicial y escalada de privilegios documentada paso a paso.",
    nivel: "Intermedio a Avanzado",
    estado: "activo",
    badgeTexto: "Activo · Writeups VulnHub",
    tags: ["VulnHub", "Boot2Root", "CTF", "Buffer Overflow", "Privilege Escalation", "Recon"],
    iconName: "flag",
    recursos: [
      {
        titulo: "VulnHub Writeup: IMF 1 (Boot2Root)",
        tipo: "writeup",
        detalle: "Reconocimiento, SQLi boolean blind y Buffer Overflow con shellcode.",
        estado: "disponible",
      },
      {
        titulo: "VulnHub Writeup: DarkHole 2",
        tipo: "writeup",
        detalle: "Explotación web, bypass de autenticación y escalada root.",
        estado: "disponible",
      },
      {
        titulo: "Metodología de Enumeración de Redes y Servicios",
        tipo: "guia",
        detalle: "De escaneo Nmap a mapas de superficie de ataque.",
        estado: "proximamente",
      },
    ],
  },
  {
    id: "programacion",
    indice: "05",
    titulo: "Programación para Hackers",
    tagline: "Automatización con Python, Bash scripting y análisis de binarios.",
    descripcion:
      "El hacker que sabe programar construye sus propias herramientas. Desarrolla scripts para automatizar escaneos, fuzzer de payloads, scripts de explotación y análisis de respuestas HTTP con Python y Bash.",
    nivel: "Principiante a Intermedio",
    estado: "en-preparacion",
    badgeTexto: "En preparación",
    tags: ["Python 3", "Bash Scripting", "Automation", "Sockets", "Scapy", "Exploit Dev"],
    iconName: "code",
    recursos: [
      {
        titulo: "Curso: Python Ofensivo y Defensivo desde Cero",
        tipo: "curso",
        detalle: "Scripts de automatización, requests, sockets y herramientas CLI.",
        estado: "proximamente",
      },
      {
        titulo: "Bash Scripting para Sysadmins y Pentesters",
        tipo: "guia",
        detalle: "Automatización de auditorías y tareas repetitivas en Linux.",
        estado: "proximamente",
      },
    ],
  },
  {
    id: "inteligencia-artificial",
    indice: "06",
    titulo: "Inteligencia Artificial y Seguridad",
    tagline: "Modelos locales, auditoría de agentes, prompt injection y defensa automatizada.",
    descripcion:
      "La nueva frontera: ejecución de LLMs privados en hardware local (Ollama/vLLM), análisis de vectores de ataque como prompt injection, data exfiltration y desarrollo de agentes de auditoría defensiva.",
    nivel: "Intermedio",
    estado: "en-preparacion",
    badgeTexto: "En preparación",
    tags: ["Local LLMs", "Ollama", "Prompt Injection", "Defensa con IA", "Agentes Autónomos"],
    iconName: "cpu",
    recursos: [
      {
        titulo: "Guía: Desplegar LLMs Privados para Análisis de Seguridad",
        tipo: "guia",
        detalle: "Configuración de Ollama, modelos abiertos y preservación de privacidad.",
        estado: "proximamente",
      },
      {
        titulo: "Vulnerabilidades en Agentes de IA: OWASP Top 10 for LLMs",
        tipo: "articulo",
        detalle: "Auditoría práctica de riesgos de inyección y sobreconfianza.",
        estado: "proximamente",
      },
    ],
  },
  {
    id: "herramientas",
    indice: "07",
    titulo: "Herramientas de Auditoría",
    tagline: "Dominio de utilidades esenciales: Nmap, Burp Suite, Wireshark, Gobuster.",
    descripcion:
      "Manuales operacionales profundos de las herramientas estándar del sector. Configuración avanzada, flags críticas, scripts NSE de Nmap, extensiones de Burp Suite y captura de paquetes con Wireshark.",
    nivel: "Todos los niveles",
    estado: "en-preparacion",
    badgeTexto: "En preparación",
    tags: ["Nmap", "Burp Suite", "Wireshark", "Gobuster", "John the Ripper", "Metasploit"],
    iconName: "wrench",
    recursos: [
      {
        titulo: "Manual Práctico: Nmap de Reconocimiento a Evasión",
        tipo: "guia",
        detalle: "Flags esenciales, scripts NSE y análisis de servicios.",
        estado: "proximamente",
      },
      {
        titulo: "Burp Suite Community: Guía de Uso Real",
        tipo: "guia",
        detalle: "Proxy, Repeater, Intruder y análisis de tráfico TLS.",
        estado: "proximamente",
      },
    ],
  },
  {
    id: "privacidad",
    indice: "08",
    titulo: "Privacidad y Seguridad Personal",
    tagline: "OpSec, anonimato, gestión criptográfica de credenciales y comunicaciones.",
    descripcion:
      "Protege tu propia huella digital. Configuración de redes de anonimato (Tor), VPNs confiables sin logs, cifrado GPG, gestión segura de contraseñas y mitigación de telemetría y rastreo en tus sistemas operativos.",
    nivel: "Todos los niveles",
    estado: "en-preparacion",
    badgeTexto: "En preparación",
    tags: ["OpSec", "Tor Project", "GPG Cifrado", "VPNs", "Privacidad Digital", "Zero Logs"],
    iconName: "lock",
    recursos: [
      {
        titulo: "Guía de OpSec Personal: Rutinas de Protección para Investigadores",
        tipo: "guia",
        detalle: "Compartimentación de identidades, DNS seguro y mitigación de fugas.",
        estado: "proximamente",
      },
      {
        titulo: "Cifrado con GPG: Firmas y Llaves desde la Terminal",
        tipo: "guia",
        detalle: "Generación de llaves, cifrado de archivos y verificación de integridad.",
        estado: "proximamente",
      },
    ],
  },
]

export function getCategoria(id: string): CategoriaModulo | undefined {
  return CATEGORIAS.find((c) => c.id === id)
}
