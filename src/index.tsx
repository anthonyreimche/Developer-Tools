// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// Developer Tools: the in-app inspector panel, its Preferences section and its
// shortcut, and the Dev module's graph of extensions and stages with its
// panels. The panel was core's built-in `core.devtools` until Safelight 3.2.0
// and keeps that panel and shortcut id, so saved layouts and rebinds keep
// working. Activation installs the console capture, starts core's dev-folder
// loader and the live relay the Dev module reads other windows through;
// deactivation removes all three, so a disabled extension leaves the console
// alone.

import { DevModule } from "./dev/DevModule";
import { ConsolePanel, PipelinePanel, VariablesPanel } from "./dev/panels/TabPanels";
import { ExtensionsPanel } from "./dev/panels/ExtensionsPanel";
import { InspectorPanel } from "./dev/panels/InspectorPanel";
import { startLiveRelay, stopLiveRelay } from "./dev/sources";
import { DevStatusBar } from "./dev/StatusBar";
import { DevSettings } from "./DevSettings";
import { DevTools } from "./DevToolsPanel";
import { PANEL_ID, initDevtoolsDetachSync, teardownDevtoolsDetachSync } from "./detach";
import { installLogCapture, uninstallLogCapture } from "./log-capture";
import { api, initRuntime } from "./rt";
import type { ModuleLayoutDef, SafelightAPI } from "./safelight";
import { devtoolsCss } from "./styles";

export { PANEL_ID };
export const KEYBINDING_ID = "core.devtools.toggle";
export const STYLESHEET_ID = "safelight.devtools.styles";

export const DEV_MODULE_ID = "dev";
export const DEV_KEYBINDING_ID = "safelight.devtools.go";
export const DEV_PANELS = {
  extensions: "safelight.devtools.extensions",
  inspector: "safelight.devtools.inspector",
  variables: "safelight.devtools.variables",
  pipeline: "safelight.devtools.pipeline",
  console: "safelight.devtools.console",
} as const;

const DEV_LAYOUT: ModuleLayoutDef = {
  rails: [
    { side: "left", width: 260, panels: [DEV_PANELS.extensions, DEV_PANELS.pipeline] },
    { side: "right", width: 320, panels: [DEV_PANELS.inspector, DEV_PANELS.variables] },
    { side: "bottom", height: 200, panels: [DEV_PANELS.console] },
  ],
};

function registerDevModule(host: SafelightAPI): void {
  host.registerModule({
    id: DEV_MODULE_ID,
    label: "Dev",
    order: 900,
    component: DevModule,
    statusBar: DevStatusBar,
    defaultLayout: DEV_LAYOUT,
  });
  host.registerPanel({ id: DEV_PANELS.extensions, title: "Extensions", component: ExtensionsPanel, fill: true });
  host.registerPanel({ id: DEV_PANELS.inspector, title: "Inspector", component: InspectorPanel, fill: true });
  host.registerPanel({ id: DEV_PANELS.variables, title: "Variables", component: VariablesPanel, fill: true });
  host.registerPanel({ id: DEV_PANELS.pipeline, title: "Pipeline", component: PipelinePanel, fill: true });
  host.registerPanel({ id: DEV_PANELS.console, title: "Console", component: ConsolePanel, allowBottomDock: true });
  host.registerKeybinding({
    id: DEV_KEYBINDING_ID,
    label: "Go to Dev",
    category: "General",
    defaultCombo: "",
    handler: () => host.navigation.goTo(DEV_MODULE_ID),
  });
}

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
  registerDevModule(host);
  startLiveRelay();
}

export function deactivate(): void {
  uninstallLogCapture();
  teardownDevtoolsDetachSync();
  stopLiveRelay();
  api.devtools?.devFolder.teardown();
}
