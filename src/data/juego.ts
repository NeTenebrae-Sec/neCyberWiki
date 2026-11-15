// Pure game manifest. No UI, no logic, no storage.
// The wiki trains; the game operates. This file only describes the shared world
// so a future engine can consume it without importing pages or components.

export type GameState = "prototipo" | "disenado" | "implementado"

export interface GameEnemy {
  id: string
  nombre: string
  clase: string
  nivel: number
  hp: number
  maxHp: number
  debilidad: string
  resistencia: string
  comando: string
  descripcion: string
  estado: GameState
}

export interface GameDaemon {
  id: string
  nombre: string
  rol: "reconocimiento" | "defensa" | "ataque"
  habilidad: string
  coste: number
  descripcion: string
}

export interface GameSector {
  id: string
  indice: string
  nombre: string
  cursoSlug: string
  modulo: string
  leccion: string
  leccionTitulo: string
  enemigoId: string
  daemonId: string
  comando: string
  estado: GameState
  briefing: string
}

// The typing drill is a real command from lesson 08. It is never executed.
export const GAME_TYPING_DRILL = {
  comando: "sudo systemctl enable ufw",
  pista: "El servicio que activa el cortafuegos al arrancar.",
  leccion: "08-seguridad-home-dotfiles",
  leccionTitulo: "Seguridad, ~/HOME y dotfiles",
  segundos: 6,
}

export const GAME_ENEMIES: GameEnemy[] = [
  {
    id: "troll-dhcp",
    nombre: "Troll de Red/DHCP",
    clase: "Servicio poseído",
    nivel: 3,
    hp: 62,
    maxHp: 100,
    debilidad: "systemctl restart NetworkManager",
    resistencia: "ping -c 1",
    comando: "ip a",
    descripcion:
      "Secuestra la concesión de red y deja al operador sin ruta. Aparece cuando la interfaz tiene nombre pero no dirección.",
    estado: "prototipo",
  },
  {
    id: "espectro-particion",
    nombre: "Espectro de la Partición",
    clase: "Tabla corrupta",
    nivel: 5,
    hp: 48,
    maxHp: 100,
    debilidad: "lsblk -f",
    resistencia: "fdisk -l",
    comando: "lsblk",
    descripcion:
      "Se esconde en discos sin identificar. Ataca cuando escribes el dispositivo equivocado sin haberlo leído dos veces.",
    estado: "disenado",
  },
  {
    id: "grub-lord",
    nombre: "GRUB Lord",
    clase: "Guardián de arranque",
    nivel: 7,
    hp: 84,
    maxHp: 100,
    debilidad: "bootctl status",
    resistencia: "reboot",
    comando: "efibootmgr",
    descripcion:
      "Vigila la puerta de acero. Si el orden de arranque cambia, reclama el sector y deja la pantalla en negro.",
    estado: "disenado",
  },
]

export const GAME_DAEMONS: GameDaemon[] = [
  {
    id: "nmap-bot",
    nombre: "Nmap-bot",
    rol: "reconocimiento",
    habilidad: "Barrido de puertos",
    coste: 1,
    descripcion:
      "Revela la debilidad del enemigo durante un turno. No ataca: informa. Sin su lectura, el operador dispara a ciegas.",
  },
  {
    id: "proxy-shield",
    nombre: "Proxy-Shield",
    rol: "defensa",
    habilidad: "Cortafuegos temporal",
    coste: 2,
    descripcion:
      "Absorbe un golpe de red y devuelve el turno al operador. Se rompe después de un uso; no reemplaza aprender UFW.",
  },
]

export const GAME_SECTORS: GameSector[] = [
  {
    id: "umbral-dhcp",
    indice: "01",
    nombre: "Umbral del DHCP",
    cursoSlug: "arch-linux-facil",
    modulo: "fundamentos-y-preparacion",
    leccion: "03-archiso-red-y-ssh",
    leccionTitulo: "Archiso: terminal, red y SSH",
    enemigoId: "troll-dhcp",
    daemonId: "nmap-bot",
    comando: "systemctl enable dhcpcd",
    estado: "prototipo",
    briefing:
      "El primer sector enseña a leer la red antes de tocarla. La lección conecta la interfaz; el juego convierte esa orden en el primer turno.",
  },
  {
    id: "camara-particion",
    indice: "02",
    nombre: "Cámara de la Partición",
    cursoSlug: "arch-linux-facil",
    modulo: "instalacion-archinstall",
    leccion: "04-archinstall-disco",
    leccionTitulo: "archinstall I — Disco y sistema base",
    enemigoId: "espectro-particion",
    daemonId: "nmap-bot",
    comando: "lsblk -f",
    estado: "disenado",
    briefing:
      "Aquí se paga el error de escribir sobre el disco equivocado. El sector no pide memoria: pide identificar el dispositivo con evidencia.",
  },
  {
    id: "puerta-acero",
    indice: "03",
    nombre: "Puerta de Acero",
    cursoSlug: "arch-linux-facil",
    modulo: "instalacion-archinstall",
    leccion: "06-primer-arranque-y-gnome",
    leccionTitulo: "Primer arranque: GNOME y el primer update",
    enemigoId: "grub-lord",
    daemonId: "proxy-shield",
    comando: "bootctl status",
    estado: "disenado",
    briefing:
      "El guardián del arranque no se vence con fuerza: se vence leyendo el gestor de arranque y verificando la entrada correcta.",
  },
]

// Lookup helpers keep the page declarative and the future engine honest.
export const getEnemy = (id: string) => GAME_ENEMIES.find((enemy) => enemy.id === id)
export const getDaemon = (id: string) => GAME_DAEMONS.find((daemon) => daemon.id === id)
