// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// Where everything in the graph goes, in graph pixels. Core sits on the left,
// full height. Lanes run left to right after the bands' registration-port
// column; bands stack top to bottom, each as tall as its tallest stack of
// stages. Edges are orthogonal: out of the start port, one vertical run in a
// channel between the two, and into the end port; when the end lies behind the
// start, the edge drops into the gap under its band first. Each core port has
// its own channel in the gutter right of core, so its edges read as one bus.
// No edge runs through a node: lane paddings, the gutters and the gaps between
// bands hold none, so an edge that would cross one goes by those instead.

import type { CorePort, CorePortGroup, Edge, Graph, ShownBand, StageNode } from "./model";
import { CORE_GROUP_LABEL, CORE_NODE, HEADER_PORT } from "./model";
import type { LaneId } from "./phases";
import type { Point } from "./view-math";

export const CORE_W = 168;
const GUTTER = 120;
export const BAND_X = CORE_W + GUTTER;
export const BAND_PORTS_W = 132;
const LANES_X = BAND_X + BAND_PORTS_W;
const LANE_PAD = 18;
export const NODE_W = 184;
export const LANE_W = NODE_W + 2 * LANE_PAD;
export const NARROW_LANE_W = 26;
export const LANE_HEAD_H = 30;
const TOP = LANE_HEAD_H + 10;
export const HEADER_H = 28;
export const PORT_ROW = 16;
/** A port dot's diameter. The dot is centred on the port's point. */
export const PORT_DOT = 6;
export const NODE_HEAD_H = 24;
const NODE_PAD_B = 6;
const STACK_GAP = 14;
const BAND_PAD_T = 10;
const BAND_PAD_B = 18;
const BAND_GAP = 14;
const STUB = 8;
const CORE_HEAD_H = 34;
const CORE_GROUP_H = 20;
const CORE_GROUP_GAP = 8;
const MARGIN = 24;

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** A port's point, and which way it faces: 1 right, -1 left. */
export interface PortPos extends Point {
  facing: 1 | -1;
}

export interface LaidLane {
  id: LaneId;
  label: string;
  x: number;
  w: number;
  empty: boolean;
}

export interface LaidBandPort {
  id: string;
  label: string;
  side: "in" | "out";
  x: number;
  y: number;
}

export interface LaidBand {
  id: string;
  band: ShownBand;
  rect: Rect;
  header: Rect;
  collapsed: boolean;
  ports: LaidBandPort[];
}

export interface LaidNode {
  id: string;
  band: string;
  lane: LaneId;
  stage: StageNode;
  rect: Rect;
}

export interface LaidCorePort extends CorePort {
  y: number;
}

export interface LaidEdge {
  id: string;
  edge: Edge;
  d: string;
  /** A small arrowhead at the end port. */
  arrow: string;
}

export interface Layout {
  width: number;
  height: number;
  lanes: LaidLane[];
  core: Rect;
  corePorts: LaidCorePort[];
  coreGroups: { label: string; y: number }[];
  bands: LaidBand[];
  nodes: LaidNode[];
  /** By portKey(node, port). */
  ports: ReadonlyMap<string, PortPos>;
  edges: LaidEdge[];
}

export const portKey = (node: string, port: string): string => `${node}|${port}`;

const num = (n: number) => String(Math.round(n * 10) / 10);

/** An orthogonal path from `s` through alternating horizontal and vertical
 *  runs, given as the x or y each run ends at. */
function orth(s: Point, ...runs: number[]): string {
  return runs.reduce((d, v, i) => `${d} ${i % 2 === 0 ? "H" : "V"} ${num(v)}`, `M ${num(s.x)} ${num(s.y)}`);
}

function arrowAt(e: PortPos): string {
  const base = e.x + e.facing * 6;
  return `M ${num(e.x)} ${num(e.y)} L ${num(base)} ${num(e.y - 3)} L ${num(base)} ${num(e.y + 3)} Z`;
}

