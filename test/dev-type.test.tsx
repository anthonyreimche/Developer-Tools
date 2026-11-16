// The Dev module's type and contrast, held to the app's own convention: in the
// graph, titles at 12 px and every other label at 11 px, each set on the label
// rather than inherited; in the panels, 11 px text with 10 px kept for the
// uppercase section labels, as core's labelCls has it. Muted text is for what
// isn't in use, nothing in the graph fades below 70 % unless the selection dims
// it, and the opening view never shrinks text past a readable zoom.

import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DevModule } from "../src/dev/DevModule";
import { DEV_PANELS, activate, deactivate } from "../src/index";
import { ExtensionsPanel } from "../src/dev/panels/ExtensionsPanel";
import { InspectorPanel } from "../src/dev/panels/InspectorPanel";
import { stopLiveRelay } from "../src/dev/sources";
import { DevStatusBar } from "../src/dev/StatusBar";
import { devView, resetDevView } from "../src/dev/store";
import { READABLE_ZOOM, openingView } from "../src/dev/view-math";
import { React, initRuntime } from "../src/rt";
import type { PipelineRow, RegisteredProcessingStage } from "../src/safelight";
import { PREFIX } from "../src/styles";
import { extensionInfo, fakeApi, liveStatus, stageOf } from "./support/fake-api";

afterEach(() => {
  deactivate();
  cleanup();
  stopLiveRelay();
  resetDevView();
});

const STAGES: RegisteredProcessingStage[] = [
  stageOf("a", "a.s", {
    name: "Alpha Tone",
    phase: "tone-map",
    anchor: "tone",
    uniforms: [{ key: "amount", glslType: "float", default: 0 }],
  }),
  stageOf("b", "b.s", { name: "Beta Grain", phase: "effects" }),
];

function mount(ui: () => React.ReactElement) {
  const rig = fakeApi({ stages: STAGES });
  initRuntime(rig.api);
  resetDevView();
  render(ui());
  act(() => rig.extensions?.set([extensionInfo("a", { name: "Alpha" }), extensionInfo("b", { name: "Beta" })]));
  act(() => rig.render?.live.set(liveStatus({ programStages: ["a.s"], dormant: ["b.s"] })));
  return rig;
}

const SIZE = new RegExp(`(?:^|\\s)${PREFIX}text-_(\\d+)px_(?:\\s|$)`);

/** The size class nearest the text, walking out from its element. */
function sizeOf(el: Element | null): number | null {
  for (let e = el; e; e = e.parentElement) {
    const m = SIZE.exec(e.getAttribute("class") ?? "");
    if (m) return Number(m[1]);
  }
  return null;
}

const hasClass = (el: Element | null, name: string): boolean => {
  for (let e = el; e; e = e.parentElement) if (e.classList.contains(PREFIX + name)) return true;
  return false;
};

/** Every element holding visible text under `root`. An icon glyph (no letter
 *  or digit, such as ↓ or ⧉) is sized as an icon, not as text. */
function textHolders(root: Element): Element[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const holders: Element[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = n.textContent?.trim() ?? "";
    if (/[\p{L}\p{N}]/u.test(text) && n.parentElement && !n.parentElement.closest("title")) holders.push(n.parentElement);
  }
  return holders;
}

const describeEl = (el: Element) => `"${el.textContent?.trim().slice(0, 40)}"`;

describe("graph type", () => {
  it("sets every label at 11 px and every title at 12 px, on the label itself", () => {
    mount(() => <DevModule />);
    const world = screen.getByTestId("dev-world");
    const sizes = textHolders(world).map((el) => [describeEl(el), sizeOf(el)] as const);
    expect(sizes.length).toBeGreaterThan(10);
    for (const [text, size] of sizes) expect([text, size]).toEqual([text, expect.toBeOneOf([11, 12])]);
    for (const name of ["Alpha Tone", "Beta Grain", "Safelight core"]) {
      expect([name, sizeOf(screen.getByText(name))]).toEqual([name, 12]);
    }
  });

  it("keeps muted text for ports nothing uses", () => {
    mount(() => <DevModule />);
    const world = screen.getByTestId("dev-world");
    const muted = textHolders(world).filter((el) => hasClass(el, "text-text-muted"));
    for (const el of muted) expect([describeEl(el), el.closest('[data-used="false"]') !== null]).toEqual([describeEl(el), true]);
  });

  it("dims what the selection leaves out no further than half", () => {
    mount(() => <DevModule />);
    act(() => devView().getState().select({ kind: "node", id: "stage:a.s" }));
    const dimmed = [...document.querySelectorAll<HTMLElement>('[data-dimmed="true"]')];
    expect(dimmed.length).toBeGreaterThan(0);
    for (const el of dimmed) {
      const opacity = Number(el.style.opacity || "1");
      expect([el.getAttribute("data-node") ?? el.getAttribute("data-edge"), opacity >= 0.5]).toEqual([
        el.getAttribute("data-node") ?? el.getAttribute("data-edge"),
        true,
      ]);
    }
  });

  it("fades nothing below 70 % unless the selection dims it", () => {
    mount(() => <DevModule />);
    const world = screen.getByTestId("dev-world");
    const faded = [...world.querySelectorAll<HTMLElement | SVGElement>("[style]")].filter((el) => {
      const opacity = el.style.opacity;
      return opacity !== "" && Number(opacity) < 0.7 && el.closest('[data-dimmed="true"]') === null;
    });
    expect(faded.map((el) => el.getAttribute("data-edge") ?? el.getAttribute("data-port") ?? el.tagName)).toEqual([]);
  });
});

