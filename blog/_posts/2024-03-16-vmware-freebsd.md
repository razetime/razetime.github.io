---
title: Installing FreeBSD in VMWare Workstation 17 Player
layout: post
tags: computer
---

Based on FreeBSD 14.0 release, VMWare Workstation 17 Player 17.5.1 build-23298084

Since it was a bit unobvious and the FreeBSD Manual does not detail on it I am
putting this here for now.

Get a vmdk file from https://www.freebsd.org/where/
and boot up VMWare Workstation. 

1. Start by creating a new VM. ![VMWare Workstation Startup Screen](img/vmtut1.png)
2. Select the guest operating system: I chose Other, and selected FreeBSD 14 64-bit.
3. Use the default storage location and *Store the disk as a single file.*
   ![Store the disk as a single file is selected](img/vmtut2.png)
4. In the next page, simply click *Finish*.
5. Right click your new VM and open its settings. A hard disk should be present.
   Check the location of the disk file, and replace it with your downloaded vmdk
   from Step 1.
6. Boot your FreeBSD VM. Right now the only user on your FreeBSD system is root,
   and root will have no password. Set the password and configure a user for
   yourself (detailed in the manual), as it is better to be safe than sorry.

Enjoy your local FreeBSD install.