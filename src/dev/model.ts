// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// The Dev module's graph, in two steps. buildModel reads what the window
// knows (the registry, the extensions list, the pipeline rows, the live
// status and the shared variables) into one band per extension holding its
// stages, with their ports and statuses. projectGraph then applies the view:
// which bands show, which are collapsed, and the edges between what shows.
// Both run in time linear in the number of stages and contributions.

import type {
  DevExtensionInfo,
  LiveRenderStatus,
  PipelineRow,
  RegisteredProcessingStage,
  RegistryState,
  StageAnchor,
  StageFailureInfo,
  VariableInspection,
} from "../safelight";
import { LANE_LABEL, LANE_ORDER, PROCESSING_PHASE_ORDER, laneIndex, laneOf, type LaneId } from "./phases";
import { extensionStatus, indexLive, stageStatus, type ExtensionState, type StageState, type Tone } from "./status";

export const CORE_NODE = "core";
/** The extension id Safelight's own contributions carry. */
export const CORE_EXTENSION = "core";
/** The port a collapsed band's edges attach to. */
export const HEADER_PORT = "header";

export const bandId = (extensionId: string): string => `band:${extensionId}`;
export const stageNodeId = (stageId: string): string => `stage:${stageId}`;

export interface GraphInput {
  registry: RegistryState;
  /** null without api.devtools.extensions: bands then come from the registry. */
  extensions: readonly DevExtensionInfo[] | null;
  rows: readonly PipelineRow[];
  live: LiveRenderStatus | null;
  failures: Readonly<Record<string, StageFailureInfo>>;
  variables: readonly VariableInspection[];
  appVersion: string | null;
}

export interface Port {
  id: string;
  label: string;
}

export type CorePortGroup = "to-extensions" | "from-extensions" | "to-stages" | "from-stages";

export interface CorePort extends Port {
  group: CorePortGroup;
  /** An edge in the shown graph ends here. */
  used: boolean;
}

export const CORE_GROUP_LABEL: Readonly<Record<CorePortGroup, string>> = {
  "to-extensions": "to extensions",
  "from-extensions": "from extensions",
  "to-stages": "to stages",
  "from-stages": "from stages",
};

const CORE_PORTS: readonly Omit<CorePort, "used">[] = [
  { id: "param-bag", label: "param bag", group: "to-extensions" },
  { id: "catalogue", label: "catalogue", group: "to-extensions" },
  { id: "renderer", label: "renderer", group: "to-extensions" },
  { id: "ui-shell", label: "UI shell", group: "to-extensions" },
  { id: "settings-variables-out", label: "settings + variables", group: "to-extensions" },
  { id: "ui-registrations", label: "UI registrations", group: "from-extensions" },
  { id: "settings-variables-in", label: "settings + variables", group: "from-extensions" },
  { id: "stage-textures", label: "stage textures", group: "from-extensions" },
  { id: "stage-declarations", label: "stage declarations", group: "from-extensions" },
  { id: "image", label: "image", group: "to-stages" },
  { id: "uniforms", label: "uniforms", group: "to-stages" },
  { id: "derived", label: "derived", group: "to-stages" },
  { id: "prepass", label: "prepass", group: "to-stages" },
  { id: "textures", label: "textures", group: "to-stages" },
  { id: "brush", label: "brush", group: "to-stages" },
  { id: "mask", label: "mask", group: "to-stages" },
  { id: "geometry", label: "geometry", group: "from-stages" },
  { id: "display-export", label: "display + export", group: "from-stages" },
];

/** A stage input core feeds from the port of the same id. */
const RESOURCE_PORTS: ReadonlySet<string> = new Set(["uniforms", "derived", "prepass", "textures", "brush", "mask"]);

/** Band registration ports and the core port each one links to. */
const BAND_IN: Readonly<Record<string, { label: string; core: string }>> = {
  params: { label: "params", core: "param-bag" },
  catalogue: { label: "photo / catalogue", core: "catalogue" },
  settings: { label: "settings", core: "settings-variables-out" },
  variables: { label: "variables", core: "settings-variables-out" },
};
const BAND_OUT: Readonly<Record<string, { label: string; core: string }>> = {
  ui: { label: "UI register", core: "ui-registrations" },
  "settings-variables": { label: "settings + variables", core: "settings-variables-in" },
  "stage-texture": { label: "stage texture", core: "stage-textures" },
  "stage-declaration": { label: "stage declaration", core: "stage-declarations" },
};

