// The Dev module in a DOM over the fake API: bands and stage nodes from the
// registry, selecting and dimming, the Inspector's live values, search,
// collapsing a band, pan and zoom under a zoomed body, the status bar, the
// Extensions panel, and the module without core's new seams.

import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DevModule } from "../src/dev/DevModule";
import { BAND_X, PORT_DOT } from "../src/dev/layout";
import { ExtensionsPanel } from "../src/dev/panels/ExtensionsPanel";
import { InspectorPanel, formatValue } from "../src/dev/panels/InspectorPanel";
import { stopLiveRelay } from "../src/dev/sources";
import { DevStatusBar } from "../src/dev/StatusBar";
import { devView, resetDevView } from "../src/dev/store";
import { React, initRuntime } from "../src/rt";
import type { RegisteredProcessingStage } from "../src/safelight";
import { extensionInfo, fakeApi, liveStatus, stageOf, type Rig, type RigOptions } from "./support/fake-api";

afterEach(() => {
  cleanup();
  stopLiveRelay();
  resetDevView();
});

const STAGES: RegisteredProcessingStage[] = [
  stageOf("a", "a.s", { name: "Alpha Tone", phase: "tone-map", uniforms: [{ key: "amount", glslType: "float", default: 0 }] }),
  stageOf("b", "b.s", { name: "Beta Grain", phase: "effects" }),
  stageOf("c", "c.s", { name: "Gamma Encode", phase: "output-encode" }),
];

function mount(options: RigOptions = {}, ui: () => React.ReactElement = () => <DevModule />): Rig {
  const rig = fakeApi({ stages: STAGES, ...options });
  initRuntime(rig.api);
  resetDevView();
  render(ui());
  return rig;
}

const node = (id: string) => document.querySelector<HTMLElement>(`[data-node="${id}"]`);
const viewport = () => screen.getByTestId("dev-viewport");

