---
title: "El disco: GPT, ESP y decisiones"
description: "Antes de instalar: identifica tu disco, entiende qué son GPT, la ESP y la raíz, y decide entre solo Linux o dual boot."
tags: ["arch-linux", "disco", "gpt", "esp"]
curso: "arch-linux"
modulo: "instalacion"
modulo_titulo: "Instalación"
submodulo: ""
submodulo_titulo: ""
numero: "2.1"
orden: 7
duracion: ""
nivel: "principiante"
video: ""
variante: "comun"
entorno: "ambos"
arranque: "ambos"
prerrequisitos: ["1.7"]
estado: "publicada"
date: 2026-11-19
---

## Objetivo

Entender qué hay en un disco, qué piezas necesita Arch y qué decisiones tienes que tomar **antes** de instalar. Los conceptos son los mismos en hardware real y en una VM; lo que cambia es el nombre del disco.

## Antes de nada: el backup

Repite conmigo: **esto borra el disco**. Si tienes algo importante, ya deberías tener el backup hecho. Un disco formateado no se recupera con Ctrl+Z, y ninguna herramienta de recuperación es tan barata como una copia. En VM el riesgo es menor, pero la costumbre se entrena desde el primer día.

## Cómo identificar tu disco

Antes de tocar nada, mira qué discos tienes:

```bash
lsblk
```

Fíjate en el **nombre** (`sda`, `nvme0n1`, `vda`), el **tamaño** y el **modelo**. Si tienes un disco de 500 GB y otro de 2 TB, no queremos sorpresas. En una VM verás un disco virtual más pequeño; ese es el tuyo.

La regla es simple: si dudas de cuál es tu disco, sal del instalador, vuelve a mirar con `lsblk` y no continúes hasta estar seguro.

## GPT: el mapa del disco

GPT es el mapa que le dice al firmware dónde empieza y dónde termina cada partición. No es un sistema de archivos ni el sistema operativo: es la tabla de contenidos del disco.

Ya viste MBR vs GPT en la lección de la UEFI. Lo importante aquí es que en este curso vamos con **GPT + UEFI**, el estándar de cualquier PC moderno. GPT guarda copias de la tabla, soporta discos grandes y no se limita a cuatro particiones. El instalador escribirá ese mapa por ti; tú decides **qué parcelas** quieres dentro.

## Las dos piezas que necesita Arch

Para una instalación limpia de un solo sistema, el layout por defecto son dos piezas:

- **ESP**: partición pequeña en **FAT32**, montada en `/boot`. Es la puerta por la que entra el firmware UEFI al encender: ahí vive el bootloader. Con 512 MB o 1 GB vas sobrado.
- **Raíz**: partición grande con **ext4** que ocupa el resto del disco. Ahí vive todo: el kernel, los programas y tu carpeta personal. Una sola raíz, sin malabares.

¿Y separar `/home`? Se puede, y tiene ventajas si algún día reinstalas, pero añade una decisión más a tu primera instalación. Cuando quieras complicarte, la ArchWiki tiene la puerta abierta: <https://wiki.archlinux.org/title/Partitioning>.

## Swap: ninguna, vamos con ZRAM

Si el instalador pregunta por swap, elige **none**. No queremos una partición de swap en el disco: más adelante configuramos **ZRAM**, un dispositivo comprimido dentro de la RAM, mucho más rápido que el disco (lección 3.4). Por ahora: sin swap en disco, ZRAM después.

## ext4 o BTRFS

- **ext4**: el clásico, estable y fácil de recuperar. Es el que vamos a usar.
- **BTRFS**: más moderno, con subvolúmenes, compresión e instantáneas. Excelente opción, pero añade conceptos que no necesitas en tu primera instalación.

Si ya sabes que quieres BTRFS puedes elegirlo y dejar la configuración por defecto; si es tu primera vez, ext4 te dará menos sorpresas.

## Disco completo o espacio libre

Esta es la decisión que cambia según tu arranque:

- **Solo Linux**: Arch puede usar el disco completo. El instalador borra lo que haya y crea ESP + raíz.
- **Dual boot**: necesitas **espacio libre sin asignar** y una **ESP compartida** con Windows. Esa ESP no se formatea: se monta. La preparación desde Windows la viste en 1.6; el paso concreto está en la lección de dual boot de tu ruta (2.4 o 2.8).

Si estás en el primer caso, no tienes que hacer nada más. Si estás en el segundo, no toques «usar disco completo» ni de broma.

## La regla de oro

Antes de confirmar cualquier cosa, revisa dos veces: que el disco es el correcto y que el tamaño coincide con el que esperas. Si algo no cuadra, cancela y vuelve a empezar. Y si el instalador ofrece borrar una partición que no reconoces, para: pregunta, revisa o mira la ArchWiki. No hay prisa.

## Qué sigue

Ya sabes qué piezas necesita el disco y por qué. En la siguiente lección lo pones en práctica: con `archinstall` en la ruta Fácil, o a mano en la Avanzada.
