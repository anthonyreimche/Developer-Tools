// The console capture: what it records, how it merges entries from other
// windows, and that uninstalling leaves the console as it found it.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatArg } from "../src/format-arg";
import {
  LOG_CHANNEL,
  MAX_ENTRIES,
  clearLog,
  devLog,
  installLogCapture,
  pushEntry,
  uninstallLogCapture,
  type LogEntry,
  type Wire,
} from "../src/log-capture";
import { initRuntime } from "../src/rt";
import { fakeApi } from "./support/fake-api";

const entries = () => devLog().getState().entries;

/** Wait for BroadcastChannel deliveries, which are queued as tasks. */
const delivery = () => new Promise((r) => setTimeout(r, 20));

beforeEach(() => {
  initRuntime(fakeApi().api);
  clearLog();
});
afterEach(() => {
  uninstallLogCapture();
  vi.restoreAllMocks();
});

describe("log capture", () => {
  it("records each console method with its formatted arguments and still logs", () => {
    const original = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    installLogCapture();
    console.warn("disk", 3, { a: 1 });
    expect(entries().map((e) => [e.level, e.parts])).toEqual([["warn", ["disk", "3", '{"a":1}']]]);
    expect(original).toHaveBeenCalledWith("disk", 3, { a: 1 });
  });

  it("records uncaught errors and unhandled rejections as exceptions", () => {
    installLogCapture();
    const error = new TypeError("boom");
    window.dispatchEvent(new ErrorEvent("error", { error, message: "boom" }));
    window.dispatchEvent(new ErrorEvent("error", { message: "", filename: "app.js", lineno: 4, colno: 2 }));
    const rejection = new Event("unhandledrejection") as PromiseRejectionEvent;
    Object.defineProperty(rejection, "reason", { value: "nope" });
    window.dispatchEvent(rejection);
    const [first, second, third] = entries();
    expect(first).toMatchObject({ level: "exception", parts: ["TypeError: boom"], stack: error.stack });
    expect(second).toMatchObject({ level: "exception", parts: ["Uncaught error"], stack: "at app.js:4:2" });
    expect(third).toMatchObject({ level: "exception", parts: ["Unhandled rejection: nope"] });
  });

  it("restores the console and stops listening once uninstalled", () => {
    const pristine = console.error;
    installLogCapture();
    installLogCapture();
    uninstallLogCapture();
    expect(console.error).toBe(pristine);
    window.dispatchEvent(new ErrorEvent("error", { message: "late" }));
    expect(entries()).toEqual([]);
  });

  it("keeps the newest entries once the buffer is full", () => {
    for (let i = 0; i < MAX_ENTRIES + 5; i++) pushEntry("log", [String(i)]);
    expect(entries()).toHaveLength(MAX_ENTRIES);
    expect(entries()[0].parts).toEqual(["5"]);
  });

  it("merges other windows' entries by id, in time order, and answers a sync request", async () => {
    installLogCapture();
    const peer = new BroadcastChannel(LOG_CHANNEL);
    const heard: Wire[] = [];
    peer.onmessage = (e: MessageEvent<Wire>) => void heard.push(e.data);
    const remote: LogEntry = { id: "peer-1", level: "info", parts: ["from the main window"], time: 1 };
    peer.postMessage({ kind: "entry", entry: remote } satisfies Wire);
    peer.postMessage({ kind: "sync-response", entries: [remote] } satisfies Wire);
    await delivery();
    expect(entries().filter((e) => e.id === "peer-1")).toHaveLength(1);
    expect(entries()[0].id).toBe("peer-1");

    peer.postMessage({ kind: "sync-request" } satisfies Wire);
    await delivery();
    const answer = heard.find((m) => m.kind === "sync-response");
    expect(answer?.kind === "sync-response" && answer.entries.map((e) => e.id)).toEqual(["peer-1"]);
    peer.close();
  });

  it("formats values compactly and safely", () => {
    const circular: { self?: unknown } = {};
    circular.self = circular;
    expect(formatArg(null)).toBe("null");
    expect(formatArg(function named() {})).toBe("ƒ named()");
    expect(formatArg(circular)).toBe('{"self":"[Circular]"}');
    expect(formatArg({ n: 1n })).toBe('{"n":"1n"}');
    expect(formatArg("x".repeat(2100)).length).toBe(2100);
    expect(formatArg(["y".repeat(2100)]).endsWith("…")).toBe(true);
  });
});
