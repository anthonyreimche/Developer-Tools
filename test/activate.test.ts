// What activate() registers and starts: the Developer Tools panel, its
// Preferences section and its shortcut under core's old ids (so saved layouts
// and rebinds keep working), the Dev module with its panels and shortcut, the
// stylesheet, the console capture and core's dev-folder loader; and that
// deactivate() undoes each.

import { afterEach, describe, expect, it } from "vitest";
import { DevModule } from "../src/dev/DevModule";
import { DevStatusBar } from "../src/dev/StatusBar";
import { DevSettings } from "../src/DevSettings";
import { DevTools } from "../src/DevToolsPanel";
import {
  DEV_KEYBINDING_ID,
  DEV_MODULE_ID,
  DEV_PANELS,
  KEYBINDING_ID,
  PANEL_ID,
  STYLESHEET_ID,
  activate,
  deactivate,
} from "../src/index";
import { isCaptureInstalled } from "../src/log-capture";
import { fakeApi } from "./support/fake-api";

afterEach(() => deactivate());

describe("activate", () => {
  it("registers the panel as core's core.devtools did", () => {
    const rig = fakeApi();
    activate(rig.api);
    expect(rig.panels[0]).toEqual({ id: "core.devtools", title: "Developer Tools", component: DevTools });
    expect(PANEL_ID).toBe("core.devtools");
  });

  it("registers the Preferences ▸ Developer Tools section with its own component", () => {
    const rig = fakeApi();
    activate(rig.api);
    expect(rig.settings).toEqual([{ title: "Developer Tools", fields: [], component: DevSettings }]);
  });

  it("registers Ctrl+Alt+I to toggle the panel", () => {
    const rig = fakeApi();
    activate(rig.api);
    expect(rig.keybindings[0]).toEqual({
      id: "core.devtools.toggle",
      label: "Toggle Developer Tools Panel",
      category: "General",
      defaultCombo: "Ctrl+Alt+I",
      handler: expect.any(Function),
    });
    expect(KEYBINDING_ID).toBe("core.devtools.toggle");
    rig.keybindings[0].handler();
    expect(rig.toggles).toEqual(["core.devtools"]);
    expect(rig.open.has("core.devtools")).toBe(true);
  });

  it("registers one stylesheet coloured from the theme tokens", () => {
    const rig = fakeApi();
    activate(rig.api);
    expect(rig.stylesheets.map((s) => s.id)).toEqual([STYLESHEET_ID]);
    expect(rig.stylesheets[0].css).toContain("var(--color-surface-2)");
  });

  it("installs the console capture and starts the dev-folder loader; deactivate stops both", () => {
    const rig = fakeApi();
    const pristine = console.log;
    activate(rig.api);
    expect(isCaptureInstalled()).toBe(true);
    expect(console.log).not.toBe(pristine);
    expect(rig.calls).toEqual(["init"]);
    deactivate();
    expect(isCaptureInstalled()).toBe(false);
    expect(console.log).toBe(pristine);
    expect(rig.calls).toEqual(["init", "teardown"]);
  });

  it("activates without api.devtools: everything but the dev folder", () => {
    const rig = fakeApi({ devtools: false });
    activate(rig.api);
    expect(rig.panels.map((p) => p.id)).toContain(PANEL_ID);
    expect(rig.modules.map((m) => m.id)).toEqual([DEV_MODULE_ID]);
    expect(rig.settings).toHaveLength(1);
    expect(rig.keybindings).toHaveLength(2);
    expect(isCaptureInstalled()).toBe(true);
    expect(rig.calls).toEqual([]);
    expect(() => deactivate()).not.toThrow();
  });
});

describe("Dev module", () => {
  it("registers the module with its status bar and a layout naming only its own panels", () => {
    const rig = fakeApi();
    activate(rig.api);
    expect(rig.modules).toEqual([
      {
        id: "dev",
        label: "Dev",
        order: 900,
        component: DevModule,
        statusBar: DevStatusBar,
        defaultLayout: {
          rails: [
            expect.objectContaining({ side: "left", panels: [DEV_PANELS.extensions, DEV_PANELS.pipeline] }),
            expect.objectContaining({ side: "right", panels: [DEV_PANELS.inspector, DEV_PANELS.variables] }),
            expect.objectContaining({ side: "bottom", panels: [DEV_PANELS.console] }),
          ],
        },
      },
    ]);
    expect(DEV_MODULE_ID).toBe("dev");
  });

  it("registers its five panels with no default dock of their own", () => {
    const rig = fakeApi();
    activate(rig.api);
    const ids = rig.panels.map((p) => p.id).filter((id) => id !== PANEL_ID);
    expect(ids).toEqual([
      "safelight.devtools.extensions",
      "safelight.devtools.inspector",
      "safelight.devtools.variables",
      "safelight.devtools.pipeline",
      "safelight.devtools.console",
    ]);
    expect(Object.values(DEV_PANELS).sort()).toEqual([...ids].sort());
    expect(rig.panels.every((p) => !("defaultDock" in p))).toBe(true);
  });

  it("registers Go to Dev without a default combo", () => {
    const rig = fakeApi();
    activate(rig.api);
    const go = rig.keybindings.find((k) => k.id === DEV_KEYBINDING_ID);
    expect(go).toMatchObject({ id: "safelight.devtools.go", label: "Go to Dev", category: "General", defaultCombo: "" });
    go?.handler();
    expect(rig.navigations).toEqual(["dev"]);
  });

  it("registers the module the same without core's new seams", () => {
    const rig = fakeApi({ seams: false });
    activate(rig.api);
    expect(rig.modules.map((m) => m.id)).toEqual(["dev"]);
    expect(rig.panels).toHaveLength(6);
  });
});
