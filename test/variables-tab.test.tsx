// Ported from core's VariablesTab.test.tsx, over a one-window fake of core's
// variable registry. The tab writes through this extension's own
// api.variables, so its edits are written as safelight.devtools.

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { React, initRuntime } from "../src/rt";
import { UNAVAILABLE_TEXT } from "../src/Unavailable";
import { VariablesTab } from "../src/VariablesTab";
import { fakeApi, type Rig } from "./support/fake-api";
import type { FakeVariables } from "./support/fake-variables";

afterEach(cleanup);

function rig(): Rig {
  const r = fakeApi();
  initRuntime(r.api);
  return r;
}

const renderTab = () => render(<VariablesTab />);

describe("VariablesTab", () => {
  it("says so when no extension has registered a variable", () => {
    rig();
    renderTab();
    expect(screen.getByText(/No shared variables yet/)).toBeTruthy();
  });

  it("lists variables with revision, size and refusals, and shows the selected one's detail", () => {
    const reg: FakeVariables = rig().variables;
    const map = reg.scoped("map");
    map.register("map.overlays", { initial: {}, description: "Lines and points drawn on the Map." });
    map.set("map.overlays", { a: 1 });
    reg.scoped("gps-track").set("map.overlays", { b: 2 }); // never read it: stale
    renderTab();
    const item = screen.getByRole("button", { name: /map\.overlays/ });
    expect(item.textContent).toContain("rev 1");
    expect(screen.getByLabelText("1 refused or lost")).toBeTruthy();
    expect(screen.getByText("Lines and points drawn on the Map.")).toBeTruthy();
    expect(screen.getByText("map (this window)", { selector: "dd" })).toBeTruthy();
    expect(screen.getByText(/refused: hadn't seen rev 1 by map \(this window\)/)).toBeTruthy();
    expect(screen.getByText(/"a": 1/)).toBeTruthy();
  });

  it("shows each variable's last writer in the list", () => {
    const reg = rig().variables;
    reg.scoped("map").register("map.overlays", { initial: {} });
    const gps = reg.scoped("gps-track");
    gps.get("map.overlays");
    gps.set("map.overlays", { track: 1 });
    renderTab();
    const item = screen.getByRole("button", { name: /map\.overlays/ });
    expect(item.textContent).toContain("gps-track (this window)");
  });

  it("shows the subscribers in this window", () => {
    const reg = rig().variables;
    reg.scoped("map").register("map.overlays", { initial: {} });
    renderTab();
    expect(screen.getByText("none")).toBeTruthy();
    act(() => {
      reg.scoped("map").subscribe("map.overlays");
      reg.scoped("gps-track").subscribe("map.overlays");
    });
    expect(screen.getByText("map, gps-track")).toBeTruthy();
  });

  it("selects another variable from the list", () => {
    const reg = rig().variables;
    reg.scoped("map").register("map.overlays", { initial: {} });
    reg.scoped("gps").register("gps.track", { initial: [1, 2] });
    renderTab();
    expect(screen.getByRole("button", { name: /map\.overlays/ }).getAttribute("aria-current")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: /gps\.track/ }));
    expect(screen.getByRole("button", { name: /gps\.track/ }).getAttribute("aria-current")).toBe("true");
    expect(screen.getByText("gps.track", { selector: "dd" })).toBeTruthy();
  });

  it("shows the value in an open, collapsible section", () => {
    const reg = rig().variables;
    const map = reg.scoped("map");
    map.register("map.overlays", { initial: {} });
    map.set("map.overlays", { a: 1 });
    renderTab();
    const details = screen.getByText(/"a": 1/).closest("details");
    expect(details).not.toBeNull();
    expect(details?.open).toBe(true);
    expect(details?.querySelector("summary")?.textContent).toBe("Value");
  });

  it("follows changes", () => {
    const reg = rig().variables;
    const map = reg.scoped("map");
    map.register("map.overlays", { initial: {} });
    renderTab();
    act(() => void map.set("map.overlays", { z: 1 }));
    expect(screen.getByRole("button", { name: /map\.overlays/ }).textContent).toContain("rev 1");
  });

  it("Edit value writes as safelight.devtools", () => {
    const reg = rig().variables;
    reg.scoped("map").register("map.overlays", { initial: {} });
    renderTab();
    fireEvent.click(screen.getByRole("button", { name: "Edit value" }));
    fireEvent.change(screen.getByLabelText("New value (JSON)"), { target: { value: '{"z": 3}' } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    const s = reg.scoped("anyone").get<{ z: number }>("map.overlays");
    expect(s?.value).toEqual({ z: 3 });
    expect(s?.writer.extension).toBe("safelight.devtools");
    expect(screen.getByText("Saved as revision 1.")).toBeTruthy();
  });

  it("shows a stale save and invalid JSON inline, changing nothing", () => {
    const reg = rig().variables;
    const map = reg.scoped("map");
    map.register("map.overlays", { initial: {} });
    renderTab();
    fireEvent.click(screen.getByRole("button", { name: "Edit value" }));
    fireEvent.change(screen.getByLabelText("New value (JSON)"), { target: { value: "{" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText(/^Not valid JSON:/)).toBeTruthy();
    act(() => void map.set("map.overlays", { by: "map" }));
    fireEvent.change(screen.getByLabelText("New value (JSON)"), { target: { value: "{}" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText(/map \(this window\) changed it since you opened the editor/)).toBeTruthy();
    expect(reg.scoped("anyone").get("map.overlays")?.value).toEqual({ by: "map" });
  });

  it("Cancel drops the draft and shows the value again", () => {
    const reg = rig().variables;
    reg.scoped("map").register("map.overlays", { initial: { keep: true } });
    renderTab();
    fireEvent.click(screen.getByRole("button", { name: "Edit value" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByLabelText("New value (JSON)")).toBeNull();
    expect(screen.getByText(/"keep": true/)).toBeTruthy();
  });

  it("says the tab is unavailable when the host hands over no devtools reads", () => {
    const r = fakeApi({ devtools: false });
    initRuntime(r.api);
    renderTab();
    expect(screen.getByText(UNAVAILABLE_TEXT)).toBeTruthy();
  });
});
