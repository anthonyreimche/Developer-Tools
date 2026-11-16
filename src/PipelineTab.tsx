// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// Developer Tools ▸ Pipeline: the develop program the open photo renders with,
// or the one any process version would, as core describes it from the calls
// the renderer makes: the core blocks in order, the stages between them, the
// conversions, and every clip of the colour.

import { isDevtoolsWindow } from "./detach";
import { Unavailable } from "./Unavailable";
import { React, api } from "./rt";
import type {
  ClipWhen,
  DevtoolsAPI,
  DisplaySpace,
  PipelineRow,
  ProcessVersion,
  ScreenTarget,
  StageDomain,
  StageSpace,
} from "./safelight";
import { cx, tw } from "./styles";

type Row<K extends PipelineRow["kind"]> = Extract<PipelineRow, { kind: K }>;

/** A row with the rows that belong to it: a core block's transform and clips,
 *  a stage's clips, the output's clips. */
interface Item {
  head: PipelineRow;
  under: PipelineRow[];
}

export const COLOR_SPACES: { value: DisplaySpace | "adobe-rgb" | "prophoto-rgb"; label: string }[] = [
  { value: "srgb", label: "sRGB" },
  { value: "display-p3", label: "Display P3" },
  { value: "adobe-rgb", label: "Adobe RGB" },
  { value: "prophoto-rgb", label: "ProPhoto RGB" },
];

/** The space a stage's block sees, as "encoding/primaries". */
export function spaceKey(space: StageSpace | undefined, domain: StageDomain): string {
  const encoding = space?.encoding ?? (domain === "scene" ? "linear" : "perceptual");
  return `${encoding}/${space?.primaries === "rec2020" ? "rec2020" : "rec709"}`;
}

const WHERE: Record<Row<"clamp">["where"], string> = {
  input: "input",
  result: "result",
  "pass-input": "what its passes read, not the frame",
};
const WHEN: Record<ClipWhen, string> = {
  always: "always",
  "while-active": "while in use",
  "per-mask": "inside each mask that uses it, blended by coverage",
  "fallback-preview": "fallback preview only",
  "non-srgb-output": "only when the output isn't sRGB",
  "no-float-targets": "only without float render targets or mipmaps",
};

/** Each row under the one it belongs to. A stage's clips are found by its id,
 *  not by position: a reader's pass clip is written ahead of the first
 *  output-frame stage, which need not be the reader. */
function itemsOf(rows: readonly PipelineRow[]): Item[] {
  const items: Item[] = [];
  const stages = new Map<string, Item>();
  const owned: Row<"clamp">[] = [];
  let core: Item | undefined;
  for (const row of rows) {
    if (row.kind === "clamp" && row.reason !== "core") {
      owned.push(row);
    } else if (core && (row.kind === "transform" || row.kind === "clamp")) {
      core.under.push(row);
    } else {
      const item: Item = { head: row, under: [] };
      items.push(item);
      if (row.kind === "core") core = item;
      if (row.kind === "stage") stages.set(row.id, item);
    }
  }
  const output = items.find((i) => i.head.kind === "output");
  for (const clamp of owned) {
    const owner = "stageId" in clamp ? stages.get(clamp.stageId) : output;
    if (owner) owner.under.push(clamp);
    else items.push({ head: clamp, under: [] });
  }
  return items;
}

const CHIP = tw("rounded bg-surface-3 px-1 text-text-secondary");

function StageView({ row }: { row: Row<"stage"> }) {
  const { domain } = row;
  const facts = [
    row.owner ?? "Safelight",
    `${row.phase}, priority ${row.priority}`,
    // A geometry stage moves pixels and holds no colour.
    ...(domain ? [row.space ? spaceKey(row.space, domain) : `${domain} values`] : []),
    ...(row.reads === "current" ? ["reads the current image"] : []),
    ...(row.maskable && row.copies ? [`per mask, ${row.copies} ${row.copies === 1 ? "copy" : "copies"}`] : []),
    ...(row.maskable && !row.copies ? ["maskable"] : []),
  ];
  return (
    <>
      <div className={tw("flex items-baseline gap-2")}>
        <span className={tw("text-text-primary")}>{row.name}</span>
        <span className={tw("font-code text-[11px] text-text-secondary")}>{row.id}</span>
      </div>
      <div className={tw("flex flex-wrap gap-x-2.5 text-[11px] text-text-secondary")}>
        {facts.map((fact) => (
          <span key={fact}>{fact}</span>
        ))}
      </div>
      {row.note && <div className={tw("text-[11px] text-text-secondary")}>{row.note}</div>}
      {row.floors.map((floor, i) => (
        <div key={i} className={tw("font-code text-[11px] text-amber-400")}>{`found in GLSL: ${floor}`}</div>
      ))}
    </>
  );
}

function ClipView({ row, screen }: { row: Row<"clamp">; screen: ScreenTarget }) {
  return (
    <div>
      <span className={CHIP}>{`${WHERE[row.where]} · ${WHEN[row.when]}`}</span>
      {/* The export's space isn't known until an export, but the view's is. */}
      {row.when === "non-srgb-output" && (
        <span className={cx(tw("ml-1.5"), screen.profile ? tw("text-amber-400") : tw("text-text-muted"))}>
          {screen.profile ? "Runs for this screen's monitor profile." : "Doesn't run for this screen."}
        </span>
      )}
      <span className={tw("ml-1.5 text-text-muted")}>{row.detail}</span>
    </div>
  );
}

