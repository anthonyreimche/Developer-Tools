// The Developer Tools panel in a DOM over the fake API: the Console and Issues
// tabs over the captured log, the REPL, the System, Storage and Native tabs,
// popping the panel out and re-docking it, and the Preferences section.

import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CTL_CHANNEL, initDevtoolsDetachSync, teardownDevtoolsDetachSync } from "../src/detach";
import { DevSettings } from "../src/DevSettings";
import { DevTools, DevToolsPanel } from "../src/DevToolsPanel";
import { clearLog, pushEntry } from "../src/log-capture";
import { React, initRuntime } from "../src/rt";
import type { NativeDetails } from "../src/safelight";
import { classOf } from "../src/styles";
import { UNAVAILABLE_TEXT } from "../src/Unavailable";
import { CONTROLS_TEST_ID, NATIVE, fakeApi, type Rig, type RigOptions } from "./support/fake-api";

afterEach(() => {
  cleanup();
  teardownDevtoolsDetachSync();
  localStorage.clear();
  window.history.replaceState({}, "", "/");
  vi.restoreAllMocks();
});

function mount(options: RigOptions = {}, ui: () => React.ReactElement = () => <DevToolsPanel />): Rig {
  const rig = fakeApi(options);
  initRuntime(rig.api);
  clearLog();
  render(ui());
  return rig;
}

const tab = (name: string) => fireEvent.click(screen.getByRole("button", { name: new RegExp(`^${name}`) }));
const delivery = () => new Promise((r) => setTimeout(r, 20));

