// Stage and extension status: each stage status and its precedence, mask
// copies mapped to their stage, the at-rest flag, the extension statuses, and
// the per-extension hue.

import { describe, expect, it } from "vitest";
import { extensionHue } from "../src/dev/palette";
import { atRest, baseStageId, extensionStatus, indexLive, stageStatus, type StageStatus } from "../src/dev/status";
import type { LiveRenderStatus, ProcessingStageContribution, StageFailureInfo } from "../src/safelight";
import { extensionInfo, liveStatus, stageOf } from "./support/fake-api";

function statusOf(
  stage: ProcessingStageContribution,
  live: LiveRenderStatus | null,
  failures: Record<string, StageFailureInfo> = {},
  others: ProcessingStageContribution[] = [],
): StageStatus {
  return stageStatus(stage, indexLive(live, failures, [stage, ...others])).status;
}

describe("stage status", () => {
  const s = stageOf("a", "a.s");

  it("is registered with no live data", () => {
    expect(statusOf(s, null)).toBe("registered");
  });

  it("is running in the live program, counting its mask copies", () => {
    const index = indexLive(liveStatus({ programStages: ["a.s", "a.s@1", "a.s@2"] }), {}, [s]);
    expect(stageStatus(s, index)).toMatchObject({ status: "running", tone: "running", copies: 2 });
  });

  it("is not built when the renderer has built without it", () => {
    expect(statusOf(s, liveStatus({ dormant: ["a.s"] }))).toBe("not-built");
  });

  it("is overflowed ahead of running and not built", () => {
    expect(statusOf(s, liveStatus({ programStages: ["a.s"], overflowed: ["a.s"] }))).toBe("overflowed");
    expect(statusOf(s, liveStatus({ dormant: ["a.s"], overflowed: ["a.s@1"] }))).toBe("overflowed");
  });

  it("is left out when no stage the renderer can build produces a variable it consumes", () => {
    const consumer = stageOf("a", "a.c", { consumes: ["x_v"] });
    const producer = stageOf("b", "b.p", { produces: [{ name: "x_v", glslType: "float" }] });
    expect(statusOf(consumer, liveStatus({ programStages: [] }))).toBe("left-out");
    expect(statusOf(consumer, liveStatus(), { "b.p": { log: "ERROR", crashed: false } }, [producer])).toBe("left-out");
    expect(statusOf(consumer, liveStatus({ programStages: ["b.p"], dormant: ["a.c"] }), {}, [producer])).toBe(
      "not-built",
    );
    expect(statusOf(consumer, liveStatus({ programStages: ["a.c"] }), {}, [producer])).toBe("running");
    expect(statusOf(consumer, null)).toBe("registered");
  });

  it("is not built, not left out, when it and its producer are both dormant", () => {
    const consumer = stageOf("a", "a.c", { consumes: ["x_v"] });
    const producer = stageOf("b", "b.p", { produces: [{ name: "x_v", glslType: "float" }] });
    expect(statusOf(consumer, liveStatus({ dormant: ["a.c", "b.p"] }), {}, [producer])).toBe("not-built");
  });

  it("stays running while one of its mask copies is dormant, and counts that copy", () => {
    const index = indexLive(liveStatus({ programStages: ["a.s", "a.s@1"], dormant: ["a.s@2"] }), {}, [s]);
    expect(stageStatus(s, index)).toMatchObject({ status: "running", copies: 1, dormantCopies: 1 });
    expect(stageStatus(s, index).reason).toContain("1 mask copy not built");
  });

  it("puts failures first: crashed, then quarantined, whatever the program says", () => {
    const live = liveStatus({ programStages: ["a.s"], overflowed: ["a.s"] });
    expect(statusOf(s, live, { "a.s": { log: "ERROR: 0:1", crashed: false } })).toBe("quarantined");
    expect(statusOf(s, live, { "a.s@1": { log: "gpu lost", crashed: true } })).toBe("crashed");
    expect(
      statusOf(s, live, { "a.s": { log: "ERROR", crashed: false }, "a.s@2": { log: "gpu lost", crashed: true } }),
    ).toBe("crashed");
    expect(statusOf(s, null, { "a.s": { log: "ERROR", crashed: false } })).toBe("quarantined");
  });

  it("gives each status a reason and a tone", () => {
    const index = indexLive(null, { "a.s": { log: "ERROR: 0:12: 'x' undeclared", crashed: false } }, [s]);
    expect(stageStatus(s, index)).toMatchObject({ tone: "failure", failure: { crashed: false } });
    expect(stageStatus(s, index).reason).toContain("undeclared");
    expect(stageStatus(s, indexLive(liveStatus({ dormant: ["a.s"] }), {}, [s])).tone).toBe("dim");
    expect(stageStatus(s, indexLive(liveStatus({ overflowed: ["a.s"] }), {}, [s])).tone).toBe("problem");
    expect(stageStatus(s, indexLive(null, {}, [s])).tone).toBe("neutral");
  });

  it("maps mask copy ids to their stage", () => {
    expect(baseStageId("a.s@3")).toBe("a.s");
    expect(baseStageId("a.s")).toBe("a.s");
    expect(baseStageId("odd@name@1")).toBe("odd@name");
  });
});

