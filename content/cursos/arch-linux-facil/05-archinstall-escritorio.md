---
title: "archinstall II — Escritorio y perfil"
description: "Elige tu escritorio: DE vs WM, por qué GNOME, driver gráfico, GDM, PipeWire, NetworkManager, kernel linux y la instalación final."
tags: ["arch-linux", "archinstall", "gnome", "pipewire"]
curso: "arch-linux-facil"
modulo: "instalacion-archinstall"
modulo_titulo: "Instalación con archinstall"
submodulo: "2.2"
submodulo_titulo: "Escritorio y primer arranque"
orden: 4
duracion: "10 min"
nivel: "principiante"
video: ""
date: 2026-11-09
---

## Objetivo

Elegir escritorio y perfil en `archinstall`, instalar Arch y dejarlo listo para el primer arranque.

## Notas

### DE vs WM

- **DE** (*Desktop Environment*): paquete completo — ventanas, panel, ajustes, apps. GNOME, KDE Plasma, XFCE.
- **WM** (*Window Manager*): solo ventanas, control por teclado. BSPWM, i3, Hyprland. Más ligero y personalizable, pero exige más configuración.

### Los candidatos y por qué GNOME

- **GNOME** — limpio, moderno, Wayland por defecto. Está la opción de esta serie: fácil si vienes de Windows/macOS.
- **KDE Plasma** — el rey de la personalización.
- **XFCE** — ligero y estable para equipos modestos.
- **Hyprland/BSPWM** — WMs de tiling espectaculares, pero no para tu primera instalación. Primero camina, luego haz parkour.

### Profile, driver y greeter

En **Profile**:

- Type: **Desktop** · Desktop: **GNOME**
- **Driver gráfico:** el de tu tarjeta (AMD / Intel / Nvidia) o `all-opensource` si no estás seguro. Con Nvidia, el propietario rinde más en juegos; para empezar, open source suele ir bien.
- **Greeter:** **GDM** (el de GNOME por defecto).

### Audio, Bluetooth, impresión y fuentes

- **Audio: PipeWire** — el estándar moderno.
- Bluetooth: solo si lo usas. Impresión: solo si tienes impresora.
- **Firewall: UFW** si aparece (se configura bien en el episodio 8).
- **Fonts:** selecciona todas si dudas — evita caracteres raros y emojis rotos.

### Red, timezone y kernels

- **Network: NetworkManager** — Wi-Fi desde el escritorio y GNOME.
- **Timezone:** tu zona + sincronización automática del reloj.
- **Kernel: `linux`** — el más equilibrado. `linux-lts` = largo plazo; `linux-zen` = escritorio/juegos; `linux-hardened` = estricto (puede dar problemas).

### Paquetes adicionales

```text
firefox git
```

Navegador + Git. El resto del kit llega en el episodio 7 — a propósito: menos que configurar ahora.

### Instalar y reiniciar

Revisa: GNOME ✔ GDM ✔ PipeWire ✔ NetworkManager ✔ systemd-boot ✔ sin swap ✔ usuario con sudo ✔ → **Install**. Al terminar, **quita el USB** antes de reiniciar.

## Ejercicio

En una VM: instala con el perfil GNOME + NetworkManager + `linux`. Verifica tras el primer arranque que GNOME carga, hay red y el sonido funciona.

## Comprobación

1. ¿Qué diferencia hay entre un DE y un WM? Cita dos ejemplos de cada uno.
2. ¿Por qué PipeWire y no PulseAudio?
3. ¿Qué es GDM y qué es el "greeter"?
4. ¿Por qué el kernel `linux` y no `linux-hardened` para tu primera vez?