describe("Console and Issues", () => {
  it("lists captured entries, newest last, with an empty state before any", () => {
    mount();
    expect(screen.getByText("No console output yet.")).toBeTruthy();
    act(() => {
      pushEntry("log", ["first"]);
      pushEntry("info", ["second", "part"]);
    });
    expect(screen.getByText("first")).toBeTruthy();
    expect(screen.getByText("second part")).toBeTruthy();
  });

  it("filters by text and by level", () => {
    mount();
    act(() => {
      pushEntry("log", ["alpha"]);
      pushEntry("debug", ["beta"]);
    });
    fireEvent.change(screen.getByPlaceholderText("Filter…"), { target: { value: "ALP" } });
    expect(screen.queryByText("beta")).toBeNull();
    fireEvent.change(screen.getByPlaceholderText("Filter…"), { target: { value: "" } });
    fireEvent.click(screen.getByTitle("Toggle debug"));
    expect(screen.getByText("alpha")).toBeTruthy();
    expect(screen.queryByText("beta")).toBeNull();
  });

  it("counts warnings, errors and exceptions on the Issues tab and shows only those there", () => {
    mount();
    act(() => {
      pushEntry("log", ["fine"]);
      pushEntry("warn", ["careful"]);
      pushEntry("error", ["broken"]);
      pushEntry("exception", ["thrown"], "at x.js:1:1");
    });
    const issues = screen.getByRole("button", { name: /^Issues/ });
    expect(within(issues).getByText("3")).toBeTruthy();
    tab("Issues");
    expect(screen.queryByText("fine")).toBeNull();
    expect(screen.getByText("careful")).toBeTruthy();
    expect(screen.queryByPlaceholderText("Evaluate JavaScript…")).toBeNull();
  });

  it("caps the Issues count at 999+", () => {
    mount();
    act(() => {
      for (let i = 0; i < 1000; i++) pushEntry("warn", [`w${i}`]);
    });
    expect(within(screen.getByRole("button", { name: /^Issues/ })).getByText("999+")).toBeTruthy();
  });

  it("shows an entry's stack on click", () => {
    mount();
    act(() => pushEntry("exception", ["thrown"], "at x.js:1:1"));
    expect(screen.queryByText("at x.js:1:1")).toBeNull();
    fireEvent.click(screen.getByText("thrown"));
    expect(screen.getByText("at x.js:1:1")).toBeTruthy();
  });

  it("clears the log", () => {
    mount();
    act(() => pushEntry("log", ["gone soon"]));
    fireEvent.click(screen.getByTitle("Clear log"));
    expect(screen.getByText("No console output yet.")).toBeTruthy();
  });

  it("evaluates a REPL line and walks its history with the arrow keys", () => {
    mount();
    const input = screen.getByPlaceholderText<HTMLInputElement>("Evaluate JavaScript…");
    fireEvent.change(input, { target: { value: "6 * 7" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("6 * 7")).toBeTruthy();
    expect(screen.getByText("42")).toBeTruthy();
    fireEvent.change(input, { target: { value: "nope(" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText(/^SyntaxError/)).toBeTruthy();
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input.value).toBe("nope(");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input.value).toBe("6 * 7");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.value).toBe("");
  });
});

describe("System", () => {
  it("lists the app version, runtime, platform and WebGL facts from the host", async () => {
    mount();
    await act(async () => tab("System"));
    expect(screen.getByText("3.2.0")).toBeTruthy();
    expect(screen.getByText("Electron 37.2.0 · Chromium 138.0.7204.97")).toBeTruthy();
    expect(screen.getByText("win32")).toBeTruthy();
    expect(screen.getByText("Acme GPU")).toBeTruthy();
    expect(screen.getByText("16384")).toBeTruthy();
  });

  it("shows Chromium's GPU feature status, flagging what runs disabled or in software", async () => {
    mount();
    await act(async () => tab("System"));
    expect(screen.getByText("GPU feature status")).toBeTruthy();
    const status = (feature: string) =>
      (screen.getByText(feature).closest("tr") as HTMLElement).querySelectorAll("td")[1];
    expect(status("gpu_compositing").textContent).toBe("enabled");
    expect(status("gpu_compositing").className).toContain(classOf("text-emerald-400"));
    expect(status("vulkan").textContent).toBe("disabled_off");
    expect(status("vulkan").className).toContain(classOf("text-amber-400"));
  });

  it("leaves the GPU feature status out where the desktop build can't report it", async () => {
    mount({ native: { ...NATIVE, gpuInfo: undefined } });
    await act(async () => tab("System"));
    expect(screen.getByText("win32")).toBeTruthy();
    expect(screen.queryByText("GPU feature status")).toBeNull();
  });

  it("leaves the GPU feature status out when reading it fails", async () => {
    mount({ native: { ...NATIVE, gpuInfo: () => Promise.reject(new Error("no gpu")) } });
    await act(async () => tab("System"));
    expect(screen.getByText("win32")).toBeTruthy();
    expect(screen.queryByText("GPU feature status")).toBeNull();
  });

  it("re-reads the GPU feature status on Refresh", async () => {
    const gpuInfo = vi
      .fn<() => Promise<Record<string, string>>>()
      .mockResolvedValueOnce({ webgl2: "enabled" })
      .mockResolvedValueOnce({ webgl2: "unavailable_software" });
    mount({ native: { ...NATIVE, gpuInfo } });
    await act(async () => tab("System"));
    expect(screen.getByText("enabled")).toBeTruthy();
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "↻ Refresh" })));
    expect(screen.getByText("unavailable_software")).toBeTruthy();
    expect(gpuInfo).toHaveBeenCalledTimes(2);
  });

  it("says WebGL is unavailable and the runtime is a browser where the host says so", async () => {
    vi.spyOn(navigator, "platform", "get").mockReturnValue("Linux x86_64");
    mount({ desktop: false, webgl: null });
    await act(async () => tab("System"));
    expect(screen.getByText("Browser (no Electron bridge)")).toBeTruthy();
    expect(screen.getByText("unavailable")).toBeTruthy();
    expect(screen.getByText("Linux x86_64")).toBeTruthy();
    expect(screen.queryByText("GPU feature status")).toBeNull();
  });

  it("shows an unknown version without api.devtools", async () => {
    mount({ devtools: false });
    await act(async () => tab("System"));
    expect(screen.getByText("unknown")).toBeTruthy();
  });
});

