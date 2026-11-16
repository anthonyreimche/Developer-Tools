// The live relay between windows: a Dev view's hello is answered by every
// window with a live develop view, which then re-sends on change (throttled)
// until hellos stop for 5 s; the newest live data wins; a selected stage's
// drawn values are asked of the window that sent it; and every malformed
// message is dropped.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  RESEND_MS,
  SILENCE_MS,
  createLiveRelay,
  parseRelayMessage,
  pickNewest,
  type LiveRelay,
  type RelayMessage,
  type RelayPort,
} from "../src/dev/relay";
import { liveRelay, startLiveRelay, stopLiveRelay } from "../src/dev/sources";
import { initRuntime } from "../src/rt";
import { fakeApi, liveStatus, type FakeRender } from "./support/fake-api";

/** An in-memory BroadcastChannel: a post reaches every other port, cloned, at once. */
function bus() {
  const ports = new Set<{ handler: ((data: unknown) => void) | null }>();
  const sent: unknown[] = [];
  const port = (): RelayPort => {
    const self = { handler: null as ((data: unknown) => void) | null };
    ports.add(self);
    return {
      post: (message) => {
        sent.push(message);
        for (const p of ports) if (p !== self) p.handler?.(structuredClone(message));
      },
      listen: (handler) => void (self.handler = handler),
      close: () => void ports.delete(self),
    };
  };
  /** Post raw data, as a window of another build might. */
  const inject = (data: unknown) => {
    for (const p of ports) p.handler?.(data);
  };
  return { port, sent, inject };
}

function renderOf(): FakeRender {
  const rig = fakeApi();
  initRuntime(rig.api);
  if (!rig.render) throw new Error("the rig has the render seam by default");
  return rig.render;
}

let relays: LiveRelay[] = [];
const open = (r: LiveRelay) => (relays.push(r), r);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(1_000_000);
});
afterEach(() => {
  for (const r of relays) r.close();
  relays = [];
  vi.useRealTimers();
});

describe("live relay", () => {
  it("answers a hello with the live view, and the asker keeps it by window", () => {
    const b = bus();
    const render = renderOf();
    render.live.set(liveStatus({ at: 999_000, programStages: ["a.s"] }));
    open(createLiveRelay({ port: b.port(), windowId: "dev", windowLabel: "the Develop window", render }));
    const asker = open(createLiveRelay({ port: b.port(), windowId: "main", windowLabel: "the main window", render: undefined }));
    asker.hello();
    const remote = asker.remotes().get("dev");
    expect(remote).toMatchObject({ windowId: "dev", window: "the Develop window", live: { programStages: ["a.s"] } });
  });

  it("stays quiet without a live view", () => {
    const b = bus();
    open(createLiveRelay({ port: b.port(), windowId: "dev", windowLabel: "x", render: renderOf() }));
    const asker = open(createLiveRelay({ port: b.port(), windowId: "main", windowLabel: "y", render: undefined }));
    asker.hello();
    expect(asker.remotes().size).toBe(0);
  });

  it("re-sends on change at most every 250 ms, with the latest value", () => {
    const b = bus();
    const render = renderOf();
    render.live.set(liveStatus({ at: 1 }));
    open(createLiveRelay({ port: b.port(), windowId: "dev", windowLabel: "x", render }));
    const asker = open(createLiveRelay({ port: b.port(), windowId: "main", windowLabel: "y", render: undefined }));
    const heard: number[] = [];
    asker.subscribe(() => heard.push(asker.remotes().get("dev")?.live.at ?? -1));
    asker.hello();
    vi.advanceTimersByTime(10);
    render.live.set(liveStatus({ at: 2 }));
    render.live.set(liveStatus({ at: 3 }));
    render.stageFailures.set({ "a.s": { log: "boom", crashed: false } });
    expect(heard).toEqual([1]);
    vi.advanceTimersByTime(RESEND_MS);
    expect(heard).toEqual([1, 3]);
    expect(asker.remotes().get("dev")?.failures).toEqual({ "a.s": { log: "boom", crashed: false } });
  });

  it("stops re-sending 5 s after the last hello", () => {
    const b = bus();
    const render = renderOf();
    render.live.set(liveStatus({ at: 1 }));
    open(createLiveRelay({ port: b.port(), windowId: "dev", windowLabel: "x", render }));
    const asker = open(createLiveRelay({ port: b.port(), windowId: "main", windowLabel: "y", render: undefined }));
    asker.hello();
    vi.advanceTimersByTime(SILENCE_MS + 1);
    render.live.set(liveStatus({ at: 2 }));
    vi.advanceTimersByTime(RESEND_MS * 2);
    expect(asker.remotes().get("dev")?.live.at).toBe(1);
    asker.hello();
    expect(asker.remotes().get("dev")?.live.at).toBe(2);
  });

  it("asks the window that sent the live data for a stage's drawn values", async () => {
    const b = bus();
    const render = renderOf();
    render.live.set(liveStatus());
    render.values.set("a.s", { amount: 0.25 });
    open(createLiveRelay({ port: b.port(), windowId: "dev", windowLabel: "x", render }));
    const asker = open(createLiveRelay({ port: b.port(), windowId: "main", windowLabel: "y", render: undefined }));
    await expect(asker.requestValues("dev", "a.s")).resolves.toEqual({ amount: 0.25 });
  });

  it("gives up on values nobody answers", async () => {
    const b = bus();
    const asker = open(createLiveRelay({ port: b.port(), windowId: "main", windowLabel: "y", render: undefined }));
    const answer = asker.requestValues("gone", "a.s");
    vi.advanceTimersByTime(5_000);
    await expect(answer).resolves.toBeNull();
  });

  it("sends nothing once closed", () => {
    const b = bus();
    const asker = createLiveRelay({ port: b.port(), windowId: "main", windowLabel: "y", render: undefined });
    asker.close();
    asker.hello();
    void asker.requestValues("dev", "a.s");
    expect(b.sent).toEqual([]);
  });

  it("drops malformed messages", () => {
    const b = bus();
    const asker = open(createLiveRelay({ port: b.port(), windowId: "main", windowLabel: "y", render: undefined }));
    const good = liveStatus();
    b.inject(null);
    b.inject("live");
    b.inject({ type: "live", from: "x", window: "w", live: { ...good, at: "now" }, failures: {} });
    b.inject({ type: "live", from: "x", window: "w", live: { ...good, programStages: [1] }, failures: {} });
    b.inject({ type: "live", from: "x", window: "w", live: good, failures: { s: { log: 1, crashed: false } } });
    b.inject({ type: "live", from: 7, window: "w", live: good, failures: {} });
    expect(asker.remotes().size).toBe(0);
    b.inject({ type: "live", from: "x", window: "w", live: good, failures: {} });
    expect(asker.remotes().size).toBe(1);
  });
});

