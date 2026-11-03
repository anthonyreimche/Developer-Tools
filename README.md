# Developer Tools for Safelight

An in-app inspector for people building Safelight extensions, or tracking
down a problem. Open it from View ▸ Developer Tools or with Ctrl+Alt+I.

- **Console:** everything the app logs, with a text filter, a toggle per
  level, autoscroll and a JavaScript line to evaluate. The desktop app's
  security policy refuses `eval`, so there the line reports the refusal; the
  Native tab opens the full Chrome DevTools console instead.
- **Issues:** only the warnings, errors and uncaught exceptions. Its tab
  shows how many there are.
- **System:** the app version, the Electron and Chromium versions, platform,
  screen, WebGL renderer and memory, and in the desktop app Chromium's GPU
  feature status.
- **Storage:** every localStorage key, with an editor to change or delete it.
- **Variables:** every shared variable (`api.variables`) in this window, with
  who wrote it, who listens, its value and its recent history. Edit value
  writes as `safelight.devtools`, under the same stale-write rule as any
  extension.
- **Pipeline:** the develop program the open photo renders with, or the one
  any process version would: core blocks, extension stages, conversions and
  every clip of the colour.
- **Native:** open, dock, close and reload Chrome DevTools, and each
  process's CPU and memory, in the desktop app.

The ⧉ button pops the panel out into its own window; Re-dock there puts it
back. The console is captured only while the extension is enabled, and
disabling it gives the console back untouched.

**Preferences ▸ Developer Tools** points Safelight at a folder of built
extensions to load them without installing them through GitHub. The loaded
extensions appear under Extensions ▸ Dev.

Until Safelight 3.2.0 this was built in. It keeps the built-in panel's id
(`core.devtools`) and shortcut id (`core.devtools.toggle`), so layouts and
rebinds saved before then keep working.

## Development

```bash
npm install
npm run typecheck
npm run build    # dist/index.js, the file Safelight loads
npm test         # vitest; the bundle checks read dist/, so build first
npm run check    # all three, in that order
```

Safelight hands the extension its own React through `api.react`, so the
bundle never includes React. `src/safelight.d.ts` mirrors the part of the
app's extension API the extension uses. The dev-folder loader, the pipeline
description and the variable registry stay in Safelight; the extension reads
them through `api.devtools`, which only this extension's id is given.

The look is core's Tailwind utilities, written out in `src/styles.ts` under
the `sldt-` prefix: `tw("flex px-2 hover:bg-surface-3")` returns the
prefixed classes, and the type refuses a name the sheet doesn't define.

## Licence

GPL-3.0-only with an attribution term (GPL v3 §7b), the same licence as Safelight; see LICENSE. Copyright (C) 2026 Anthony Reimche.
