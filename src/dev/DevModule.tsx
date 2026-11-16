// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// The Dev module's main view: a toolbar over the graph of every extension, the
// stages each one registers and what the live view runs. Read-only.

import type { ReactNode } from "react";
import { React } from "../rt";
import { cx, tw } from "../styles";
import { GraphView } from "./GraphView";
import { layoutGraph } from "./layout";
import { linkedTo } from "./model";
import { useGraph, useHello, useModel } from "./sources";
import { devView } from "./store";

const TOOL = tw("rounded px-2 py-0.5 text-text-secondary hover:bg-surface-3 hover:text-text-primary");

function Toggle({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cx(
        tw("rounded px-2 py-0.5"),
        pressed ? tw("bg-surface-3 text-text-primary") : tw("text-text-secondary hover:text-text-primary"),
      )}
    >
      {children}
    </button>
  );
}

function Toolbar({ bandIds }: { bandIds: readonly string[] }) {
  const store = devView();
  const search = store((s) => s.search);
  const showAll = store((s) => s.showAll);
  const showEmpty = store((s) => s.showEmpty);
  const actions = store.getState();
  return (
    <div className={tw("flex shrink-0 flex-wrap items-center gap-1.5 border-b border-border-subtle bg-surface-2 px-2 py-1.5")}>
      <input
        value={search}
        onChange={(e) => actions.setSearch(e.target.value)}
        placeholder="Search extensions and stages…"
        spellCheck={false}
        className={tw(
          "w-56 min-w-0 rounded bg-surface-1 px-2 py-1 text-text-primary outline-none placeholder:text-text-muted focus:bg-surface-3",
        )}
      />
      <Toggle pressed={showAll} onClick={actions.toggleShowAll}>
        All extensions
      </Toggle>
      <Toggle pressed={showEmpty} onClick={actions.toggleShowEmpty}>
        Empty phases
      </Toggle>
      <span className={tw("flex-1")} />
      <button type="button" className={TOOL} onClick={actions.requestFit}>
        Fit
      </button>
      <button type="button" className={TOOL} onClick={() => actions.setCollapsed(bandIds, true)}>
        Collapse all
      </button>
      <button type="button" className={TOOL} onClick={() => actions.setCollapsed(bandIds, false)}>
        Expand all
      </button>
    </div>
  );
}

export function DevModule() {
  useHello();
  const model = useModel();
  const graph = useGraph(model);
  const store = devView();
  const showEmpty = store((s) => s.showEmpty);
  const selection = store((s) => s.selection);
  const layout = React.useMemo(() => layoutGraph(graph, { showEmptyPhases: showEmpty }), [graph, showEmpty]);
  const linked = React.useMemo(() => linkedTo(graph, selection), [graph, selection]);
  const bandIds = React.useMemo(() => model.bands.map((b) => b.id), [model]);

  return (
    <div className={tw("flex h-full w-full flex-col bg-surface-1 text-[11px] text-text-primary")}>
      <Toolbar bandIds={bandIds} />
      <div className={tw("relative min-h-0 flex-1")}>
        <GraphView layout={layout} linked={linked} selection={selection} />
      </div>
    </div>
  );
}
