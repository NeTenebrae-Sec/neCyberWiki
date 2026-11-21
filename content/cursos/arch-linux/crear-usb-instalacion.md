---
title: "Crear el USB de instalación"
description: "Convierte la ISO verificada en un USB arrancable con GPT y UEFI, sin borrar por error el disco equivocado."
tags: ["arch-linux", "usb", "rufus", "uefi"]
curso: "arch-linux"
modulo: "preparacion"
modulo_titulo: "Preparación"
submodulo: ""
submodulo_titulo: ""
numero: "1.3"
orden: 2
duracion: ""
nivel: "principiante"
video: ""
variante: "comun"
entorno: "hardware"
arranque: "ambos"
prerrequisitos: ["1.2"]
estado: "publicada"
date: 2026-11-19
---

## Objetivo

Pasar la ISO verificada a un USB arrancable. Esta lección es para **hardware real**: si estás en una máquina virtual, sáltala, el temario no te la muestra.

## Lo que necesitas

Un USB de **8 GB o más**. Todo lo que tenga dentro se va a borrar, así que sácalo de ahí: fotos, documentos, la carpeta de «no borrar». Y si tienes dudas, revisa dos veces la letra de la unidad antes de darle a Start. No hay botón de deshacer para un USB formateado.

## Rufus (Windows)

En Windows, **Rufus** es la opción recomendada. Lo descargas desde su página oficial, lo abres y seleccionas el USB y la ISO que descargaste. Deja estas opciones:

- Esquema de partición: **GPT**.
- Sistema de destino: **UEFI (sin CSM)**.
- Sistema de archivos: **FAT32**.
- Tamaño de clúster: el que venga por defecto.

Le das a Start y esperas. Si Rufus avisa de que va a borrar el USB, aceptas. Si ofrece descargar componentes extra, léelo antes: no necesitas nada raro.

Existen alternativas como `dd` en Linux/macOS o BalenaEtcher. Ventoy también funciona, pero si es tu primera instalación, no mezcles variables: quédate con Rufus.

## Un truco para no equivocarte

Antes de darle a Start, mira tres cosas:

1. Que el USB es el correcto.
2. Que el tamaño coincide con el que esperas.
3. Que la ISO seleccionada es la que verificaste.

Si algo no cuadra, cancela y vuelve a empezar. Perder un minuto aquí es mejor que perder un disco después.

## ¿Y si estoy en Linux?

Puedes usar `dd`, pero con mucho cuidado: equivocándote de dispositivo borras el disco del sistema. El comando típico es:

```bash
sudo dd if=archlinux-2026.11.01-x86_64.iso of=/dev/sdX bs=4M status=progress oflag=sync
```

Cambia `/dev/sdX` por el dispositivo del USB, no por una partición. Verifica con `lsblk` antes de ejecutar. Si no quieres arriesgarte, usa BalenaEtcher. No hay premio por hacerlo a mano.

## Errores comunes

- **Escribir en `/dev/sdX1` en lugar de `/dev/sdX`**: `dd` espera el dispositivo completo.
- **Dejar Rufus en MBR/BIOS**: Arch arrancará en modo legacy o no arrancará; el curso asume UEFI + GPT.
- **No expulsar el USB tras escribirlo**: en algunos equipos el arranque falla si el sistema de archivos queda montado.

## Checklist

- [ ] USB de 8 GB o más, sin datos importantes.
- [ ] Rufus en GPT + UEFI (sin CSM) + FAT32.
- [ ] ISO correcta seleccionada.
- [ ] USB expulsado y listo para la UEFI.
