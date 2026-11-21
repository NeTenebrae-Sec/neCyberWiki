---
title: "AUR y paru"
description: "Qué es el AUR, cómo se usa paru y por qué tienes que leer el PKGBUILD antes de instalar cualquier cosa."
tags: ["arch-linux", "aur", "paru"]
curso: "arch-linux"
modulo: "configuracion"
modulo_titulo: "Configuración"
submodulo: ""
submodulo_titulo: ""
numero: "3.3"
orden: 18
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

Entender qué es el AUR, instalar `paru` y saber revisar lo que instalas. El AUR no entiende de escritorios ni de métodos de instalación: es el mismo repositorio para todos.

## Qué es el AUR

El **AUR** (*Arch User Repository*) es un repositorio mantenido por la comunidad con software que no está en los repositorios oficiales: herramientas raras, versiones específicas, paquetes que la comunidad mantiene porque le interesan.

Importante: el AUR **no** es oficial. Cualquiera puede subir un paquete. Eso no significa que todo sea peligroso, pero sí que hay que revisar lo que instalas.

El AUR no guarda binarios: guarda **PKGBUILDs**, recetas que le dicen a `makepkg` de dónde descargar el código, cómo compilarlo y cómo empaquetarlo. Por eso, al instalar algo del AUR, tu equipo lo construye localmente.

## Qué necesitas

`git` y `base-devel` (ya los instalamos en 3.2) y un ayudante. Nosotros usamos **paru**, un ayudante de AUR escrito en Rust. `paru` no está en los repos oficiales; se instala desde el AUR:

```bash
git clone https://aur.archlinux.org/paru.git
cd paru
makepkg -si
```

`makepkg -si` construye el paquete, instala sus dependencias y lo instala en el sistema; te pedirá tu contraseña de sudo. Comprueba que funciona:

```bash
paru --version
```

## Los comandos de paru

Casi iguales a los de `pacman`:

```bash
paru -Syu              # actualizar todo, incluido el AUR
paru -S paquete        # instalar desde repos o AUR
paru -Ss termino       # buscar
paru -Rns paquete      # eliminar
```

La diferencia: `paru` busca primero en los repos oficiales y, si no encuentra el paquete, mira en el AUR. Si es del AUR, te muestra el PKGBUILD y te pide confirmación antes de construir.

## Leer el PKGBUILD

Cuando `paru` te muestre el PKGBUILD, léelo. No tienes que entender cada línea, pero sí mirar de dónde descarga, qué comandos ejecuta y quién lo mantiene. Si algo te parece raro, no lo instales.

No instales paquetes del AUR porque un video lo diga. Revisa el paquete, mira los comentarios y comprueba que el mantenedor sea activo. Y una regla de oro: si un paquete te pide ejecutar algo como root sin mostrar el código, para.

## Actualizar con paru

```bash
paru -Syu
```

Equivalente a `pacman -Syu`, pero también revisa tus paquetes del AUR. Si un paquete del AUR falla al compilar, `paru` te lo dirá y podrás decidir si lo saltas o lo arreglas.

No actualices el AUR todos los días por obsesión: una vez por semana, o cuando instales algo nuevo, es suficiente.

## Qué sigue

Ya tienes acceso al AUR y sabes revisar lo que instalas. En la siguiente lección configuramos **ZRAM** y una rutina de mantenimiento.
