// Laying the graph out: lanes left to right, bands top to bottom without
// overlapping, each stage inside its lane and band, empty lanes narrow, and
// every edge path running from its start port to its end port; plus the view
// maths for pan, zoom and fit.

import { describe, expect, it } from "vitest";
import { LANE_W, NARROW_LANE_W, layoutGraph, portKey, type Layout } from "../src/dev/layout";
import { bandId, buildGraph, type Graph, type GraphInput } from "../src/dev/model";
import { fitView, zoomAt } from "../src/dev/view-math";
import type { RegisteredProcessingStage } from "../src/safelight";
import { emptyRegistry, stageOf } from "./support/fake-api";

function graph(stages: RegisteredProcessingStage[], collapsed: Record<string, boolean> = {}): Graph {
  const input: GraphInput = {
    registry: {
      ...emptyRegistry(),
      processingStages: Object.fromEntries(stages.map((s) => [s.id, s])),
      panels: { "b.panel": { extensionId: "b" } },
    },
    extensions: null,
    rows: [],
    live: null,
    failures: {},
    variables: [],
    appVersion: null,
  };
  return buildGraph(input, { showAll: false, search: "", collapsed, selection: { kind: "node", id: bandId("b") } });
}

const STAGES = [
  stageOf("a", "a.tone", { phase: "tone-map", uniforms: [{ key: "k", glslType: "float", default: 0 }] }),
  stageOf("a", "a.fx1", { phase: "effects", produces: [{ name: "a_v", glslType: "float" }] }),
  stageOf("a", "a.fx2", { phase: "effects", mask: { maskable: true } }),
  stageOf("b", "b.fx", { phase: "effects", consumes: ["a_v"], textures: [{ key: "lut", kind: "lut" }] }),
  stageOf("b", "b.out", { phase: "output-encode" }),
  stageOf("core", "core.crop", { phase: "geometry" }),
];

/** The start and end points of an `M x y H x V y …` path. */
function ends(d: string): { start: [number, number]; end: [number, number] } {
  const tokens = d.trim().split(/\s+/);
  let x = 0;
  let y = 0;
  let start: [number, number] = [0, 0];
  for (let i = 0; i < tokens.length; ) {
    const cmd = tokens[i++];
    if (cmd === "M" || cmd === "L") {
      x = Number(tokens[i++]);
      y = Number(tokens[i++]);
      if (cmd === "M") start = [x, y];
    } else if (cmd === "H") x = Number(tokens[i++]);
    else if (cmd === "V") y = Number(tokens[i++]);
    else throw new Error(`unexpected ${cmd}`);
  }
  return { start, end: [x, y] };
}

const inside = (inner: { x: number; y: number; w: number; h: number }, outer: { x: number; y: number; w: number; h: number }) =>
  inner.x >= outer.x && inner.y >= outer.y && inner.x + inner.w <= outer.x + outer.w && inner.y + inner.h <= outer.y + outer.h;

describe("layoutGraph", () => {
  const g = graph(STAGES);
  const layout: Layout = layoutGraph(g, { showEmptyPhases: false });

  it("places lanes left to right without overlapping, right of the core node", () => {
    expect(layout.lanes.map((l) => l.id)).toEqual(g.lanes.map((l) => l.id));
    for (let i = 1; i < layout.lanes.length; i++) {
      expect(layout.lanes[i].x).toBeGreaterThanOrEqual(layout.lanes[i - 1].x + layout.lanes[i - 1].w);
    }
    expect(layout.lanes[0].x).toBeGreaterThan(layout.core.x + layout.core.w);
  });

  it("stacks bands top to bottom without overlapping", () => {
    expect(layout.bands.map((b) => b.id)).toEqual(g.bands.map((b) => b.id));
    for (let i = 1; i < layout.bands.length; i++) {
      const above = layout.bands[i - 1].rect;
      expect(layout.bands[i].rect.y).toBeGreaterThanOrEqual(above.y + above.h);
    }
  });

  it("puts each stage inside its lane and its band, stacking stages that share both", () => {
    expect(layout.nodes).toHaveLength(STAGES.length);
    for (const node of layout.nodes) {
      const lane = layout.lanes.find((l) => l.id === node.lane);
      const band = layout.bands.find((b) => b.id === node.band);
      expect(lane && node.rect.x >= lane.x && node.rect.x + node.rect.w <= lane.x + lane.w).toBe(true);
      expect(band && inside(node.rect, band.rect)).toBe(true);
    }
    const [one, two] = layout.nodes.filter((n) => n.id.startsWith("stage:a.fx"));
    expect(two.rect.y).toBeGreaterThanOrEqual(one.rect.y + one.rect.h);
  });

  it("draws an empty lane narrow unless Empty phases is on", () => {
    const empty = layout.lanes.find((l) => l.id === "scene-linear");
    expect(empty).toMatchObject({ w: NARROW_LANE_W, empty: true });
    expect(layout.lanes.find((l) => l.id === "effects")?.w).toBe(LANE_W);
    const wide = layoutGraph(g, { showEmptyPhases: true });
    expect(wide.lanes.every((l) => l.w === LANE_W)).toBe(true);
  });

  it("starts and ends every edge path on its ports", () => {
    expect(layout.edges).toHaveLength(g.edges.length);
    for (const edge of g.edges) {
      const laid = layout.edges.find((e) => e.id === edge.id);
      const from = layout.ports.get(portKey(edge.from.node, edge.from.port));
      const to = layout.ports.get(portKey(edge.to.node, edge.to.port));
      expect(laid && from && to).toBeTruthy();
      if (!laid || !from || !to) continue;
      expect(ends(laid.d)).toEqual({ start: [from.x, from.y], end: [to.x, to.y] });
    }
  });

  it("lays a collapsed band out as its header and ends its edges there", () => {
    const folded = graph(STAGES, { [bandId("a")]: true });
    const l = layoutGraph(folded, { showEmptyPhases: false });
    const band = l.bands.find((b) => b.id === bandId("a"));
    expect(band?.rect.h).toBe(band?.header.h);
    expect(l.nodes.some((n) => n.band === bandId("a"))).toBe(false);
    for (const edge of folded.edges) {
      const laid = l.edges.find((e) => e.id === edge.id);
      const to = l.ports.get(portKey(edge.to.node, edge.to.port));
      expect(laid && to && ends(laid.d).end).toEqual(to && [to.x, to.y]);
    }
  });

  it("puts the core node's ports on its right edge", () => {
    const image = layout.ports.get(portKey("core", "image"));
    expect(image?.x).toBe(layout.core.x + layout.core.w);
    expect(image?.facing).toBe(1);
  });
});

