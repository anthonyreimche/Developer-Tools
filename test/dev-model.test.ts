// The Dev module's graph model: one band per extension (core's own first),
// which bands show, which lane each stage sits in and in what order, the ports
// a stage or band has, and the edges between them: the colour chain, isv
// links, core resources, geometry and the selected band's registrations.

import { describe, expect, it } from "vitest";
import {
  CORE_NODE,
  bandId,
  buildGraph,
  buildModel,
  linkedTo,
  projectGraph,
  stageNodeId,
  type Edge,
  type Graph,
  type GraphInput,
  type GraphOptions,
} from "../src/dev/model";
import type { PipelineRow, RegisteredProcessingStage, RegistryState, VariableInspection } from "../src/safelight";
import { emptyRegistry, extensionInfo, liveStatus, stageOf } from "./support/fake-api";

function input(stages: RegisteredProcessingStage[], more: Partial<GraphInput> = {}): GraphInput {
  return {
    registry: { ...emptyRegistry(), processingStages: Object.fromEntries(stages.map((s) => [s.id, s])) },
    extensions: null,
    rows: [],
    live: null,
    failures: {},
    variables: [],
    appVersion: "3.3.0",
    ...more,
  };
}

const OPTIONS: GraphOptions = { showAll: false, search: "", collapsed: {}, selection: null };

const graphOf = (i: GraphInput, o: Partial<GraphOptions> = {}): Graph => buildGraph(i, { ...OPTIONS, ...o });

const ids = (g: Graph) => g.bands.map((b) => b.extensionId);
const ofKind = (g: Graph, kind: Edge["kind"]) => g.edges.filter((e) => e.kind === kind);
const link = (e: Edge) => `${e.from.node}.${e.from.port} -> ${e.to.node}.${e.to.port}`;

const stageRow = (id: string): PipelineRow => ({
  kind: "stage",
  id,
  name: id,
  phase: "effects",
  priority: 100,
  owner: null,
  space: null,
  domain: "display",
  reads: "source",
  maskable: false,
  floors: [],
});

const panel = (extensionId: string) => ({ extensionId });

describe("bands", () => {
  it("makes one band per extension, core's first as Safelight with the app version, the rest by name", () => {
    const g = graphOf(
      input([stageOf("zeta", "zeta.a"), stageOf("core", "core.exposure"), stageOf("alpha", "alpha.a")], {
        extensions: [extensionInfo("zeta", { name: "Zeta" }), extensionInfo("alpha", { name: "Alpha" })],
      }),
    );
    expect(ids(g)).toEqual(["core", "alpha", "zeta"]);
    expect(g.bands[0]).toMatchObject({ id: bandId("core"), name: "Safelight", version: "3.3.0" });
    expect(g.bands[1]).toMatchObject({ name: "Alpha", version: "1.0.0", source: "installed" });
  });

  it("shows only bands with stages or a problem unless All extensions is on", () => {
    const registry: RegistryState = { ...emptyRegistry(), panels: { "quiet.panel": panel("quiet") } };
    const i: GraphInput = {
      ...input([stageOf("busy", "busy.a")]),
      registry: { ...registry, processingStages: { "busy.a": stageOf("busy", "busy.a") } },
      extensions: [
        extensionInfo("busy"),
        extensionInfo("quiet"),
        extensionInfo("broken", { failure: { reason: "threw", message: "boom" } }),
        extensionInfo("off", { enabled: false, running: false }),
      ],
    };
    expect(ids(graphOf(i))).toEqual(["broken", "busy"]);
    expect(ids(graphOf(i, { showAll: true }))).toEqual(["broken", "busy", "off", "quiet"]);
  });

  it("searches every extension by name, id or stage name", () => {
    const i = input([stageOf("film", "film.grain", { name: "Grain" }), stageOf("lens", "lens.ca")], {
      extensions: [extensionInfo("film", { name: "Film Look" }), extensionInfo("lens"), extensionInfo("quiet")],
    });
    expect(ids(graphOf(i, { search: "grain" }))).toEqual(["film"]);
    expect(ids(graphOf(i, { search: "LOOK" }))).toEqual(["film"]);
    expect(ids(graphOf(i, { search: "quiet" }))).toEqual(["quiet"]);
  });

  it("starts bands with stages expanded and the rest collapsed, and honours a toggle", () => {
    const i = input([stageOf("a", "a.s")], { extensions: [extensionInfo("a"), extensionInfo("b")] });
    const g = graphOf(i, { showAll: true });
    expect(g.bands.map((b) => [b.extensionId, b.collapsed])).toEqual([
      ["a", false],
      ["b", true],
    ]);
    expect(graphOf(i, { showAll: true, collapsed: { [bandId("a")]: true } }).bands[0].collapsed).toBe(true);
  });

  it("works from the registry alone, without the extensions list", () => {
    const g = graphOf(input([stageOf("a", "a.s")]));
    expect(g.bands[0]).toMatchObject({ extensionId: "a", name: "a", version: null, source: null });
    expect(g.bands[0].status.kind).toBe("running");
  });
});

