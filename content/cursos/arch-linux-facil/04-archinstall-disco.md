---
title: "archinstall I — Disco y sistema base"
description: "Particionado automático con archinstall: idioma, teclado, mirrors, GPT+UEFI, ext4, systemd-boot, hostname y usuario con sudo. Este episodio BORRA el disco."
tags: ["arch-linux", "archinstall", "ext4", "uefi"]
curso: "arch-linux-facil"
modulo: "instalacion-archinstall"
modulo_titulo: "Instalación con archinstall"
submodulo: "2.1"
submodulo_titulo: "Sistema base"
orden: 3
duracion: "10 min"
nivel: "principiante"
video: ""
date: 2026-11-09
---

## Objetivo

Configurar en `archinstall`: idioma, teclado, mirrors, disco (automático), bootloader, hostname y usuario. **El particionado automático borra el disco seleccionado — verifica antes.**

## Notas

### Antes de nada

```bash
lsblk     # identifica tamaño/modelo de tus discos
archinstall
```

La interfaz es una TUI: flechas, Enter y las letras indicadas. Los nombres de menú cambian entre versiones; busca el equivalente.

### Idioma, teclado y locale

- Idioma del **instalador** (no del sistema): el que prefieras.
- Teclado: `es` (España) o `la-latin1` (Latinoamérica). Usa `/` para buscar.
- Locale: tu idioma o `en_US.UTF-8` — lo importante es **UTF-8**.

### Mirrors y repos

- Selecciona **Worldwide** + tu país/región.
- **No** actives repositorios de testing.
- **Multilib** solo si necesitas 32 bits (Steam, Wine).

### El disco: particionado automático

`Disk configuration → configuration automática (best-effort layout)`:

- **ext4** — el clásico estable. La opción de esta serie. (BTRFS es válido pero con más conceptos; temporada avanzada.)
- Sin separar `/home`. Una sola raíz.
- **Sin swap** — usaremos ZRAM en el episodio 7.
- Se crea: partición ESP (FAT32) + raíz (ext4).

> **PUNTO DE NO RETORNO:** si elegiste el disco equivocado, cancela y empieza de nuevo. Un disco formateado no tiene "Ctrl + Z".

### GPT/UEFI y systemd-boot

- UEFI → **GPT**. La partición ESP la usa el firmware para arrancar.
- Bootloader: **systemd-boot** (simple, UEFI-friendly, un solo sistema).
- GRUB solo para BIOS o dual boot → temporada avanzada.
- No actives "Unified Kernel Images" ni "Install to removable location".

### Hostname, root y usuario

- **Hostname:** el nombre de tu PC (`arch-casa`, `miarch`…).
- **root:** contraseña distinta a la de tu usuario.
- **Usuario:** minúsculas sin espacios, contraseña para el escritorio, **acceso a sudo: SÍ**.

### Guardar y revisar

Antes de instalar: disco ✔ ext4 ✔ GPT/UEFI ✔ systemd-boot ✔ sin swap ✔ hostname ✔ usuario con sudo ✔. **No instales todavía.** En el episodio 5 elegimos GNOME.

## Ejercicio

Sin instalar, ejecuta `archinstall` en una VM (o un disco de repuesto) y documenta: qué disco aparece en `lsblk` antes de entrar, qué opciones elegiste y qué verificarías antes de darle a Install.

## Comprobación

1. ¿Qué crea el particionado automático (dos particiones)?
2. ¿Por qué "sin swap" en esta serie?
3. ¿Qué es la ESP y quién la usa para arrancar?
4. ¿Qué diferencia hay entre systemd-boot y GRUB?