describe("DevModule", () => {
  it("draws a band per extension and a node per stage, in phase lanes", () => {
    mount();
    for (const name of ["Alpha Tone", "Beta Grain", "Gamma Encode"]) expect(screen.getByText(name)).toBeTruthy();
    expect(document.querySelectorAll("[data-band]")).toHaveLength(3);
    expect(screen.getByText("Tone map")).toBeTruthy();
    expect(screen.getByText("colour in", { selector: `[data-node="stage:a.s"] *` })).toBeTruthy();
    expect(document.querySelectorAll("[data-edge]").length).toBeGreaterThan(0);
  });

  it("selects a node on click and dims what isn't linked to it; Esc clears", () => {
    mount();
    fireEvent.click(screen.getByText("Alpha Tone"));
    expect(devView().getState().selection).toEqual({ kind: "node", id: "stage:a.s" });
    expect(node("stage:c.s")?.dataset.dimmed).toBe("true");
    expect(node("stage:b.s")?.dataset.dimmed).toBe("false");
    fireEvent.keyDown(viewport(), { key: "Escape" });
    expect(devView().getState().selection).toBeNull();
    expect(node("stage:c.s")?.dataset.dimmed).toBe("false");
  });

  it("keeps a band's registration edges while one of them, or a core port, is selected; Esc drops them", () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: "Collapse a" }));
    fireEvent.click(screen.getByRole("button", { name: "Expand a" }));
    fireEvent.click(screen.getByText("Alpha Tone"));
    const registration = () => document.querySelectorAll('[data-edge^="registration:"]');
    expect(registration().length).toBeGreaterThan(0);
    const first = registration()[0];
    const id = first.getAttribute("data-edge");
    const hit = first.querySelector("[data-hit]");
    if (hit) fireEvent.click(hit);
    expect(devView().getState().selection).toEqual({ kind: "edge", id });
    expect(document.querySelector(`[data-edge="${id}"]`)?.getAttribute("data-dimmed")).toBe("false");
    const corePort = document.querySelector('[data-node="core"] [data-port="stage-declarations"]');
    if (corePort) fireEvent.click(corePort);
    expect(registration().length).toBeGreaterThan(0);
    fireEvent.keyDown(viewport(), { key: "Escape" });
    expect(registration()).toHaveLength(0);
  });

  it("draws a band port's dot centred on the point its edges end at", () => {
    mount();
    fireEvent.click(screen.getByText("Alpha Tone"));
    const port = document.querySelector<HTMLElement>('[data-band-port="band:a|params"]');
    const dot = port?.querySelector<HTMLElement>("[data-dot]");
    expect(port?.style.left).toBe(`${BAND_X}px`);
    expect(dot?.style.left).toBe(`-${PORT_DOT / 2}px`);
    expect(dot?.style.width).toBe(`${PORT_DOT}px`);
  });

  it("filters bands with the search", () => {
    mount();
    fireEvent.change(screen.getByPlaceholderText("Search extensions and stages…"), { target: { value: "grain" } });
    expect(document.querySelector('[data-band="a"]')).toBeNull();
    expect(document.querySelector('[data-band="b"]')).toBeTruthy();
  });

  it("collapses a band to its header, and expands every band again", () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: "Collapse a" }));
    expect(node("stage:a.s")).toBeNull();
    expect(document.querySelector('[data-band="a"]')).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Collapse all" }));
    expect(node("stage:b.s")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Expand all" }));
    expect(node("stage:a.s")).toBeTruthy();
  });

  it("shows only bands with stages until All extensions is on", () => {
    const rig = mount();
    act(() => rig.extensions?.set([extensionInfo("a"), extensionInfo("quiet", { name: "Quiet One" })]));
    expect(document.querySelector('[data-band="quiet"]')).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "All extensions" }));
    expect(document.querySelector('[data-band="quiet"]')).toBeTruthy();
  });

  it("pans by dragging empty space, in the viewport's own pixels under a zoomed body", () => {
    mount();
    const el = viewport();
    Object.defineProperty(el, "offsetWidth", { configurable: true, value: 400 });
    el.getBoundingClientRect = () => DOMRect.fromRect({ x: 0, y: 0, width: 800, height: 600 });
    const before = devView().getState().view;
    fireEvent.pointerDown(el, { clientX: 100, clientY: 100, button: 0, pointerId: 1 });
    fireEvent.pointerMove(el, { clientX: 300, clientY: 140, pointerId: 1 });
    fireEvent.pointerUp(el, { clientX: 300, clientY: 140, pointerId: 1 });
    const after = devView().getState().view;
    expect(after).toEqual({ x: before.x + 100, y: before.y + 20, k: before.k });
    fireEvent.pointerMove(el, { clientX: 500, clientY: 500, pointerId: 1 });
    expect(devView().getState().view).toEqual(after);
    expect(screen.getByTestId("dev-world").style.transform).toBe(`translate(${after.x}px, ${after.y}px) scale(${after.k})`);
  });

  it("shows the app's panning cursor while a pan is held", () => {
    mount();
    const el = viewport();
    expect(el.style.cursor).toBe("");
    fireEvent.pointerDown(el, { clientX: 100, clientY: 100, button: 0, pointerId: 1 });
    expect(el.style.cursor).toBe("move");
    fireEvent.pointerUp(el, { clientX: 100, clientY: 100, pointerId: 1 });
    expect(el.style.cursor).toBe("");
  });

  it("selects no text while a pan is held, and lets selection go on release, cancel or unmount", () => {
    const selectionStarts = (): boolean => {
      const e = new Event("selectstart", { bubbles: true, cancelable: true });
      document.body.dispatchEvent(e);
      return !e.defaultPrevented;
    };
    mount();
    const el = viewport();
    const press = { clientX: 100, clientY: 100, button: 0, pointerId: 1 };
    fireEvent.pointerDown(el, press);
    expect(selectionStarts()).toBe(false);
    fireEvent.pointerUp(el, press);
    expect(selectionStarts()).toBe(true);
    fireEvent.pointerDown(el, press);
    fireEvent.pointerCancel(el, press);
    expect(selectionStarts()).toBe(true);
    fireEvent.pointerDown(el, press);
    cleanup();
    expect(selectionStarts()).toBe(true);
  });

  it("zooms on the wheel about the pointer and keeps the page from scrolling", () => {
    mount();
    const el = viewport();
    Object.defineProperty(el, "offsetWidth", { configurable: true, value: 400 });
    el.getBoundingClientRect = () => DOMRect.fromRect({ x: 0, y: 0, width: 800, height: 600 });
    const before = devView().getState().view;
    const wheel = new WheelEvent("wheel", { deltaY: -200, clientX: 200, clientY: 100, cancelable: true, bubbles: true });
    act(() => void el.dispatchEvent(wheel));
    expect(wheel.defaultPrevented).toBe(true);
    const after = devView().getState().view;
    expect(after.k).toBeGreaterThan(before.k);
    expect((100 - after.x) / after.k).toBeCloseTo((100 - before.x) / before.k);
  });

  it("runs on registry and pipeline rows alone without core's new seams", () => {
    mount({ seams: false });
    expect(screen.getByText("Alpha Tone")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Fit" })).toBeTruthy();
  });

  it("colours a stage by its live status", () => {
    const rig = mount();
    act(() => rig.render?.live.set(liveStatus({ programStages: ["a.s"], dormant: ["b.s"] })));
    expect(node("stage:a.s")?.dataset.status).toBe("running");
    expect(node("stage:b.s")?.dataset.status).toBe("not-built");
    expect(node("stage:c.s")?.dataset.status).toBe("registered");
  });
});