describe("Storage", () => {
  it("lists, edits, saves and deletes localStorage keys", () => {
    localStorage.setItem("sl_theme", "dark");
    localStorage.setItem("other", "1");
    mount();
    tab("Storage");
    expect(screen.getByText("localStorage · 2 keys")).toBeTruthy();
    fireEvent.click(screen.getByText("sl_theme"));
    const editor = screen.getByDisplayValue("dark");
    fireEvent.change(editor, { target: { value: "light" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(localStorage.getItem("sl_theme")).toBe("light");
    fireEvent.click(within(screen.getByTitle("other").parentElement as HTMLElement).getByTitle("Delete key"));
    expect(localStorage.getItem("other")).toBeNull();
    expect(screen.getByText("localStorage · 1 keys")).toBeTruthy();
  });
});

describe("Native", () => {
  it("drives the window's Chrome DevTools through the host", async () => {
    const rig = mount();
    tab("Native");
    for (const name of ["Open ⧉", "Dock ▾", "Toggle", "Close", "Reload", "Hard reload"]) {
      await act(async () => fireEvent.click(screen.getByRole("button", { name })));
    }
    expect(rig.calls).toEqual(["open:detach", "open:bottom", "toggle", "close", "reload:false", "reload:true"]);
  });

  it("says a failed call inline", async () => {
    const rig = mount();
    const electron = rig.api.devtools?.electron;
    if (!electron) throw new Error("no electron bridge");
    electron.toggle = () => Promise.reject(new Error("no window"));
    tab("Native");
    await act(async () => fireEvent.click(screen.getByRole("button", { name: "Toggle" })));
    expect(screen.getByText("Toggle failed: no window")).toBeTruthy();
  });

  it("lists each process's CPU and memory", async () => {
    mount();
    await act(async () => tab("Native"));
    const row = (pid: string) =>
      [...(screen.getByText(pid).closest("tr") as HTMLElement).querySelectorAll("td")].map((td) => td.textContent);
    expect(row("4100")).toEqual(["Browser", "4100", "1.2", "182 MB"]);
    expect(row("4101")).toEqual(["GPU", "4101", "3.0", "252 MB"]);
  });

  it("re-reads the metrics on refresh", async () => {
    const metrics = vi
      .fn<NonNullable<NativeDetails["metrics"]>>()
      .mockResolvedValueOnce([{ type: "Browser", pid: 1, cpuPercent: 1, memoryMB: 100 }])
      .mockResolvedValueOnce([{ type: "Browser", pid: 1, cpuPercent: 9, memoryMB: 300 }]);
    mount({ native: { ...NATIVE, metrics } });
    await act(async () => tab("Native"));
    expect(screen.getByText("100 MB")).toBeTruthy();
    await act(async () => fireEvent.click(screen.getByTitle("Refresh metrics")));
    expect(screen.getByText("300 MB")).toBeTruthy();
    expect(metrics).toHaveBeenCalledTimes(2);
  });

  it("says the metrics are unavailable where the desktop build can't report them, or reading them fails", async () => {
    mount({ native: { ...NATIVE, metrics: undefined } });
    await act(async () => tab("Native"));
    expect(screen.getByText("Metrics unavailable (older desktop build).")).toBeTruthy();
    cleanup();
    mount({ native: { ...NATIVE, metrics: () => Promise.reject(new Error("gone")) } });
    await act(async () => tab("Native"));
    expect(screen.getByText("Metrics unavailable (older desktop build).")).toBeTruthy();
  });

  it("keeps the metrics and a plain Reload in a desktop build without the DevTools bridge", async () => {
    mount({ desktop: false, native: NATIVE });
    await act(async () => tab("Native"));
    expect(screen.getByText("DevTools control unavailable (older desktop build).")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Reload" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Hard reload" })).toBeNull();
    expect(screen.getByText("4100")).toBeTruthy();
  });

  it("points at the browser's own DevTools outside the desktop app", () => {
    mount({ desktop: false });
    tab("Native");
    expect(screen.getByText(/Native tools require the SafeLight desktop app/)).toBeTruthy();
  });
});

describe("popping out", () => {
  it("opens its own window and closes the docked panel", () => {
    const opened = { focus: vi.fn(), closed: false };
    const open = vi.spyOn(window, "open").mockReturnValue(opened as unknown as Window);
    const rig = mount();
    rig.open.add("core.devtools");
    fireEvent.click(screen.getByTitle("Open in a separate window"));
    expect(open).toHaveBeenCalledWith(expect.stringMatching(/\?devtools=1$/), "safelight-devtools", "width=760,height=600");
    expect(rig.open.has("core.devtools")).toBe(false);
    fireEvent.click(screen.getByTitle("Open in a separate window"));
    expect(open).toHaveBeenCalledTimes(1);
    expect(opened.focus).toHaveBeenCalledTimes(2);
  });

  it("renders the whole window there, with a title bar to re-dock from", async () => {
    window.history.replaceState({}, "", "/?devtools=1");
    const close = vi.spyOn(window, "close").mockImplementation(() => undefined);
    const rig = mount({}, () => <DevTools />);
    expect(rig.overlays).toContain("--color-surface-2");
    expect(document.title).toBe("SafeLight — Developer Tools");
    expect(screen.queryByTitle("Open in a separate window")).toBeNull();

    const main = new BroadcastChannel(CTL_CHANNEL);
    const heard: unknown[] = [];
    main.onmessage = (e: MessageEvent) => void heard.push(e.data);
    fireEvent.click(screen.getByTitle("Close and re-dock in the main window"));
    await delivery();
    expect(heard).toEqual([{ type: "reattach" }]);
    expect(close).toHaveBeenCalled();
    main.close();
  });

  it("leaves room for the window controls on the platform's side", () => {
    window.history.replaceState({}, "", "/?devtools=1");
    mount({}, () => <DevTools />);
    const bar = () => screen.getByText("Developer Tools").parentElement as HTMLElement;
    expect(bar().style.paddingRight).toBe("138px");
    expect(bar().style.paddingLeft).toBe("");
    cleanup();
    mount({ native: { ...NATIVE, platform: "darwin" } }, () => <DevTools />);
    expect(bar().style.paddingLeft).toBe("78px");
    expect(bar().style.paddingRight).toBe("");
  });

  it("re-docks the panel in the main window when the popped-out one asks", async () => {
    const rig = mount();
    initDevtoolsDetachSync();
    const popped = new BroadcastChannel(CTL_CHANNEL);
    popped.postMessage({ type: "reattach" });
    await delivery();
    expect(rig.open.has("core.devtools")).toBe(true);
    popped.close();
  });

  it("renders the docked panel in the main window", () => {
    mount({}, () => <DevTools />);
    expect(screen.getByTitle("Open in a separate window")).toBeTruthy();
    expect(screen.queryByText("Developer Tools")).toBeNull();
  });
});

describe("Preferences ▸ Developer Tools", () => {
  it("shows core's dev-folder controls in their settings layout", () => {
    mount({}, () => <DevSettings />);
    expect(screen.getByText("Development extensions folder")).toBeTruthy();
    expect(screen.getByTestId(CONTROLS_TEST_ID).textContent).toBe("settings");
  });

  it("says the folder needs the desktop app outside it", () => {
    mount({ desktop: false }, () => <DevSettings />);
    expect(screen.getByText("Loading extensions from a folder requires the desktop app.")).toBeTruthy();
    expect(screen.queryByTestId(CONTROLS_TEST_ID)).toBeNull();
  });

  it("says it is unavailable without api.devtools", () => {
    mount({ devtools: false }, () => <DevSettings />);
    expect(screen.getByText(UNAVAILABLE_TEXT)).toBeTruthy();
  });
});
