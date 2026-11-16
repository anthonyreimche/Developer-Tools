// A stand-in Safelight API over real React and zustand. The dock keeps a set of
// open panels, the pipeline reads and the contribution registry come from
// zustand stores a test can set, shared variables follow core's stale-write
// rule (fake-variables.ts), the extensions list and the live render status are
// observables a test can set, and every registration, navigation and native
// DevTools call is recorded.

import * as React from "react";
import { create, type StoreApi, type UseBoundStore } from "zustand";
import type {
  DevExtensionInfo,
  DevtoolsAPI,
  DevtoolsExtensions,
  DevtoolsObservable,
  DevtoolsRender,
  ElectronDevtools,
  KeyActionContribution,
  LiveRenderStatus,
  ModuleContribution,
  NativeDetails,
  PanelContribution,
  PipelineRow,
  ProcessVersion,
  RegisteredProcessingStage,
  RegistryState,
  SafelightAPI,
  ScreenTarget,
  SettingsContribution,
  StageFailureInfo,
  StylesheetContribution,
  UiTokens,
  WebGLInfo,
} from "../../src/safelight";
import { fakeVariables, type FakeVariables } from "./fake-variables";

export const TOKENS: UiTokens = {
  surface1: "var(--color-surface-1)",
  surface2: "var(--color-surface-2)",
  surface3: "var(--color-surface-3)",
  surface4: "var(--color-surface-4)",
  border: "var(--color-border)",
  borderSubtle: "var(--color-border-subtle)",
  textPrimary: "var(--color-text-primary)",
  textSecondary: "var(--color-text-secondary)",
  textMuted: "var(--color-text-muted)",
  accent: "var(--color-accent)",
  sliderFill: "var(--color-slider-fill)",
  white: "var(--color-white)",
  fontCode: "var(--font-code)",
};

export interface PipelineState {
  photoId: string | null;
  /** The open photo's version (the defaults' with none open). */
  version: ProcessVersion;
  /** What useRows returns for each version. */
  rows: Record<ProcessVersion, PipelineRow[]>;
  screen: ScreenTarget;
}

/** An observable whose value a test sets. */
export interface Settable<T> extends DevtoolsObservable<T> {
  set(value: T): void;
}

export function observable<T>(initial: T): Settable<T> {
  let value = initial;
  const listeners = new Set<() => void>();
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => void listeners.delete(listener);
  };
  const get = () => value;
  return {
    get,
    subscribe,
    use: () => React.useSyncExternalStore(subscribe, get),
    set: (next) => {
      value = next;
      for (const l of [...listeners]) l();
    },
  };
}

export function emptyRegistry(): RegistryState {
  return {
    panels: {},
    themes: {},
    sliderIcons: {},
    layouts: {},
    settings: {},
    pipelines: {},
    exportProcessors: {},
    filenameTemplates: {},
    processingStages: {},
    catalogHooks: {},
    presetImporters: {},
    gridFilters: {},
    gridMenuItems: {},
    slots: {},
    panelHeaderAccessories: {},
    librarySorts: {},
    stylesheets: {},
    modules: {},
  };
}

/** A registered stage with the fields every stage has. */
export function stageOf(
  extensionId: string,
  id: string,
  more: Partial<RegisteredProcessingStage> = {},
): RegisteredProcessingStage {
  return { extensionId, id, name: id, phase: "effects", uniforms: [], ...more };
}

export function extensionInfo(id: string, more: Partial<DevExtensionInfo> = {}): DevExtensionInfo {
  return {
    id,
    name: id,
    version: "1.0.0",
    source: "installed",
    running: true,
    enabled: true,
    failure: null,
    callbackFailures: 0,
    devError: null,
    ...more,
  };
}

export function liveStatus(more: Partial<LiveRenderStatus> = {}): LiveRenderStatus {
  return {
    at: Date.now(),
    photoId: "p1",
    processVersion: 2,
    programStages: [],
    dormant: [],
    overflowed: [],
    frameMs: 16,
    lastError: null,
    ...more,
  };
}

export interface FakeRender extends DevtoolsRender {
  live: Settable<LiveRenderStatus | null>;
  stageFailures: Settable<Readonly<Record<string, StageFailureInfo>>>;
  /** What liveValues answers while there is a live view, by stage id. */
  values: Map<string, Record<string, unknown>>;
}

export interface FakeExtensions extends DevtoolsExtensions {
  set(value: readonly DevExtensionInfo[]): void;
  /** Every reloadDev call's id. */
  reloads: string[];
}

export interface Rig {
  api: SafelightAPI;
  panels: PanelContribution[];
  modules: ModuleContribution[];
  settings: SettingsContribution[];
  keybindings: KeyActionContribution[];
  stylesheets: StylesheetContribution[];
  /** Panels open in the dock. */
  open: Set<string>;
  /** Every dock.togglePanel call. */
  toggles: string[];
  /** Every titleBar.useOverlay variable, once per render. */
  overlays: string[];
  /** Every devtools call: "init", "teardown", "open:detach", "reload:true" … */
  calls: string[];
  /** The version each useRows call asked for. */
  rowRequests: ProcessVersion[];
  pipeline: UseBoundStore<StoreApi<PipelineState>>;
  variables: FakeVariables;
  registry: UseBoundStore<StoreApi<RegistryState>>;
  /** Every navigation.goTo module. */
  navigations: string[];
  /** Undefined with `seams: false`. */
  extensions: FakeExtensions | undefined;
  render: FakeRender | undefined;
}

export const CONTROLS_TEST_ID = "dev-folder-controls";

