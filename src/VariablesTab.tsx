// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// Developer Tools ▸ Variables: every shared variable this window holds, with
// its writers, subscribers, value and recent history, plus an editor that
// writes through this extension's own api.variables, under the same
// stale-write rule as any extension.

import { React, api } from "./rt";
import type {
  SharedVariablesAPI,
  VariableHistoryItem,
  VariableInspection,
  VariableInspector,
  VariableWriter,
} from "./safelight";
import { cx, tw } from "./styles";
import { Unavailable } from "./Unavailable";

/** Characters of a value's JSON shown before it is cut off. */
const VALUE_DISPLAY_LIMIT = 200_000;

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1048576).toFixed(1)} MB`;
}

function writerName(inspector: VariableInspector, w: VariableWriter): string {
  return `${w.extension} (${inspector.windowName(w.window)})`;
}

export function VariablesTab() {
  const inspector = api.devtools?.variables;
  if (!inspector) return <Unavailable />;
  return <VariablesView inspector={inspector} variables={api.variables} />;
}

function VariablesView({ inspector, variables }: { inspector: VariableInspector; variables: SharedVariablesAPI }) {
  const count = React.useSyncExternalStore(inspector.subscribeChanges, inspector.changeCount);
  // `count` is the store's version: a new one means inspect() would differ.
  const list = React.useMemo(() => inspector.inspect(), [inspector, count]);
  const [selected, setSelected] = React.useState<string | null>(null);
  const current = list.find((v) => v.snapshot.name === selected) ?? list[0] ?? null;

  if (!current)
    return (
      <div className={tw("p-3 text-text-muted")}>
        No shared variables yet. Extensions create them with api.variables.register().
      </div>
    );

  return (
    <div className={tw("flex h-full min-h-0")}>
      <ul aria-label="Variables" className={tw("w-56 shrink-0 overflow-y-auto border-r border-border-subtle")}>
        {list.map((v) => {
          const name = v.snapshot.name;
          const problems = v.history.filter((h) => h.outcome !== "accepted").length;
          const isCurrent = current.snapshot.name === name;
          return (
            <li key={name}>
              <button
                type="button"
                onClick={() => setSelected(name)}
                aria-current={isCurrent}
                className={cx(
                  tw("flex w-full flex-col px-2 py-1 text-left hover:bg-surface-3"),
                  isCurrent ? tw("bg-surface-3 text-text-primary") : tw("text-text-secondary"),
                )}
              >
                <span className={tw("flex w-full items-center gap-1")}>
                  <span className={tw("min-w-0 flex-1 truncate font-code")}>{name}</span>
                  <span className={tw("shrink-0 text-text-muted")}>
                    rev {v.snapshot.revision.n} · {formatBytes(v.size)}
                  </span>
                  {problems > 0 && (
                    <span
                      aria-label={`${problems} refused or lost`}
                      className={tw("shrink-0 rounded-full bg-amber-500/80 px-1 text-[9px] text-white")}
                    >
                      {problems}
                    </span>
                  )}
                </span>
                <span className={tw("block truncate text-text-muted")}>{writerName(inspector, v.snapshot.writer)}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <VariableDetail key={current.snapshot.name} v={current} inspector={inspector} variables={variables} />
    </div>
  );
}

const QUIET_BUTTON = tw("rounded px-1.5 py-0.5 text-text-secondary hover:bg-surface-3 hover:text-text-primary");
const TERM = tw("text-text-muted");

function VariableDetail({
  v,
  inspector,
  variables,
}: {
  v: VariableInspection;
  inspector: VariableInspector;
  variables: SharedVariablesAPI;
}) {
  const [draft, setDraft] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<string | null>(null);
  const s = v.snapshot;
  const json = React.useMemo(() => JSON.stringify(s.value, null, 2), [s.value]);
  const shown =
    json.length > VALUE_DISPLAY_LIMIT
      ? `${json.slice(0, VALUE_DISPLAY_LIMIT)}\n… cut off: ${formatBytes(json.length)} of JSON`
      : json;
  const lastWrite = [...v.history].reverse().find((h) => h.outcome === "accepted");

  const startEdit = () => {
    const now = variables.get(s.name); // what Save is checked against
    setDraft(JSON.stringify(now?.value ?? null, null, 2));
    setResult(null);
  };

  const save = () => {
    let value: unknown;
    try {
      value = JSON.parse(draft ?? "");
    } catch (err) {
      setResult(`Not valid JSON: ${err instanceof Error ? err.message : String(err)}`);
      return;
    }
    const r = variables.set(s.name, value);
    if (r.ok) {
      setDraft(null);
      setResult(`Saved as revision ${r.revision.n}.`);
    } else if (r.reason === "stale") {
      setResult(
        `${writerName(inspector, r.current.writer)} changed it since you opened the editor. Cancel and edit again to start from the new value.`,
      );
    } else if (r.reason === "invalid") {
      setResult(`Refused: ${r.message}.`);
    } else {
      setResult("Refused: nobody has registered this variable.");
    }
  };

  const outcomeText = (h: VariableHistoryItem): string => {
    switch (h.outcome) {
      case "accepted":
        return "accepted";
      case "stale":
        return `refused: hadn't seen rev ${h.revision.n}${h.other ? ` by ${writerName(inspector, h.other)}` : ""}`;
      case "invalid":
        return `refused: ${h.message ?? "not JSON data"}`;
      case "lost":
        return `lost to ${h.other ? writerName(inspector, h.other) : "another window"}`;
    }
  };

  return (
    <div className={tw("flex min-w-0 flex-1 flex-col gap-2 overflow-y-auto p-2")}>
      <dl className={tw("grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5")}>
        <dt className={TERM}>Name</dt>
        <dd className={tw("font-code")}>{s.name}</dd>
        {s.description && (
          <>
            <dt className={TERM}>Description</dt>
            <dd>{s.description}</dd>
          </>
        )}
        <dt className={TERM}>Registered by</dt>
        <dd>{writerName(inspector, s.registeredBy)}</dd>
        <dt className={TERM}>Last write</dt>
        <dd>
          {writerName(inspector, s.writer)}, revision {s.revision.n}
          {lastWrite ? `, ${new Date(lastWrite.time).toLocaleTimeString()}` : ""}
        </dd>
        <dt className={TERM}>Subscribers here</dt>
        <dd>{v.subscribers.length > 0 ? v.subscribers.join(", ") : "none"}</dd>
      </dl>

      <details open>
        <summary className={tw("cursor-pointer text-text-muted")}>Value</summary>
        <div className={tw("my-1 flex items-center gap-2")}>
          {draft === null ? (
            <button type="button" onClick={startEdit} className={QUIET_BUTTON}>
              Edit value
            </button>
          ) : (
            <>
              <button type="button" onClick={save} className={tw("rounded px-1.5 py-0.5 text-accent hover:bg-surface-3")}>
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraft(null);
                  setResult(null);
                }}
                className={QUIET_BUTTON}
              >
                Cancel
              </button>
            </>
          )}
        </div>
        {draft === null ? (
          <pre className={tw("max-h-64 overflow-auto rounded bg-surface-2 p-1.5 font-code text-[11px]")}>{shown}</pre>
        ) : (
          <textarea
            aria-label="New value (JSON)"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            spellCheck={false}
            className={tw(
              "h-40 w-full rounded border border-border-subtle bg-surface-2 p-1.5 font-code text-[11px] text-text-primary",
            )}
          />
        )}
        {result && <p className={tw("mt-1 text-text-secondary")}>{result}</p>}
      </details>

      <section>
        <div className={tw("mb-1 text-text-muted")}>History (newest first)</div>
        <table className={tw("w-full")}>
          <tbody>
            {[...v.history].reverse().map((h, i) => (
              <tr key={`${h.time}-${i}`} className={h.outcome === "accepted" ? undefined : tw("text-amber-400")}>
                <td className={tw("pr-2 align-top text-text-muted")}>{new Date(h.time).toLocaleTimeString()}</td>
                <td className={tw("pr-2 align-top")}>{writerName(inspector, h.writer)}</td>
                <td className={tw("pr-2 align-top")}>rev {h.revision.n}</td>
                <td className={tw("align-top")}>{outcomeText(h)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
