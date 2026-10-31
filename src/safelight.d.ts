// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// The slice of Safelight's extension API this extension touches, mirrored from
// the app's src/extensions/types.ts, src/extensions/ui-kit.tsx,
// src/extensions/variables.ts, src/extensions/pipeline-inspect.ts and
// src/rendering/webgl/pipeline-description.ts. Extensions are standalone
// bundles, so the host's source is not on the type path; React and zustand
// types come from their packages (dev only).

import type { ComponentType } from "react";
import type { create } from "zustand";

export interface PanelContribution {
  /** Globally unique, e.g. "core.histogram" or "my-ext.fancy-curves". */
  id: string;
  title: string;
  component: ComponentType;
}

export interface SettingsContribution {
  /** Section title; defaults to the extension's name. */
  title?: string;
  /** Declarative fields. This extension draws its whole section itself. */
  fields: [];
  /** Rendered instead of the declarative `fields`. */
  component?: ComponentType;
}

export interface KeyActionContribution {
  id: string;
  label: string;
  category?: "General" | "Develop" | "Library";
  /** Default key combo in Safelight combo format, e.g. "Ctrl+Shift+I". */
  defaultCombo: string;
  handler(): void;
}

/** A stylesheet applied to every app window after the core styles. Extension
 *  rules are unlayered, so they win over Tailwind utility classes at equal or
 *  lower specificity; disabling the extension removes the sheet. */
export interface StylesheetContribution {
  id: string;
  css: string;
}

/** The theme's CSS variables as `var(--color-…)` / `var(--font-…)` strings. */
export interface UiTokens {
  readonly surface1: string;
  readonly surface2: string;
  readonly surface3: string;
  readonly surface4: string;
  readonly border: string;
  readonly borderSubtle: string;
  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly textMuted: string;
  readonly accent: string;
  readonly sliderFill: string;
  readonly white: string;
  readonly fontCode: string;
}

// ── Shared variables ─────────────────────────────────────────────────────────

/** Who made a write or a registration. */
export interface VariableWriter {
  extension: string;
  /** The window it happened in. */
  window: string;
}

/** Orders writes across windows: the higher `n` wins. */
export interface VariableRevision {
  n: number;
  window: string;
}

export interface VariableSnapshot<T> {
  name: string;
  value: T;
  revision: VariableRevision;
  writer: VariableWriter;
  registeredBy: VariableWriter;
  description?: string;
}

export type VariableWriteResult<T> =
  | { ok: true; revision: VariableRevision }
  | { ok: false; reason: "stale"; current: VariableSnapshot<T> }
  | { ok: false; reason: "unregistered" }
  | { ok: false; reason: "invalid"; message: string };

export interface SharedVariablesAPI {
  /** The current snapshot, or undefined when nobody has registered `name`. */
  get<T>(name: string): VariableSnapshot<T> | undefined;
  /** Write `value`. Refused as "stale" when another writer changed the
   *  variable after the latest revision this extension saw in this window. */
  set<T>(name: string, value: T): VariableWriteResult<T>;
}

export type VariableOutcome = "accepted" | "stale" | "invalid" | "lost";

export interface VariableHistoryItem {
  time: number;
  writer: VariableWriter;
  /** accepted and lost: the write's own revision. stale and invalid: the
   *  current revision the write was refused against. */
  revision: VariableRevision;
  outcome: VariableOutcome;
  /** stale: who wrote the revision the writer hadn't seen. lost: who won. */
  other?: VariableWriter;
  /** invalid: why. */
  message?: string;
}

export interface VariableInspection {
  snapshot: VariableSnapshot<unknown>;
  size: number;
  history: readonly VariableHistoryItem[];
  /** Extension ids subscribed in this window, in subscription order. */
  subscribers: string[];
}

/** The read side of the window's variable registry. */
export interface VariableInspector {
  inspect(): VariableInspection[];
  /** For useSyncExternalStore: fires on every change the Variables tab shows. */
  subscribeChanges(listener: () => void): () => void;
  changeCount(): number;
  /** "this window", another window's label, or the first four characters of its id. */
  windowName(id: string): string;
}

// ── Pipeline ─────────────────────────────────────────────────────────────────

export type ProcessVersion = 1 | 2 | 3;

export type ProcessingPhase =
  | "geometry"
  | "decode"
  | "noise-reduction"
  | "scene-linear"
  | "tone-map"
  | "display-adjust"
  | "effects"
  | "output-encode";

export interface StageSpace {
  encoding: "linear" | "perceptual";
  /** Default "rec709", the core's working primaries. */
  primaries?: "rec709" | "rec2020";
}

/** Scene-linear values before the display transform, display-encoded after. */
export type StageDomain = "scene" | "display";

export type DisplaySpace = "srgb" | "display-p3";

/** When a clip runs: on every frame; while the tool above it is in use; inside
 *  each mask that uses it; only for a fallback preview's source; only when the
 *  output isn't sRGB; only on a GPU without float render targets. */