export const NATIVE: NativeDetails = {
  platform: "win32",
  versions: { electron: "37.2.0", chrome: "138.0.7204.97" },
  gpuInfo: async () => ({ gpu_compositing: "enabled", webgl2: "enabled", vulkan: "disabled_off" }),
  metrics: async () => [
    { type: "Browser", pid: 4100, cpuPercent: 1.2, memoryMB: 182.4 },
    { type: "GPU", pid: 4101, cpuPercent: 3, memoryMB: 251.6 },
  ],
};

export interface RigOptions {
  /** false: the host hands over no api.devtools. */
  devtools?: boolean;
  /** false: outside the desktop app (no Electron DevTools bridge). */
  desktop?: boolean;
  /** The desktop app's api.devtools.native; NATIVE in the desktop app, none
   *  outside it. */
  native?: NativeDetails;
  webgl?: WebGLInfo | null;
  appVersion?: string;
  pipeline?: Partial<PipelineState>;
  /** false: a Safelight without api.devtools.extensions and .render. */
  seams?: boolean;
  /** The registry's processing stages. */
  stages?: RegisteredProcessingStage[];
}

export function fakeApi({
  devtools = true,
  desktop = true,
  native = desktop ? NATIVE : undefined,
  webgl = { vendor: "Acme", renderer: "Acme GPU", glsl: "WebGL GLSL ES 3.00", maxTexture: 16384 },
  appVersion = "3.2.0",
  pipeline: pipelineState = {},
  seams = true,
  stages = [],
}: RigOptions = {}): Rig {
  const panels: PanelContribution[] = [];
  const modules: ModuleContribution[] = [];
  const settings: SettingsContribution[] = [];
  const keybindings: KeyActionContribution[] = [];
  const stylesheets: StylesheetContribution[] = [];
  const open = new Set<string>();
  const toggles: string[] = [];
  const overlays: string[] = [];
  const calls: string[] = [];
  const rowRequests: ProcessVersion[] = [];
  const navigations: string[] = [];
  const variables = fakeVariables();

  const pipeline = create<PipelineState>()(() => ({
    photoId: null,
    version: 2,
    rows: { 1: [], 2: [], 3: [] },
    screen: { space: "srgb", profile: null },
    ...pipelineState,
  }));

  const registry = create<RegistryState>()(() => ({
    ...emptyRegistry(),
    processingStages: Object.fromEntries(stages.map((s) => [s.id, s])),
  }));

  const extensionsList = observable<readonly DevExtensionInfo[]>([]);
  const reloads: string[] = [];
  const extensions: FakeExtensions | undefined = seams
    ? { ...extensionsList, reloads, reloadDev: async (id) => void reloads.push(id) }
    : undefined;
  const values = new Map<string, Record<string, unknown>>();
  const live = observable<LiveRenderStatus | null>(null);
  const render: FakeRender | undefined = seams
    ? {
        live,
        stageFailures: observable<Readonly<Record<string, StageFailureInfo>>>({}),
        values,
        liveValues: (id) => (live.get() ? (values.get(id) ?? {}) : null),
      }
    : undefined;

  const call = (name: string) => async () => void calls.push(name);
  const electron: ElectronDevtools = {
    open: async (mode) => void calls.push(`open:${mode}`),
    close: call("close"),
    toggle: call("toggle"),
    isOpen: async () => false,
    reload: async (hard) => void calls.push(`reload:${hard}`),
  };

  function Controls({ variant }: { variant: "tab" | "settings" }) {
    return React.createElement("div", { "data-testid": CONTROLS_TEST_ID }, variant);
  }

  const devtoolsApi: DevtoolsAPI = {
    devFolder: {
      init: () => void calls.push("init"),
      teardown: () => void calls.push("teardown"),
      Controls,
    },
    pipeline: {
      versions: [1, 2, 3],
      useOpenVersion: () => {
        const photoId = pipeline((s) => s.photoId);
        const version = pipeline((s) => s.version);
        return { photoId, version };
      },
      useRows: (version) => {
        rowRequests.push(version);
        return pipeline((s) => s.rows[version]);
      },
      useScreen: () => pipeline((s) => s.screen),
    },
    variables,
    webglInfo: () => webgl,
    appVersion: async () => appVersion,
    electron: desktop ? electron : undefined,
    native,
    extensions,
    render,
  };

  const api: SafelightAPI = {
    version: 1,
    extensionId: "safelight.devtools",
    react: React,
    registerPanel: (c) => void panels.push(c),
    registerModule: (c) => void modules.push(c),
    registerSettings: (c) => void settings.push(c),
    registerKeybinding: (c) => void keybindings.push(c),
    registerStylesheet: (c) => void stylesheets.push(c),
    ui: { tokens: TOKENS },
    stores: { create },
    registry: { use: (selector) => registry(selector) },
    navigation: { goTo: (module) => void navigations.push(module) },
    dock: {
      togglePanel: (id) => {
        toggles.push(id);
        if (!open.delete(id)) open.add(id);
      },
      isPanelOpen: (id) => open.has(id),
    },
    titleBar: { useOverlay: (bgVar) => void overlays.push(bgVar) },
    devtools: devtools ? devtoolsApi : undefined,
    variables: variables.scoped("safelight.devtools"),
  };

  return {
    api,
    panels,
    modules,
    settings,
    keybindings,
    stylesheets,
    open,
    toggles,
    overlays,
    calls,
    rowRequests,
    pipeline,
    variables,
    registry,
    navigations,
    extensions,
    render,
  };
}
