---
title: "Primer arranque: GNOME y el primer update"
description: "systemd-boot, GDM, actualización completa con pacman -Syu (nunca -Sy), RED y audio verificados, y troubleshooting del primer arranque."
tags: ["arch-linux", "gnome", "pacman", "troubleshooting"]
curso: "arch-linux-facil"
modulo: "instalacion-archinstall"
modulo_titulo: "Instalación con archinstall"
submodulo: "2.2"
submodulo_titulo: "Escritorio y primer arranque"
orden: 5
duracion: "9 min"
nivel: "principiante"
video: ""
date: 2026-11-09
---

## Objetivo

Arrancar tu Arch por primera vez, actualizarlo correctamente, verificar red/audio/drivers y dejar GNOME a tu gusto.

## Notas

### systemd-boot y GDM

Al arrancar verás el menú de **systemd-boot** → después **GDM** (pantalla de login). Entra con tu usuario.

GNOME en 30 segundos: botón **Activities** (arriba a la izquierda), `Super` (tecla Windows) abre la vista general, escribe para buscar apps.

### El primer update (lo más importante)

La ISO puede tener semanas/meses; los paquetes instalados son de esa ISO. Antes de instalar nada:

```bash
sudo pacman -Syu
```

Desglose: `sudo` (permisos) · `pacman` (gestor de paquetes) · `-S` (sincronizar) · `-y` (refrescar DB) · `-u` (actualizar).

**Nunca** `pacman -Sy paquete`: actualiza la base de datos pero no el sistema → **actualización parcial** → el famoso "rompí Arch".

Si hay problemas con claves:

```bash
sudo pacman -S --needed archlinux-keyring
sudo pacman -Syu
```

Si actualizó kernel → `reboot`. Lee lo que pacman va a instalar **antes** de confirmar.

### Mirrors veloces (opcional)

```bash
sudo pacman -S --needed reflector
sudo reflector --latest 10 --sort rate --save /etc/pacman.d/mirrorlist
```

### Red

```bash
ip a
ping -c 4 archlinux.org
nmcli device status
nmcli device wifi connect "MiWiFi" password "MiClave"
```

**NetworkManager** es el servicio de red de GNOME. `rfkill list` / `rfkill unblock wifi` si está bloqueado por hardware.

### Audio (PipeWire) y drivers

```bash
wpctl status                          # dispositivos y streams
systemctl --user status pipewire
systemctl --user status wireplumber
```

Drivers: `lspci -k | grep -A 3 -E "VGA|3D"` (requiere `pciutils`). AMD/Intel open source funcionan solos; Nvidia puede necesitar el propietario (temporada avanzada). `linux-firmware` trae firmware de red/Wi-Fi/GPU — `pacman -Q linux-firmware`.

### Ajustes básicos de GNOME

Settings → Apariencia, Pantalla (activa más Hz si tu monitor soporta), Touchpad, Energía, Fecha/hora (NTP). `sudo pacman -S gnome-tweaks` para opciones extra. **Primero funciona, luego se ve bonito.**

### Si el arranque falla

- **No aparece systemd-boot:** revisa orden de arranque UEFI y Secure Boot.
- **Pantalla negra:** arranca con `nomodeset` (diagnóstico temporal) y mira `journalctl -b -1`.
- **Sin Wi-Fi:** `rfkill` + `linux-firmware` + `nmcli device status`.
- **La hora mal:** `sudo timedatectl set-ntp true`.
- Y la respuesta casi siempre está en la **ArchWiki**.

## Ejercicio

Tras el primer arranque: actualiza con `sudo pacman -Syu`, cambia el papel tapiz, activa "toque para hacer clic" y ejecuta `ip a` y `wpctl status`. Documenta cualquier error junto con su solución (guarda el comando que lo arregló).

## Comprobación

1. ¿Qué pasa exactamente si ejecutas `sudo pacman -Sy paquete`?
2. ¿Qué es una actualización parcial y por qué rompe Arch?
3. ¿Qué hace `reflector` y por qué acelera las descargas?
4. ¿Qué servicio maneja la red y cuál el audio?
