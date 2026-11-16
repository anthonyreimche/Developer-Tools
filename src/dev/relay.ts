// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// The live develop view can be in any window: opening Dev unmounts Develop in
// its window, and Develop can pop out. Core's stores don't cross windows, so
// every window runs this relay over a BroadcastChannel. A mounted Dev view
// says hello every 2 s; a window with a live view answers with its live status
// and stage failures, then re-sends on change, at most every 250 ms, until
// 5 s pass without a hello. A Dev view asks the window whose data it shows for
// a stage's drawn values. Every message is checked before it is used, since
// another window may run another build of this extension.

import type { DevtoolsRender, LiveRenderStatus, ProcessVersion, StageFailureInfo } from "../safelight";

export const LIVE_CHANNEL = "safelight-devtools-live";
export const HELLO_MS = 2000;
export const RESEND_MS = 250;
export const SILENCE_MS = 5000;
export const VALUES_TIMEOUT_MS = 2000;

export type Failures = Readonly<Record<string, StageFailureInfo>>;

/** A stage's drawn values, by uniform key: numbers, booleans, vectors or
 *  matrices, whatever the stage binds, so left unknown until shown. */
export type StageValues = Readonly<Record<string, unknown>>;

export type RelayMessage =
  | { type: "hello"; from: string }
  | { type: "live"; from: string; window: string; live: LiveRenderStatus; failures: Failures }
  | { type: "values"; from: string; to: string; id: number; stageId: string }
  | { type: "values-answer"; from: string; to: string; id: number; stageId: string; values: StageValues | null };

/** What the relay sends and hears through: a BroadcastChannel in the app. */
export interface RelayPort {
  post(message: RelayMessage): void;
  listen(handler: (data: unknown) => void): void;
  close(): void;
}

export function broadcastPort(name = LIVE_CHANNEL): RelayPort | null {
  if (typeof BroadcastChannel === "undefined") return null;
  const channel = new BroadcastChannel(name);
  return {
    post: (message) => channel.postMessage(message),
    listen: (handler) => {
      channel.onmessage = (e: MessageEvent) => handler(e.data);
    },
    close: () => channel.close(),
  };
}

// ─── Validation ──────────────────────────────────────────────────────────────

/** A message's fields before they are checked: it came from another window. */
type Fields = { readonly [key: string]: unknown };

const isFields = (v: unknown): v is Fields => typeof v === "object" && v !== null && !Array.isArray(v);
const isString = (v: unknown): v is string => typeof v === "string";
const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const isStrings = (v: unknown): v is string[] => Array.isArray(v) && v.every(isString);
const isVersion = (v: unknown): v is ProcessVersion => v === 1 || v === 2 || v === 3;

function parseLive(v: unknown): LiveRenderStatus | null {
  if (!isFields(v)) return null;
  const { at, photoId, processVersion, programStages, dormant, overflowed, frameMs, lastError } = v;
  if (!isNumber(at) || !(photoId === null || isString(photoId)) || !isVersion(processVersion)) return null;
  if (!isStrings(programStages) || !isStrings(dormant) || !isStrings(overflowed)) return null;
  if (!(frameMs === null || isNumber(frameMs))) return null;
  let error: LiveRenderStatus["lastError"] = null;
  if (lastError !== null) {
    if (!isFields(lastError) || !isNumber(lastError.at) || !isString(lastError.message)) return null;
    error = { at: lastError.at, message: lastError.message };
  }
  return { at, photoId, processVersion, programStages, dormant, overflowed, frameMs, lastError: error };
}

function parseFailures(v: unknown): Record<string, StageFailureInfo> | null {
  if (!isFields(v)) return null;
  const out: Record<string, StageFailureInfo> = {};
  for (const [id, f] of Object.entries(v)) {
    if (!isFields(f) || !isString(f.log) || typeof f.crashed !== "boolean") return null;
    out[id] = { log: f.log, crashed: f.crashed };
  }
  return out;
}

/** The message, rebuilt from checked fields, or null when anything about it
 *  is off. */
export function parseRelayMessage(data: unknown): RelayMessage | null {
  if (!isFields(data) || !isString(data.from)) return null;
  const from = data.from;
  switch (data.type) {
    case "hello":
      return { type: "hello", from };
    case "live": {
      const live = parseLive(data.live);
      const failures = parseFailures(data.failures);
      if (!isString(data.window) || !live || !failures) return null;
      return { type: "live", from, window: data.window, live, failures };
    }
    case "values":
      if (!isString(data.to) || !isNumber(data.id) || !isString(data.stageId)) return null;
      return { type: "values", from, to: data.to, id: data.id, stageId: data.stageId };
    case "values-answer": {
      const { to, id, stageId, values } = data;
      if (!isString(to) || !isNumber(id) || !isString(stageId)) return null;
      if (values !== null && !isFields(values)) return null;
      return { type: "values-answer", from, to, id, stageId, values };
    }
    default:
      return null;
  }
}

// ─── The relay ───────────────────────────────────────────────────────────────

