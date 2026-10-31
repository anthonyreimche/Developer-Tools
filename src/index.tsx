// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// Developer Tools: the in-app inspector panel, its Preferences section and its
// shortcut. It was core's built-in `core.devtools` until Safelight 3.2.0 and
// keeps that panel and shortcut id, so saved layouts and rebinds keep working.
// Activation installs the console capture and starts core's dev-folder loader;
// deactivation removes both, so a disabled extension leaves the console alone.

import { DevSettings } from "./DevSettings";
import { DevTools } from "./DevToolsPanel";
import { PANEL_ID, initDevtoolsDetachSync, teardownDevtoolsDetachSync } from "./detach";
import { installLogCapture, uninstallLogCapture } from "./log-capture";
import { api, initRuntime } from "./rt";
import type { SafelightAPI } from "./safelight";
import { devtoolsCss } from "./styles";

export { PANEL_ID };
export const KEYBINDING_ID = "core.devtools.toggle";
export const STYLESHEET_ID = "safelight.devtools.styles";

export function activate(host: SafelightAPI): void {
  initRuntime(host);
  host.registerStylesheet({ id: STYLESHEET_ID, css: devtoolsCss(host.ui.tokens) });
  installLogCapture();
  initDevtoolsDetachSync();
  host.devtools?.devFolder.init();
  host.registerPanel({ id: PANEL_ID, title: "Developer Tools", component: DevTools });
  host.registerSettings({ title: "Developer Tools", fields: [], component: DevSettings });
  host.registerKeybinding({
    id: KEYBINDING_ID,
    label: "Toggle Developer Tools Panel",
    category: "General",
    defaultCombo: "Ctrl+Alt+I",
    handler: () => host.dock.togglePanel(PANEL_ID),
  });
}

export function deactivate(): void {
  uninstallLogCapture();
  teardownDevtoolsDetachSync();
  api.devtools?.devFolder.teardown();
}
