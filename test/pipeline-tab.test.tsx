// Ported from core's PipelineTab.test.tsx. Core builds the rows (its
// pipeline-inspect hooks, behind api.devtools.pipeline); these tests hand the
// tab rows in the shapes core makes and check how it groups, labels and picks
// them. Core keeps the tests of which rows a program has and of when the hooks
// rebuild them.

import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DevToolsPanel } from "../src/DevToolsPanel";
import { PipelineTab } from "../src/PipelineTab";
import { React, initRuntime } from "../src/rt";
import { classOf } from "../src/styles";
import type { PipelineRow, ProcessingPhase, ProcessVersion } from "../src/safelight";
import { UNAVAILABLE_TEXT } from "../src/Unavailable";
import { fakeApi, type PipelineState, type Rig, type RigOptions } from "./support/fake-api";

afterEach(() => {
  cleanup();
  window.history.replaceState({}, "", "/");
});

type Stage = Extract<PipelineRow, { kind: "stage" }>;

const stage = (id: string, name: string, more: Partial<Stage> = {}): Stage => ({
  kind: "stage",
  id,
  name,
  phase: "display-adjust",
  priority: 100,
  owner: "acme",
  space: null,
  domain: "display",
  reads: "source",
  maskable: false,
  floors: [],
  ...more,
});

const core = (label: string, note?: string): PipelineRow => ({ kind: "core", label, note });

const coreClip = (where: "input" | "result", when: "always" | "while-active", detail = ""): PipelineRow => ({
  kind: "clamp",
  reason: "core",
  where,
  when,
  detail,
});

const CLAMPED_TOOLS = ["Whites", "Blacks", "Contrast", "Dehaze"];

/** Version 2's tools that need [0, 1] clip their input while in use; version 1
 *  clips once, after the transform; version 3 maps the output. */
function program(version: ProcessVersion): PipelineRow[] {
  return [
    core("Exposure"),
    { kind: "transform", id: null, flags: [] },
    ...(version === 1 ? [coreClip("result", "always", "the display transform's result")] : []),
    ...CLAMPED_TOOLS.flatMap((tool) => [core(tool), ...(version === 1 ? [] : [coreClip("input", "while-active")])]),
    { kind: "output", mapped: version === 3, detail: "the sRGB encode" },
  ];
}

const PROGRAMS: Record<ProcessVersion, PipelineRow[]> = { 1: program(1), 2: program(2), 3: program(3) };

function mount(pipeline: Partial<PipelineState> = {}, options: RigOptions = {}): Rig {
  const rig = fakeApi({ ...options, pipeline: { rows: PROGRAMS, ...pipeline } });
  initRuntime(rig.api);
  render(<PipelineTab />);
  return rig;
}

const allVersions = (rows: PipelineRow[]): Record<ProcessVersion, PipelineRow[]> => ({ 1: rows, 2: rows, 3: rows });

// Extensions are plain JavaScript and the registry only warns about a phase the
// table lacks, so a stage can reach the tab with one.
const unlistedPhase = (name: string): ProcessingPhase => name as ProcessingPhase;

/** The version button that is pressed. */
const shown = () =>
  ["v1", "v2", "v3"].find((v) => screen.getByRole("button", { name: v }).getAttribute("aria-pressed") === "true");

/** The list item a row heads (a core block, a stage, the output) or sits in. */
function item(text: string): HTMLLIElement {
  const li = screen.getByText(text).closest("li");
  if (!li) throw new Error(`"${text}" is in no list item`);
  return li;
}

const pick = (version: string) => fireEvent.click(screen.getByRole("button", { name: version }));