type ContributionKind = Exclude<keyof RegistryState, "processingStages">;

const CONTRIBUTION_KINDS: readonly { kind: ContributionKind; label: string; port: "ui" | "catalogue" | "settings" | null }[] = [
  { kind: "panels", label: "Panels", port: "ui" },
  { kind: "modules", label: "Modules", port: "ui" },
  { kind: "slots", label: "Slots", port: "ui" },
  { kind: "stylesheets", label: "Stylesheets", port: "ui" },
  { kind: "themes", label: "Themes", port: "ui" },
  { kind: "layouts", label: "Layouts", port: "ui" },
  { kind: "panelHeaderAccessories", label: "Panel header accessories", port: "ui" },
  { kind: "sliderIcons", label: "Slider icons", port: "ui" },
  { kind: "catalogHooks", label: "Catalogue hooks", port: "catalogue" },
  { kind: "gridFilters", label: "Grid filters", port: "catalogue" },
  { kind: "gridMenuItems", label: "Grid menu items", port: "catalogue" },
  { kind: "librarySorts", label: "Library sorts", port: "catalogue" },
  { kind: "settings", label: "Settings", port: "settings" },
  { kind: "pipelines", label: "Display transforms", port: null },
  { kind: "exportProcessors", label: "Export processors", port: null },
  { kind: "filenameTemplates", label: "Filename templates", port: null },
  { kind: "presetImporters", label: "Preset importers", port: null },
];

const BRUSH_KINDS: ReadonlySet<string> = new Set(["coverage", "atlas", "paint"]);

export interface StageNode {
  id: string;
  stageId: string;
  name: string;
  extensionId: string;
  bandId: string;
  lane: LaneId;
  anchor: StageAnchor | null;
  /** A geometry stage maps coordinates and holds no colour. */
  geometry: boolean;
  stage: RegisteredProcessingStage;
  inPorts: Port[];
  outPorts: Port[];
  state: StageState;
  /** Position in the program order the graph draws. */
  rank: number;
}

export interface ContributionGroup {
  kind: ContributionKind | "processingStages";
  label: string;
  ids: string[];
}

export interface Band {
  id: string;
  extensionId: string;
  name: string;
  version: string | null;
  source: DevExtensionInfo["source"] | null;
  /** null without the extensions list, or for an extension it doesn't name. */
  info: DevExtensionInfo | null;
  status: ExtensionState;
  /** In program order. */
  stages: StageNode[];
  inPorts: Port[];
  outPorts: Port[];
  contributions: ContributionGroup[];
  /** Variables it subscribes to in this window. */
  subscribed: string[];
  /** Variables it registered or wrote, as far back as their history goes. */
  written: string[];
  /** It failed, or one of its stages has a problem. */
  problem: boolean;
}

export interface Stats {
  extensions: { running: number; failed: number; off: number };
  stages: { running: number; notBuilt: number; problems: number };
}

export interface Model {
  /** Safelight's own band first, then by name. */
  bands: Band[];
  /** Every stage, in program order. */
  stages: StageNode[];
  /** Each isv name's producing stage. */
  producers: ReadonlyMap<string, StageNode>;
  stats: Stats;
}

function push<K, V>(map: Map<K, V[]>, key: K, value: V): void {
  const list = map.get(key);
  if (list) list.push(value);
  else map.set(key, [value]);
}

interface Owned {
  stages: RegisteredProcessingStage[];
  contributions: Map<ContributionGroup["kind"], string[]>;
}

function ownedBy(registry: RegistryState, extensions: readonly DevExtensionInfo[] | null): Map<string, Owned> {
  const owned = new Map<string, Owned>();
  const of = (id: string): Owned => {
    let o = owned.get(id);
    if (!o) {
      o = { stages: [], contributions: new Map() };
      owned.set(id, o);
    }
    return o;
  };
  for (const info of extensions ?? []) of(info.id);
  for (const { kind } of CONTRIBUTION_KINDS) {
    for (const [id, entry] of Object.entries(registry[kind])) {
      push(of(entry.extensionId).contributions, kind, id);
    }
  }
  for (const stage of Object.values(registry.processingStages)) {
    const o = of(stage.extensionId);
    o.stages.push(stage);
    push(o.contributions, "processingStages", stage.id);
  }
  return owned;
}