describe("at rest", () => {
  const stage = stageOf("a", "a.s", { dormantWhen: { amount: 0, tint: [0, 0, 0], on: false } });

  it("holds when every listed uniform is drawn at its rest value", () => {
    expect(atRest(stage, { amount: 0, tint: [0, 0, 0], on: false, other: 5 })).toBe(true);
  });

  it("fails on any differing value, vector element or missing value", () => {
    expect(atRest(stage, { amount: 0.1, tint: [0, 0, 0], on: false })).toBe(false);
    expect(atRest(stage, { amount: 0, tint: [0, 0.5, 0], on: false })).toBe(false);
    expect(atRest(stage, { amount: 0, on: false })).toBe(false);
  });

  it("compares typed arrays, which structured clone keeps typed, element by element", () => {
    expect(atRest(stage, { amount: 0, tint: new Float32Array([0, 0, 0]), on: false })).toBe(true);
    expect(atRest(stage, { amount: 0, tint: new Float32Array([0, 1, 0]), on: false })).toBe(false);
  });

  it("accepts values keyed by the qualified bag key", () => {
    expect(atRest(stage, { "a.s.amount": 0, "a.s.tint": [0, 0, 0], "a.s.on": false })).toBe(true);
  });

  it("never holds without a rule or without values", () => {
    expect(atRest(stageOf("a", "a.t"), { amount: 0 })).toBe(false);
    expect(atRest(stage, null)).toBe(false);
  });
});

describe("extension status", () => {
  it("is running, or running without the extensions list", () => {
    expect(extensionStatus(extensionInfo("a")).kind).toBe("running");
    expect(extensionStatus(null).kind).toBe("running");
  });

  it("reports a start failure, a dev folder error, turned off, callback failures and not running", () => {
    expect(extensionStatus(extensionInfo("a", { failure: { reason: "threw", message: "boom" } }))).toMatchObject({
      kind: "failed",
      tone: "failure",
      message: "boom",
    });
    expect(extensionStatus(extensionInfo("a", { devError: "no manifest", source: "dev" }))).toMatchObject({
      kind: "dev-error",
      message: "no manifest",
    });
    expect(extensionStatus(extensionInfo("a", { enabled: false, running: false })).kind).toBe("off");
    expect(extensionStatus(extensionInfo("a", { callbackFailures: 1 }))).toMatchObject({
      kind: "callback-failures",
      tone: "problem",
      label: "A callback failed",
    });
    expect(extensionStatus(extensionInfo("a", { running: false })).kind).toBe("installed");
  });

  it("ranks a start failure above everything else", () => {
    const info = extensionInfo("a", {
      failure: { reason: "threw", message: "boom" },
      devError: "x",
      enabled: false,
      callbackFailures: 2,
    });
    expect(extensionStatus(info).kind).toBe("failed");
  });
});

describe("extension hue", () => {
  it("is the same for the same id and stays clear of the status reds and ambers", () => {
    expect(extensionHue("film.look")).toBe(extensionHue("film.look"));
    const hues = ["a", "b", "film.look", "safelight.essentials", "map", "x".repeat(40)].map(extensionHue);
    for (const h of hues) {
      expect(h).toBeGreaterThanOrEqual(110);
      expect(h).toBeLessThan(350);
    }
    expect(new Set(hues).size).toBeGreaterThan(3);
  });
});
