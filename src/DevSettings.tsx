// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// Preferences ▸ Developer Tools. It exists only while the extension is
// enabled. Lets the user point Safelight at a local folder of built extensions
// to load them live; the folder controls are core's, which holds the
// filesystem access.

import { React, api } from "./rt";
import { tw } from "./styles";
import { UNAVAILABLE_TEXT } from "./Unavailable";

const NOTE = tw("text-[11px] text-text-muted");

export function DevSettings() {
  const devtools = api.devtools;

  return (
    <div className={tw("flex flex-col gap-4")}>
      <div>
        <div className={tw("text-[10px] uppercase tracking-widest text-text-muted")}>Development extensions folder</div>
        <p className={tw("mt-1.5 text-[10px] leading-relaxed text-text-muted")}>
          Point Safelight at a local folder of built extensions to load them live, without installing through
          GitHub. Point at a single extension's folder — a <code>safelight.json</code> manifest plus its built
          bundle, the same layout an installed extension uses — or at a parent folder whose immediate subfolders
          are each one. Loaded extensions appear under Extensions ▸ Dev.
        </p>
      </div>

      {!devtools ? (
        <p className={NOTE}>{UNAVAILABLE_TEXT}</p>
      ) : !devtools.electron ? (
        <p className={NOTE}>Loading extensions from a folder requires the desktop app.</p>
      ) : (
        <devtools.devFolder.Controls variant="settings" />
      )}
    </div>
  );
}