function OutputView({ row, screen }: { row: Row<"output">; screen: ScreenTarget }) {
  const target = screen.profile
    ? `${screen.profile} (monitor profile)`
    : (COLOR_SPACES.find((s) => s.value === screen.space)?.label ?? screen.space);
  return (
    <>
      <div className={tw("flex items-baseline gap-2")}>
        <span className={tw("text-text-muted")}>Output</span>
        <span className={cx(CHIP, tw("text-[11px]"))}>{row.mapped ? "mapped" : "clipped"}</span>
      </div>
      <div className={tw("text-[11px] text-text-secondary")}>{row.detail}</div>
      {row.mapped && <div className={tw("text-[11px] text-text-secondary")}>{`On this screen: ${target}`}</div>}
    </>
  );
}

function RowView({ row, screen }: { row: PipelineRow; screen: ScreenTarget }) {
  switch (row.kind) {
    case "core":
      return (
        <div className={tw("text-text-secondary")}>
          <span>{row.label}</span>
          {row.note && <span className={tw("ml-2 text-[11px]")}>{row.note}</span>}
        </div>
      );
    case "stage":
      return <StageView row={row} />;
    case "convert":
      return (
        <div className={tw("pl-3 font-code text-[11px] text-text-secondary")}>
          {row.elided ? `stays in ${row.to}` : `${row.from} → ${row.to}`}
        </div>
      );
    case "clamp":
      return <ClipView row={row} screen={screen} />;
    case "transform":
      return (
        <div className={tw("flex flex-wrap gap-x-2.5 text-text-secondary")}>
          <span>{`Transform: ${row.id ?? "Built-in"}`}</span>
          {row.flags.map((f) => (
            <span key={f.flag} className={f.honoured ? undefined : tw("text-amber-400")}>
              {`${f.flag}: ${f.honoured ? "honoured" : "ignored on this version"}`}
            </span>
          ))}
        </div>
      );
    case "output":
      return <OutputView row={row} screen={screen} />;
  }
}

export function PipelineView({
  rows,
  versions,
  version,
  onVersion,
  photoVersion = null,
  screen = { space: "srgb", profile: null },
  popped = false,
}: {
  rows: readonly PipelineRow[];
  versions: readonly ProcessVersion[];
  version: ProcessVersion;
  onVersion: (version: ProcessVersion) => void;
  /** The open photo's version; null with no photo open. */
  photoVersion?: ProcessVersion | null;
  screen?: ScreenTarget;
  /** In the popped-out Developer Tools window, which has no photo open though
   *  the main window may. */
  popped?: boolean;
}) {
  const items = React.useMemo(() => itemsOf(rows), [rows]);
  const photoNote = photoVersion
    ? `Open photo: v${photoVersion}`
    : popped
      ? "Dock Developer Tools to see the open photo."
      : "No photo open";
  return (
    <div className={tw("flex h-full flex-col")}>
      <div className={tw("flex shrink-0 items-center gap-1.5 border-b border-border-subtle px-2 py-1.5")}>
        <span className={tw("text-text-muted")}>Process version</span>
        {versions.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onVersion(v)}
            aria-pressed={v === version}
            className={cx(
              tw("rounded px-1.5 py-0.5"),
              v === version ? tw("bg-surface-3 text-text-primary") : tw("text-text-muted hover:text-text-secondary"),
            )}
          >
            v{v}
          </button>
        ))}
        <span className={tw("ml-auto text-text-muted")}>{photoNote}</span>
      </div>
      <ol aria-label="Pipeline" className={tw("min-h-0 flex-1 overflow-y-auto")}>
        {items.map(({ head, under }, i) => (
          <li key={i} className={tw("border-b border-border-subtle/50 px-2 py-1")}>
            <RowView row={head} screen={screen} />
            {under.length > 0 && (
              <ul className={tw("mt-0.5 space-y-px pl-3 text-[11px]")}>
                {under.map((row, j) => (
                  <li key={j}>
                    <RowView row={row} screen={screen} />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** The program for the open photo (the current defaults with none open), read
 *  through core's pipeline hooks. */
export function PipelineTab() {
  const pipeline = api.devtools?.pipeline;
  if (!pipeline) return <Unavailable />;
  return <LivePipeline pipeline={pipeline} />;
}

function LivePipeline({ pipeline }: { pipeline: DevtoolsAPI["pipeline"] }) {
  const { photoId, version: photoVersion } = pipeline.useOpenVersion();
  // A pick holds for the photo and version it was made on, and is forgotten
  // once either is left: opening another photo, or updating this one's
  // processing, shows that photo's own version, and so does coming back to it.
  const [pick, setPick] = React.useState<{ version: ProcessVersion; on: string } | null>(null);
  const on = `${photoId}:${photoVersion}`;
  if (pick && pick.on !== on) setPick(null);
  const version = pick?.on === on ? pick.version : photoVersion;
  const rows = pipeline.useRows(version);
  const screen = pipeline.useScreen();

  return (
    <PipelineView
      rows={rows}
      versions={pipeline.versions}
      version={version}
      onVersion={(v) => setPick({ version: v, on })}
      photoVersion={photoId ? photoVersion : null}
      screen={screen}
      popped={isDevtoolsWindow()}
    />
  );
}
