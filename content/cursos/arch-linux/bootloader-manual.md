---
title: "Bootloader manual"
description: "Instala GRUB en la ESP, genera su configuración y deja Arch arrancando por sí solo."
tags: ["arch-linux", "grub", "bootloader", "manual"]
curso: "arch-linux"
modulo: "instalacion"
modulo_titulo: "Instalación"
submodulo: ""
submodulo_titulo: ""
numero: "2.7"
orden: 13
duracion: ""
nivel: "intermedio"
video: ""
variante: "avanzada"
entorno: "ambos"
arranque: "ambos"
prerrequisitos: ["2.6"]
estado: "en-construccion"
date: 2026-11-19
---

## EN CONSTRUCCIÓN

Esta lección todavía no tiene guion escrito. El video y la guía completa se publicarán cuando estén listos.

## Qué cubrirá

- Qué es el bootloader: el intermediario entre la UEFI y el kernel.
- **GRUB** como opción principal de la ruta manual: flexible, detecta otros sistemas y funciona también en BIOS/MBR. Instalación con `pacman -S --needed grub efibootmgr os-prober`.
- `grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=ARCH` y `grub-mkconfig -o /boot/grub/grub.cfg`; verificación con `efibootmgr -v`.
- **systemd-boot** como alternativa más simple en UEFI puro, mencionada en una línea; si el equipo no es UEFI, se avisa de que el escenario es otro (`i386-pc`).
- `mkinitcpio -P` si se cambió algo del kernel, reinicio y retirada del USB/ISO.
- Si no arranca: orden de arranque en la UEFI, Secure Boot desactivado y ESP montada correctamente.

Mientras tanto: completa 2.6. Si vas a dual boot, la detección de Windows se trata en 2.8.
