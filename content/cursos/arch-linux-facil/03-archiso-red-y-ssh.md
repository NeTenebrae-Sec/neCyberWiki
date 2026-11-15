---
title: "Archiso: terminal, red y SSH"
description: "Pierde el miedo a la terminal: configura el teclado con loadkeys, conéctate por Ethernet o Wi-Fi con iwctl, y opcionalmente entra por SSH."
tags: ["arch-linux", "terminal", "red", "ssh"]
curso: "arch-linux-facil"
modulo: "fundamentos-y-preparacion"
modulo_titulo: "Fundamentos y preparación"
submodulo: "1.2"
submodulo_titulo: "Dentro de Archiso"
orden: 2
duracion: "8 min"
nivel: "principiante"
video: ""
date: 2026-11-09
---

## Objetivo

Configurar el teclado, conectar el PC a internet y (opcional) preparar SSH. **SSH es opcional**: si ni lo necesitas, salta al siguiente bloque.

## Notas

### La terminal en 60 segundos

El **prompt** es lo que ves antes del cursor. En Archiso:

```text
root@archiso ~ #
```

Significa: usuario `root`, equipo `archiso`, carpeta personal (`~`), y `#` = permisos de administrador.

Cuatro imprescindibles: `ls` (lista), `cd` (cambiar carpeta), `pwd` (dónde estoy), `Ctrl + C` (cancelar). **Tab** autocompleta: tu amigo más útil.

### Teclado

```bash
loadkeys es          # España
loadkeys la-latin1   # Latinoamérica
localectl list-keymaps  # ver todas las opciones
```

Comprueba que `@` o `\` aparecen donde deben.

### Ethernet (recomendado)

```bash
ip a                       # busca tu interfaz: enp3s0, eno1, eth0…
ping -c 4 archlinux.org    # si responde, hay red
```

Si no tienes cable, el portátil puede estar bloqueado por hardware: `rfkill list` / `sudo rfkill unblock wifi`.

### Wi-Fi con `iwctl`

```bash
iwctl
device list                       # identifica tu tarjeta (p. ej. wlan0)
station wlan0 scan
station wlan0 get-networks
station wlan0 connect "MiWiFi"    # te pide la contraseña
quit
ping -c 4 archlinux.org
```

`nmcli` llega más tarde, cuando NetworkManager esté instalado (episodio 6).

### SSH (opcional, solo red local de confianza)

```bash
passwd                 # contraseña de root
systemctl start sshd   # arranca el servidor
ip a                   # anota la IP (p. ej. 192.168.1.50)
# Desde tu otro PC:
ssh root@192.168.1.50
```

Con `tmux` la sesión sobrevive a cortes: `tmux new -s arch`.

> **Advertencia:** SSH como root solo en tu red local. Nunca lo expongas a internet.

## Ejemplo práctico

Flujo completo verificado: `loadkeys es` → `ping -c 4 archlinux.org` (responde) → `archinstall`.

## Ejercicio

Conéctate por Wi-Fi con `iwctl` y ejecuta `ping -c 4 archlinux.org`. Si tienes VM o segundo PC, prueba SSH.

## Comprobación

1. ¿Qué significan las partes del prompt `root@archiso ~ #`?
2. ¿Qué comando se usa para Wi-Fi en Archiso y cuál más tarde?
3. ¿Por qué SSH como root es peligroso fuera de tu red local?
