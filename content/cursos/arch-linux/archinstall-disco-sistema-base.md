---
title: "archinstall: disco y sistema base"
description: "Configura disco, bootloader, hostname y usuarios dentro de archinstall. Nada se instala todavía: tu disco sigue intacto."
tags: ["arch-linux", "archinstall", "systemd-boot", "ext4"]
curso: "arch-linux"
modulo: "instalacion"
modulo_titulo: "Instalación"
submodulo: ""
submodulo_titulo: ""
numero: "2.2"
orden: 8
duracion: ""
nivel: "principiante"
video: ""
variante: "facil"
entorno: "ambos"
arranque: "ambos"
prerrequisitos: ["2.1"]
estado: "publicada"
date: 2026-11-19
---

## Objetivo

Configurar dentro de `archinstall` el idioma, mirrors, disco, bootloader, hostname y usuarios. Importante: en esta lección **todavía no se instala nada**. El botón de Install llega en la lección siguiente, con el escritorio ya elegido.

## Antes de abrir archinstall

Repite conmigo: **esto borra el disco**. Si no tienes backup, pausa aquí y hazlo.

Mira qué discos tienes:

```bash
lsblk
```

Y abre el instalador:

```bash
archinstall
```

Se abre una TUI: se maneja con flechas, Enter y las letras indicadas. Los nombres exactos de los menús pueden cambiar entre versiones; si ves algo parecido a lo que se muestra aquí, es lo mismo.

## Idioma, teclado y locale

El idioma del instalador solo cambia los menús; si prefieres inglés, déjalo así. Para el teclado: `es` (España) o `la-latin1` (Latinoamérica); con `/` puedes buscar en la lista.

El **locale** es el idioma y la codificación del sistema. Selecciona el de tu país (o `en_US.UTF-8`), pero que sea **UTF-8**: es el estándar que entiende todos los caracteres del mundo.

## Mirrors

Los mirrors son copias de los repositorios repartidas por el mundo. Recomendación:

- Selecciona **Worldwide** y tu país (o los más cercanos).
- No actives los repositorios de testing: pueden romper cosas.
- Activa **Multilib** solo si usas Steam, Wine o programas de 32 bits.
- No toques los repositorios personalizados.

## Disk configuration

Entra en **Disk configuration** y elige la opción de configuración automática (algo como **Best-effort default layout**; el nombre exacto varía por versión). Recuerda lo que vimos en 2.1: el layout por defecto crea la **ESP** en FAT32 montada en `/boot` y una raíz **ext4** con el resto. Tú confirmas el disco; el instalador hace el resto.

Selecciona el disco fijándote en tamaño y nombre. Luego el sistema de archivos:

- **ext4**: el que vamos a usar.
- **BTRFS**: válido si ya sabes qué haces; en la ruta avanzada se profundiza.

El best-effort no pregunta por separar `/home`: crea una sola raíz. Si pregunta por **swap**, elige **none** (usaremos ZRAM, lección 3.4).

## Si vas a hacer dual boot

Pausa importante: si vas a compartir el disco con Windows, **no elijas «usar el disco completo»** ni dejes que el instalador toque la ESP de Windows. Mira antes la lección **2.4 — Dual boot con archinstall**: cómo elegir el espacio libre y montar la ESP compartida sin formatearla. Después vuelves aquí.

## Bootloader

El bootloader arranca el sistema cuando enciendes el PC: es el intermediario entre la UEFI y Arch. En UEFI limpio la opción sensata es **systemd-boot**: está diseñado para ese escenario, encaja con el `systemd` que ya corre Arch y para un sistema único GRUB sería complejidad que no aporta. GRUB manda cuando sales del escenario UEFI puro: BIOS/MBR o detección de sistemas en dual boot.

Unified Kernel Images e **Install to removable location**: desactivadas. No las necesitamos.

## Hostname, root y usuario

El **hostname** es el nombre del PC (`arch-casa`, `miarch`…): que sea fácil de identificar. Luego la contraseña de **root**: el superusuario con permisos absolutos; usa una distinta a la de tu usuario.

Después crea tu **usuario**: nombre en minúsculas y sin espacios, contraseña para el escritorio y, a la pregunta de sudo, **sí**: necesitas permisos de administrador para instalar paquetes. La opción de U2F (llaves físicas) déjala desactivada.

## Revisión antes de seguir

Antes de pasar a la siguiente lección, revisa la configuración:

- Disco correcto.
- ext4, GPT/UEFI, systemd-boot, sin swap.
- Hostname y usuario con sudo.

Si todo está bien, guarda la configuración si quieres tenerla de referencia y **no instales todavía**. En la siguiente lección elegimos el escritorio y ahí sí le das a Install.

## Qué sigue

Hoy solo configuraste opciones: tu disco sigue intacto. La instalación real ocurre en la siguiente lección, cuando elijas escritorio y pulses Install.