/** Each horizontal and vertical run of an `M x y H x V y …` path. */
function runs(d: string): { x1: number; y1: number; x2: number; y2: number }[] {
  const tokens = d.trim().split(/\s+/);
  const out: { x1: number; y1: number; x2: number; y2: number }[] = [];
  let x = 0;
  let y = 0;
  for (let i = 0; i < tokens.length; ) {
    const cmd = tokens[i++];
    const v = Number(tokens[i++]);
    if (cmd === "M") {
      x = v;
      y = Number(tokens[i++]);
    } else if (cmd === "H") {
      out.push({ x1: x, y1: y, x2: v, y2: y });
      x = v;
    } else if (cmd === "V") {
      out.push({ x1: x, y1: y, x2: x, y2: v });
      y = v;
    }
  }
  return out;
}

const crosses = (r: { x1: number; y1: number; x2: number; y2: number }, rect: { x: number; y: number; w: number; h: number }) =>
  Math.max(r.x1, r.x2) > rect.x &&
  Math.min(r.x1, r.x2) < rect.x + rect.w &&
  Math.max(r.y1, r.y2) > rect.y &&
  Math.min(r.y1, r.y2) < rect.y + rect.h;

describe("edge routing around nodes", () => {
  const BUSY = [
    stageOf("a", "a.tone", { phase: "tone-map" }),
    stageOf("a", "a.fx", { phase: "effects", uniforms: [{ key: "k", glslType: "float", default: 0 }] }),
    stageOf("b", "b.tone", { phase: "tone-map", mask: { maskable: true } }),
    stageOf("b", "b.fx1", { phase: "effects" }),
    stageOf("b", "b.fx2", { phase: "effects", uniforms: [{ key: "k", glslType: "float", default: 0 }] }),
    stageOf("c", "c.out", { phase: "output-encode", consumes: ["a_v"] }),
    stageOf("d", "d.nr", { phase: "noise-reduction", produces: [{ name: "a_v", glslType: "float" }] }),
    stageOf("core", "core.crop", { phase: "geometry" }),
    ...Array.from({ length: 10 }, (_, i) => stageOf("a0", `a0.dec${i}`, { phase: "decode" })),
    stageOf("a0", "a0.out", { phase: "output-encode" }),
  ];

  for (const [label, collapsed] of [
    ["every band expanded", {}],
    ["a band collapsed", { [bandId("b")]: true }],
  ] as const) {
    it(`runs no edge through a node it doesn't end at, with ${label}`, () => {
      const g = graph(BUSY, collapsed);
      const l = layoutGraph(g, { showEmptyPhases: false });
      const hits: string[] = [];
      for (const laid of l.edges) {
        for (const node of l.nodes) {
          if (node.id === laid.edge.from.node || node.id === laid.edge.to.node) continue;
          if (runs(laid.d).some((r) => crosses(r, node.rect))) hits.push(`${laid.id} through ${node.id}`);
        }
      }
      expect(hits).toEqual([]);
    });
  }

  it("puts a band port's point where its dot is drawn", () => {
    const l = layoutGraph(graph(BUSY), { showEmptyPhases: false });
    const band = l.bands.find((b) => b.ports.length > 0);
    const port = band?.ports[0];
    expect(port && band && l.ports.get(portKey(band.id, port.id))?.x).toBe(port?.x);
  });
});

describe("view maths", () => {
  it("zooms about the pointer, keeping the point under it still", () => {
    const view = { x: 10, y: 20, k: 1 };
    const next = zoomAt(view, { x: 110, y: 120 }, 2);
    expect(next.k).toBe(2);
    expect((110 - next.x) / next.k).toBeCloseTo((110 - view.x) / view.k);
    expect((120 - next.y) / next.k).toBeCloseTo((120 - view.y) / view.k);
    expect(zoomAt(view, { x: 0, y: 0 }, 100).k).toBeLessThanOrEqual(3);
    expect(zoomAt(view, { x: 0, y: 0 }, 0.0001).k).toBeGreaterThanOrEqual(0.1);
  });

  it("fits the graph in the viewport, centred, never above 1:1", () => {
    const v = fitView({ width: 1000, height: 500 }, { width: 500, height: 250 });
    expect(v.k).toBeCloseTo(0.5 * 0.95);
    expect(v.x).toBeCloseTo((500 - 1000 * v.k) / 2);
    expect(fitView({ width: 10, height: 10 }, { width: 500, height: 250 }).k).toBe(1);
  });
});
