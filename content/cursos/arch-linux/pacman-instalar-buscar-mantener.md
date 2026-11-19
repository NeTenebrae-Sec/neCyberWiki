---
title: "Pacman: instalar, buscar y mantener"
description: "Domina pacman: buscar, instalar, actualizar y eliminar paquetes sin romper Arch con una actualización parcial."
tags: ["arch-linux", "pacman", "paquetes"]
curso: "arch-linux"
modulo: "configuracion"
modulo_titulo: "Configuración"
submodulo: ""
submodulo_titulo: ""
numero: "3.2"
orden: 17
duracion: ""
nivel: "principiante"
video: ""
variante: "comun"
entorno: "ambos"
arranque: "ambos"
prerrequisitos: ["3.1"]
estado: "publicada"
date: 2026-11-19
---

## Objetivo

Entender `pacman`, instalar tu kit básico de usuario y no romper nada por el camino. El AUR llega en la siguiente lección; la limpieza y el mantenimiento, en 3.4.

## Qué es pacman

`pacman` es el gestor de paquetes de Arch: descarga, instala, actualiza y elimina software desde los repositorios oficiales. Los tres principales:

- **core**: lo mínimo para que el sistema funcione.
- **extra**: la mayoría del software.
- **multilib**: paquetes de 32 bits, útiles para Steam, Wine y aplicaciones antiguas.

## Los comandos esenciales

**Buscar:**

```bash
pacman -Ss navegador
pacman -Si firefox
```

`-Ss` busca por nombre o descripción; `-Si` muestra la información de un paquete antes de instalarlo.

**Instalar:**

```bash
sudo pacman -S firefox
sudo pacman -S --needed firefox vlc git
```

`--needed` evita reinstalar lo que ya tienes.

**Actualizar todo:**

```bash
sudo pacman -Syu
```

**Eliminar:**

```bash
sudo pacman -Rns paquete
```

`-R` elimina, `-n` los archivos de configuración y `-s` las dependencias huérfanas. Es la forma limpia de desinstalar.

**Ver qué tienes:**

```bash
pacman -Q
pacman -Qe
```

`-Q` lista todo; `-Qe` solo lo que instalaste explícitamente.

## La regla que evita romper Arch

Una **actualización parcial** es `pacman -Sy paquete`, o `pacman -S paquete` tras refrescar la base de datos sin actualizar el sistema. Puede dejar bibliotecas viejas con paquetes nuevos que esperan bibliotecas nuevas: el famoso «rompí Arch».

La regla:

- Para instalar algo: `sudo pacman -S paquete`.
- Para actualizar todo: `sudo pacman -Syu`.
- Para actualizar e instalar a la vez: `sudo pacman -Syu paquete`.

Nunca `pacman -Sy paquete`. Y si `pacman` avisa de un conflicto, lee el mensaje: no escribas «sí» por reflejo. Si algo sale mal, `/var/log/pacman.log` guarda el log de todo lo que pasó.

## El kit de usuario normal

Un punto de partida sensato:

```bash
sudo pacman -S --needed \
  firefox \
  libreoffice-fresh \
  vlc \
  file-roller \
  7zip \
  unzip \
  pciutils \
  rsync \
  noto-fonts \
  noto-fonts-emoji \
  ttf-liberation \
  htop \
  nano \
  git \
  base-devel \
  reflector \
  pacman-contrib \
  ufw \
  zram-generator
```

- **Navegador:** `firefox`.
- **Oficina:** `libreoffice-fresh` (en español: `libreoffice-fresh-es`).
- **Archivos y multimedia:** `vlc`, `file-roller`, `7zip`, `unzip`.
- **Fuentes:** `noto-fonts`, `noto-fonts-emoji`, `ttf-liberation`.
- **Herramientas:** `git`, `base-devel`, `htop`, `nano`, `pciutils`, `rsync`, `reflector`, `pacman-contrib`, `ufw`, `zram-generator`.

Si pregunta por los miembros del grupo `base-devel`, pulsa **Enter** para seleccionarlos todos. Instalamos `ufw` y `zram-generator` ya porque las lecciones 3.4 y 3.5 los necesitan.

## Leer antes de confirmar

`pacman` no es peligroso si lo lees: mira la lista de paquetes, el tamaño de la descarga y los avisos. Si te pide reemplazar un paquete, entiende por qué. Si hay una intervención manual, no la ignores.

## Qué sigue

Ya sabes instalar, actualizar, buscar y eliminar. En la siguiente lección, el AUR y `paru`.
