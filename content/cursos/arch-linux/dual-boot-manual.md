---
title: "Dual boot manual"
description: "Que GRUB detecte Windows y el menú muestre ambas entradas, sin romper el arranque de Windows."
tags: ["arch-linux", "dual-boot", "grub", "os-prober"]
curso: "arch-linux"
modulo: "instalacion"
modulo_titulo: "Instalación"
submodulo: ""
submodulo_titulo: ""
numero: "2.8"
orden: 14
duracion: ""
nivel: "intermedio"
video: ""
variante: "avanzada"
entorno: "hardware"
arranque: "dualboot"
prerrequisitos: ["1.6", "2.7"]
estado: "en-construccion"
date: 2026-11-19
---

## EN CONSTRUCCIÓN

Esta lección todavía no tiene guion escrito. El video y la guía completa se publicarán cuando estén listos.

## Qué cubrirá

- Confirmación previa: 1.6 hecho (Fast Startup fuera, BitLocker suspendido, backup) y que en 2.5 se usó el espacio libre **sin formatear** la ESP de Windows.
- Activación de la detección de otros sistemas en `/etc/default/grub`: `GRUB_DISABLE_OS_PROBER=false`, con `os-prober` ya instalado en 2.7.
- Si Windows está en otro disco, montaje de su ESP para que `os-prober` la vea; explicación del caso.
- `grub-mkconfig -o /boot/grub/grub.cfg` y verificación de que el `grub.cfg` contiene una entrada de Windows; revisión del orden de arranque con `efibootmgr -v` y ajuste con `efibootmgr -o`.
- **Reloj**: Windows usa hora local y Linux UTC; se explica el síntoma y las dos soluciones (`timedatectl set-local-rtc 0` o ajuste en Windows).
- **BitLocker**: si Windows pide la clave de recuperación, es la guardada en 1.6; no se continúa sin ella. Prueba de ambas entradas; si Windows no arranca, no formatear: revisar entrada UEFI y ESP.

Mientras tanto: completa 1.6, 2.5 y 2.7. El escritorio de la ruta Avanzada se monta en 2.9.
