---
title: "USB, ISO y arranque en UEFI"
description: "Descarga y verifica la ISO oficial, crea el USB con Rufus y configura UEFI: dónde la gente borra el disco equivocado y cómo evitarlo."
tags: ["arch-linux", "usb", "uefi", "iso"]
curso: "arch-linux-facil"
modulo: "fundamentos-y-preparacion"
modulo_titulo: "Fundamentos y preparación"
submodulo: "1.1"
submodulo_titulo: "Antes de instalar"
orden: 1
duracion: "8 min"
nivel: "principiante"
video: ""
date: 2026-11-09
---

## Objetivo

Descargar y verificar la ISO de Arch, crear un USB booteable y entrar en Archiso. **Este es el punto donde la gente borra el disco equivocado: lee antes de actuar.**

## Notas

### Descargar la ISO

Descárgala **solo** desde `archlinux.org/download/`. Recomendación: **torrent**, porque verifica integridad mientras descarga.

Verifica el checksum (huella digital del archivo):

```powershell
# Windows (PowerShell)
Get-FileHash .\archlinux-x86_64.iso -Algorithm SHA256
```

```bash
# Linux / macOS
sha256sum archlinux-x86_64.iso
```

Compara con el valor publicado en el sitio oficial. Si no coincide: vuelve a descargar.

> **Alternativa segura:** una máquina virtual (VirtualBox, VMware, GNOME Boxes) con UEFI, 4 GB de RAM y 20 GB de disco. El proceso es casi idéntico y sin riesgo para tu PC.

### Crear el USB con Rufus (Windows)

USB de **8 GB o más** — **se borrará todo su contenido**. Opciones en Rufus:

- Esquema de partición: **GPT**
- Destino: **UEFI (sin CSM)**
- Sistema de archivos: **FAT32**

Alternativas en Linux/macOS: `dd` o BalenaEtcher.

### MBR/BIOS vs GPT/UEFI

- **GPT + UEFI** = estándar actual. Es el camino de esta serie.
- **MBR/BIOS** = legado; solo PC muy viejos. Necesitaría GRUB en vez de systemd-boot (temporada avanzada).

### UEFI y Secure Boot

1. Reinicia y entra a la BIOS/UEFI (`F2`, `F10`, `F12`, `Supr` o `Esc` según tu placa).
2. Activa **UEFI**, desactiva **Legacy/CSM**.
3. **Desactiva Secure Boot.** Arch no lleva firma de Microsoft; con Secure Boot activo, el USB no arranca.
4. Pon el USB primero en el orden de arranque o usa el boot menu (`F12`/`F11`/`Esc`).

> **Advertencia:** no reactives Secure Boot hasta instalar y saber firmar el kernel (temporada avanzada, con `sbctl`).

### Entrar a Archiso

Si todo salió bien verás una terminal negra con el prompt `root@archiso ~ #`. No se rompió nada: así se ve Archiso.

## Ejercicio

- Si estás en VM: crea una VM con UEFI, 4 GB RAM, 20 GB disco y monta la ISO.
- Si vas a hardware real: **haz tu backup ahora**, no después. Verifica el checksum de la ISO.

## Comprobación

1. ¿Dónde se descarga la ISO y por qué el torrent es recomendable?
2. ¿Qué hace un checksum y qué haces si no coincide?
3. ¿Por qué hay que desactivar Secure Boot?
4. ¿Cómo entras al boot menu en tu placa?
