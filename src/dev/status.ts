// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// What a stage and an extension are doing, from the live render status, the
// standing stage failures and the extensions list. A stage's status is the
// first rule that holds, in the order of STAGE_STATUSES. Mask copies (`id@n`)
// count as their stage.

import type {
  DevExtensionInfo,
  LiveRenderStatus,
  ProcessingStageContribution,
  StageFailureInfo,
  UniformValue,
} from "../safelight";
import type { StageValues } from "./relay";

/** How a status is drawn: failures red, problems amber, idle dim, running in
 *  the owner's colour, and unknown plain. */
export type Tone = "running" | "dim" | "neutral" | "problem" | "failure";

export const STAGE_STATUSES = [
  "crashed",
  "quarantined",
  "left-out",
  "overflowed",
  "not-built",
  "running",
  "registered",
] as const;

export type StageStatus = (typeof STAGE_STATUSES)[number];

export const STAGE_STATUS_LABEL: Readonly<Record<StageStatus, string>> = {
  crashed: "Crashed",
  quarantined: "Quarantined",
  "left-out": "Left out",
  overflowed: "Overflowed",
  "not-built": "Not built",
  running: "Running",
  registered: "Registered",
};

const STAGE_TONE: Readonly<Record<StageStatus, Tone>> = {
  crashed: "failure",
  quarantined: "failure",
  "left-out": "problem",
  overflowed: "problem",
  "not-built": "dim",
  running: "running",
  registered: "neutral",
};

export interface StageState {
  status: StageStatus;
  tone: Tone;
  label: string;
  reason: string;
  /** Mask copies running in the live program. */
  copies: number;
  /** Mask copies the live renderer has built without. */
  dormantCopies: number;
  failure: StageFailureInfo | null;
}

/** The live data, keyed by stage id for lookups in constant time. */
export interface LiveIndex {
  live: LiveRenderStatus | null;
  /** Each stage's first position in the program. */
  program: ReadonlyMap<string, number>;
  copies: ReadonlyMap<string, number>;
  /** Stage ids the live renderer has built without, copies (`id@n`) apart:
   *  a dormant copy says nothing about its stage. */
  dormant: ReadonlySet<string>;
  dormantCopies: ReadonlyMap<string, number>;
  overflowed: ReadonlySet<string>;
  failures: ReadonlyMap<string, StageFailureInfo>;
  /** isv names some registered stage that hasn't failed produces: the stages
   *  the renderer builds from, dormant ones included. */
  produced: ReadonlySet<string>;
}

const COPY = /@\d+$/;

/** The stage a mask copy id (`id@n`) belongs to. */
export function baseStageId(id: string): string {
  return id.replace(COPY, "");
}

export function indexLive(
  live: LiveRenderStatus | null,
  failures: Readonly<Record<string, StageFailureInfo>>,
  stages: Iterable<Pick<ProcessingStageContribution, "id" | "produces">>,
): LiveIndex {
  const program = new Map<string, number>();
  const copies = new Map<string, number>();
  live?.programStages.forEach((id, i) => {
    const base = baseStageId(id);
    if (!program.has(base)) program.set(base, i);
    if (base !== id) copies.set(base, (copies.get(base) ?? 0) + 1);
  });
  const failed = new Map<string, StageFailureInfo>();
  for (const [id, info] of Object.entries(failures)) {
    const base = baseStageId(id);
    if (!failed.get(base)?.crashed) failed.set(base, info);
  }
  const produced = new Set<string>();
  for (const stage of stages) {
    if (failed.has(stage.id)) continue;
    for (const v of stage.produces ?? []) produced.add(v.name);
  }
  const dormantCopies = new Map<string, number>();
  for (const id of live?.dormant ?? []) {
    const base = baseStageId(id);
    if (base !== id) dormantCopies.set(base, (dormantCopies.get(base) ?? 0) + 1);
  }
  return {
    live,
    program,
    copies,
    dormant: new Set(live?.dormant),
    dormantCopies,
    overflowed: new Set(live?.overflowed.map(baseStageId)),
    failures: failed,
    produced,
  };
}

function firstLine(text: string): string {
  return text.split("\n").find((line) => line.trim() !== "") ?? text;
}