describe("lanes and stages", () => {
  it("puts each stage in its phase's lane, and an unknown phase in Other", () => {
    // A phase from a newer Safelight than this extension knows.
    const odd: RegisteredProcessingStage = Object.assign(stageOf("a", "a.odd"), { phase: "future-phase" });
    const g = graphOf(input([stageOf("a", "a.nr", { phase: "noise-reduction" }), odd]));
    const lanes = Object.fromEntries(g.bands[0].stages.map((s) => [s.stageId, s.lane]));
    expect(lanes).toEqual({ "a.nr": "noise-reduction", "a.odd": "other" });
    expect(g.lanes.map((l) => l.id)).toEqual([
      "geometry",
      "decode",
      "noise-reduction",
      "scene-linear",
      "tone-map",
      "display-adjust",
      "effects",
      "output-encode",
      "other",
    ]);
    expect(g.lanes.find((l) => l.id === "noise-reduction")?.stages).toBe(1);
    expect(g.lanes.find((l) => l.id === "effects")?.stages).toBe(0);
  });

  it("leaves out the Other lane when nothing needs it", () => {
    expect(graphOf(input([stageOf("a", "a.s")])).lanes.some((l) => l.id === "other")).toBe(false);
  });

  it("orders a lane's stages by priority, by the rows when known, by the live program when known", () => {
    const stages = [
      stageOf("a", "a.one", { priority: 10 }),
      stageOf("a", "a.two", { priority: 20 }),
      stageOf("a", "a.three", { priority: 30 }),
    ];
    const order = (i: GraphInput) => graphOf(i).bands[0].stages.map((s) => s.stageId);
    expect(order(input(stages))).toEqual(["a.one", "a.two", "a.three"]);
    const rows = [stageRow("a.three"), stageRow("a.one"), stageRow("a.two")];
    expect(order(input(stages, { rows }))).toEqual(["a.three", "a.one", "a.two"]);
    const live = liveStatus({ programStages: ["a.two", "a.two@1", "a.three", "a.one"] });
    expect(order(input(stages, { rows, live }))).toEqual(["a.two", "a.three", "a.one"]);
  });

  it("tags an anchored stage", () => {
    const g = graphOf(input([stageOf("core", "core.wb", { phase: "scene-linear", anchor: "white-balance" })]));
    expect(g.bands[0].stages[0].anchor).toBe("white-balance");
  });
});

