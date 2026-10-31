// What activate() registers and starts: the Developer Tools panel, its
// Preferences section and its shortcut under core's old ids (so saved layouts
// and rebinds keep working), the stylesheet, the console capture and core's
// dev-folder loader; and that deactivate() undoes each.

import { afterEach, describe, expect, it } from "vitest";
import { DevSettings } from "../src/DevSettings";
import { DevTools } from "../src/DevToolsPanel";
import { KEYBINDING_ID, PANEL_ID, STYLESHEET_ID, activate, deactivate } from "../src/index";
import { isCaptureInstalled } from "../src/log-capture";
import { fakeApi } from "./support/fake-api";

afterEach(() => deactivate());

describe("activate", () => {
  it("registers the panel as core's core.devtools did", () => {
    const rig = fakeApi();
    activate(rig.api);
    expect(rig.panels).toEqual([{ id: "core.devtools", title: "Developer Tools", component: DevTools }]);
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
    expect(rig.keybindings).toEqual([
      {
        id: "core.devtools.toggle",
        label: "Toggle Developer Tools Panel",
        category: "General",
        defaultCombo: "Ctrl+Alt+I",
        handler: expect.any(Function),
      },
    ]);
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
    expect(rig.panels).toHaveLength(1);
    expect(rig.settings).toHaveLength(1);
    expect(rig.keybindings).toHaveLength(1);
    expect(isCaptureInstalled()).toBe(true);
    expect(rig.calls).toEqual([]);
    expect(() => deactivate()).not.toThrow();
  });
});
