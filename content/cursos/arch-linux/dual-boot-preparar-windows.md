---
title: "Dual boot: preparar Windows"
description: "Antes de instalar Arch al lado de Windows: Fast Startup fuera, BitLocker bajo control, backup y espacio libre sin formatear."
tags: ["arch-linux", "dual-boot", "windows", "bitlocker"]
curso: "arch-linux"
modulo: "preparacion"
modulo_titulo: "Preparación"
submodulo: ""
submodulo_titulo: ""
numero: "1.6"
orden: 5
duracion: ""
nivel: "principiante"
video: ""
variante: "comun"
entorno: "hardware"
arranque: "dualboot"
prerrequisitos: ["1.2", "1.5"]
estado: "en-construccion"
date: 2026-11-19
---

## EN CONSTRUCCIÓN

Esta lección todavía no tiene guion escrito. El video y la guía completa se publicarán cuando estén listos.

## Qué cubrirá

- **Inicio rápido OFF**: Panel de control → Opciones de energía → elegir el comportamiento de los botones de encendido → desactivar «Activar inicio rápido».
- **BitLocker**: guardar la clave de recuperación y suspender la protección antes de tocar particiones. Sin la clave, no se sigue.
- **Backup**: un disco particionado no tiene Ctrl+Z; el respaldo no es opcional.
- **Administrador de discos de Windows**: reducir la partición de Windows y dejar el espacio libre **sin asignar**, sin crear particiones nuevas.
- **No tocar la ESP**: se comparte con Arch; se monta, no se formatea.
- Apagar Windows completamente, no reiniciar con Inicio rápido.
- Si Windows está en BIOS/MBR, el dual boot con UEFI no es posible sin convertir el disco; se avisa y se remite a la documentación.
- Si Windows está en otro disco, se explica dónde dejar el espacio libre.

Mientras tanto: completa 1.2 y 1.5. La instalación en sí se hace en 2.4 (ruta Fácil) o 2.8 (ruta Avanzada).