describe("ports", () => {
  it("gives a stage only the ports that apply", () => {
    const plain = graphOf(input([stageOf("a", "a.plain")])).bands[0].stages[0];
    expect(plain.inPorts.map((p) => p.id)).toEqual(["colour"]);
    expect(plain.outPorts.map((p) => p.id)).toEqual(["colour"]);

    const full = graphOf(
      input([
        stageOf("a", "a.full", {
          uniforms: [{ key: "amount", glslType: "float", default: 0 }],
          passes: [{ uniforms: [{ key: "radius", glslType: "float", default: 1 }] }, {}],
          derive: () => ({}),
          consumes: ["a_mask"],
          produces: [{ name: "a_detail", glslType: "float" }],
          textures: [
            { key: "lut", kind: "lut" },
            { key: "strokes", kind: "coverage" },
          ],
          mask: { maskable: true },
        }),
      ]),
    ).bands[0].stages[0];
    expect(full.inPorts.map((p) => [p.id, p.label])).toEqual([
      ["colour", "colour in"],
      ["consumes:a_mask", "consumes a_mask"],
      ["uniforms", "uniforms (2)"],
      ["derived", "derived"],
      ["prepass", "prepass (2)"],
      ["textures", "textures (1)"],
      ["brush", "brush (1)"],
      ["mask", "mask"],
    ]);
    expect(full.outPorts.map((p) => [p.id, p.label])).toEqual([
      ["colour", "colour out"],
      ["produces:a_detail", "produces a_detail"],
    ]);
  });

  it("gives a geometry stage a geometry output and no colour", () => {
    const geo = graphOf(input([stageOf("core", "core.crop", { phase: "geometry" })])).bands[0].stages[0];
    expect(geo.inPorts.map((p) => p.id)).toEqual([]);
    expect(geo.outPorts.map((p) => p.id)).toEqual(["geometry"]);
  });

  it("gives a band the registration ports that apply", () => {
    const registry: RegistryState = {
      ...emptyRegistry(),
      processingStages: { "a.s": stageOf("a", "a.s", { uniforms: [{ key: "k", glslType: "float", default: 0 }] }) },
      panels: { "a.panel": panel("a") },
      gridFilters: { "a.filter": panel("a") },
      settings: { a: panel("a") },
    };
    const band = graphOf({ ...input([]), registry }).bands[0];
    expect(band.inPorts.map((p) => p.id)).toEqual(["params", "catalogue", "settings"]);
    expect(band.outPorts.map((p) => p.id)).toEqual(["ui", "stage-declaration"]);
    expect(band.contributions).toContainEqual({ kind: "panels", label: "Panels", ids: ["a.panel"] });
  });

  it("gives a band variable ports from what it subscribes to and has written", () => {
    const writer = (extension: string) => ({ extension, window: "w1" });
    const variable: VariableInspection = {
      snapshot: {
        name: "map.overlays",
        value: {},
        revision: { n: 2, window: "w1" },
        writer: writer("gps"),
        registeredBy: writer("map"),
      },
      size: 2,
      history: [{ time: 1, writer: writer("gps"), revision: { n: 2, window: "w1" }, outcome: "accepted" }],
      subscribers: ["map"],
    };
    const g = graphOf(input([stageOf("map", "map.s"), stageOf("gps", "gps.s")], { variables: [variable] }));
    const band = (id: string) => g.bands.find((b) => b.extensionId === id);
    expect(band("map")?.inPorts.map((p) => p.id)).toContain("variables");
    expect(band("map")?.subscribed).toEqual(["map.overlays"]);
    expect(band("gps")?.outPorts.map((p) => p.id)).toContain("settings-variables");
    expect(band("gps")?.written).toEqual(["map.overlays"]);
    expect(band("gps")?.inPorts.map((p) => p.id)).not.toContain("variables");
  });
});

describe("edges", () => {
  it("chains colour from core's image through each stage in order to display + export", () => {
    const g = graphOf(
      input([
        stageOf("a", "a.fx", { phase: "effects" }),
        stageOf("b", "b.tone", { phase: "tone-map" }),
        stageOf("core", "core.crop", { phase: "geometry" }),
      ]),
    );
    expect(ofKind(g, "colour").map(link)).toEqual([
      `${CORE_NODE}.image -> ${stageNodeId("b.tone")}.colour`,
      `${stageNodeId("b.tone")}.colour -> ${stageNodeId("a.fx")}.colour`,
      `${stageNodeId("a.fx")}.colour -> ${CORE_NODE}.display-export`,
    ]);
    expect(ofKind(g, "geometry").map(link)).toEqual([`${stageNodeId("core.crop")}.geometry -> ${CORE_NODE}.geometry`]);
  });

  it("links an isv producer to its consumers", () => {
    const g = graphOf(
      input([
        stageOf("a", "a.make", { phase: "tone-map", produces: [{ name: "a_v", glslType: "float" }] }),
        stageOf("b", "b.use", { consumes: ["a_v", "nobody_v"] }),
      ]),
    );
    expect(ofKind(g, "isv").map(link)).toEqual([
      `${stageNodeId("a.make")}.produces:a_v -> ${stageNodeId("b.use")}.consumes:a_v`,
    ]);
  });

  it("feeds each resource port a stage has from core", () => {
    const g = graphOf(
      input([stageOf("a", "a.s", { uniforms: [{ key: "k", glslType: "float", default: 0 }], mask: { maskable: true } })]),
    );
    expect(ofKind(g, "resource").map(link)).toEqual([
      `${CORE_NODE}.uniforms -> ${stageNodeId("a.s")}.uniforms`,
      `${CORE_NODE}.mask -> ${stageNodeId("a.s")}.mask`,
    ]);
    const used = g.core.filter((p) => p.used).map((p) => p.id);
    expect(used).toEqual(expect.arrayContaining(["image", "uniforms", "mask", "display-export"]));
    expect(g.core.find((p) => p.id === "renderer")?.used).toBe(false);
  });

  it("draws registration edges only for the selected band, or the selected stage's", () => {
    const registry: RegistryState = {
      ...emptyRegistry(),
      processingStages: { "a.s": stageOf("a", "a.s"), "b.s": stageOf("b", "b.s") },
      panels: { "b.panel": panel("b") },
    };
    const i = { ...input([]), registry };
    expect(ofKind(graphOf(i), "registration")).toEqual([]);
    const forB = ofKind(graphOf(i, { selection: { kind: "node", id: bandId("b") } }), "registration").map(link);
    expect(forB).toEqual([`${bandId("b")}.ui -> ${CORE_NODE}.ui-registrations`, `${bandId("b")}.stage-declaration -> ${CORE_NODE}.stage-declarations`]);
    const forStage = ofKind(graphOf(i, { selection: { kind: "node", id: stageNodeId("a.s") } }), "registration");
    expect(forStage.every((e) => e.from.node === bandId("a") || e.to.node === bandId("a"))).toBe(true);
    expect(forStage.length).toBeGreaterThan(0);
  });

  it("reattaches a collapsed band's edges to its header and drops the ones inside it", () => {
    const i = input([
      stageOf("a", "a.one", { phase: "tone-map" }),
      stageOf("a", "a.two", { phase: "effects" }),
      stageOf("b", "b.last", { phase: "output-encode" }),
    ]);
    const g = graphOf(i, { collapsed: { [bandId("a")]: true } });
    expect(ofKind(g, "colour").map(link)).toEqual([
      `${CORE_NODE}.image -> ${bandId("a")}.header`,
      `${bandId("a")}.header -> ${stageNodeId("b.last")}.colour`,
      `${stageNodeId("b.last")}.colour -> ${CORE_NODE}.display-export`,
    ]);
    expect(g.lanes.find((l) => l.id === "tone-map")?.stages).toBe(0);
  });

  it("skips stages of bands the search hides", () => {
    const g = graphOf(input([stageOf("a", "a.s", { phase: "tone-map" }), stageOf("b", "b.s")]), { search: "b.s" });
    expect(ofKind(g, "colour").map(link)).toEqual([
      `${CORE_NODE}.image -> ${stageNodeId("b.s")}.colour`,
      `${stageNodeId("b.s")}.colour -> ${CORE_NODE}.display-export`,
    ]);
  });

  it("tones edges by the stages they join and colours them by the owning extension", () => {
    const live = liveStatus({ programStages: ["a.run"], dormant: ["b.idle"] });
    const g = graphOf(input([stageOf("a", "a.run", { phase: "tone-map" }), stageOf("b", "b.idle")], { live }));
    const [first, second] = ofKind(g, "colour");
    expect(first).toMatchObject({ tone: "running", owner: "a" });
    expect(second).toMatchObject({ tone: "dim", owner: "b" });
  });
});

