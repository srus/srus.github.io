---
title: Cómo redimensionar el disco duro en VirtualBox 4
description: Cómo redimensionar el disco duro en VirtualBox 4.
---

Partimos de un disco duro en formato [VMDK](http://en.wikipedia.org/wiki/Vmdk) con Windows instalado. Lo primero, como siempre, será guardar una copia por si acaso ocurriera algo. Por ejemplo, [exportando](http://www.comtecknet.com/2010/08/25/exportar-nuestras-maquinas-virtuales-en-virtualbox/) la máquina.

A partir de la versión 4 de VirtualBox ya es posible redimensionar los discos duros, pero sólo si:

* El Almacenamiento está en modo Expansión Dinámica.
* El Formato del disco duro es [VDI](http://en.wikipedia.org/wiki/VirtualBox#Device_virtualization) o [VHD](http://en.wikipedia.org/wiki/VHD_(file_format)).

Por lo tanto, si tenemos el disco en formato VMDK, hay que convertirlo primero a VDI. Para ello hay que:

* Liberar el disco duro en el Administrador de Medios Virtuales.
* Cerrar VirtualBox.
* Abrir una consola y situarnos en el directorio donde se encuentra el disco duro: `VBoxManage clonehd --format VDI win.vmdk win.vdi`
* Abrir VirtualBox.
* En el Administrador de Medios Virtuales, eliminar el disco duro VMDK.
* Abrir el panel de Configuración de la máquina y en la sección de Almacenamiento, añadir el nuevo disco duro VDI.

Ya tenemos nuestro disco duro en formato VDI. Ahora hay que redimensionarlo. Para ello nos dirigimos de nuevo a la consola y situándonos en el directorio donde está el disco duro, ponemos:

`VBoxManage modifyhd win.vdi --resize <tamaño_en_megabytes>`

Por último sólo falta redimensionar la partición de Windows, usando [GParted](http://gparted.org/), por ejemplo.