const nodeHeight = (s: StageNode) => NODE_HEAD_H + Math.max(s.inPorts.length, s.outPorts.length, 1) * PORT_ROW + NODE_PAD_B;

const coreChannel = (index: number) => CORE_W + 12 + index * 5;

export function layoutGraph(graph: Graph, options: { showEmptyPhases: boolean }): Layout {
  const ports = new Map<string, PortPos>();

  let x = LANES_X;
  const lanes: LaidLane[] = graph.lanes.map((lane) => {
    const empty = lane.stages === 0;
    const w = empty && !options.showEmptyPhases ? NARROW_LANE_W : LANE_W;
    const laid = { id: lane.id, label: lane.label, x, w, empty };
    x += w;
    return laid;
  });
  const width = x + MARGIN;
  const laneById = new Map(lanes.map((l) => [l.id, l]));

  let y = TOP;
  const bands: LaidBand[] = [];
  const nodes: LaidNode[] = [];
  const bandTop = new Map<string, number>();
  const bandBottom = new Map<string, number>();
  for (const band of graph.bands) {
    bandTop.set(band.id, y);
    const header: Rect = { x: BAND_X, y, w: width - MARGIN - BAND_X, h: HEADER_H };
    ports.set(portKey(band.id, HEADER_PORT), { x: BAND_X, y: y + HEADER_H / 2, facing: -1 });
    if (band.collapsed) {
      bands.push({ id: band.id, band, rect: { ...header }, header, collapsed: true, ports: [] });
      bandBottom.set(band.id, y + HEADER_H);
      y += HEADER_H + BAND_GAP;
      continue;
    }

    const bodyY = y + HEADER_H + BAND_PAD_T;
    const bandPorts: LaidBandPort[] = [
      ...band.inPorts.map((p) => ({ ...p, side: "in" as const })),
      ...band.outPorts.map((p) => ({ ...p, side: "out" as const })),
    ].map((p, i) => ({ ...p, x: BAND_X, y: bodyY + i * PORT_ROW + PORT_ROW / 2 }));
    for (const p of bandPorts) ports.set(portKey(band.id, p.id), { x: p.x, y: p.y, facing: -1 });

    const stackTop = new Map<LaneId, number>();
    let tallest = 0;
    for (const stage of band.stages) {
      const lane = laneById.get(stage.lane);
      if (!lane) continue;
      const top = stackTop.get(stage.lane) ?? bodyY;
      const h = nodeHeight(stage);
      const rect: Rect = { x: lane.x + LANE_PAD, y: top, w: NODE_W, h };
      nodes.push({ id: stage.id, band: band.id, lane: stage.lane, stage, rect });
      stage.inPorts.forEach((p, i) =>
        ports.set(portKey(stage.id, p.id), { x: rect.x, y: rect.y + NODE_HEAD_H + i * PORT_ROW + PORT_ROW / 2, facing: -1 }),
      );
      stage.outPorts.forEach((p, i) =>
        ports.set(portKey(stage.id, p.id), {
          x: rect.x + NODE_W,
          y: rect.y + NODE_HEAD_H + i * PORT_ROW + PORT_ROW / 2,
          facing: 1,
        }),
      );
      stackTop.set(stage.lane, top + h + STACK_GAP);
      tallest = Math.max(tallest, top + h - bodyY);
    }
    const h = HEADER_H + BAND_PAD_T + Math.max(bandPorts.length * PORT_ROW, tallest) + BAND_PAD_B;
    bands.push({ id: band.id, band, rect: { ...header, h }, header, collapsed: false, ports: bandPorts });
    bandBottom.set(band.id, y + h);
    y += h + BAND_GAP;
  }

  const coreGroups: { label: string; y: number }[] = [];
  const corePorts: LaidCorePort[] = [];
  let cy = TOP + CORE_HEAD_H;
  let group: CorePortGroup | null = null;
  for (const p of graph.core) {
    if (p.group !== group) {
      if (group !== null) cy += CORE_GROUP_GAP;
      group = p.group;
      coreGroups.push({ label: CORE_GROUP_LABEL[p.group], y: cy });
      cy += CORE_GROUP_H;
    }
    const py = cy + PORT_ROW / 2;
    corePorts.push({ ...p, y: py });
    ports.set(portKey(CORE_NODE, p.id), { x: CORE_W, y: py, facing: 1 });
    cy += PORT_ROW;
  }
  const bandsEnd = bands.length > 0 ? y - BAND_GAP : TOP;
  const core: Rect = { x: 0, y: TOP, w: CORE_W, h: Math.max(cy + 10, bandsEnd) - TOP };
  const height = Math.max(core.y + core.h, bandsEnd) + MARGIN;

  const coreIndex = new Map(graph.core.map((p, i) => [p.id, i]));
  const stageOfNode = new Map(nodes.map((n) => [n.id, n]));
  const nodesOfBand = new Map<string, LaidNode[]>();
  for (const n of nodes) {
    const list = nodesOfBand.get(n.band);
    if (list) list.push(n);
    else nodesOfBand.set(n.band, [n]);
  }
  const below = (band: string) => (bandBottom.get(band) ?? 0) + BAND_GAP / 2;
  const above = (band: string) => (bandTop.get(band) ?? TOP) - BAND_GAP / 2;
  const laneGap = (n: LaidNode) => (laneById.get(n.lane)?.x ?? n.rect.x - LANE_PAD) + 6;
  const gutter = BAND_X - STUB;
  /** No node of `band` but `skip` sits on the horizontal run at y from x1 to x2. */
  const clear = (y: number, x1: number, x2: number, band: string, skip: string) =>
    !(nodesOfBand.get(band) ?? []).some(
      (n) =>
        n.id !== skip &&
        n.rect.y < y &&
        y < n.rect.y + n.rect.h &&
        n.rect.x < Math.max(x1, x2) &&
        n.rect.x + n.rect.w > Math.min(x1, x2),
    );

  const edges: LaidEdge[] = [];
  for (const edge of graph.edges) {
    const s = ports.get(portKey(edge.from.node, edge.from.port));
    const e = ports.get(portKey(edge.to.node, edge.to.port));
    if (!s || !e) continue;
    const fromCore = edge.from.node === CORE_NODE;
    const toCore = edge.to.node === CORE_NODE;
    const coreCh = coreChannel(coreIndex.get(fromCore ? edge.from.port : edge.to.port) ?? 0);
    const src = stageOfNode.get(edge.from.node);
    const tgt = stageOfNode.get(edge.to.node);
    let d: string;
    if (src && toCore) {
      d = orth(s, s.x + STUB, below(src.band), coreCh, e.y, e.x);
    } else if (src && tgt) {
      const xa = laneGap(tgt);
      d =
        xa >= s.x + STUB && clear(s.y, s.x, xa, src.band, src.id)
          ? orth(s, xa, e.y, e.x)
          : orth(s, s.x + STUB, below(src.band), xa, e.y, e.x);
    } else if (src) {
      d = orth(s, s.x + STUB, below(src.band), gutter, e.y, e.x);
    } else if (tgt) {
      const ch = fromCore ? coreCh : gutter;
      d = clear(e.y, ch, e.x, tgt.band, tgt.id)
        ? orth(s, ch, e.y, e.x)
        : orth(s, ch, above(tgt.band), laneGap(tgt), e.y, e.x);
    } else {
      d = orth(s, fromCore || toCore ? coreCh : gutter, e.y, e.x);
    }
    edges.push({ id: edge.id, edge, d, arrow: arrowAt(e) });
  }

  return { width, height, lanes, core, corePorts, coreGroups, bands, nodes, ports, edges };
}
