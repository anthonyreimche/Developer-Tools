// The stylesheet that stands in for core's Tailwind utilities: core's values,
// zero specificity, core's accessibility rules, and a rule behind every class
// the panel renders.

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { DevToolsPanel, DevToolsWindow } from "../src/DevToolsPanel";
import { clearLog, pushEntry } from "../src/log-capture";
import { React, initRuntime } from "../src/rt";
import { PREFIX, classOf, cx, devtoolsCss, tw } from "../src/styles";
import { TOKENS, fakeApi } from "./support/fake-api";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

const css = devtoolsCss(TOKENS);
const lines = css.split("\n").filter(Boolean);

describe("devtoolsCss", () => {
  it("prefixes Tailwind's names, keeping them valid class names", () => {
    expect(tw("flex px-2.5 hover:bg-surface-3 text-[11px] w-1/2")).toBe(
      "sldt-flex sldt-px-2_5 sldt-hover_bg-surface-3 sldt-text-_11px_ sldt-w-1_2",
    );
    expect(cx(tw("flex"), false, null, undefined, tw("block"))).toBe("sldt-flex sldt-block");
  });

  it("gives the utilities core's values, coloured from the theme tokens", () => {
    expect(css).toContain(`:where(.${classOf("px-2.5")}) { padding-inline: 0.625rem; }`);
    expect(css).toContain(`:where(.${classOf("bg-surface-2")}) { background-color: var(--color-surface-2); }`);
    expect(css).toContain(`:where(.${classOf("font-code")}) { font-family: var(--font-code); }`);
    expect(css).toContain(
      `:where(.${classOf("border-border-subtle/50")}) { border-color: color-mix(in oklab, var(--color-border-subtle) 50%, transparent); }`,
    );
    expect(css).toContain(`:where(.${classOf("text-amber-400")}) { color: oklch(82.8% 0.189 84.429); }`);
  });

  it("keeps hover behind a hover-capable pointer, as Tailwind does", () => {
    expect(css).toContain(
      `@media (hover: hover) { :where(.${classOf("hover:bg-surface-3")}:hover) { background-color: var(--color-surface-3); } }`,
    );
    expect(css).toContain(
      `@media (hover: hover) { :where(.${classOf("group")}:hover .${classOf("group-hover:opacity-100")}) { opacity: 1; } }`,
    );
    expect(css).toContain(`:where(.${classOf("placeholder:text-text-muted")})::placeholder { color: var(--color-text-muted); }`);
  });

  it("puts every rule at zero specificity except core's accessibility overrides", () => {
    const plain = lines.filter((line) => !line.includes(":where(") && !line.startsWith("html.sl-"));
    expect(plain).toEqual([]);
  });

  it("repeats core's Larger text and Title-case headings rules", () => {
    expect(css).toContain(`html.sl-larger-text .${classOf("text-[9px]")} { font-size: 11px !important; }`);
    expect(css).toContain(`html.sl-larger-text .${classOf("text-[10px]")} { font-size: 12px !important; }`);
    expect(css).toContain(
      `html.sl-larger-text .${classOf("text-[11px]")} { font-size: 13px !important; line-height: 1.45 !important; }`,
    );
    expect(css).toContain(`html.sl-larger-text .${classOf("uppercase")} { text-transform: none !important; }`);
    expect(css).toContain(`html.sl-title-headings .${classOf("uppercase")} { text-transform: capitalize !important; }`);
  });

  it("has a rule for every class the panel renders", async () => {
    const rig = fakeApi({ pipeline: { photoId: "p1", rows: { 1: [], 2: [{ kind: "core", label: "Exposure" }], 3: [] } } });
    initRuntime(rig.api);
    clearLog();
    localStorage.setItem("sl_key", "v");
    rig.variables.scoped("map").register("map.overlays", { initial: {} });
    rig.variables.scoped("gps").set("map.overlays", { stale: true });
    const used = new Set<string>();
    const collect = () =>
      document.querySelectorAll("[class]").forEach((el) => {
        for (const c of el.classList) if (c.startsWith(PREFIX)) used.add(c);
      });

    render(<DevToolsWindow />);
    act(() => {
      pushEntry("warn", ["careful"]);
      pushEntry("exception", ["thrown"], "at x.js:1:1");
    });
    fireEvent.click(screen.getByText("thrown"));
    collect();
    for (const name of ["Issues", "System", "Storage", "Variables", "Pipeline", "Native"]) {
      await act(async () => fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${name}`) })));
      if (name === "Storage") fireEvent.click(screen.getByText("sl_key"));
      if (name === "Variables") fireEvent.click(screen.getByRole("button", { name: "Edit value" }));
      collect();
    }
    cleanup();
    render(<DevToolsPanel />);
    collect();

    expect(used.size).toBeGreaterThan(50);
    const missing = [...used].filter((c) => !css.includes(`.${c}`));
    expect(missing).toEqual([]);
  });
});
