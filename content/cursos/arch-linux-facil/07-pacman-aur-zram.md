---
title: "Pacman, el AUR y ZRAM"
description: "Domina pacman sin miedo: kit de usuario normal, AUR con paru (lee el PKGBUILD), swap vs ZRAM (zstd, min(ram*2,16GB), swappiness=150) y mantenimiento semanal."
tags: ["arch-linux", "pacman", "aur", "zram"]
curso: "arch-linux-facil"
modulo: "tu-arch-usable"
modulo_titulo: "Tu Arch, usable y seguro"
submodulo: "3.1"
submodulo_titulo: "Paquetes y AUR"
orden: 6
duracion: "10 min"
nivel: "principiante"
video: ""
date: 2026-11-09
---

## Objetivo

Dominar `pacman` básico, instalar el kit de usuario normal, conocer el AUR con `paru` y configurar **ZRAM** en lugar de swap en disco.

## Notas

### Qué es pacman

`pacman` gestiona paquetes desde los repositorios: **core** (mínimo), **extra** (la mayoría), **multilib** (32 bits, Steam/Wine).

### Comandos esenciales

```bash
pacman -Ss navegador      # buscar
pacman -Si firefox        # información
sudo pacman -S firefox    # instalar
sudo pacman -S --needed firefox vlc git   # varios; omitir los ya instalados
sudo pacman -Syu          # actualizar TODO
sudo pacman -Rns paquete  # eliminar (con configuraciones y dependencias)
pacman -Q                 # ver todo instalado
pacman -Qe                # solo lo instalado por ti
```

**Regla de oro — nunca actualices a medias:** instalar = `-S` · actualizar = `-Syu`. Nada de `-Sy` suelto. Si pacman avisa de un conflicto, lee el mensaje.

### El kit de usuario normal

```bash
sudo pacman -S --needed \
  firefox libreoffice-fresh vlc file-roller 7zip unzip pciutils rsync \
  noto-fonts noto-fonts-emoji ttf-liberation \
  htop nano git base-devel reflector pacman-contrib ufw zram-generator
```

`base-devel` y `git` también hacen falta para el AUR. Para LibreOffice en español: `libreoffice-fresh-es`.

### El AUR y paru

El **AUR** (*Arch User Repository*) es mantenido por la **comunidad**, no por Arch. Hay de todo — revisa lo que instalas.

```bash
git clone https://aur.archlinux.org/paru.git
cd paru
makepkg -si          # construye e instala
cd ~
paru --version
```

Comandos casi idénticos a pacman: `paru -Syu`, `paru -S paquete`, `paru -Ss término`, `paru -Rns paquete`. Cuando paru muestre un **PKGBUILD**, léelo: de dónde descarga, qué ejecuta, quién lo mantiene. Si huele raro, no lo instales.

### ZRAM: por qué no usamos swap en disco

El disco es lento; la RAM es rápida. **ZRAM** crea un dispositivo comprimido dentro de la propia RAM (`zstd`). Más información cabe comprimida y el acceso es ultrarrápido.

```ini
# /etc/systemd/zram-generator.conf
[zram0]
zram-size = min(ram * 2, 16384)
compression-algorithm = zstd
```

Con 8 GB RAM → 16 GB de ZRAM; con 4 GB → 8 GB; con 32 GB → tope de 16 GB. Por ser rápido, subimos el `swappiness`:

```ini
# /etc/sysctl.d/99-swappiness.conf
vm.swappiness = 150
```

> `swappiness=150` **solo con ZRAM**. Con swap en disco un valor así te congela el equipo.

```bash
sudo nano /etc/systemd/zram-generator.conf
sudo nano /etc/sysctl.d/99-swappiness.conf
sudo systemctl daemon-reload
sudo systemctl start systemd-zram-setup@zram0.service
sudo sysctl --system
zramctl && swapon --show && free -h
```

Extras: `earlyoom` mata procesos antes de que la memoria se agote (ideal con 4–8 GB).

### Mantenimiento semanal

1. **Lee las noticias de Arch** antes de actualizar (`archlinux.org/news/`).
2. Actualiza **una vez por semana**.
3. Si actualizó el kernel → reinicia.
4. Limpia caché: `sudo paccache -r` (guarda las 3 últimas versiones).
5. Huérfanos: `pacman -Qtdq | sudo pacman -Rns -`

## Ejercicio

Instala `zram-generator`, escribe las dos configs anteriores, aplica y verifica con `zramctl` y `free -h`. Ejemplo de referencia: con 4 GB RAM, `zramctl` debe reportar zram0 con ~8 GB de tamaño.

## Comprobación

1. ¿Qué significa `-Rns` y por qué es la forma limpia de desinstalar?
2. ¿Qué es el AUR y quién lo mantiene?
3. ¿Qué hace `min(ram * 2, 16384)`?
4. ¿Por qué `swappiness=150` es seguro solo con ZRAM?
