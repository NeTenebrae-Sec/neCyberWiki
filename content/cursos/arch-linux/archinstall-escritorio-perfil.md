---
title: "archinstall: escritorio y perfil"
description: "Elige escritorio (GNOME), PipeWire, NetworkManager, zona horaria y kernel dentro de archinstall, y lánzalo de verdad."
tags: ["arch-linux", "archinstall", "gnome", "pipewire"]
curso: "arch-linux"
modulo: "instalacion"
modulo_titulo: "Instalación"
submodulo: ""
submodulo_titulo: ""
numero: "2.3"
orden: 9
duracion: ""
nivel: "principiante"
video: ""
variante: "facil"
entorno: "ambos"
arranque: "ambos"
prerrequisitos: ["2.2"]
estado: "publicada"
date: 2026-11-19
---

## Objetivo

Elegir escritorio, audio, red, zona horaria y kernel, y ejecutar la instalación de verdad. Si vienes de dual boot, la lección 2.4 ya te dejó el disco listo; si vas solo Linux, sigues desde 2.2.

## DE vs WM

**DE** (*Desktop Environment*) es un paquete completo: gestor de ventanas, panel, menú, configuración del sistema. Ejemplos: GNOME, KDE Plasma, XFCE.

**WM** (*Window Manager*) solo gestiona ventanas y se controla con atajos de teclado: más ligero y más personalizable, pero requiere más configuración. Ejemplos: BSPWM, i3, Hyprland.

Para empezar, un DE es lo cómodo: trae todo lo necesario sin configurar cada detalle.

## Los candidatos

- **GNOME**: limpio, moderno, Wayland por defecto y fácil si vienes de Windows o macOS. Es el de esta ruta.
- **KDE Plasma**: el rey de la personalización, con pinta de Windows y comunidad enorme.
- **XFCE**: ligero, rápido y estable; ideal para equipos modestos.
- **Hyprland**: WM de tiling para Wayland, precioso pero no para una primera vez.
- **BSPWM**: tiling en X11, minimalista y por teclado. Es el setup de la ruta Avanzada, no tu primera instalación.

## Profile: GNOME y drivers

En `Profile` selecciona (los nombres cambian según la versión):

- **Type:** Desktop.
- **Desktop:** GNOME.
- **Driver gráfico:** el de tu tarjeta (AMD, Intel, Nvidia) o `all-opensource` si no estás seguro.
- **Greeter:** GDM (el de GNOME).

GDM es el gestor de la pantalla de inicio de sesión: la ventanita donde escribes tu usuario y arranca tu sesión. Nada más místico que eso.

Si tienes Nvidia, el soporte propietario u open varía según la GPU y la versión; lo honesto es revisar la ArchWiki para tu tarjeta antes de decidir: <https://wiki.archlinux.org/title/NVIDIA>. Si es tu primera instalación en VM, casi seguro tienes GPU virtual e `all-opensource` es la opción sensata: cubre AMD, Intel y Nouveau sin fricción.

## Audio y extras

- **Audio:** elige **PipeWire**, el estándar actual de Arch; reemplaza a PulseAudio y unifica audio y video.
- **Bluetooth:** solo si tienes dispositivos Bluetooth.
- **Print service:** solo si tienes impresora.
- **Firewall:** elige **UFW** si aparece; en la lección 3.5 lo configuramos bien.
- **Fonts:** si tienes dudas, selecciona todas; evita caracteres raros y emojis rotos.

Todo esto se puede cambiar después: Arch se construye por capas.

## Red y zona horaria

**Network:** elige **NetworkManager**, el que usa GNOME para manejar la red y conectarte por Wi-Fi desde el escritorio.

**Timezone:** selecciona tu zona horaria y activa la sincronización automática del reloj.

## Kernel

Un **kernel** es la pieza central del sistema: el intermediario entre el hardware y los programas (memoria, procesador, dispositivos, procesos). Elige **`linux`**, el equilibrado y el que menos problemas da. Los demás en una línea: `linux-lts` (soporte a largo plazo), `linux-zen` (escritorio y juegos), `linux-hardened` (seguridad estricta). Si empiezas, uno solo: `linux`.

## Paquetes extra

En **Additional packages**, mi recomendación para arrancar con lo justo:

```text
firefox git
```

Con eso tienes navegador y Git. El resto del kit llega en 3.2 con `pacman` y en 3.3 con `paru`. No llenes la lista: cuantas menos cosas instales ahora, más fácil entender qué tienes y qué te falta.

## Revisión final e Install

Revisa una última vez: GNOME, GDM, PipeWire, NetworkManager, systemd-boot, sin swap en disco, usuario con sudo.

Selecciona **Install** y espera. El tiempo depende de tu conexión y de tu disco. Cuando termine, el instalador ofrecerá reiniciar: **quita el USB** (o desmonta la ISO en la VM) para que el PC arranque desde el disco.

Arch ya está instalado.

## Qué sigue

En la siguiente lección arrancas por primera vez, entras al escritorio, actualizas el sistema y compruebas red, audio y drivers.