describe("PipelineTab", () => {
  it("lists a legacy display stage with the clip ahead of it, and the input clips of the tools that need [0, 1]", () => {
    mount({
      photoId: "p1",
      rows: allVersions([
        ...program(2),
        {
          kind: "clamp",
          reason: "legacy-display-stage",
          stageId: "acme.tint",
          where: "input",
          when: "always",
          detail: "Tint declares no space, so its input is clipped to [0, 1].",
        },
        stage("acme.tint", "Tint"),
      ]),
    });
    const tint = item("Tint");
    expect(within(tint).getByText("acme.tint")).toBeTruthy();
    expect(within(tint).getByText("input · always")).toBeTruthy();
    expect(within(tint).getByText(/Tint declares no space/)).toBeTruthy();
    expect(within(tint).getByText("display values")).toBeTruthy();
    for (const tool of CLAMPED_TOOLS) {
      expect(within(item(tool)).queryByText("input · while in use"), tool).not.toBeNull();
    }
  });

  it("shows the version picked: version 1 clips after the transform, version 3 maps the output", () => {
    const rig = mount({ photoId: "p1" });
    const afterTransform = () => item("Transform: Built-in").nextElementSibling?.textContent ?? null;
    expect(afterTransform()).toBeNull();

    pick("v1");
    expect(rig.rowRequests.at(-1)).toBe(1);
    for (const tool of CLAMPED_TOOLS) {
      expect(within(item(tool)).queryByText("input · while in use"), tool).toBeNull();
    }
    expect(afterTransform()).toMatch(/^result · always/);

    pick("v3");
    expect(rig.rowRequests.at(-1)).toBe(3);
    const output = item("Output");
    expect(within(output).getByText("mapped")).toBeTruthy();
    expect(output.textContent).toContain("On this screen: sRGB");
  });

  it("puts a built-in stage's own clip under that stage, wherever core lists it", () => {
    mount({
      rows: allVersions([
        {
          kind: "clamp",
          reason: "builtin-stage",
          stageId: "core.heal",
          where: "result",
          when: "while-active",
          detail: "The Heal copy clips to [0, 1].",
        },
        stage("builtin.denoise", "Denoise", { owner: null, phase: "noise-reduction", domain: "scene" }),
        stage("core.heal", "Heal", { owner: null, phase: "decode", domain: "scene" }),
      ]),
    });
    const heal = item("Heal");
    expect(within(heal).getByText("result · while in use")).toBeTruthy();
    expect(within(heal).getAllByText("Safelight")).toHaveLength(1);
    expect(within(item("Denoise")).queryByText("result · while in use")).toBeNull();
  });

  it("shows a floor found in a stage's GLSL", () => {
    mount({ rows: allVersions([stage("acme.film", "Film", { floors: ["max(lin, 0.0)"], domain: "scene" })]) });
    expect(within(item("Film")).getByText("found in GLSL: max(lin, 0.0)")).toBeTruthy();
  });

  it("marks a maskable stage the photo's masks run again, with the number of copies", () => {
    mount({
      rows: allVersions([
        stage("acme.wash", "Wash", { maskable: true, copies: 2, note: "Runs again inside 2 masks." }),
        stage("acme.glow", "Glow", { maskable: true, copies: 1 }),
        stage("acme.fade", "Fade", { maskable: true }),
      ]),
    });
    const wash = item("Wash");
    expect(within(wash).getByText("per mask, 2 copies")).toBeTruthy();
    expect(wash.textContent).toContain("Runs again inside 2 masks");
    expect(within(item("Glow")).getByText("per mask, 1 copy")).toBeTruthy();
    expect(within(item("Fade")).getByText("maskable")).toBeTruthy();
  });

  it("says whether the version shown honours the transform's skipToneShoulder", () => {
    const transformRows = (honoured: boolean): PipelineRow[] => [
      core("Display transform"),
      { kind: "transform", id: "acme.filmic", flags: [{ flag: "skipToneShoulder", honoured }] },
    ];
    mount({ photoId: "p1", version: 1, rows: { 1: transformRows(false), 2: transformRows(true), 3: transformRows(true) } });
    expect(screen.getByText("Transform: acme.filmic")).toBeTruthy();
    expect(screen.getByText("skipToneShoulder: ignored on this version").className).toBe(classOf("text-amber-400"));
    pick("v2");
    expect(screen.getByText("skipToneShoulder: honoured").className).toBe("");
  });

  it("names a stage's declared space as its encoding and primaries, and says when it reads the current image", () => {
    mount({
      rows: allVersions([
        stage("acme.wide", "Wide", { domain: "scene", space: { encoding: "perceptual", primaries: "rec2020" } }),
        stage("acme.flat", "Flat", { domain: "display", space: { encoding: "linear" }, reads: "current" }),
        stage("acme.warp", "Warp", { domain: null, phase: "geometry" }),
      ]),
    });
    expect(within(item("Wide")).getByText("perceptual/rec2020")).toBeTruthy();
    expect(within(item("Flat")).getByText("linear/rec709")).toBeTruthy();
    expect(within(item("Flat")).getByText("reads the current image")).toBeTruthy();
    expect(within(item("Warp")).getByText("geometry, priority 100")).toBeTruthy();
    expect(within(item("Warp")).queryByText(/values|rec709|rec2020/)).toBeNull();
  });

  it("shows each conversion, or that the values stay in their space", () => {
    mount({
      rows: allVersions([
        stage("acme.wide", "Wide", { domain: "scene" }),
        { kind: "convert", from: "linear/rec709", to: "perceptual/rec2020", elided: false },
        { kind: "convert", from: "linear/rec709", to: "linear/rec709", elided: true },
      ]),
    });
    expect(screen.getByText("linear/rec709 → perceptual/rec2020")).toBeTruthy();
    expect(screen.getByText("stays in linear/rec709")).toBeTruthy();
  });

  it("is a Developer Tools tab, showing the current version while no photo is open", () => {
    const rig = fakeApi({ pipeline: { rows: PROGRAMS } });
    initRuntime(rig.api);
    render(<DevToolsPanel />);
    fireEvent.click(screen.getByRole("button", { name: "Pipeline" }));
    expect(screen.getByRole("list", { name: "Pipeline" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "v2" }).getAttribute("aria-pressed")).toBe("true");
  });

  // A typo in a phase must not take the whole Developer Tools panel down with
  // it: the Console that holds the registry's warning is in the same panel.
  it("lists a stage naming a phase the table lacks among scene values, as core describes it", () => {
    mount({ rows: allVersions([stage("acme.odd", "Odd", { phase: unlistedPhase("post-effects"), domain: "scene" })]) });
    const odd = item("Odd");
    expect(within(odd).getByText("post-effects, priority 100")).toBeTruthy();
    expect(within(odd).getByText("scene values")).toBeTruthy();
  });

  it("forgets a version pick once its photo is left", () => {
    const rig = mount({ photoId: "p1", version: 2 });
    pick("v3");
    expect(shown()).toBe("v3");
    act(() => rig.pipeline.setState({ photoId: "p2" }));
    expect(shown()).toBe("v2");
    act(() => rig.pipeline.setState({ photoId: "p1" }));
    expect(shown()).toBe("v2");
  });

  it("forgets a version pick once the photo's own version changes", () => {
    const rig = mount({ photoId: "p1", version: 1 });
    pick("v3");
    act(() => rig.pipeline.setState({ version: 2 }));
    expect(shown()).toBe("v2");
  });

  it("names the screen's space on a mapped output", () => {
    mount({ photoId: "p1", screen: { space: "display-p3", profile: null } });
    pick("v3");
    expect(item("Output").textContent).toContain("On this screen: Display P3");
  });

  it("names the monitor profile when one is active", () => {
    mount({ photoId: "p1", screen: { space: "srgb", profile: "Dell U2723QE" } });
    pick("v3");
    expect(item("Output").textContent).toContain("On this screen: Dell U2723QE (monitor profile)");
  });

  it("says no screen line on a clipped output", () => {
    mount({ photoId: "p1" });
    expect(within(item("Output")).getByText("clipped")).toBeTruthy();
    expect(item("Output").textContent).not.toContain("On this screen");
  });

  it("says whether a clip for non-sRGB output runs for this screen", () => {
    const rows = allVersions([
      core("Output encode"),
      { kind: "clamp", reason: "core", where: "result", when: "non-srgb-output", detail: "" },
    ]);
    const rig = mount({ rows });
    expect(screen.getByText("Doesn't run for this screen.")).toBeTruthy();
    act(() => rig.pipeline.setState({ screen: { space: "srgb", profile: "Dell U2723QE" } }));
    expect(screen.getByText("Runs for this screen's monitor profile.")).toBeTruthy();
  });

  it("lists a stage's clip on its own when that stage isn't in the program", () => {
    mount({
      rows: allVersions([
        core("Exposure"),
        {
          kind: "clamp",
          reason: "legacy-display-stage",
          stageId: "acme.gone",
          where: "pass-input",
          when: "always",
          detail: "Gone's passes read [0, 1].",
        },
      ]),
    });
    const lone = item("what its passes read, not the frame · always");
    expect(within(lone).queryByText("Exposure")).toBeNull();
  });

  it("says no photo is open in the docked panel when none is", () => {
    mount();
    expect(screen.getByText("No photo open")).toBeTruthy();
  });

  it("names the open photo's version when one is open", () => {
    mount({ photoId: "p1", version: 3 });
    expect(screen.getByText("Open photo: v3")).toBeTruthy();
  });

  it("asks for the panel to be docked in the popped-out window, which can't see the open photo", () => {
    window.history.replaceState({}, "", "/?devtools=1");
    mount();
    expect(screen.getByText("Dock Developer Tools to see the open photo.")).toBeTruthy();
    expect(screen.queryByText("No photo open")).toBeNull();
  });

  it("says the tab is unavailable when the host hands over no devtools reads", () => {
    mount({}, { devtools: false });
    expect(screen.getByText(UNAVAILABLE_TEXT)).toBeTruthy();
  });
});
