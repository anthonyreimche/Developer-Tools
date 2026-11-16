// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// Where the graph's input comes from. The registry, the extensions list, the
// pipeline rows and the variables are this window's: every window activates
// the same extensions, and the rows only give structure and order. The live
// status and failures are the newest any window has, through the relay. Each
// api.devtools member is optional: without one the graph does without it.
// The model and the graph are worked out once per window and shared by the
// module, its status bar and its panels.

import { React, api } from "../rt";
import type {
  DevExtensionInfo,
  DevtoolsObservable,
  LiveRenderStatus,
  PipelineRow,
  RegistryState,
  VariableInspection,
} from "../safelight";
import {
  bandOfSelection,
  buildModel,
  projectGraph,
  type Graph,
  type GraphInput,
  type GraphOptions,
  type Model,
} from "./model";
import {
  HELLO_MS,
  broadcastPort,
  createLiveRelay,
  pickNewest,
  type Failures,
  type LiveRelay,
  type LiveSource,
  type RelayPort,
  type StageValues,
} from "./relay";
import { devView } from "./store";

const WINDOW_ID = Math.random().toString(36).slice(2, 10);

/** This window as another window's status bar names it. */
export function windowLabel(): string {
  const params = new URLSearchParams(window.location.search);
  const detached = params.get("detached");
  if (detached) return `the ${detached.charAt(0).toUpperCase()}${detached.slice(1)} window`;
  if (params.get("devtools") === "1") return "the Developer Tools window";
  return "the main window";
}

const silentPort: RelayPort = { post: () => undefined, listen: () => undefined, close: () => undefined };

let relay: LiveRelay | null = null;
let silent: LiveRelay | null = null;
let stopped = false;

/** This window's relay. After deactivation it is a silent one, so a render or
 *  a timer that outlives the extension opens no channel and posts nothing. */
export function liveRelay(): LiveRelay {
  if (stopped) {
    silent ??= createLiveRelay({ port: silentPort, windowId: WINDOW_ID, windowLabel: "", render: undefined });
    return silent;
  }
  relay ??= createLiveRelay({
    port: broadcastPort() ?? silentPort,
    windowId: WINDOW_ID,
    windowLabel: windowLabel(),
    render: api.devtools?.render,
  });
  return relay;
}

/** Start the relay, so this window answers Dev views elsewhere. */
export function startLiveRelay(): void {
  stopped = false;
  liveRelay();
}

/** Close the relay and forget what this window had worked out. */
export function stopLiveRelay(): void {
  relay?.close();
  relay = null;
  stopped = true;
  sharedModel = null;
  sharedGraph = null;
  appVersion = null;
  askedVersion = false;
}

/** Say hello now and every 2 s while the Dev view is mounted. */
export function useHello(): void {
  React.useEffect(() => {
    const hello = () => liveRelay().hello();
    hello();
    const timer = setInterval(hello, HELLO_MS);
    return () => clearInterval(timer);
  }, []);
}

const NO_FAILURES: Failures = {};
const NO_ROWS: readonly PipelineRow[] = [];
const NO_VARIABLES: readonly VariableInspection[] = [];
const noSubscription = () => () => undefined;
const noChanges = () => 0;

function useObservable<T>(obs: DevtoolsObservable<T> | undefined, fallback: T): T {
  const subscribe = React.useCallback((l: () => void) => (obs ? obs.subscribe(l) : () => undefined), [obs]);
  const get = React.useCallback(() => (obs ? obs.get() : fallback), [obs, fallback]);
  return React.useSyncExternalStore(subscribe, get);
}

function useRows(): readonly PipelineRow[] {
  const pipeline = api.devtools?.pipeline;
  // api.devtools is handed over once at activation, so this branch is the
  // same on every render and the hooks behind it keep their order.
  if (!pipeline) return NO_ROWS;
  return pipeline.useRows(pipeline.useOpenVersion().version);
}

let appVersion: string | null = null;
let askedVersion = false;
const versionListeners = new Set<() => void>();

/** Watch the app version, which is asked of core once per window. */
function subscribeVersion(listener: () => void): () => void {
  versionListeners.add(listener);
  if (!askedVersion) {
    askedVersion = true;
    void api.devtools?.appVersion().then((v) => {
      appVersion = v;
      for (const l of [...versionListeners]) l();
    });
  }
  return () => void versionListeners.delete(listener);
}

const currentVersion = () => appVersion;

const selectAll = (s: RegistryState) => s;

/** The newest live data across windows, this one's included. */
export function useLive(): LiveSource | null {
  const render = api.devtools?.render;
  const live = useObservable<LiveRenderStatus | null>(render?.live, null);
  const failures = useObservable<Failures>(render?.stageFailures, NO_FAILURES);
  const r = liveRelay();
  const remotes = React.useSyncExternalStore(r.subscribe, r.remotes);
  return React.useMemo(() => pickNewest({ live, failures }, remotes), [live, failures, remotes]);
}