describe("panel type", () => {
  it("sets panel text at 11 px, with 10 px only for uppercase section labels", () => {
    mount(() => (
      <>
        <ExtensionsPanel />
        <InspectorPanel />
        <DevStatusBar />
      </>
    ));
    act(() => devView().getState().select({ kind: "node", id: "stage:a.s" }));
    const holders = textHolders(document.body).filter((el) => !el.closest('[data-testid="dev-world"]'));
    expect(holders.length).toBeGreaterThan(10);
    for (const el of holders) {
      const size = sizeOf(el);
      const ok = size === 11 || (size === 10 && hasClass(el, "uppercase"));
      expect([describeEl(el), size, ok]).toEqual([describeEl(el), size, true]);
    }
  });
});

describe("every Dev panel as core mounts it", () => {
  // Core draws a panel's component with nothing around it, so a panel that
  // leaves its size to its parent gets the page's own.
  const ROWS: PipelineRow[] = [
    { kind: "core", label: "Geometry", note: "the view mapped to the source" },
    {
      kind: "stage",
      id: "a.s",
      name: "Alpha Tone",
      phase: "tone-map",
      priority: 100,
      owner: "a",
      space: null,
      domain: "scene",
      reads: "current",
      maskable: true,
      floors: ["max(c, 0.0)"],
      note: "runs per mask",
    },
    { kind: "convert", from: "linear/rec709", to: "perceptual/rec709", elided: false },
    { kind: "clamp", reason: "core", where: "input", when: "while-active", detail: "Whites needs [0, 1]" },
    { kind: "transform", id: null, flags: [{ flag: "skipToneShoulder", honoured: false }] },
    { kind: "output", mapped: true, detail: "the sRGB encode" },
  ];

  it("sets its text at 11 px, with 10 px only for uppercase labels", () => {
    const rig = fakeApi({ stages: STAGES, pipeline: { rows: { 1: ROWS, 2: ROWS, 3: ROWS } } });
    rig.variables.scoped("map").register("map.overlays", { initial: { lines: [] }, description: "Lines drawn on the map." });
    activate(rig.api);
    const ids: readonly string[] = Object.values(DEV_PANELS);
    const panels = rig.panels.filter((p) => ids.includes(p.id));
    expect(panels.map((p) => p.id).sort()).toEqual([...ids].sort());
    for (const panel of panels) {
      const Panel = panel.component;
      const { container, unmount } = render(<Panel />);
      act(() => devView().getState().select({ kind: "node", id: "stage:a.s" }));
      const holders = textHolders(container);
      expect([panel.id, holders.length > 0]).toEqual([panel.id, true]);
      for (const el of holders) {
        const size = sizeOf(el);
        const ok = size === 11 || (size === 10 && hasClass(el, "uppercase"));
        expect([panel.id, describeEl(el), size, ok]).toEqual([panel.id, describeEl(el), size, true]);
      }
      unmount();
    }
  });
});

describe("opening view", () => {
  it("opens at 1:1, so graph text matches the panels' text", () => {
    expect(READABLE_ZOOM).toBe(1);
  });

  it("fits a graph that fits at 1:1", () => {
    expect(openingView({ width: 800, height: 400 }, { width: 900, height: 500 }).k).toBe(1);
  });

  it("holds a bigger graph at 1:1, from its top-left corner", () => {
    const v = openingView({ width: 4000, height: 6000 }, { width: 1200, height: 800 });
    expect(v.k).toBe(READABLE_ZOOM);
    expect(v.x).toBeGreaterThanOrEqual(0);
    expect(v.y).toBeGreaterThanOrEqual(0);
    expect(v.x).toBeLessThan(40);
    expect(v.y).toBeLessThan(40);
  });
});
