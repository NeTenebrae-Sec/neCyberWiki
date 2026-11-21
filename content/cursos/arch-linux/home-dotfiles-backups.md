---
title: "HOME, dotfiles y backups + checklist"
description: "Dónde vive tu configuración, qué son los dotfiles, cómo hacer un backup que sirva y la checklist final del curso."
tags: ["arch-linux", "dotfiles", "backups", "checklist"]
curso: "arch-linux"
modulo: "configuracion"
modulo_titulo: "Configuración"
submodulo: ""
submodulo_titulo: ""
numero: "3.6"
orden: 21
duracion: ""
nivel: "principiante"
video: ""
variante: "comun"
entorno: "ambos"
arranque: "ambos"
prerrequisitos: ["3.5"]
estado: "publicada"
date: 2026-11-19
---

## Objetivo

Entender dónde vive tu configuración, qué son los dotfiles, cómo hacer un backup de verdad y cerrar con la checklist final del curso.

## Tu carpeta personal

Tu usuario vive en `/home/tu-usuario`, abreviado `~`. Dentro están tus documentos, descargas y fotos, y sobre todo tu configuración:

```bash
ls -la ~
```

`-l` muestra detalles y `-a` incluye los ocultos: en Linux, un archivo que empieza por punto está oculto. Las carpetas ocultas importantes:

- `~/.config` — configuración de la mayoría de aplicaciones modernas.
- `~/.local/share` — datos de aplicaciones; `~/.local/bin` — ejecutables propios.
- `~/.cache` — caché; se puede borrar sin miedo, aunque algunas apps tardarán en arrancar.
- `~/.ssh` — claves y configuración de SSH; no se toca a la ligera.
- `~/.bashrc`, `~/.zshrc`, `~/.gitconfig` — configuración de la shell y de Git.

El estándar que organiza esto se llama **XDG Base Directory**: la configuración va en `~/.config`, los datos en `~/.local/share` y la caché en `~/.cache`. Muchas aplicaciones modernas lo respetan; otras guardan cosas directamente en `~`.

## Qué son los dotfiles

Los **dotfiles** son los archivos de configuración que empiezan por punto. Su gracia es que son **texto**: puedes copiarlos, versionarlos y restaurarlos en otro equipo. Si alguna vez reinstalas Arch, recuperas tu configuración en minutos en lugar de pasar horas tocando cosas.

Un ejemplo sencillo: un alias para actualizar el sistema, añadido a `~/.bashrc`:

```bash
nano ~/.bashrc
```

```bash
alias actualizar='sudo pacman -Syu'
```

Guarda, sal y recarga:

```bash
source ~/.bashrc
```

Nunca subas a Git tus claves SSH, tokens de API, contraseñas ni archivos `.env`: los dotfiles son para configuración, no para secretos.

## Backups

No necesitas un sistema empresarial. Puedes empezar con:

```bash
rsync -av --exclude='.cache' ~/ /ruta/del/backup/
```

Ese comando copia tu carpeta personal excluyendo la caché. Disco externo, otro PC o la nube: úsalos. Y no olvides los dotfiles: `~/.config`, `~/.bashrc`, `~/.gitconfig` y, con cuidado, `~/.ssh`.

Un backup que nunca has probado a restaurar no es un backup; es una esperanza. Prueba a recuperar un archivo de vez en cuando. Si puedes, automatiza la copia con `systemd` timers o `cron`; pero primero hazla funcionar a mano.

## Checklist final

Si llegaste hasta aquí, deberías tener:

- Arch Linux instalado y arrancando.
- Sistema actualizado con `pacman -Syu`.
- Red y audio comprobados.
- Kit de usuario normal instalado.
- `paru` funcionando para el AUR.
- ZRAM activo con `zstd` y `swappiness=150`.
- UFW activo con política `deny incoming`.
- DNS pública configurada (opcional, recomendable).
- Una idea clara de dónde vive tu configuración.
- Un backup de lo importante.

Si algo no está en la lista, no pasa nada: vuelve a la lección correspondiente y lo ajustas. Este curso es una guía, no un examen.

## El curso termina aquí

No importa si tu escritorio no se ve como el de un «ricer» de YouTube: importa que sabes dónde está cada cosa y que puedes cambiarla. Arch no es una distro para presumir, es una distro para aprender.

Si quieres seguir, tienes tres herramientas: **la ArchWiki** (<https://wiki.archlinux.org/>), **las noticias de Arch** (<https://archlinux.org/news/>) y **la comunidad**. Pregunta, pero muestra lo que intentaste.

Y si quieres el mismo curso por la otra ruta —Fácil o Avanzada, VM o hardware, solo Linux o dual boot—, la ficha del curso te deja cambiar la dificultad y el temario se reorganiza: las lecciones que ya viste se quedan, las específicas aparecen.
