---
title: "Sistema base manual"
description: "pacstrap, fstab, chroot y la configuración mínima: locale, timezone, hostname, usuarios, sudo y red."
tags: ["arch-linux", "pacstrap", "chroot", "manual"]
curso: "arch-linux"
modulo: "instalacion"
modulo_titulo: "Instalación"
submodulo: ""
submodulo_titulo: ""
numero: "2.6"
orden: 12
duracion: ""
nivel: "intermedio"
video: ""
variante: "avanzada"
entorno: "ambos"
arranque: "ambos"
prerrequisitos: ["2.5"]
estado: "en-construccion"
date: 2026-11-19
---

## EN CONSTRUCCIÓN

Esta lección todavía no tiene guion escrito. El video y la guía completa se publicarán cuando estén listos.

## Qué cubrirá

- `pacstrap -K /mnt base linux linux-firmware nano networkmanager sudo`, explicando qué aporta cada paquete.
- `genfstab -U /mnt >> /mnt/etc/fstab` y revisión del `fstab` generado.
- `arch-chroot /mnt` y la configuración mínima: **timezone** (`ln -sf ... /etc/localtime`, `hwclock --systohc`), **locale** (`/etc/locale.gen`, `locale-gen`, `/etc/locale.conf`) y **teclado** (`/etc/vconsole.conf`).
- **Hostname** (`/etc/hostname`, `/etc/hosts`) y contraseña de **root** (`passwd`).
- Creación del **usuario** con `useradd -m -G wheel -s /bin/bash`, su contraseña y **sudo** (`EDITOR=nano visudo`, descomentar `%wheel ALL=(ALL:ALL) ALL`).
- Habilitación de NetworkManager (`systemctl enable NetworkManager`) e initramfs (`mkinitcpio -P`). Salida del chroot y desmontaje (`umount -R /mnt`). No reiniciar todavía: falta el bootloader.

Mientras tanto: completa 2.5. El arranque del sistema se resuelve en 2.7.