export interface RemoteLive {
  windowId: string;
  /** The window's name, as the status bar says it. */
  window: string;
  live: LiveRenderStatus;
  failures: Failures;
}

/** The live data the Dev view shows and where it came from: windowId null is
 *  this window. */
export interface LiveSource {
  windowId: string | null;
  window: string;
  live: LiveRenderStatus;
  failures: Failures;
}

export interface LiveRelay {
  /** Ask every other window for its live view. */
  hello(): void;
  /** The newest live data each other window has sent. A new map on change. */
  remotes(): ReadonlyMap<string, RemoteLive>;
  subscribe(listener: () => void): () => void;
  /** Ask window `windowId` for a stage's drawn values; null when it doesn't
   *  answer in time. */
  requestValues(windowId: string, stageId: string): Promise<StageValues | null>;
  close(): void;
}

export interface RelayOptions {
  port: RelayPort;
  windowId: string;
  windowLabel: string;
  /** This window's live view; undefined on a Safelight without it. */
  render: DevtoolsRender | undefined;
}

export function createLiveRelay({ port, windowId, windowLabel, render }: RelayOptions): LiveRelay {
  let remotes: ReadonlyMap<string, RemoteLive> = new Map();
  const listeners = new Set<() => void>();
  const pending = new Map<number, { resolve: (v: StageValues | null) => void; timer: ReturnType<typeof setTimeout> }>();
  let nextId = 1;

  let closed = false;
  const post = (message: RelayMessage) => {
    if (!closed) port.post(message);
  };

  let lastHello = -Infinity;
  let lastSent = -Infinity;
  let trailing: ReturnType<typeof setTimeout> | null = null;
  let unwatch: (() => void) | null = null;

  const sendLive = () => {
    const live = render?.live.get();
    if (!render || !live) return;
    lastSent = Date.now();
    post({ type: "live", from: windowId, window: windowLabel, live, failures: render.stageFailures.get() });
  };
  const stopWatching = () => {
    unwatch?.();
    unwatch = null;
    if (trailing) clearTimeout(trailing);
    trailing = null;
  };
  const heardRecently = () => Date.now() - lastHello <= SILENCE_MS;
  const changed = () => {
    if (!heardRecently()) {
      stopWatching();
      return;
    }
    if (trailing) return;
    const wait = lastSent + RESEND_MS - Date.now();
    if (wait <= 0) {
      sendLive();
      return;
    }
    trailing = setTimeout(() => {
      trailing = null;
      if (heardRecently()) sendLive();
    }, wait);
  };
  const watch = () => {
    if (unwatch || !render) return;
    const offLive = render.live.subscribe(changed);
    const offFailures = render.stageFailures.subscribe(changed);
    unwatch = () => {
      offLive();
      offFailures();
    };
  };

  const answerValues = (to: string, id: number, stageId: string) => {
    const values = render?.liveValues(stageId) ?? null;
    try {
      post({ type: "values-answer", from: windowId, to, id, stageId, values });
    } catch {
      post({ type: "values-answer", from: windowId, to, id, stageId, values: null });
    }
  };

  port.listen((data) => {
    const m = parseRelayMessage(data);
    if (!m || m.from === windowId) return;
    switch (m.type) {
      case "hello":
        lastHello = Date.now();
        sendLive();
        watch();
        break;
      case "live": {
        const next = new Map(remotes);
        next.set(m.from, { windowId: m.from, window: m.window, live: m.live, failures: m.failures });
        remotes = next;
        for (const l of [...listeners]) l();
        break;
      }
      case "values":
        if (m.to === windowId) answerValues(m.from, m.id, m.stageId);
        break;
      case "values-answer": {
        const waiting = m.to === windowId ? pending.get(m.id) : undefined;
        if (!waiting) break;
        clearTimeout(waiting.timer);
        pending.delete(m.id);
        waiting.resolve(m.values);
        break;
      }
    }
  });

  return {
    hello: () => post({ type: "hello", from: windowId }),
    remotes: () => remotes,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
    requestValues: (target, stageId) =>
      new Promise((resolve) => {
        if (closed) {
          resolve(null);
          return;
        }
        const id = nextId++;
        const timer = setTimeout(() => {
          pending.delete(id);
          resolve(null);
        }, VALUES_TIMEOUT_MS);
        pending.set(id, { resolve, timer });
        post({ type: "values", from: windowId, to: target, id, stageId });
      }),
    close: () => {
      closed = true;
      stopWatching();
      for (const { resolve, timer } of pending.values()) {
        clearTimeout(timer);
        resolve(null);
      }
      pending.clear();
      listeners.clear();
      port.close();
    },
  };
}

/** The newest live frame across windows, this window's included. */
export function pickNewest(
  local: { live: LiveRenderStatus | null; failures: Failures } | null,
  remotes: ReadonlyMap<string, RemoteLive>,
): LiveSource | null {
  let best: LiveSource | null =
    local?.live ? { windowId: null, window: "this window", live: local.live, failures: local.failures } : null;
  for (const r of remotes.values()) {
    if (!best || r.live.at > best.live.at) best = { ...r };
  }
  return best;
}