describe("parseRelayMessage", () => {
  const live = liveStatus();

  it("accepts each message type in its shape", () => {
    const messages: RelayMessage[] = [
      { type: "hello", from: "a" },
      { type: "live", from: "a", window: "w", live, failures: { s: { log: "x", crashed: true } } },
      { type: "values", from: "a", to: "b", id: 3, stageId: "s" },
      { type: "values-answer", from: "b", to: "a", id: 3, stageId: "s", values: { k: [1, 2] } },
      { type: "values-answer", from: "b", to: "a", id: 3, stageId: "s", values: null },
    ];
    for (const m of messages) expect(parseRelayMessage(m)).toEqual(m);
  });

  it("refuses a wrong type anywhere in the shape", () => {
    expect(parseRelayMessage({ type: "hello" })).toBeNull();
    expect(parseRelayMessage({ type: "shout", from: "a" })).toBeNull();
    expect(parseRelayMessage({ type: "live", from: "a", window: "w", live: { ...live, processVersion: 9 }, failures: {} })).toBeNull();
    expect(parseRelayMessage({ type: "live", from: "a", window: "w", live: { ...live, frameMs: "1" }, failures: {} })).toBeNull();
    expect(
      parseRelayMessage({ type: "live", from: "a", window: "w", live: { ...live, lastError: { at: 1 } }, failures: {} }),
    ).toBeNull();
    expect(parseRelayMessage({ type: "values", from: "a", to: "b", id: "3", stageId: "s" })).toBeNull();
    expect(parseRelayMessage({ type: "values-answer", from: "b", to: "a", id: 3, stageId: "s", values: [1] })).toBeNull();
  });
});

describe("pickNewest", () => {
  const remote = (windowId: string, at: number) => ({
    windowId,
    window: `window ${windowId}`,
    live: liveStatus({ at }),
    failures: {},
  });

  it("takes the newest live frame across windows, this one's included", () => {
    const remotes = new Map([
      ["b", remote("b", 20)],
      ["c", remote("c", 30)],
    ]);
    expect(pickNewest({ live: liveStatus({ at: 10 }), failures: {} }, remotes)?.windowId).toBe("c");
    expect(pickNewest({ live: liveStatus({ at: 40 }), failures: {} }, remotes)).toMatchObject({
      windowId: null,
      window: "this window",
    });
    expect(pickNewest({ live: null, failures: {} }, new Map())).toBeNull();
  });
});

describe("this window's relay", () => {
  afterEach(() => {
    stopLiveRelay();
    vi.unstubAllGlobals();
  });

  it("opens no channel after deactivation, so a late render or hello can't post on a closed one", () => {
    initRuntime(fakeApi().api);
    let opened = 0;
    const Real = BroadcastChannel;
    vi.stubGlobal(
      "BroadcastChannel",
      class extends Real {
        constructor(name: string) {
          super(name);
          opened++;
        }
      },
    );
    startLiveRelay();
    const before = liveRelay();
    expect(opened).toBe(1);
    stopLiveRelay();
    expect(() => before.hello()).not.toThrow();
    liveRelay().hello();
    expect(opened).toBe(1);
    startLiveRelay();
    expect(opened).toBe(2);
  });
});
