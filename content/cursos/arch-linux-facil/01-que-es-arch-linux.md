---
title: "Qué es Arch Linux (y qué vas a construir)"
description: "Arch no es difícil: es manual. Entiende qué es una distro independiente, qué significan KISS, rolling release y AUR, y qué construirás en esta serie."
tags: ["arch-linux", "linux", "distro"]
curso: "arch-linux-facil"
modulo: "fundamentos-y-preparacion"
modulo_titulo: "Fundamentos y preparación"
submodulo: "1.1"
submodulo_titulo: "Antes de instalar"
orden: 0
duracion: "8 min"
nivel: "principiante"
video: ""
date: 2026-11-09
---

## Objetivo

Entender qué es Arch Linux, por qué se le llama "difícil" (spoiler: es manual) y qué vas a construir en la serie. **Cero comandos: episodio 100% conceptual.**

## Notas

**Arch Linux** es una distribución GNU/Linux independiente, no "Ubuntu con otro fondo". Se construye desde una base mínima y **tú decides qué va encima**: escritorio, navegador, editor, servicios. Por eso, tras instalar Arch tienes un sistema *funcional*, pero no necesariamente *cómodo* — lo cómodo lo construyes tú.

**KISS (*Keep It Simple, Stupid*):** la simplicidad es para el sistema, no siempre para el usuario. Arch no trae pantalla de bloqueo, firewall ni apps de regalo: menos cosas automáticas, menos decisiones tomadas por otros.

Ventajas: sistema a tu medida · más ligero · aprendes Linux de verdad.
Desventajas: te toca leer · te toca configurar · actualizar sin mirar puede romper cosas.

**Rolling release:** no hay "Arch 2026". Las actualizaciones fluyen de forma continua. Regla de oro: **antes de actualizar, mira las noticias de Arch** (`archlinux.org/news/`). No es miedo; es leer antes de pulsar Enter.

**Dos cosas que hacen especial a Arch:**

1. **La ArchWiki** — probablemente la mejor documentación de Linux que existe. Si tienes un problema, la respuesta suele estar ahí.
2. **El AUR** — repositorio mantenido por la comunidad con paquetes que no están en los oficiales. Es una maravilla, pero revisa siempre lo que instalas.

**¿Por qué dicen que es difícil?** Porque no te esconde nada: no hay botón mágico; hay que leer y entender. Y eso es justo lo bonito: terminas con **tu** Linux.

## Qué vamos a construir

- UEFI con Secure Boot desactivado · GPT, disco completo con particionado automático
- systemd-boot · ext4 · GNOME + GDM · ZRAM (sin swap en disco) · UFW + DNS pública
- `pacman` y `paru` para software

Lo que **no** haremos esta temporada: LUKS, Secure Boot firmado, instalación manual, dual boot, BSPWM. Todo eso es la **temporada avanzada**.

## Ejercicio

Escribe en un papel (o en un `.txt`) qué esperas aprender de la serie y qué sabes hoy de Linux. Al final del curso vuelve a esa lista.

## Comprobación

1. ¿Qué significa KISS y para quién es la simplicidad?
2. ¿Qué significa "rolling release" y cuál es la regla de oro antes de actualizar?
3. ¿Qué son la ArchWiki y el AUR?
4. ¿Qué es `archinstall` y por qué lo usaremos?
