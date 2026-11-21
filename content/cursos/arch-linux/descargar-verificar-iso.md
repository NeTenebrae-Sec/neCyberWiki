---
title: "Descargar y verificar la ISO"
description: "Descarga la imagen oficial de Arch solo desde archlinux.org y verifícala con SHA256 antes de tocar ningún disco."
tags: ["arch-linux", "iso", "sha256"]
curso: "arch-linux"
modulo: "preparacion"
modulo_titulo: "Preparación"
submodulo: ""
submodulo_titulo: ""
numero: "1.2"
orden: 1
duracion: ""
nivel: "principiante"
video: ""
variante: "comun"
entorno: "ambos"
arranque: "ambos"
prerrequisitos: ["1.1"]
estado: "publicada"
date: 2026-11-19
---

## Objetivo

Descargar la imagen oficial de Arch y verificar que está completa e íntegra antes de instalarla. La verificación no es opcional: es la diferencia entre instalar Arch y instalar lo que alguien metió en un servidor raro.

## Descarga solo desde la fuente oficial

La ISO es la imagen del instalador de Arch: un `.iso` con todo lo necesario para arrancar el sistema en modo live. Descárgala **solo** desde la página oficial: <https://archlinux.org/download/>. Nada de blogs, espejos aleatorios ni enlaces de terceros.

La recomendación habitual es bajarla por **torrent**: suele ir más rápido y el cliente verifica las piezas que descarga contra el hash del propio torrent. Ojo con el matiz: eso verifica que la descarga llegó completa, **no** que el archivo sea legítimo. La verificación del SHA256 publicado en la web sigue siendo obligatoria, con torrent o sin él. Uno no sustituye al otro.

Si estás en una máquina virtual no necesitas USB: la misma ISO se monta como unidad óptica. Eso se configura en la lección de la máquina virtual.

## Qué es un checksum

Un checksum es una huella digital del archivo. SHA256 toma el archivo completo, lo procesa y produce una huella de 256 bits. Si el archivo se descargó mal o alguien lo modificó por el camino, aunque sea un solo byte, la huella cambia por completo.

No es un candado ni un antivirus: es la forma sencilla de asegurarte de que estás instalando lo que crees que estás instalando.

## Verificar en Windows

Abre PowerShell en la carpeta donde descargaste la ISO y ejecuta:

```powershell
Get-FileHash .\archlinux-2026.11.01-x86_64.iso -Algorithm SHA256
```

El nombre del archivo cambia con cada release. Usa el nombre real de la ISO que descargaste, no el del ejemplo.

## Verificar en Linux o macOS

```bash
sha256sum archlinux-2026.11.01-x86_64.iso
```

En macOS también puedes usar `shasum -a 256`.

## Comparar con la web oficial

Compara el resultado con el hash que aparece en <https://archlinux.org/download/>. Si coincide, adelante. Si no, vuelve a descargar.

No hay debate: si el hash no coincide, no instales. Puede ser una descarga corrupta, un mirror con problemas o algo peor. No lo arriesgues por un byte.

## Errores comunes

- **Comparar el hash de otra ISO distinta**: el checksum del sitio corresponde a la ISO publicada ese día. Compara siempre contra el archivo que tú descargaste.
- **Copiar el comando con el nombre de ejemplo**: sustituye el nombre real. Si tu ISO se llama distinto, tu comando también.
- **Confiar solo en el torrent**: el torrent verifica integridad de la descarga, no autenticidad. El SHA256 web es el que cierra el círculo.
- **Obsesionarse con el número de versión**: lo importante es que sea la versión más reciente publicada en la web oficial y que el hash coincida.

## Checklist

- [ ] ISO descargada desde `archlinux.org`.
- [ ] `sha256` calculado en tu máquina.
- [ ] Hash idéntico al publicado en la web oficial.
- [ ] ISO guardada en un sitio memorable para las próximas lecciones.
