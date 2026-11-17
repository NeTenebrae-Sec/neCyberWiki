---
title: "Seguridad, ~/HOME y dotfiles"
description: "Cierra la serie: UFW (deny incoming, allow outgoing), DNS pública con NetworkManager, cómo se organiza tu carpeta personal, qué son los dotfiles y backups."
tags: ["arch-linux", "ufw", "dotfiles", "backup", "seguridad"]
curso: "arch-linux-facil"
modulo: "tu-arch-usable"
modulo_titulo: "Tu Arch, usable y seguro"
submodulo: "3.2"
submodulo_titulo: "Seguridad y HOME"
orden: 7
duracion: "10 min"
nivel: "principiante"
video: ""
date: 2026-11-09
---

## Objetivo

Dejar tu Arch seguro y entendible: **UFW**, DNS pública, `~/HOME` ordenado, qué son los dotfiles y cómo mantener un backup que sirva de algo.

## Notas

### UFW: firewall para humanos

`iptables`/`nftables` son potentes pero espartanos. **UFW** (*Uncomplicated Firewall*) es una capa sencilla: por defecto **bloquea lo que entra, permite lo que sale**.

```bash
sudo pacman -S --needed ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw enable                 # te avisa de SSH activo
sudo ufw status verbose
sudo systemctl enable ufw
```

> **Si estás por SSH:** abre el puerto **antes** de activar: `sudo ufw limit ssh` (limita intentos; mejor que `allow`). SSH fuera de una red local → ni lo abras.

Un firewall no te salva de descargar un ejecutable raro. La seguridad son hábitos: no reutilizar contraseñas, no ejecutar scripts desconocidos, actualizar.

### DNS pública

Tu router da DNS por defecto; cambiarlo puede ser más rápido y darte más control. Opciones conocidas: **Cloudflare** `1.1.1.1`, **Quad9** `9.9.9.9` (bloquea dominios maliciosos).

```bash
nmcli connection show --active                 # anota el nombre exacto
nmcli connection modify "Wired connection 1" ipv4.dns "1.1.1.1 1.0.0.1"
nmcli connection modify "Wired connection 1" ipv4.ignore-auto-dns yes
nmcli connection up "Wired connection 1"
nmcli connection show "Wired connection 1" | grep ipv4.dns
ping -c 4 archlinux.org
```

Una DNS pública igual ve tus consultas — elige una en la que confíes.

### Cómo se organiza tu HOME

`~` = `/home/tu-usuario`. `ls -la ~` muestra carpetas visibles y ocultas (empiezan por punto).

- **XDG:** `~/.config` = configuración · `~/.local/share` = datos · `~/.cache` = caché (borrable).
- Otras importantes: `~/.ssh` (claves — nunca se toca a la ligera), `~/.bashrc`, `~/.gitconfig`, `~/.local/bin`.

### Dotfiles: tu configuración es texto

Los **dotfiles** (`.bashrc`, `.gitconfig`, `.config/`) son texto plano: se copian, se versionan y se restauran. Un alias útil:

```bash
nano ~/.bashrc
# alias actualizar='sudo pacman -Syu'
source ~/.bashrc
```

Gestores: copia manual · repo Git desnudo · **GNU Stow** · **chezmoi**. En esta serie solo te los presento. **Nunca subas secretos a Git** (SSH, tokens, `.env`).

### Backups: el seguro que nadie quiere pagar

```bash
rsync -av --exclude='.cache' ~/ /ruta/del/backup/
```

**Un backup que nunca probaste a restaurar no es un backup — es esperanza.**

### Checklist final de la temporada

- [ ] UEFI + GPT + systemd-boot
- [ ] GNOME con GDM
- [ ] `sudo pacman -Syu` funcionando
- [ ] Red y audio verificados
- [ ] Kit de usuario instalado · `paru` con AUR
- [ ] ZRAM con `zstd` y `swappiness=150`
- [ ] UFW activo (`deny incoming`)
- [ ] DNS pública (opcional)
- [ ] Sabes dónde vive tu configuración
- [ ] Backup al día

## Ejercicio

1. Activa UFW con las reglas de arriba y verifica `sudo ufw status verbose`.
2. Crea el alias `actualizar` y prueba que funciona.
3. Define un destino de backup (USB/nube/PC) y copia tu home con `rsync`.

## Comprobación

1. ¿Qué políticas pone UFW por defecto y por qué ese orden?
2. ¿Qué significa XDG y qué va en cada carpeta?
3. ¿Qué son los dotfiles y qué **nunca** debe versionarse?
4. ¿Por qué probar la restauración es parte del backup?
