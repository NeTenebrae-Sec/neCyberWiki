---
title: "ZRAM y mantenimiento"
description: "ZRAM en lugar de swap en disco, swappiness=150 y una rutina de mantenimiento que no te robe la vida."
tags: ["arch-linux", "zram", "mantenimiento"]
curso: "arch-linux"
modulo: "configuracion"
modulo_titulo: "Configuración"
submodulo: ""
submodulo_titulo: ""
numero: "3.4"
orden: 19
duracion: ""
nivel: "principiante"
video: ""
variante: "comun"
entorno: "ambos"
arranque: "ambos"
prerrequisitos: ["3.2"]
estado: "publicada"
date: 2026-11-19
---

## Objetivo

Hacer que tu equipo respire mejor cuando la memoria se llena y montar una rutina de mantenimiento sencilla. Funciona igual en un portátil, un PC de escritorio o una VM.

## Swap: el problema

Cuando la RAM se llena, Linux mueve parte de la memoria al **swap**. Tradicionalmente, el swap es una partición o un archivo en disco, y el disco es mucho más lento que la RAM: cuando el sistema empieza a hacer swap en disco, todo se ralentiza. Por eso en este curso no creamos swap en disco: usamos **ZRAM**.

## Qué es ZRAM

ZRAM crea un dispositivo comprimido **en la propia RAM**: los datos se comprimen con un algoritmo como `zstd` y se guardan ahí. Es mucho más rápido que el disco y, como van comprimidos, cabe más información de la que cabría sin comprimir. El procesador comprime y descomprime a cambio de evitar el cuello de botella del disco; en un escritorio moderno la balanza sale claramente a favor.

## La configuración

Crea `/etc/systemd/zram-generator.conf`:

```ini
[zram0]
zram-size = min(ram * 2, 16384)
compression-algorithm = zstd
```

La fórmula, explicada: `ram` es la memoria total en megabytes; `ram * 2` pide el doble; `min(..., 16384)` lo limita a 16 GB. Con 8 GB de RAM obtienes 16 GB de ZRAM; con 4 GB, 8 GB; con 32 GB se queda en 16 GB. No reserva esos gigas de golpe: el tamaño real depende de cuánto se comprima.

¿Por qué `zstd`? Muy buen equilibrio entre compresión y rendimiento. Los demás en una línea: **lzo**, clásico y rápido con compresión modesta; **lz4**, rapidísima si priorizas velocidad; **lz4hc**, alta compresión a costa de más recursos.

## Swappiness

Como ZRAM es rápido, subimos el `swappiness` (el valor por defecto es 60) a 150, que le dice al kernel que puede mover páginas a ZRAM con más agresividad porque ahí no duele:

```ini
# /etc/sysctl.d/99-swappiness.conf
vm.swappiness = 150
```

`vm.swappiness=150` está pensado para ZRAM. No lo uses tal cual en un sistema con swap en disco.

## Aplicarlo

```bash
sudo nano /etc/systemd/zram-generator.conf
sudo nano /etc/sysctl.d/99-swappiness.conf

sudo systemctl daemon-reload
sudo systemctl start systemd-zram-setup@zram0.service
sudo sysctl --system
```

Si el servicio se queja porque `zram0` ya existe, reinicia el equipo. Verifica:

```bash
zramctl
swapon --show
free -h
```

Deberías ver un `zram0` con algoritmo `zstd` usado como swap.

## Un extra para equipos con poca memoria

`earlyoom` mata procesos cuando la memoria está a punto de agotarse, antes de que el sistema se congele:

```bash
sudo pacman -S --needed earlyoom
sudo systemctl enable --now earlyoom
```

No es obligatorio; con 16 GB o más probablemente no lo necesitas.

## Mantenimiento: la rutina corta

Arch es rolling release: el mantenimiento es parte de la vida, pero no necesitas veinte comandos al día.

1. **Lee las noticias de Arch** antes de una actualización grande: <https://archlinux.org/news/>.
2. **Actualiza con frecuencia**: una vez por semana es suficiente para la mayoría.
3. **Reinicia tras actualizar el kernel**: no es obligatorio en el segundo exacto, pero sí recomendable.
4. **Limpia la caché de paquetes** de vez en cuando: `sudo paccache -r` guarda las tres últimas versiones y elimina el resto; `sudo paccache -rk1` es más agresivo.
5. **Elimina huérfanos**: `pacman -Qtdq | sudo pacman -Rns -`. Si no hay huérfanos, `pacman` se quejará de que no hay objetivos; es normal.

Un sistema bien cuidado no necesita veinte comandos al día.

## Qué sigue

ZRAM funcionando y rutina de mantenimiento en su sitio. En la siguiente lección, el firewall con UFW y una DNS pública.
