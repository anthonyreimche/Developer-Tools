// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// Dev ▸ Extensions: every extension and its stages, each with its status.
// Clicking one selects it and brings it into view in the graph, showing its
// band first if the toolbar's filters hide it. Dev-folder extensions can be
// reloaded from here.

import { React, api } from "../../rt";
import { cx, tw } from "../../styles";
import { isCollapsed, type Band, type StageNode } from "../model";
import { extensionColour } from "../palette";
import type { Tone } from "../status";
import { useGraph, useModel } from "../sources";
import { devView } from "../store";

export const TONE_TEXT: Readonly<Record<Tone, string>> = {
  running: tw("text-accent"),
  neutral: tw("text-text-secondary"),
  dim: tw("text-text-secondary"),
  problem: tw("text-amber-400"),
  failure: tw("text-red-400"),
};

const ROW = tw("flex w-full min-w-0 items-baseline gap-1.5 text-left hover:bg-surface-3");

export function ExtensionsPanel() {
  const model = useModel();
  const graph = useGraph(model);
  const selection = devView()((s) => s.selection);
  const selected = selection?.kind === "node" ? selection.id : null;
  const shown = React.useMemo(() => new Map(graph.bands.map((b) => [b.id, b])), [graph]);
  const reload = api.devtools?.extensions?.reloadDev;

  const go = (band: Band, nodeId: string) => {
    const s = devView().getState();
    const laid = shown.get(band.id);
    if (!laid) {
      s.setSearch("");
      s.setShowAll(true);
    }
    if (nodeId !== band.id && (laid?.collapsed ?? isCollapsed(band, s.collapsed))) s.setCollapsed([band.id], false);
    s.select({ kind: "node", id: nodeId });
    s.focusOn(nodeId);
  };

  return (
    <div className={tw("h-full overflow-y-auto py-1 text-[11px]")}>
      <ul aria-label="Extensions">
        {model.bands.map((band) => (
          <li key={band.id}>
            <div className={tw("flex items-center gap-1 pr-1")}>
              <button
                type="button"
                aria-current={selected === band.id}
                onClick={() => go(band, band.id)}
                className={cx(ROW, tw("px-2 py-1"), selected === band.id && tw("bg-surface-3"))}
              >
                <span
                  className={tw("shrink-0 rounded-full")}
                  style={{ width: 8, height: 8, background: extensionColour(band.extensionId, api.ui.tokens) }}
                />
                <span className={tw("min-w-0 truncate text-text-primary")}>{band.name}</span>
                <span className={cx(tw("ml-auto shrink-0 text-[11px]"), TONE_TEXT[band.status.tone])}>
                  {band.status.label}
                </span>
              </button>
              {band.source === "dev" && reload && (
                <button
                  type="button"
                  aria-label={`Reload ${band.name}`}
                  title="Reload from the dev folder"
                  onClick={() => void reload(band.extensionId)}
                  className={tw("shrink-0 rounded px-1.5 text-text-secondary hover:bg-surface-3 hover:text-text-primary")}
                >
                  ↻
                </button>
              )}
            </div>
            {band.status.message && (
              <div className={tw("break-words pl-3 pr-2 text-[11px] text-red-400")}>{band.status.message}</div>
            )}
            {band.stages.length > 0 && (
              <ul>
                {band.stages.map((stage) => (
                  <StageRow key={stage.id} stage={stage} selected={selected === stage.id} onClick={() => go(band, stage.id)} />
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StageRow({ stage, selected, onClick }: { stage: StageNode; selected: boolean; onClick: () => void }) {
  const { tone, label, reason } = stage.state;
  const flagged = tone === "failure" || tone === "problem";
  return (
    <li>
      <button
        type="button"
        aria-current={selected}
        title={`${stage.stageId}: ${reason}`}
        onClick={onClick}
        className={cx(ROW, tw("py-0.5 pl-3 pr-2"), selected && tw("bg-surface-3"))}
      >
        <span className={tw("min-w-0 truncate pl-3 text-text-secondary")}>{stage.name}</span>
        <span className={cx(tw("ml-auto shrink-0 text-[11px]"), TONE_TEXT[tone])}>{label}</span>
      </button>
      {flagged && <div className={cx(tw("break-words pl-6 pr-2 text-[11px]"), TONE_TEXT[tone])}>{reason}</div>}
    </li>
  );
}
