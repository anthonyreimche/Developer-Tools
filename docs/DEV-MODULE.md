# Dev module

A top-level module in the Developer Tools extension (`safelight.devtools`, the
only extension core hands `api.devtools`). It draws every installed
extension, the processing stages each one registers, the links between them
and what the live view is running, as a node graph in phase swimlanes. It is
for people debugging Safelight and building extensions. It is read-only.

The Developer Tools panel (`core.devtools`, Ctrl+Alt+I, pop-out window) stays
as it is. The module adds the graph and its own panels.

Revised 2026-11-15 after an adversarial review against the code.

## What the user sees

**Module tab "Dev"** (module id `dev`). It can be popped out like any module.
The main view is a toolbar plus the graph.

**Toolbar:**
- search, which filters bands by extension or stage name.
- "All extensions" toggle. Off by default: then only bands with stages or a
  problem show.
- "Empty phases" toggle.
- Fit.
- Collapse all / expand all.

**Columns (swimlanes):** the processing phases in core's
`PROCESSING_PHASE_ORDER`, copied into the extension because it isn't on the
API: geometry, decode, noise reduction, scene-linear, tone map, display
adjust, effects, output encode. An "other" column catches an unknown phase.
- A phase with no stage is drawn narrow and labelled unless "Empty phases"
  is on.
- A stage sits in its declared phase. An anchored stage carries an "at
  {anchor}" tag.
- Inside a column, stages are ordered by the live program's order when
  known, else by the local pipeline rows' order, else by priority.

**Core node:** on the left, full height. Its ports, as in the sketch:
- out to extensions: param bag, catalogue, renderer, UI shell, settings +
  variables.
- out to stages: image, uniforms, derived, prepass, textures, brush, mask.
- in: UI registrations, settings + variables, stage textures, stage
  declarations, geometry, display + export.

**Extension bands:** one horizontal band per extension, sorted by name. The
built-in `core` band ("Safelight", app version) holds core's own stages.
- Header: name, id, version, source (built-in / installed / dev folder), a
  status badge and a [-]/[+] collapse button. Bands start expanded when they
  have stages and collapsed otherwise. A collapsed band's edges attach to
  its header.
- Left-hand registration ports, drawn only when they apply:
  - in: params (it owns stages with uniforms), photo/catalogue (catalogue
    hooks, grid filters or menu items, sorts), settings (it has a settings
    section), variables (it subscribes to one).
  - out: UI register (panels, modules, slots, stylesheets, themes, layouts,
    panel header accessories, slider icons, cursors…), settings + variables
    (it has written one), stage texture (one of its stages declares
    textures), stage declaration (it owns stages).
  - Registration edges (band ↔ core) are drawn only for the selected band.
    Hundreds of them into the core node would be unreadable.
- Its stage nodes sit in their columns. Several stages of one extension in
  one column stack vertically.

**Stage node:** the name in the header, the id on hover. Ports, drawn only
when they apply:
- in: colour in, consumes (one per `isv` name), uniforms (count), derived
  (`derive`), prepass (pass count), textures (non-coverage), brush (coverage
  textures), mask (maskable).
- out: colour out, produces (one per `isv` name), geometry.

**Edges:**
- colour chain: core image → each stage in order → core display + export.
  Geometry stages are left out of the chain: they map coordinates and hold
  no colour.
- isv: producer → consumer.
- core resources: core → stage, for each resource port the stage has.
- geometry: stage → core.
- registrations: band ↔ core, for the selected band only.

**Stage status:** precedence top to bottom, first match wins.

| Status | Rule | Colour |
|---|---|---|
| crashed | in render failures with `crashed` | red |
| quarantined | in render failures (signature-filtered by core) | red |
| left out | not in the live program; no failure; consumes something (orphan) | amber |
| overflowed | in the last frame's overflowed list | amber |
| not built | in the live renderer's dormant list ("not built this session": no frame has needed it since the renderer started) | dim |
| running | in the live program | accent |
| registered | no live data (no Develop frame in any window) | neutral |

Mask copy ids `stage@n` map to their parent stage. A running stage also gets
an "at rest" flag when its `dormantWhen` holds for the drawn values. The
Inspector shows it ("idle: every listed uniform at its rest value").

**Extension status:**
- running.
- turned off.
- failed to start (with the message).
- callback failures (count).
- dev folder error (with the message).
- installed but not running.

Running edges are solid in the accent colour. "Not built" and "registered"
edges are dim and dashed. Problems are amber, failures red.

**Interaction:**
- Drag empty space to pan. It is smooth and stops on release, with no
  momentum.
- The wheel zooms about the cursor. The listener is attached natively with
  `{ passive: false }`.
- Double-click empty space to fit.
- Click a node, port or edge to select it. Things not linked to the
  selection dim.
- Esc clears the selection.
- Pointer maths run on the untransformed viewport element:
  `(clientX - rect.left) / (rect.width / el.offsetWidth)`, which survives
  the UI-scale body zoom and display scaling.

