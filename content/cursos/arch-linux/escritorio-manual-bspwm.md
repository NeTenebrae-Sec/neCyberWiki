---
title: "Escritorio manual: BSPWM"
description: "Un escritorio mínimo con BSPWM sobre X11: drivers, audio, red, LightDM y una configuración base de atajos."
tags: ["arch-linux", "bspwm", "x11", "manual"]
curso: "arch-linux"
modulo: "instalacion"
modulo_titulo: "Instalación"
submodulo: ""
submodulo_titulo: ""
numero: "2.9"
orden: 15
duracion: ""
nivel: "intermedio"
video: ""
variante: "avanzada"
entorno: "ambos"
arranque: "ambos"
prerrequisitos: ["2.7"]
estado: "en-construccion"
date: 2026-11-19
---

## EN CONSTRUCCIÓN

Esta lección todavía no tiene guion escrito. El video y la guía completa se publicarán cuando estén listos.

## Qué cubrirá

- **BSPWM es un WM, no un DE**: solo gestiona ventanas; necesita X11, un gestor de sesiones y piezas aparte (contrástese con DE vs WM de la ruta Fácil).
- Paquetes base: `xorg-server xorg-xinit bspwm sxhkd lightdm lightdm-gtk-greeter alacritty`.
- Drivers: `mesa` y el específico de la GPU (`xf86-video-amdgpu`, `xf86-video-intel`, `nvidia`); en VM, `mesa` suele bastar.
- Audio con `pipewire pipewire-pulse wireplumber` y servicios de usuario habilitados; red con NetworkManager (de 2.6) comprobada con `systemctl status NetworkManager`.
- Mínimos para trabajar: `firefox`, `pcmanfm` o `thunar`, `git`; `systemctl enable lightdm` para la pantalla de login.
- Configuración base: `~/.config/bspwm/bspwmrc` (ejecutable, con `sxhkd &` y reglas mínimas) y `~/.config/sxhkd/sxhkdrc` con atajos para terminal, cerrar ventana y reiniciar BSPWM; `chmod +x` del `bspwmrc`. Esto es un escritorio mínimo, no un «rice» completo.

Mientras tanto: completa 2.7. En dual boot, 2.8 va antes que esta lección.