describe("selection", () => {
  it("links a stage to its edges' other ends and their bands, and nothing else", () => {
    const g = graphOf(input([stageOf("a", "a.s", { phase: "tone-map" }), stageOf("b", "b.s"), stageOf("c", "c.s", { phase: "output-encode" })]));
    const linked = linkedTo(g, { kind: "node", id: stageNodeId("a.s") });
    expect(linked?.nodes.has(stageNodeId("b.s"))).toBe(true);
    expect(linked?.nodes.has(bandId("b"))).toBe(true);
    expect(linked?.nodes.has(stageNodeId("c.s"))).toBe(false);
    expect([...(linked?.edges ?? [])].every((id) => id.includes("a.s"))).toBe(true);
    expect(linkedTo(g, null)).toBeNull();
  });

  it("links a band through all its stages", () => {
    const g = graphOf(input([stageOf("a", "a.s", { phase: "tone-map" }), stageOf("b", "b.s")]));
    const linked = linkedTo(g, { kind: "node", id: bandId("a") });
    expect(linked?.nodes.has(stageNodeId("a.s"))).toBe(true);
    expect(linked?.nodes.has(stageNodeId("b.s"))).toBe(true);
  });
});

describe("model and stats", () => {
  it("counts extensions and stages by status across every band", () => {
    const live = liveStatus({ programStages: ["a.run"], dormant: ["a.idle"] });
    const m = buildModel(
      input([stageOf("a", "a.run"), stageOf("a", "a.idle"), stageOf("a", "a.bad")], {
        live,
        failures: { "a.bad": { log: "boom", crashed: false } },
        extensions: [
          extensionInfo("a"),
          extensionInfo("off", { enabled: false, running: false }),
          extensionInfo("dead", { failure: { reason: "threw", message: "x" } }),
        ],
      }),
    );
    expect(m.stats).toEqual({
      extensions: { running: 1, failed: 1, off: 1 },
      stages: { running: 1, notBuilt: 1, problems: 1 },
    });
    const projected = projectGraph(m, OPTIONS);
    expect(projected.bands.map((b) => b.extensionId)).toEqual(["a", "dead"]);
  });
});
