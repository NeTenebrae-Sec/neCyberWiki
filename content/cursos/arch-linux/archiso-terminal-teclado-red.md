---
title: "Archiso: terminal, teclado y red"
description: "Sobrevivir a la primera terminal: teclado en español, red por cable o Wi-Fi con iwctl y SSH opcional para instalar cómodo."
tags: ["arch-linux", "archiso", "wifi", "ssh"]
curso: "arch-linux"
modulo: "preparacion"
modulo_titulo: "Preparación"
submodulo: ""
submodulo_titulo: ""
numero: "1.7"
orden: 6
duracion: ""
nivel: "principiante"
video: ""
variante: "comun"
entorno: "ambos"
arranque: "ambos"
prerrequisitos: ["1.2"]
estado: "publicada"
date: 2026-11-19
---

## Objetivo

Configurarte dentro de Archiso: teclado, red y, opcionalmente, SSH. Esta lección es común: te sirve igual en hardware real que en una VM, por la ruta Fácil o por la Avanzada.

Para llegar aquí necesitas el medio de arranque listo: USB y UEFI en hardware (1.3 y 1.5), la máquina virtual si aplica (1.4), y la preparación de Windows si vas a dual boot (1.6).

## La terminal en 60 segundos

Lo que ves antes del cursor es el **prompt**. En Archiso suele ser:

```text
root@archiso ~ #
```

Estás como `root` en el equipo `archiso`, en tu carpeta personal (`~`); el `#` indica permisos de administrador. Lo básico:

- `ls` lista archivos; `cd` cambia de carpeta; `pwd` dice dónde estás.
- `Ctrl + C` cancela un comando colgado; `cat` vuelca un archivo; `less` lo pagina (sales con `q`).
- `nano` es un editor sencillo: guardas con `Ctrl + O` y sales con `Ctrl + X`.
- **Tab autocompleta** nombres de archivos y comandos.

## Teclado

Archiso carga por defecto el teclado en inglés. Para España:

```bash
loadkeys es
```

Para Latinoamérica:

```bash
loadkeys la-latin1
```

Prueba escribiendo `@` o `\`. Si aparecen donde deberían, ya está. Si usas otra distribución, lista las opciones con `localectl list-keymaps`.

## Red por cable

Si puedes usar cable, úsalo: es más estable y te ahorra el drama del Wi-Fi durante la instalación. Comprueba las interfaces:

```bash
ip a
```

Verás algo como `enp3s0`, `eno1` o `eth0`. Si tiene IP asignada, ya tienes red. Pruébala:

```bash
ping -c 4 archlinux.org
```

## Wi-Fi con iwctl

Si no hay cable, usa `iwctl`:

```bash
iwctl
```

Dentro, lista los dispositivos (tu tarjeta suele ser `wlan0`, aunque puede llamarse `wlp2s0`):

```text
device list
station wlan0 scan
station wlan0 get-networks
station wlan0 connect "NOMBRE_DE_TU_WIFI"
quit
```

Te pedirá la contraseña. Sal con `quit` y comprueba con `ping -c 4 archlinux.org`.

Si la tarjeta no aparece: revisa que no esté bloqueada por software con `rfkill list` (y `rfkill unblock wifi` si hace falta), vuelve a listar dispositivos y, en equipos muy nuevos, comprueba el paquete `linux-firmware`. `nmcli` es para cuando el sistema ya esté instalado: en Archiso todavía no hay NetworkManager.

## SSH opcional

Opcional pero muy cómodo, sobre todo en VM: instalas desde tu terminal principal, con tu teclado y tu portapapeles. En Archiso, define una contraseña para root y arranca el servicio:

```bash
passwd
systemctl start sshd
ip a
```

Desde tu PC principal:

```bash
ssh root@192.168.1.50
```

Acepta la huella del host y escribe la contraseña. Si el servidor rechaza el login de root, edita temporalmente `PermitRootLogin yes` en `/etc/ssh/sshd_config` y ejecuta `systemctl restart sshd`. Úsalo solo en una red local de confianza; nunca expuesto a internet.

Para sesiones largas, `tmux new -s arch` sobrevive a un corte de red; vuelves con `tmux attach -t arch`.

## Antes de seguir

Asegúrate de tener teclado configurado, red funcionando (`ping -c 4 archlinux.org`) y, si quieres, SSH. Si algo falla, casi siempre es el cable/Wi-Fi, el nombre de la interfaz o la contraseña; revisa el cable primero.

## Qué sigue

Ya puedes moverte por la terminal sin miedo. En la siguiente lección llega el disco.
