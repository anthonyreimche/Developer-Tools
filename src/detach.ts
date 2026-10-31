// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// Pops the Developer Tools panel out into its own OS window (e.g. on a second
// monitor): open an app:// URL with a query flag; Electron's did-create-window
// handler turns it into a native child window that shares the origin, preload
// and COOP/COEP.
//
// The popped-out window renders only the panel. Its log buffer is filled from
// the main window over the log BroadcastChannel (log-capture.ts); this module
// adds a small control channel for re-docking.

import { api } from "./rt";

export const PANEL_ID = "core.devtools";
const DEVTOOLS_PARAM = "devtools";
const WINDOW_NAME = "safelight-devtools";
export const CTL_CHANNEL = "safelight-devtools-ctl";

/** True when the current window is the popped-out Developer Tools window. */
export function isDevtoolsWindow(): boolean {
  return new URLSearchParams(window.location.search).get(DEVTOOLS_PARAM) === "1";
}

// The popped window, so a second detach focuses it instead of opening a
// duplicate. The window `name` also keeps it single-instance in the browser.
let popped: Window | null = null;
let ctlChannel: BroadcastChannel | null = null;

function ensurePanelOpen(): void {
  if (!api.dock.isPanelOpen(PANEL_ID)) api.dock.togglePanel(PANEL_ID);
}
function ensurePanelClosed(): void {
  if (api.dock.isPanelOpen(PANEL_ID)) api.dock.togglePanel(PANEL_ID);
}

/** Open (or focus) the Developer Tools window and remove the in-dock panel. */
export function detachDevtools(): void {
  if (popped && !popped.closed) {
    popped.focus();
    return;
  }
  const url = `${window.location.origin}${window.location.pathname}?${DEVTOOLS_PARAM}=1`;
  const win = window.open(url, WINDOW_NAME, "width=760,height=600");
  if (!win) return;
  popped = win;
  ensurePanelClosed();
  win.focus();
}

/** Called from the popped-out window: re-dock in the main window, then close. */
export function reattachDevtools(): void {
  const ch = ctlChannel ?? new BroadcastChannel(CTL_CHANNEL);
  ch.postMessage({ type: "reattach" });
  window.close();
}

export function initDevtoolsDetachSync(): void {
  if (ctlChannel) return;
  ctlChannel = new BroadcastChannel(CTL_CHANNEL);
  ctlChannel.onmessage = (e: MessageEvent<{ type: string }>) => {
    // Only the main window re-docks; the popped-out window is the one closing.
    if (e.data?.type === "reattach" && !isDevtoolsWindow()) {
      popped = null;
      ensurePanelOpen();
    }
  };
}

export function teardownDevtoolsDetachSync(): void {
  ctlChannel?.close();
  ctlChannel = null;
}
