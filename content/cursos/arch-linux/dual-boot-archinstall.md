---
title: "Dual boot con archinstall"
description: "Instalar Arch en el espacio libre del disco con archinstall, compartiendo la ESP con Windows sin formatearla."
tags: ["arch-linux", "dual-boot", "archinstall"]
curso: "arch-linux"
modulo: "instalacion"
modulo_titulo: "Instalación"
submodulo: ""
submodulo_titulo: ""
numero: "2.4"
orden: 10
duracion: ""
nivel: "principiante"
video: ""
variante: "facil"
entorno: "hardware"
arranque: "dualboot"
prerrequisitos: ["1.6", "2.2"]
estado: "en-construccion"
date: 2026-11-19
---

## EN CONSTRUCCIÓN

Esta lección todavía no tiene guion escrito. El video y la guía completa se publicarán cuando estén listos.

## Qué cubrirá

- Confirmación previa: 1.6 hecho (Fast Startup fuera, BitLocker suspendido, backup, espacio libre sin asignar) y `lsblk` para ubicar disco, particiones de Windows, ESP y espacio libre.
- En **Disk configuration**, nada de "whole disk": elegir la opción que permita usar el espacio libre y crear solo la **raíz** en ext4.
- Montaje de la **ESP existente** en `/boot` **sin formatear**. Es la misma que usa Windows: si la formateas, rompes el arranque de Windows.
- No crear una segunda ESP ni tocar las particiones de Windows; el layout final debe mostrar ESP intacta + raíz de Arch + Windows intacto.
- **Bootloader**: systemd-boot suele detectar Windows Boot Manager en la misma ESP; si no aparece, GRUB con `os-prober` es la alternativa.
- **Reloj**: Windows usa hora local y Linux UTC; se explica el síntoma (hora desfasada) y el ajuste. Al terminar, se vuelve a 2.3 para elegir GNOME y pulsar Install.

Mientras tanto: completa 1.6 y 2.2. La instalación del escritorio se hace en 2.3.
