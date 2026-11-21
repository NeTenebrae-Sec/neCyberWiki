---
title: "Qué es Arch Linux"
description: "Arch no es difícil: es manual. Entiende qué es una distro independiente, KISS, rolling release y qué vas a construir en este curso."
tags: ["arch-linux", "linux", "distro"]
curso: "arch-linux"
modulo: "preparacion"
modulo_titulo: "Preparación"
submodulo: ""
submodulo_titulo: ""
numero: "1.1"
orden: 0
duracion: ""
nivel: "principiante"
video: ""
variante: "comun"
entorno: "ambos"
arranque: "ambos"
prerrequisitos: []
estado: "publicada"
date: 2026-11-19
---

## Objetivo

Entender qué es Arch Linux, por qué se le llama «difícil» (spoiler: es manual) y qué vas a construir en este curso. Cero comandos: lección 100% conceptual.

## Qué es Arch Linux

Arch Linux es una distribución **independiente**. No es Ubuntu con otro fondo, ni un derivado de Debian, ni un fork de Fedora: tiene su propio sistema de paquetes, su propia filosofía y su propia forma de hacer las cosas.

Su base es mínima. Al terminar la instalación tienes un sistema **funcional**, pero no necesariamente **cómodo**. No viene con escritorio, ni firewall configurado, ni veinte aplicaciones que nunca vas a abrir. Eso lo construyes tú.

Ahí está la diferencia con Ubuntu, Linux Mint o CachyOS: en esas distros, tras instalar ya tienes un sistema listo para usar. En Arch tienes un sistema al que le faltan piezas, y tú decides cuáles poner.

Por eso el mito de «Arch es difícil». No es que sea injusto; es que no te lleva de la mano. Te entrega las piezas y te dice: «hasta aquí llegué, el resto es tuyo».

## KISS: simple por dentro, no fácil por fuera

Arch sigue la filosofía **KISS**: *Keep It Simple, Stupid*. Y mucha gente traduce eso como «Arch es simple de usar». No.

KISS significa que el **sistema** sea lo más sencillo y mínimo posible. Menos capas, menos servicios, menos decisiones tomadas por alguien que no eres tú. La simplicidad es para el sistema, no para ti como usuario.

Por eso Arch no te instala una pantalla de bloqueo, no te configura un firewall y no te mete un entorno gráfico con veinte aplicaciones por defecto. Cada pieza que está, está porque tú la pusiste. Al principio asusta; después lo agradeces: sabes exactamente qué tienes y por qué.

## Rolling release: tu sistema vive en «hoy»

Arch no tiene versiones tipo «Arch 11». No hay una «siguiente versión» que esperar: es **rolling release**, un flujo continuo de actualizaciones. Cada vez que actualizas, recibes los últimos paquetes. Software fresco siempre, sin reinstalar cada seis meses.

Si tienes un Arch de hace años y lo actualizas hoy, tienes lo más reciente. Eso sí: con grandes poderes vienen grandes responsabilidades. Actualizar seguido y leer las noticias de Arch es parte del trato; en la última lección del curso lo vemos con calma.

## Las dos armas secretas: ArchWiki y AUR

**La ArchWiki** es probablemente la mejor documentación de Linux que existe. Está sobre todo en inglés, pero hay artículos en español y hoy traducir una página es lo de menos. Si tienes un problema con Arch, lo más probable es que la respuesta esté ahí, con detalle y directo al grano: <https://wiki.archlinux.org/>.

**El Arch User Repository** (AUR) es un repositorio mantenido por la comunidad donde encuentras muchísimos paquetes que no están en los oficiales. Es una maravilla para la compatibilidad de software, pero no es magia: cualquiera puede subir un paquete, así que hay que revisar lo que instalas. En la lección de AUR lo vemos a fondo con `paru`.

## Qué vas a construir

En este curso terminas con un Arch **funcional, seguro y usable**: un escritorio que tú elegiste (GNOME en la ruta Fácil, BSPWM en la Avanzada), ZRAM en lugar de swap en disco, UFW y DNS pública, `pacman` y `paru` para el software.

La ruta la eliges tú en la ficha del curso: Fácil (archinstall) o Avanzada (instalación manual), en máquina virtual o en hardware real, solo Linux o dual boot. El temario se reorganiza según tu elección; las lecciones comunes son las mismas para todas las rutas.

Lo que **no** verás: LUKS y Secure Boot firmado. Eso es material para otro curso.

## Lo que no vas a necesitar

No necesitas ser un experto en terminal, ni saber programar, ni un doctorado. Sí necesitas **ganas de leer, de equivocarte y de entender**: este no es un tutorial de copiar y pegar. Cada comando va acompañado de qué hace y por qué está ahí.

Los requisitos completos (RAM, disco, USB, backup, internet) están en la ficha del curso y en su checklist.

## Comprobación

1. ¿Qué significa KISS y para quién es la simplicidad?
2. ¿Qué significa «rolling release» y cuál es la regla de oro antes de actualizar?
3. ¿Qué son la ArchWiki y el AUR?
4. ¿Qué decide el temario según tu ruta?