function stagePorts(stage: RegisteredProcessingStage, geometry: boolean): { inPorts: Port[]; outPorts: Port[] } {
  const inPorts: Port[] = [];
  const outPorts: Port[] = [];
  if (!geometry) inPorts.push({ id: "colour", label: "colour in" });
  for (const name of stage.consumes ?? []) inPorts.push({ id: `consumes:${name}`, label: `consumes ${name}` });
  const uniforms = stage.uniforms.length + (stage.passes ?? []).reduce((n, p) => n + (p.uniforms?.length ?? 0), 0);
  if (uniforms > 0) inPorts.push({ id: "uniforms", label: `uniforms (${uniforms})` });
  if (stage.derive) inPorts.push({ id: "derived", label: "derived" });
  const passes = stage.passes?.length ?? 0;
  if (passes > 0) inPorts.push({ id: "prepass", label: `prepass (${passes})` });
  const textures = stage.textures ?? [];
  const brushes = textures.filter((t) => BRUSH_KINDS.has(t.kind)).length;
  if (textures.length > brushes) inPorts.push({ id: "textures", label: `textures (${textures.length - brushes})` });
  if (brushes > 0) inPorts.push({ id: "brush", label: `brush (${brushes})` });
  if (stage.mask?.maskable) inPorts.push({ id: "mask", label: "mask" });

  if (!geometry) outPorts.push({ id: "colour", label: "colour out" });
  for (const v of stage.produces ?? []) outPorts.push({ id: `produces:${v.name}`, label: `produces ${v.name}` });
  if (geometry) outPorts.push({ id: "geometry", label: "geometry" });
  return { inPorts, outPorts };
}

function variableUse(variables: readonly VariableInspection[]): {
  subscribed: Map<string, string[]>;
  written: Map<string, string[]>;
} {
  const subscribed = new Map<string, string[]>();
  const written = new Map<string, string[]>();
  const add = (map: Map<string, string[]>, extension: string, name: string) => {
    const list = map.get(extension) ?? [];
    if (!list.includes(name)) list.push(name);
    map.set(extension, list);
  };
  for (const v of variables) {
    const name = v.snapshot.name;
    for (const s of v.subscribers) add(subscribed, s, name);
    add(written, v.snapshot.registeredBy.extension, name);
    add(written, v.snapshot.writer.extension, name);
    for (const h of v.history) if (h.outcome === "accepted") add(written, h.writer.extension, name);
  }
  return { subscribed, written };
}

const has = (band: Owned, kinds: ReadonlySet<ContributionGroup["kind"]>): boolean =>
  [...band.contributions.keys()].some((k) => kinds.has(k));

const kindsFor = (port: "ui" | "catalogue" | "settings"): ReadonlySet<ContributionGroup["kind"]> =>
  new Set(CONTRIBUTION_KINDS.filter((k) => k.port === port).map((k) => k.kind));
const UI_KINDS = kindsFor("ui");
const CATALOGUE_KINDS = kindsFor("catalogue");
const SETTINGS_KINDS = kindsFor("settings");

const TONE_RANK: Readonly<Record<Tone, number>> = { running: 0, neutral: 1, dim: 2, problem: 3, failure: 4 };
const worse = (a: Tone, b: Tone): Tone => (TONE_RANK[a] >= TONE_RANK[b] ? a : b);
const isProblem = (tone: Tone) => tone === "problem" || tone === "failure";