/** What the model is built from, by identity or by content: equal keys build
 *  equal models. A new frame moves the live status's `at` and `frameMs`
 *  without changing what the graph draws, so the key leaves them out. */
interface ModelKey {
  registry: RegistryState;
  extensions: readonly DevExtensionInfo[] | null;
  rows: string;
  live: string;
  failures: string;
  variables: number;
  appVersion: string | null;
}

const sameKey = (a: ModelKey, b: ModelKey) =>
  a.registry === b.registry &&
  a.extensions === b.extensions &&
  a.rows === b.rows &&
  a.live === b.live &&
  a.failures === b.failures &&
  a.variables === b.variables &&
  a.appVersion === b.appVersion;

const liveKey = (live: LiveRenderStatus | null) =>
  live ? [live.programStages, live.dormant, live.overflowed].map((l) => l.join(",")).join("|") : "";

const rowsKey = (rows: readonly PipelineRow[]) => rows.map((r) => (r.kind === "stage" ? r.id : "")).join(",");

let sharedModel: { key: ModelKey; model: Model } | null = null;

export function useModel(): Model {
  const registry = api.registry.use(selectAll);
  const extensions = useObservable<readonly DevExtensionInfo[] | null>(api.devtools?.extensions, null);
  const rows = useRows();
  const inspector = api.devtools?.variables;
  const variables = React.useSyncExternalStore(
    inspector?.subscribeChanges ?? noSubscription,
    inspector?.changeCount ?? noChanges,
  );
  const version = React.useSyncExternalStore(subscribeVersion, currentVersion);
  const source = useLive();
  const live = source?.live ?? null;
  const failures = source?.failures ?? NO_FAILURES;
  const key: ModelKey = {
    registry,
    extensions,
    rows: rowsKey(rows),
    live: liveKey(live),
    failures: JSON.stringify(failures),
    variables,
    appVersion: version,
  };
  if (!sharedModel || !sameKey(sharedModel.key, key)) {
    const input: GraphInput = {
      registry,
      extensions,
      rows,
      live,
      failures,
      variables: inspector?.inspect() ?? NO_VARIABLES,
      appVersion: version,
    };
    sharedModel = { key, model: buildModel(input) };
  }
  return sharedModel.model;
}

let sharedGraph: { model: Model; options: GraphOptions; band: string | null; graph: Graph } | null = null;

/** The graph as the toolbar and selection show it. Registration edges follow
 *  the band of the last node or port selected, and stay while an edge or a
 *  core port is selected; clearing the selection drops them. */
export function useGraph(model: Model): Graph {
  const view = devView();
  const showAll = view((s) => s.showAll);
  const search = view((s) => s.search);
  const collapsed = view((s) => s.collapsed);
  const selection = view((s) => s.selection);
  const sticky = view((s) => s.registrationBand);
  const resolved = bandOfSelection(selection, model);
  const band = selection === null ? null : (resolved ?? sticky);

  React.useEffect(() => {
    const s = devView().getState();
    if (resolved && resolved !== s.registrationBand) s.setRegistrationBand(resolved);
  }, [resolved]);

  const g = sharedGraph;
  if (
    g &&
    g.model === model &&
    g.band === band &&
    g.options.showAll === showAll &&
    g.options.search === search &&
    g.options.collapsed === collapsed
  ) {
    return g.graph;
  }
  const options: GraphOptions = { showAll, search, collapsed, selection: band ? { kind: "node", id: band } : null };
  sharedGraph = { model, options, band, graph: projectGraph(model, options) };
  return sharedGraph.graph;
}

/** A stage's drawn values from the window whose live data is shown. */
export function fetchLiveValues(source: LiveSource, stageId: string): Promise<StageValues | null> {
  if (source.windowId === null) return Promise.resolve(api.devtools?.render?.liveValues(stageId) ?? null);
  return liveRelay().requestValues(source.windowId, stageId);
}

/** The stage's drawn values, asked for on selection and again with each new
 *  live frame; null until they arrive or with no live view. */
export function useLiveValues(stageId: string | null, source: LiveSource | null): StageValues | null {
  const [got, setGot] = React.useState<{ stageId: string; values: StageValues | null } | null>(null);
  const at = source?.live.at;
  const sourceRef = React.useRef(source);
  sourceRef.current = source;
  React.useEffect(() => {
    const from = sourceRef.current;
    if (!stageId || !from) return;
    let current = true;
    void fetchLiveValues(from, stageId).then((values) => current && setGot({ stageId, values }));
    return () => {
      current = false;
    };
  }, [stageId, source?.windowId, at]);
  return got?.stageId === stageId ? got.values : null;
}
