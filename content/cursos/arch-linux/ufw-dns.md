---
title: "UFW y DNS"
description: "Un firewall sensato con UFW y una DNS pública con NetworkManager, sin configuración paranoica."
tags: ["arch-linux", "ufw", "dns", "seguridad"]
curso: "arch-linux"
modulo: "configuracion"
modulo_titulo: "Configuración"
submodulo: ""
submodulo_titulo: ""
numero: "3.5"
orden: 20
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

Separar un «Arch recién instalado» de un «Arch que puedes usar tranquilo»: un firewall sensato y una DNS que no te haga esperar. Sin paranoia.

## Qué es un firewall

Un **firewall** es un filtro de tráfico de red: decide qué conexiones entran y cuáles salen. En Linux el sistema de filtrado se llama **netfilter**, y **UFW** (*Uncomplicated Firewall*) es una capa sencilla encima de él para configurar reglas básicas sin dolor de cabeza. Por defecto, UFW bloquea lo que entra y permite lo que sale; si necesitas abrir un puerto, lo abres explícitamente.

`ufw` ya se instaló en la lección 3.2. Si no lo tienes:

```bash
sudo pacman -S --needed ufw
```

## Configurar UFW

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw enable
```

La primera regla bloquea las conexiones entrantes no permitidas; la segunda permite que tu equipo inicie conexiones hacia fuera.

`ufw enable` activa el firewall y advierte de que puede interrumpir conexiones SSH existentes: si estás conectado por SSH, **abre el puerto antes de activarlo** con `sudo ufw allow ssh`. Si no lo necesitas, no lo abras: menos puertos abiertos, menos superficie de ataque.

Comprueba el estado y deja el servicio habilitado:

```bash
sudo ufw status verbose
sudo systemctl enable ufw
```

Un firewall no te salva de descargar un ejecutable raro ni de reutilizar contraseñas: la seguridad es un conjunto de hábitos, no un botón. Y si activas UFW por SSH sin abrir el puerto 22, te quedas fuera: primero el puerto, después el firewall.

## Qué es el DNS

Cada vez que escribes `archlinux.org`, tu equipo necesita traducir ese nombre a una dirección IP: eso es el **DNS**. Por defecto usas el del router, que funciona pero a veces es lento o poco privado. Cambiarlo por una DNS pública puede mejorar la velocidad de resolución y darte más control.

Esta lección usa **Cloudflare** por defecto (`1.1.1.1` y `1.0.0.1`). Si prefieres **Quad9** (`9.9.9.9`), que bloquea dominios maliciosos, puedes usarla igual. Cualquier DNS pública sigue viendo tus consultas: elige una en la que confíes.

## Cambiar la DNS con NetworkManager

Mira el nombre de tu conexión:

```bash
nmcli connection show --active
```

Supongamos que se llama `Wired connection 1`. Configura la DNS de IPv4:

```bash
nmcli connection modify "Wired connection 1" ipv4.dns "1.1.1.1 1.0.0.1"
nmcli connection modify "Wired connection 1" ipv4.ignore-auto-dns yes
```

Si tu red usa IPv6, repite con `ipv6.dns` y `ipv6.ignore-auto-dns yes`. Aplica los cambios reiniciando la conexión:

```bash
nmcli connection up "Wired connection 1"
nmcli connection show "Wired connection 1" | grep ipv4.dns
ping -c 4 archlinux.org
```

El nombre de la conexión cambia según el idioma y el tipo de red: usa exactamente el que muestre `nmcli connection show --active`, entre comillas si tiene espacios.

## Si te quedas sin red

Si tras cambiar la DNS no resuelves nada, vuelve atrás:

```bash
nmcli connection modify "Wired connection 1" ipv4.ignore-auto-dns no
nmcli connection up "Wired connection 1"
```

Eso devuelve la configuración automática del router. La DNS pública es una mejora, no un requisito para tener internet.

## Qué sigue

Última lección del curso: tu carpeta personal, los dotfiles, los backups y la checklist final.