export type ClipWhen =
  | "always"
  | "while-active"
  | "per-mask"
  | "fallback-preview"
  | "non-srgb-output"
  | "no-float-targets";

export type PipelineRow =
  | { kind: "core"; label: string; note?: string }
  | {
      kind: "stage";
      id: string;
      name: string;
      phase: ProcessingPhase;
      priority: number;
      /** The extension that registered it; null for Safelight's own. */
      owner: string | null;
      space: StageSpace | null;
      /** null for geometry, which moves pixels and holds no colour. */
      domain: StageDomain | null;
      reads: "source" | "current";
      maskable: boolean;
      /** Floors and clips found in its GLSL. */
      floors: string[];
      /** How many mask copies run it again. */
      copies?: number;
      note?: string;
    }
  | { kind: "convert"; from: string; to: string; elided: boolean }
  | {
      kind: "clamp";
      reason: "core" | "output";
      where: "input" | "result";
      when: ClipWhen;
      detail: string;
    }
  | {
      kind: "clamp";
      reason: "legacy-display-stage";
      stageId: string;
      where: "input" | "pass-input";
      when: "always";
      detail: string;
    }
  | {
      kind: "clamp";
      reason: "builtin-stage";
      stageId: string;
      where: "result";
      when: "while-active";
      detail: string;
    }
  | {
      kind: "transform";
      /** null for the built-in transform. */
      id: string | null;
      flags: { flag: "skipBaseCurve" | "skipToneShoulder"; honoured: boolean }[];
    }
  | { kind: "output"; mapped: boolean; detail: string };

/** Where the view's frames go. */
export interface ScreenTarget {
  space: DisplaySpace;
  /** The active monitor profile's description; null without one. */
  profile: string | null;
}

// ── Developer Tools' reach into core ─────────────────────────────────────────

export interface WebGLInfo {
  vendor: string;
  renderer: string;
  glsl: string;
  maxTexture: number;
}

export interface ElectronDevtools {
  open(mode?: "right" | "bottom" | "undocked" | "detach"): Promise<void>;
  close(): Promise<void>;
  toggle(): Promise<void>;
  isOpen(): Promise<boolean>;
  /** Reload the renderer. `hard` ignores the HTTP cache. */
  reload(hard?: boolean): Promise<void>;
}

/** One of the desktop app's processes, from Electron's `app.getAppMetrics()`. */
export interface ProcessMetric {
  type: string;
  pid: number;
  cpuPercent: number;
  memoryMB: number;
}

export interface NativeDetails {
  /** Node's `process.platform`: "win32", "darwin", "linux". */
  platform: string;
  versions: { electron: string; chrome: string };
  /** Chromium's GPU feature status (`app.getGPUFeatureStatus()`). Undefined in
   *  older desktop builds. */
  gpuInfo?: () => Promise<Record<string, string>>;
  /** Undefined in older desktop builds. */
  metrics?: () => Promise<ProcessMetric[]>;
}

export interface DevtoolsAPI {
  devFolder: {
    /** Load the extensions in the configured dev folder and follow changes. */
    init(): void;
    /** Unload them and stop following. */
    teardown(): void;
    /** Pick, rescan or clear the folder, with each extension's status. */
    Controls: ComponentType<{ variant: "tab" | "settings" }>;
  };
  pipeline: {
    versions: readonly ProcessVersion[];
    /** The open photo and the version its program is built for. */
    useOpenVersion(): { photoId: string | null; version: ProcessVersion };
    /** The rows of the program `version` builds for the open photo. */
    useRows(version: ProcessVersion): PipelineRow[];
    /** The space this window's frames are drawn in, and the monitor profile. */
    useScreen(): ScreenTarget;
  };
  variables: VariableInspector;
  webglInfo(): WebGLInfo | null;
  appVersion(): Promise<string>;
  /** Undefined outside the desktop app. */
  electron: ElectronDevtools | undefined;
  /** The desktop app's platform, versions and diagnostics; undefined outside
   *  it. */
  native?: NativeDetails;
}

export interface SafelightAPI {
  version: 1;
  extensionId: string;
  react: typeof import("react");
  registerPanel(c: PanelContribution): void;
  registerSettings(c: SettingsContribution): void;
  registerKeybinding(c: KeyActionContribution): void;
  registerStylesheet(c: StylesheetContribution): void;
  ui: { tokens: UiTokens };
  stores: { create: typeof create };
  dock: {
    togglePanel(id: string): void;
    /** Whether a panel is open in the current dock layout. Non-reactive. */
    isPanelOpen(id: string): boolean;
  };
  titleBar: {
    /** Recolour the native window controls to the CSS colour variable behind
     *  the calling bar while it is mounted. React hook. */
    useOverlay(bgVar: string): void;
  };
  /** Only `safelight.devtools` gets it. */
  devtools?: DevtoolsAPI;
  variables: SharedVariablesAPI;
}

export interface ExtensionModule {
  activate(api: SafelightAPI): void;
  deactivate?(): void;
}
