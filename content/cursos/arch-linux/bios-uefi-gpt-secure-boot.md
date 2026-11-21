---
title: "BIOS/UEFI, GPT y Secure Boot"
description: "Entra en la UEFI, deja el modo UEFI + GPT, desactiva Secure Boot y arranca el USB de instalación."
tags: ["arch-linux", "uefi", "gpt", "secure-boot"]
curso: "arch-linux"
modulo: "preparacion"
modulo_titulo: "Preparación"
submodulo: ""
submodulo_titulo: ""
numero: "1.5"
orden: 4
duracion: ""
nivel: "principiante"
video: ""
variante: "comun"
entorno: "hardware"
arranque: "ambos"
prerrequisitos: ["1.3"]
estado: "publicada"
date: 2026-11-19
---

## Objetivo

Decirle al PC que arranque desde el USB: activar UEFI, desactivar Secure Boot y elegir el medio de arranque. Esta lección es para **hardware real**; en una máquina virtual el firmware lo configura la propia VM.

## MBR vs GPT

**MBR** es el esquema de particiones antiguo. Nació con BIOS, apunta a direcciones con 32 bits y sectores de 512 bytes (límite de 2 TB) y solo permite cuatro particiones primarias, porque su tabla ocupa un espacio fijo y diminuto en el primer sector.

**GPT** es el esquema moderno: funciona con UEFI, guarda varias copias de la tabla de particiones, soporta discos de más de 2 TB y no se limita a cuatro particiones. En este curso vamos con **GPT + UEFI**, el estándar en cualquier PC moderno.

Si tu equipo solo tiene BIOS legacy, necesitarás MBR y GRUB en lugar de GPT y systemd-boot; eso se trata en la lección de instalación manual. Aquí asumimos UEFI.

## BIOS vs UEFI

**BIOS** es el firmware antiguo; **UEFI**, el moderno. UEFI arranca más rápido, entiende GPT y es el estándar desde hace años. Todas las UEFI se parecen bastante entre sí: lo que veas aquí te sonará familiar aunque la tuya se vea distinta.

## Entrar en la UEFI

Con el USB conectado, reinicia y empieza a pulsar la tecla de acceso a la UEFI. Suele ser **F2**, **F10**, **F12**, **Supr** o **Esc**, según la placa. Si no sabes cuál es, busca el modelo de tu placa o portátil. Truco útil: si la tecla no entró, `Ctrl + Supr` a mitad del arranque lo interrumpe y te deja reintentar con otra tecla.

## Las tres cosas que hay que hacer

Dentro de la UEFI:

1. **Activar UEFI** y desactivar Legacy/CSM.
2. **Desactivar Secure Boot.**
3. **Poner el USB como primera opción de arranque** o usar el boot menu.

### ¿Por qué desactivamos Secure Boot?

Porque Secure Boot verifica que el sistema operativo tenga una firma digital aprobada. Arch no viene firmado con las claves de Microsoft, así que con Secure Boot activado el USB no arranca. En la ruta avanzada se puede firmar el kernel con tus propias claves; para una primera instalación, desactivarlo es lo sencillo. No lo reactives ahora: sin firmar el kernel, este Arch no arrancará.

## Arrancar desde el USB

Guarda los cambios y sal (normalmente en **Exit** o **Save & Exit**). Si no cambiaste el orden de arranque, usa el boot menu (**F12**, **F11** o **Esc**) y selecciona el USB.

Te aparece el menú de Archiso: elige la primera opción, algo como **Arch Linux install medium (x86_64, UEFI)**. Si todo salió bien, ves una terminal negra con prompt de root. Eso es Archiso: no se rompió nada.

## Si no arranca

Revisa Secure Boot (debe estar OFF), el orden de arranque y que el USB se escribió en GPT/UEFI. Algunas BIOS piden tocar Secure Boot en dos sitios distintos; confirma que está desactivado del todo, guarda y sal. Y si nada funciona, prueba en una VM: si arranca ahí, el problema es el PC o la BIOS, no la ISO.

## Checklist

- [ ] Modo UEFI activo; Legacy/CSM desactivado.
- [ ] Secure Boot en OFF.
- [ ] USB como primer arranque o seleccionado en el boot menu.
- [ ] Archiso cargado hasta el prompt de root.
