---
title: "Particionado manual"
description: "Crea a mano el esquema GPT de Arch: ESP y raíz, formateo y montajes, sin archinstall."
tags: ["arch-linux", "particionado", "gpt", "manual"]
curso: "arch-linux"
modulo: "instalacion"
modulo_titulo: "Instalación"
submodulo: ""
submodulo_titulo: ""
numero: "2.5"
orden: 11
duracion: ""
nivel: "intermedio"
video: ""
variante: "avanzada"
entorno: "ambos"
arranque: "ambos"
prerrequisitos: ["2.1"]
estado: "en-construccion"
date: 2026-11-19
---

## EN CONSTRUCCIÓN

Esta lección todavía no tiene guion escrito. El video y la guía completa se publicarán cuando estén listos.

## Qué cubrirá

- `lsblk` y `blkid` para identificar el disco correcto, confirmando tamaño y modelo antes de escribir nada.
- Herramientas: `fdisk` o `parted`, eligiendo una y explicando sus comandos sin mezclar ambas.
- Esquema **GPT**: **ESP** de 512 MB–1 GB, tipo `EFI System`, formateada en FAT32 (`mkfs.fat -F32`), montada en `/mnt/boot`.
- **Raíz** con el resto del disco (o el espacio libre), tipo `Linux filesystem`, formateada en ext4 (`mkfs.ext4`), montada en `/mnt`. **Sin swap en disco**: ZRAM se configura en 3.4.
- Montajes con `/mnt` para la raíz y `/mnt/boot` para la ESP; verificación con `lsblk`.
- **Dual boot**: no borrar la ESP de Windows; crear solo la raíz en el espacio libre y montar la ESP existente sin formatearla (detalle en 2.8). LUKS se menciona como extensión posible, no se incluye.

Mientras tanto: repasa 2.1. La instalación base sigue en 2.6.
