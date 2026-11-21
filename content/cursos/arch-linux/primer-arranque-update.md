---
title: "Primer arranque y update"
description: "El primer arranque real: entrar al escritorio, primer update con pacman y comprobar red, audio y drivers."
tags: ["arch-linux", "primer-arranque", "pacman", "update"]
curso: "arch-linux"
modulo: "configuracion"
modulo_titulo: "Configuración"
submodulo: ""
submodulo_titulo: ""
numero: "3.1"
orden: 16
duracion: ""
nivel: "principiante"
video: ""
variante: "comun"
entorno: "ambos"
arranque: "ambos"
prerrequisitos: ["2.3", "2.9"]
estado: "publicada"
date: 2026-11-19
---

## Objetivo

Entrar al escritorio por primera vez, hacer el primer update y comprobar red, audio y drivers. Vienes de terminar la instalación: con `archinstall` en la ruta Fácil, a mano en la Avanzada.

## El menú de arranque

Lo primero que aparece es el **gestor de arranque**: systemd-boot o GRUB, según lo que instalaste. Verás una entrada con el nombre del sistema y la versión del kernel; si no tocas nada, arranca solo tras unos segundos. Si compartes disco con Windows, su entrada debería aparecer también.

No hay pantalla de «instalando actualizaciones» ni asistente de bienvenida: Arch arranca y te entrega el sistema tal como lo configuraste.

## La pantalla de login

Después viene el gestor de sesiones. En GNOME es **GDM**: selecciona tu usuario, contraseña y entra. Si instalaste BSPWM, verás LightDM. El concepto es el mismo.

Lo básico de GNOME si es tu primera vez: **Activities** (arriba a la izquierda) abre la vista general, el buscador y el lanzador; con la tecla **Super** abres lo mismo. Escribiendo el nombre de una aplicación la encuentras; abre una terminal y déjala abierta.

## El primer update

Antes de instalar nada, actualiza. La ISO puede tener semanas: el sistema instalado trae los paquetes de esa ISO, no los de hoy.

```bash
sudo pacman -Syu
```

La única regla por ahora: **nunca `-Sy`**. Si `pacman` se queja de las claves o de la base de datos, actualiza primero el llavero:

```bash
sudo pacman -S --needed archlinux-keyring
sudo pacman -Syu
```

Si se actualizó el kernel o el bootloader, reinicia con `reboot`. Y lee lo que `pacman` va a instalar antes de confirmar: si te pide reemplazar un paquete o hay una intervención manual, léelos. No escribas «sí» por reflejo.

## Mirrors: si tu conexión va lenta

Los **mirrors** son los servidores desde los que `pacman` descarga. Puedes ordenarlos por velocidad con `reflector`:

```bash
sudo pacman -S --needed reflector
sudo reflector --latest 10 --sort rate --save /etc/pacman.d/mirrorlist
```

No es obligatorio, pero en algunos países hace una diferencia enorme.

## Red

Comprueba que el sistema instalado sigue teniendo red:

```bash
ip a
ping -c 4 archlinux.org
```

Si el Wi-Fi no aparece, revisa NetworkManager (`nmcli device status`) y conecta por terminal si hace falta: `nmcli device wifi list` y luego `nmcli device wifi connect "NOMBRE" password "TU_CONTRASEÑA"`. Y si la tarjeta está bloqueada: `rfkill list` y `sudo rfkill unblock wifi`.

## Audio

El audio moderno de Arch funciona con **PipeWire**. Abre los ajustes de sonido y reproduce algo; por terminal, `wpctl status` muestra dispositivos y streams. Si no suena, comprueba que PipeWire y WirePlumber están corriendo:

```bash
systemctl --user status pipewire
systemctl --user status wireplumber
```

## Drivers gráficos

```bash
lspci -k | grep -A 3 -E "VGA|3D"
```

Si `lspci` no existe: `sudo pacman -S --needed pciutils`. En AMD e Intel los drivers open source suelen funcionar sin hacer nada; en Nvidia puede que necesites el propietario. Revisa la ArchWiki para tu tarjeta: <https://wiki.archlinux.org/title/NVIDIA>. Y comprueba el firmware: `pacman -Q linux-firmware`.

## Si algo falla

- **No aparece el gestor de arranque**: orden de arranque en la UEFI, Secure Boot OFF, disco correcto.
- **Pantalla negra tras el login**: posible driver gráfico; prueba `nomodeset` como diagnóstico y revisa `journalctl -b -1`.
- **Sin Wi-Fi**: `rfkill`, `linux-firmware`, `nmcli device status`.
- **Sin audio**: `wpctl status` y el estado de PipeWire/WirePlumber.
- **La hora está mal**: `sudo timedatectl set-ntp true`.

Y si nada funciona, la respuesta casi siempre está en la ArchWiki: <https://wiki.archlinux.org/>.

## Qué sigue

Arch está actualizado, con escritorio, red, audio y drivers comprobados. A partir de aquí el sistema es tuyo: en la siguiente lección, `pacman`.
