---
title: "Frequently Asked Questions"
linkTitle: "FAQ"
weight: 20
---

Below is a collection of frequent questions and the best answers I can give.

### Why do I need Vortex for this?

You don't! If you prefer installing and managing your mods manually, or using any other modding tools, I recommend using them! CnCRV is just an alternate method of installing mods for those who are more familiar with Vortex already.

### I’m a mod/pack author, how do I make mods compatible with Vortex?

They probably already are! If you want to maximise support and avoid some issues, pack your mod archive in such a way that the root of the archive should end up at the root of the user's `Mods` directory, and that’s basically it.

The installer will auto-detect your mods `ccmod.json` and ignore anything above it, so feel free to lay out your archive how you like as long as that file is in the right place.

### My mod got installed for the wrong game! How do I fix it?

The installer relies on finding a `RedAlert.dll` or `TiberianDawn.dll` file to determine which game to install for. If that doesn't work, or the installer picks the wrong game, open the mod details pane (double click in the Mods list) and change the Mod Type to the correct game. Run a Deploy and the mod should end up in the right place.

### What about mods that aren't on the Nexus?

They should still work fine! As long as they have a `ccmod.json` file, Vortex can try and install it anyway. Remember that non-Nexus mods won't have quite the same metadata available in Vortex you might be used to.