export function buildModel(input: GraphInput): Model {
  const { registry, extensions } = input;
  const info = new Map((extensions ?? []).map((e) => [e.id, e]));
  const owned = ownedBy(registry, extensions);
  const allStages = Object.values(registry.processingStages);
  const index = indexLive(input.live, input.failures, allStages);

  const rowIndex = new Map<string, number>();
  input.rows.forEach((row, i) => {
    if (row.kind === "stage" && !rowIndex.has(row.id)) rowIndex.set(row.id, i);
  });
  const keys = new Map(
    allStages.map((s) => [
      s.id,
      [laneIndex(laneOf(s.phase)), index.program.get(s.id) ?? Infinity, rowIndex.get(s.id) ?? Infinity, s.priority ?? 100],
    ]),
  );
  const ordered = [...allStages].sort((a, b) => {
    const ka = keys.get(a.id) ?? [];
    const kb = keys.get(b.id) ?? [];
    for (let i = 0; i < ka.length; i++) if (ka[i] !== kb[i]) return ka[i] - kb[i];
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });

  const stages: StageNode[] = ordered.map((stage, rank) => {
    const geometry = stage.phase === "geometry";
    return {
      id: stageNodeId(stage.id),
      stageId: stage.id,
      name: stage.name,
      extensionId: stage.extensionId,
      bandId: bandId(stage.extensionId),
      lane: laneOf(stage.phase),
      anchor: stage.anchor ?? null,
      geometry,
      stage,
      ...stagePorts(stage, geometry),
      state: stageStatus(stage, index),
      rank,
    };
  });
  const stagesOf = new Map<string, StageNode[]>();
  for (const s of stages) push(stagesOf, s.extensionId, s);
  const producers = new Map<string, StageNode>();
  for (const s of stages) for (const v of s.stage.produces ?? []) if (!producers.has(v.name)) producers.set(v.name, s);

  const vars = variableUse(input.variables);
  const bands: Band[] = [...owned.entries()].map(([id, own]) => {
    const ext = info.get(id) ?? null;
    const isCore = id === CORE_EXTENSION;
    const mine = stagesOf.get(id) ?? [];
    const subscribed = vars.subscribed.get(id) ?? [];
    const written = vars.written.get(id) ?? [];
    const inPorts: Port[] = [];
    const outPorts: Port[] = [];
    const inPort = (port: string) => inPorts.push({ id: port, label: BAND_IN[port].label });
    const outPort = (port: string) => outPorts.push({ id: port, label: BAND_OUT[port].label });
    if (mine.some((s) => s.inPorts.some((p) => p.id === "uniforms"))) inPort("params");
    if (has(own, CATALOGUE_KINDS)) inPort("catalogue");
    if (has(own, SETTINGS_KINDS)) inPort("settings");
    if (subscribed.length > 0) inPort("variables");
    if (has(own, UI_KINDS)) outPort("ui");
    if (written.length > 0) outPort("settings-variables");
    if (mine.some((s) => (s.stage.textures?.length ?? 0) > 0)) outPort("stage-texture");
    if (mine.length > 0) outPort("stage-declaration");

    const status = extensionStatus(ext);
    const labels = new Map<ContributionGroup["kind"], string>(CONTRIBUTION_KINDS.map((k) => [k.kind, k.label]));
    labels.set("processingStages", "Processing stages");
    return {
      id: bandId(id),
      extensionId: id,
      name: ext?.name ?? (isCore ? "Safelight" : id),
      version: ext?.version ?? (isCore ? input.appVersion : null),
      source: ext?.source ?? (isCore ? "builtin" : null),
      info: ext,
      status,
      stages: mine,
      inPorts,
      outPorts,
      contributions: [...own.contributions.entries()].map(([kind, ids]) => ({
        kind,
        label: labels.get(kind) ?? kind,
        ids,
      })),
      subscribed,
      written,
      problem: isProblem(status.tone) || mine.some((s) => isProblem(s.state.tone)),
    };
  });
  bands.sort((a, b) => {
    if (a.extensionId === CORE_EXTENSION || b.extensionId === CORE_EXTENSION) {
      return a.extensionId === CORE_EXTENSION ? -1 : 1;
    }
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" }) || (a.extensionId < b.extensionId ? -1 : 1);
  });

  const stats: Stats = {
    extensions: { running: 0, failed: 0, off: 0 },
    stages: { running: 0, notBuilt: 0, problems: 0 },
  };
  for (const b of bands) {
    if (b.status.kind === "running" || b.status.kind === "callback-failures") stats.extensions.running++;
    else if (b.status.kind === "failed" || b.status.kind === "dev-error") stats.extensions.failed++;
    else if (b.status.kind === "off") stats.extensions.off++;
  }
  for (const s of stages) {
    if (s.state.status === "running") stats.stages.running++;
    else if (s.state.status === "not-built") stats.stages.notBuilt++;
    else if (isProblem(s.state.tone)) stats.stages.problems++;
  }

  return { bands, stages, producers, stats };
}