function state(
  status: StageStatus,
  reason: string,
  copies = 0,
  dormantCopies = 0,
  failure: StageFailureInfo | null = null,
): StageState {
  return { status, tone: STAGE_TONE[status], label: STAGE_STATUS_LABEL[status], reason, copies, dormantCopies, failure };
}

const copiesText = (n: number) => `${n} mask ${n === 1 ? "copy" : "copies"}`;

export function stageStatus(stage: Pick<ProcessingStageContribution, "id" | "consumes">, index: LiveIndex): StageState {
  const failure = index.failures.get(stage.id);
  if (failure?.crashed) return state("crashed", `Lost the GPU: ${firstLine(failure.log)}`, 0, 0, failure);
  if (failure) return state("quarantined", `Taken out after a failure: ${firstLine(failure.log)}`, 0, 0, failure);
  if (!index.live) return state("registered", "No live view: open Develop, or pop out Dev, to see what runs.");

  const running = index.program.has(stage.id);
  const orphans = (stage.consumes ?? []).filter((name) => !index.produced.has(name));
  if (!running && orphans.length > 0) {
    return state("left-out", `Left out: no stage the renderer can build produces ${orphans.map((n) => `isv_${n}`).join(", ")}.`);
  }
  if (index.overflowed.has(stage.id)) return state("overflowed", "Didn't fit in the last frame's limits.");
  if (index.dormant.has(stage.id)) {
    return state("not-built", "Not built this session: no frame has needed it since the renderer started.");
  }
  if (running) {
    const copies = index.copies.get(stage.id) ?? 0;
    const idle = index.dormantCopies.get(stage.id) ?? 0;
    const extra = [
      ...(copies > 0 ? [`with ${copiesText(copies)}`] : []),
      ...(idle > 0 ? [`${copiesText(idle)} not built`] : []),
    ];
    return state("running", `In the live program${extra.length > 0 ? `, ${extra.join("; ")}` : ""}.`, copies, idle);
  }
  return state("registered", "Not in the live program.");
}

function isNumberView(v: unknown): v is ArrayLike<number> {
  return ArrayBuffer.isView(v) && !(v instanceof DataView) && !(v instanceof BigInt64Array) && !(v instanceof BigUint64Array);
}

/** A vector's elements, from an array or from a typed array (structured clone
 *  keeps a Float32Array typed); null for anything else. */
export function elementsOf(v: unknown): readonly unknown[] | null {
  if (Array.isArray(v)) return v;
  return isNumberView(v) ? Array.from(v) : null;
}

function sameValue(a: UniformValue, b: unknown): boolean {
  if (!Array.isArray(a)) return a === b;
  const list = elementsOf(b);
  return list !== null && a.length === list.length && a.every((x, i) => x === list[i]);
}

/** A running stage is at rest while every uniform its `dormantWhen` lists is
 *  drawn at the value given there. */
export function atRest(
  stage: Pick<ProcessingStageContribution, "id" | "dormantWhen">,
  values: StageValues | null,
): boolean {
  const rule = stage.dormantWhen;
  if (!rule || !values) return false;
  const keys = Object.keys(rule);
  if (keys.length === 0) return false;
  return keys.every((key) => {
    const drawn = key in values ? values[key] : values[`${stage.id}.${key}`];
    return drawn !== undefined && sameValue(rule[key], drawn);
  });
}

export type ExtensionStatusKind = "running" | "off" | "failed" | "callback-failures" | "dev-error" | "installed";

export interface ExtensionState {
  kind: ExtensionStatusKind;
  tone: Tone;
  label: string;
  message: string | null;
}

/** An extension's status. Without the extensions list, an extension is known
 *  only by what it registered in this window, so it is running. */
export function extensionStatus(info: DevExtensionInfo | null): ExtensionState {
  if (!info) return { kind: "running", tone: "running", label: "Running", message: null };
  if (info.failure) return { kind: "failed", tone: "failure", label: "Failed to start", message: info.failure.message };
  if (info.devError) return { kind: "dev-error", tone: "failure", label: "Dev folder error", message: info.devError };
  if (!info.enabled) return { kind: "off", tone: "dim", label: "Turned off", message: null };
  if (info.callbackFailures > 0) {
    return { kind: "callback-failures", tone: "problem", label: "A callback failed", message: null };
  }
  if (info.running) return { kind: "running", tone: "running", label: "Running", message: null };
  return { kind: "installed", tone: "neutral", label: "Installed, not running", message: null };
}
