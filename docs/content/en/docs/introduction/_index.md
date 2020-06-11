---
title: "Introduction"
linkTitle: "Introduction"
weight: 1
description: >
  A basic introduction to C&C Remastered for Vortex
---

Command & Conquer Remastered for Vortex (CnCRV) is an **unofficial** extension for the [Vortex mod manager](https://www.nexusmods.com/about/vortex/) that adds support for installing and managing Command and Conquer Remastered mods in Vortex, just like any other supported title. To clarify, this project is not affiliated in any way with Nexus Mods, Petroglyph Games or anyone else, and is an open-source community resource.

## Status and Limitations

CnCRV is still beta-quality software! While I can test locally, I won't be able to cover every case and there is a high potential for bugs that haven't been found yet, especially with how new the modding scene for C&C Remastered is. The following is definitely supported at this point:

- **Installing mods**: Installing mods or tweaks from archive files works, deploying directly to your user mods directory.
- **Managing mods**: The standard Vortex install/enable/disable/uninstall operations should all work just as they do for any other Vortex-managed game.
- **Profiles**: Create multiple profiles for different sets of mods or tweaks and quickly switch between them.
- **Automatic Game Detection**: The extension should automatically detect which game your mod is for during installation, deploying it to the right mod path.

There's some features that we've included to get them in your hands as fast as possible, but might still have some rough edges:

- **Support for INI tweaks**: You're currently able to install INI tweaks (i.e. mods that are just one or more `.ini` files), but this hasn't been fully tested. There's also no support for merging multiple tweaks.

> If you're really missing specific features you can open an issue and we can discuss the viability, or find me on the Nexus Mods Discord.

### Nexus Mods

To be clear and upfront: being supported in Vortex (using CnCRV) **does not** mean that the Nexus Mods or Vortex team officially supports this extension or any mods you install using it. See [the FAQ](/docs/introduction/faq) for extra details.