// ─── The view ────────────────────────────────────────────────────────────────

/** What is selected: a node (core, a band or a stage, by node id), an edge,
 *  or one port of a node. null: nothing. */
export type Selection =
  | { kind: "node"; id: string }
  | { kind: "edge"; id: string }
  | { kind: "port"; node: string; port: string }
  | null;

export interface GraphOptions {
  /** Show bands without stages or problems too. */
  showAll: boolean;
  /** Matched against every extension's name and id and its stages'. */
  search: string;
  /** Band id → collapsed, where the user has toggled it. */
  collapsed: Readonly<Record<string, boolean>>;
  selection: Selection;
}

export interface ShownBand extends Band {
  collapsed: boolean;
}

export interface Lane {
  id: LaneId;
  label: string;
  /** Stage nodes drawn in it. */
  stages: number;
}

export type EdgeKind = "colour" | "isv" | "resource" | "geometry" | "registration";

export interface End {
  node: string;
  port: string;
}

export interface Edge {
  id: string;
  kind: EdgeKind;
  from: End;
  to: End;
  /** The extension whose colour it takes. */
  owner: string;
  tone: Tone;
  /** What flows along it. */
  label: string;
}

export interface Graph {
  lanes: Lane[];
  core: CorePort[];
  bands: ShownBand[];
  edges: Edge[];
}

/** Whether a band draws as its header alone: the user's toggle, else
 *  collapsed when it has no stages. */
export function isCollapsed(band: Band, collapsed: Readonly<Record<string, boolean>>): boolean {
  return collapsed[band.id] ?? band.stages.length === 0;
}

function matches(band: Band, q: string): boolean {
  const hit = (s: string) => s.toLowerCase().includes(q);
  return hit(band.name) || hit(band.extensionId) || band.stages.some((s) => hit(s.name) || hit(s.stageId));
}

/** The band a selection belongs to: the band itself, a stage's or a port's. */
export function bandOfSelection(selection: Selection, model: Pick<Model, "stages">): string | null {
  if (!selection || selection.kind === "edge") return null;
  const node = selection.kind === "node" ? selection.id : selection.node;
  if (node.startsWith("band:")) return node;
  return model.stages.find((s) => s.id === node)?.bandId ?? null;
}

const endKey = (e: End) => `${e.node}.${e.port}`;