describe("Inspector", () => {
  it("shows a selected stage's details and the live value of its uniform", async () => {
    const rig = mount({}, () => <InspectorPanel />);
    act(() => {
      rig.render?.live.set(liveStatus({ programStages: ["a.s"] }));
      rig.render?.values.set("a.s", { amount: 0.25 });
    });
    expect(screen.getByText(/Select a node/)).toBeTruthy();
    act(() => devView().getState().select({ kind: "node", id: "stage:a.s" }));
    expect(screen.getByText("Alpha Tone")).toBeTruthy();
    expect(screen.getByText("tone-map")).toBeTruthy();
    const row = (await screen.findByText("0.25")).closest("tr");
    expect(row && within(row).getByText("amount")).toBeTruthy();
  });

  it("writes typed arrays out as their numbers", () => {
    expect(formatValue(new Float32Array([0.5, 1, 0.25]))).toBe("[0.5, 1, 0.25]");
    expect(formatValue([1, 2])).toBe("[1, 2]");
  });

  it("shows an extension's contributions and status", () => {
    const rig = mount({}, () => <InspectorPanel />);
    act(() => {
      rig.extensions?.set([extensionInfo("a", { name: "Alpha", callbackFailures: 1 })]);
      devView().getState().select({ kind: "node", id: "band:a" });
    });
    expect(screen.getByText("Alpha")).toBeTruthy();
    expect(screen.getByText("A callback failed")).toBeTruthy();
    expect(screen.getByText("Processing stages")).toBeTruthy();
  });
});

describe("Extensions panel and status bar", () => {
  it("lists every extension with its stages; a click selects; dev-folder entries reload", () => {
    const rig = mount({}, () => <ExtensionsPanel />);
    act(() => rig.extensions?.set([extensionInfo("a", { name: "Alpha", source: "dev" }), extensionInfo("off", { enabled: false, running: false })]));
    expect(screen.getByText("Turned off")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Alpha Tone/ }));
    expect(devView().getState().selection).toEqual({ kind: "node", id: "stage:a.s" });
    fireEvent.click(screen.getByRole("button", { name: "Reload Alpha" }));
    expect(rig.extensions?.reloads).toEqual(["a"]);
  });

  it("expands a band the user collapsed when one of its stages is picked while the search hides it", () => {
    mount({}, () => (
      <>
        <ExtensionsPanel />
        <DevModule />
      </>
    ));
    fireEvent.click(screen.getByRole("button", { name: "Collapse a" }));
    fireEvent.change(screen.getByPlaceholderText("Search extensions and stages…"), { target: { value: "grain" } });
    fireEvent.click(screen.getByRole("button", { name: /Alpha Tone/ }));
    expect(devView().getState().collapsed["band:a"]).toBe(false);
    expect(node("stage:a.s")).toBeTruthy();
  });

  it("counts extensions and stages and says where the live data comes from", () => {
    const rig = mount({}, () => <DevStatusBar />);
    expect(screen.getByText(/Open Develop, or pop out Dev, to see what runs/)).toBeTruthy();
    act(() => rig.render?.live.set(liveStatus({ programStages: ["a.s", "b.s"], dormant: ["c.s"], frameMs: 23 })));
    expect(screen.getByText(/2 running · 1 not built · 0 problems/)).toBeTruthy();
    expect(screen.getByText(/23 ms/)).toBeTruthy();
    expect(screen.getByText(/live from this window/)).toBeTruthy();
  });
});
