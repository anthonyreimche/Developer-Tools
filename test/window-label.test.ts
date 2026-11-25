// How a window names itself to the others' status bars: from navigation and
// the Developer Tools window's own address, never the module's query string.

import { afterEach, describe, expect, it, vi } from "vitest";
import { windowLabel } from "../src/dev/sources";
import { initRuntime } from "../src/rt";
import { fakeApi } from "./support/fake-api";

afterEach(() => vi.unstubAllGlobals());

describe("windowLabel", () => {
  it("names the window a module was popped out for", () => {
    const rig = fakeApi();
    initRuntime(rig.api);
    vi.stubGlobal("window", { location: { search: "" } });
    expect(windowLabel()).toBe("the main window");
    rig.own.module = "develop";
    expect(windowLabel()).toBe("the Develop window");
    rig.own.module = "map";
    vi.stubGlobal("window", { location: { search: "?detached=develop" } });
    expect(windowLabel()).toBe("the Map window");
  });

  it("names its own window", () => {
    initRuntime(fakeApi().api);
    vi.stubGlobal("window", { location: { search: "?devtools=1" } });
    expect(windowLabel()).toBe("the Developer Tools window");
  });
});