export function projectGraph(model: Model, options: GraphOptions): Graph {
  const q = options.search.trim().toLowerCase();
  const bands: ShownBand[] = model.bands
    .filter((b) => (q ? matches(b, q) : options.showAll || b.stages.length > 0 || b.problem))
    .map((b) => ({ ...b, collapsed: isCollapsed(b, options.collapsed) }));
  const shownBand = new Map(bands.map((b) => [b.id, b]));
  const shown = model.stages.filter((s) => shownBand.has(s.bandId));

  const endOf = (s: StageNode, port: string): End =>
    shownBand.get(s.bandId)?.collapsed ? { node: s.bandId, port: HEADER_PORT } : { node: s.id, port };

  const edges: Edge[] = [];
  const seen = new Set<string>();
  const add = (kind: EdgeKind, from: End, to: End, owner: string, tone: Tone, label: string) => {
    if (from.node === to.node && from.port === to.port) return;
    const id = `${kind}:${endKey(from)}>${endKey(to)}`;
    if (seen.has(id)) return;
    seen.add(id);
    edges.push({ id, kind, from, to, owner, tone, label });
  };
  const core = (port: string): End => ({ node: CORE_NODE, port });

  let prev: StageNode | null = null;
  for (const s of shown) {
    if (s.geometry) continue;
    const tone = prev ? worse(prev.state.tone, s.state.tone) : s.state.tone;
    add("colour", prev ? endOf(prev, "colour") : core("image"), endOf(s, "colour"), s.extensionId, tone, "colour");
    prev = s;
  }
  if (prev) add("colour", endOf(prev, "colour"), core("display-export"), prev.extensionId, prev.state.tone, "colour");

  for (const s of shown) {
    for (const name of s.stage.consumes ?? []) {
      const producer = model.producers.get(name);
      if (!producer || !shownBand.has(producer.bandId)) continue;
      const tone = worse(producer.state.tone, s.state.tone);
      add("isv", endOf(producer, `produces:${name}`), endOf(s, `consumes:${name}`), s.extensionId, tone, `isv_${name}`);
    }
  }
  for (const s of shown) {
    for (const p of s.inPorts) {
      if (RESOURCE_PORTS.has(p.id)) add("resource", core(p.id), endOf(s, p.id), s.extensionId, s.state.tone, p.id);
    }
  }
  for (const s of shown) {
    if (s.geometry) add("geometry", endOf(s, "geometry"), core("geometry"), s.extensionId, s.state.tone, "geometry");
  }

  const selected = shownBand.get(bandOfSelection(options.selection, model) ?? "");
  if (selected) {
    const bandEnd = (port: string): End =>
      selected.collapsed ? { node: selected.id, port: HEADER_PORT } : { node: selected.id, port };
    const tone = selected.status.tone;
    for (const p of selected.inPorts) {
      add("registration", core(BAND_IN[p.id].core), bandEnd(p.id), selected.extensionId, tone, p.label);
    }
    for (const p of selected.outPorts) {
      add("registration", bandEnd(p.id), core(BAND_OUT[p.id].core), selected.extensionId, tone, p.label);
    }
  }

  const laneCount = new Map<LaneId, number>();
  let other = false;
  for (const s of shown) {
    if (s.lane === "other") other = true;
    if (!shownBand.get(s.bandId)?.collapsed) laneCount.set(s.lane, (laneCount.get(s.lane) ?? 0) + 1);
  }
  const laneIds: readonly LaneId[] = other ? LANE_ORDER : PROCESSING_PHASE_ORDER;
  const lanes = laneIds.map((id) => ({ id, label: LANE_LABEL[id], stages: laneCount.get(id) ?? 0 }));

  const used = new Set<string>();
  for (const e of edges) {
    if (e.from.node === CORE_NODE) used.add(e.from.port);
    if (e.to.node === CORE_NODE) used.add(e.to.port);
  }
  const corePorts = CORE_PORTS.map((p) => ({ ...p, used: used.has(p.id) }));

  return { lanes, core: corePorts, bands, edges };
}

export function buildGraph(input: GraphInput, options: GraphOptions): Graph {
  return projectGraph(buildModel(input), options);
}

export interface Linked {
  nodes: ReadonlySet<string>;
  edges: ReadonlySet<string>;
}

/** What the selection touches: its edges, their ends, and the bands those
 *  ends belong to. null with nothing selected, when nothing dims. */
export function linkedTo(graph: Graph, selection: Selection): Linked | null {
  if (!selection) return null;
  const bandOfStage = new Map<string, string>();
  for (const b of graph.bands) for (const s of b.stages) bandOfStage.set(s.id, b.id);

  const nodes = new Set<string>();
  let touches: (e: Edge) => boolean;
  if (selection.kind === "edge") {
    touches = (e) => e.id === selection.id;
  } else if (selection.kind === "port") {
    nodes.add(selection.node);
    touches = (e) =>
      (e.from.node === selection.node && e.from.port === selection.port) ||
      (e.to.node === selection.node && e.to.port === selection.port);
  } else {
    const band = graph.bands.find((b) => b.id === selection.id);
    nodes.add(selection.id);
    for (const s of band?.stages ?? []) nodes.add(s.id);
    const members = new Set(nodes);
    touches = (e) => members.has(e.from.node) || members.has(e.to.node);
  }

  const edges = new Set<string>();
  for (const e of graph.edges) {
    if (!touches(e)) continue;
    edges.add(e.id);
    nodes.add(e.from.node);
    nodes.add(e.to.node);
  }
  for (const id of [...nodes]) {
    const band = bandOfStage.get(id);
    if (band) nodes.add(band);
  }
  return { nodes, edges };
}