**Status bar:**
- extensions: running / failed / off.
- stages: running / not built / problems.
- the last live frame's request-to-answer time.
- how old the live data is: "live from {window}", "12 s ago", or "Open
  Develop, or pop out Dev, to see what runs".

**Module panels:** seeded only through the module's `defaultLayout`, with
no `defaultDock.module`.

- **Extensions** (left rail): a tree, extension → stages, each with its
  status and reason. Click one to select and scroll to it. Dev-folder
  entries have a Reload button.
- **Inspector** (right rail): the selection in detail.
  - a stage:
    - phase, priority, anchor, after, reads, space, mask, geometry,
      viewOnly, keepsDetail, `dormantWhen` and the at-rest flag.
    - uniforms with type and default, plus the live value: the drawn values,
      fetched on selection (marked "derived" for stages with `derive`).
    - passes, textures, produces / consumes.
    - status and reason: the failure log, overflow, the orphan variable.
  - an extension: its contributions by kind, its variables (subscribed /
    written, with a note that writers come from recent history) and its
    failures.
  - an edge: both ends and what flows.
- **Variables** and **Pipeline:** the existing tab components, as panels.
- **Console:** the existing console component (exported), bottom rail.

Panels whose `api.devtools` member is missing render `Unavailable` ("Not
available in this version of Safelight.").

## Core seams: the contract

All are optional members on `api.devtools`, typed in `api/devtools.ts`,
added to `scoped-api.ts` and built in `host.tsx` `devtoolsAPI()`.
`extension-types/safelight.d.ts` is regenerated, and docs and the changelog
are updated.

```ts
/** A value that can be read now, watched, or used as a React hook. */
export interface DevtoolsObservable<T> {
  get(): T;
  subscribe(listener: () => void): () => void;
  use(): T;
}

export interface DevExtensionInfo {
  id: string;
  name: string;
  version: string;
  source: "builtin" | "installed" | "dev";
  /** An instance of it is live in this window. */
  running: boolean;
  /** Not in the turned-off list. */
  enabled: boolean;
  /** Why it failed to start, while that stands. */
  failure: { reason: string; message: string } | null;
  /** Callbacks of its that threw and were guarded. */
  callbackFailures: number;
  /** A dev-folder copy's load error. */
  devError: string | null;
}

export interface DevtoolsExtensions extends DevtoolsObservable<readonly DevExtensionInfo[]> {
  /** Reload a dev-folder extension (reloadDevExtension). */
  reloadDev(id: string): Promise<void>;
}

export interface LiveRenderStatus {
  /** Date.now() of the last live frame. */
  at: number;
  photoId: string | null;
  processVersion: ProcessVersion;
  /** Stage ids in the live program, program order; mask copies as `id@n`. */
  programStages: readonly string[];
  /** Stages (and copies) the live renderer has built without since it
   *  started: no frame has needed them. */
  dormant: readonly string[];
  /** The last frame's overflowedStages. */
  overflowed: readonly string[];
  /** The last render's request-to-answer time (mailbox), ms. */
  frameMs: number | null;
  /** The last renderError, while no later frame has succeeded. */
  lastError: { at: number; message: string } | null;
}

export interface StageFailureInfo {
  log: string;
  crashed: boolean;
}

export interface DevtoolsRender {
  /** This window's live develop view; null with none since launch. */
  live: DevtoolsObservable<LiveRenderStatus | null>;
  /** Standing failures (stageFailuresOf's signature rule), by stage id. */
  stageFailures: DevtoolsObservable<Readonly<Record<string, StageFailureInfo>>>;
  /** The values this window's live view last drew for the stage's uniforms,
   *  by uniform key, derived values included; null with no live view. */
  liveValues(stageId: string): Readonly<Record<string, unknown>> | null;
}

// on DevtoolsAPI:
extensions?: DevtoolsExtensions;
render?: DevtoolsRender;
```

Implementation notes (core):

- **Program status:**
  - The worker posts a new `programStatus { programStages, dormant }`
    response whenever the live renderer's program or dormant set changes,
    not on every frame.
  - `overflowed` already rides on `frame`.
  - The bridge's `handleMessage` (`frame`, `programStatus`, `renderError`)
    writes `rendering/render-bridge/live-status.ts`, but only for the live
    develop bridge.
  - `frameMs` comes from the mailbox's existing request-to-answer timing.
  - Store writes are throttled to one a second when only `at`/`frameMs`
    changed.
  - `use-develop-renderer`'s own `overflowedStages` state should read this
    store, so DevelopCanvas and Dev share one source.
- **Extensions:**
  - `publishRunning()` publishes `{ id, source, name, version }` per instance.
  - Built-ins are included: `core` as "Safelight", with the app version.
  - Installed-but-off extensions come from `native.plugins.list()`. It is
    refreshed when the running, disabled or installed stores change, and
    when the dev folder changes.
- **Stage failures:** `useStageFailures` filtered through `stageFailuresOf`'s
  signature rule. `crashed` = `log === GPU_CRASH_LOG`.
- **liveValues:** reads the bridge's `liveStageBag` plus derived values for
  that stage's keys.

Tests: extend `host-api.test.tsx` `describe("api.devtools")`; add worker
tests for `programStatus` posting on change only, bridge/store tests for the
throttle and live-bridge-only writes, and running-instance publishing tests.

## Pop-out relay (extension)

Core stores don't cross windows. Opening the Dev tab unmounts Develop in
that window, and Develop itself can pop out. So any window may hold the
live view.

- Channel `safelight-devtools-live`.
- A mounted Dev view sends `hello` on mount, then every 2 s.
- A window whose `render.live` is non-null answers hellos with
  `{ type: "live", window, live, failures }`, and re-sends on change (at
  most every 250 ms) until 5 s pass without a hello.
- The Dev view takes the newest `live.at` across windows, its own included.
- On selection the Dev view asks `{ type: "values", stageId }`, and the
  window that sent the newest live data answers with `liveValues`.
- Every incoming message is validated (shape and types) and dropped if
  malformed.
- The extensions list, the registry and the pipeline rows are read locally:
  every window activates the same extensions. Rows only give structure and
  order, and status comes from live data, so the pop-out's default-photo
  rows are good enough.

## Code layout (extension)

```
src/dev/
  phases.ts     PROCESSING_PHASE_ORDER copy + labels
  model.ts      buildGraph(input) → { lanes, bands, nodes, edges }: pure
  status.ts     stage / extension status rules: pure
  layout.ts     layoutGraph(graph, view opts) → positions + edge paths: pure
  relay.ts      BroadcastChannel protocol + validation
  sources.ts    hooks gathering GraphInput (local + relay)
  store.ts      zustand: selection, collapsed bands, toggles, view transform
  DevModule.tsx module view: toolbar + GraphView
  GraphView.tsx SVG edges + HTML nodes, pan/zoom, selection
  StatusBar.tsx
  panels/       ExtensionsPanel, InspectorPanel, VariablesPanel, PipelinePanel, ConsolePanel
```

- `src/safelight.d.ts` mirrors the new API: `registerModule`/
  `ModuleContribution`/`ModuleLayoutDef`, `registry.use` with the
  RegistryState slice used, `ProcessingStageContribution` fields read,
  `stores.useDevelopStore` (photoId only), `navigation.goTo`, and the new
  devtools types.
- `test/support/fake-api.ts` gains the same.
- All styling goes through `tw()`. Any utility the graph needs is added to
  `styles.ts`. Bespoke geometry uses inline style plus `api.ui.tokens`.
- Canadian spelling throughout, and no third-party program names in UI
  strings.

## Registration

- `registerModule({ id: "dev", label: "Dev", order: 900, component:
  DevModule, statusBar: DevStatusBar, defaultLayout })`.
  - Left rail: Extensions, Pipeline.
  - Right rail: Inspector, Variables.
  - Bottom: Console.
- Panels: `safelight.devtools.{extensions,inspector,variables,pipeline,console}`.
  The four side-rail panels are `fill`, so two expanded in one rail share its
  height (core 3.2.8; older cores stretch only the first).
- Keybinding `safelight.devtools.go` "Go to Dev", category General, no
  default combo.
- Version 1.0.1 → 1.1.0. minAppVersion stays 3.2.0, because the new seams
  are feature-detected and `registerModule` predates 3.2.0.

## Tests (red first)

- **model:**
  - bands: per extension, the core band, and the visibility filter.
  - stages land in the right lane, including "other".
  - stacking; ports only when they apply.
  - colour chain: program order, else rows order, else priority; geometry
    stages left out.
  - isv edges; registration edges only for the selected band.
  - a collapsed band reattaches its edges.
  - variable ports.
- **status:** every stage status and its precedence; `@n` copies mapped;
  the at-rest flag; extension statuses.
- **layout:**
  - lane x is monotonic and bands don't overlap.
  - nodes sit inside their lane and band.
  - empty lanes are narrow.
  - edge paths start and end on their ports.
- **relay:** hello/answer, newest wins, the throttle, the 5 s silence stop,
  values request/answer, malformed messages dropped.
- **view (Testing Library):**
  - renders bands and nodes from a fake registry.
  - click selects and dims.
  - the Inspector shows a uniform's live value.
  - search; collapse.
  - pan/zoom maths with a zoomed rect; a wheel `preventDefault`.
- **activate:** the module, panels and keybinding are registered; the
  module works without the new seams; existing behaviour is unchanged.

## Out of scope (v1)

- Editing the graph.
- Per-stage GPU timing: only the whole frame is timed.
- Non-live renderers (export, thumbnails).
