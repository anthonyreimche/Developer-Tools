// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// Developer Tools panel: a tabbed in-app inspector, opened from the View menu
// or Ctrl+Alt+I. Tabs: Console, Issues, System, Storage, Variables, Pipeline,
// Native. In the popped-out window it fills the window under its own title bar.

import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import { detachDevtools, isDevtoolsWindow, reattachDevtools } from "./detach";
import { formatArg } from "./format-arg";
import { clearLog, devLog, pushEntry, type LogEntry, type LogLevel } from "./log-capture";
import { PipelineTab } from "./PipelineTab";
import { React, api } from "./rt";
import type { ProcessMetric } from "./safelight";
import { cx, tw } from "./styles";
import { VariablesTab } from "./VariablesTab";

type Tab = "Console" | "Issues" | "System" | "Storage" | "Variables" | "Pipeline" | "Native";
const TABS: Tab[] = ["Console", "Issues", "System", "Storage", "Variables", "Pipeline", "Native"];

const LEVEL_STYLE: Record<LogLevel, string> = {
  log: tw("text-text-primary"),
  info: tw("text-sky-400"),
  debug: tw("text-text-muted"),
  warn: tw("text-amber-400"),
  error: tw("text-red-400"),
  exception: tw("text-red-400"),
  input: tw("text-accent"),
  result: tw("text-emerald-400"),
};
const LEVEL_GLYPH: Record<LogLevel, string> = {
  log: "",
  info: "ⓘ",
  debug: "",
  warn: "▲",
  error: "✕",
  exception: "✕",
  input: "›",
  result: "‹",
};

const isIssue = (e: LogEntry): boolean => e.level === "warn" || e.level === "error" || e.level === "exception";

/** The registered panel: the docked inspector, or the whole popped-out window. */
export function DevTools() {
  return isDevtoolsWindow() ? <DevToolsWindow /> : <DevToolsPanel />;
}

export function DevToolsPanel({ fill = false }: { fill?: boolean } = {}) {
  const [tab, setTab] = React.useState<Tab>("Console");
  const entries = devLog()((s) => s.entries);
  const issueCount = React.useMemo(() => entries.filter(isIssue).length, [entries]);
  const inWindow = isDevtoolsWindow();

  return (
    <div className={cx(tw("flex flex-col text-[11px]"), fill ? tw("h-full") : tw("h-[420px]"))}>
      <div className={tw("flex shrink-0 items-center gap-0.5 border-b border-border-subtle bg-surface-2 px-1")}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cx(
              tw("relative px-2.5 py-1.5 tracking-wide transition-colors"),
              tab === t ? tw("text-text-primary") : tw("text-text-muted hover:text-text-secondary"),
            )}
          >
            {t}
            {t === "Issues" && issueCount > 0 && (
              <span className={tw("ml-1 rounded-full bg-red-500/80 px-1 text-[9px] text-white")}>
                {issueCount > 999 ? "999+" : issueCount}
              </span>
            )}
            {tab === t && <span className={tw("absolute inset-x-1.5 -bottom-px h-0.5 rounded bg-accent")} />}
          </button>
        ))}
        <div className={tw("flex-1")} />
        {!inWindow && (
          <button
            onClick={detachDevtools}
            title="Open in a separate window"
            className={tw(
              "mr-1 rounded px-1.5 py-0.5 text-[12px] leading-none text-text-muted hover:bg-surface-3 hover:text-text-primary",
            )}
          >
            ⧉
          </button>
        )}
      </div>

      <div className={tw("min-h-0 flex-1")}>
        {tab === "Console" && <ConsoleTab entries={entries} />}
        {tab === "Issues" && <ConsoleTab entries={entries} issuesOnly />}
        {tab === "System" && <SystemTab />}
        {tab === "Storage" && <StorageTab />}
        {tab === "Variables" && <VariablesTab />}
        {tab === "Pipeline" && <PipelineTab />}
        {tab === "Native" && <NativeTab />}
      </div>
    </div>
  );
}

// csstype predates the -webkit-app-region property.
type AppRegionStyle = CSSProperties & { WebkitAppRegion?: "drag" | "no-drag" };

/** The title bar drags the window and leaves room for the OS-drawn controls:
 *  traffic lights on the left (macOS), the min/max/close overlay on the right. */
function dragBarStyle(platform: string | undefined): AppRegionStyle {
  return {
    WebkitAppRegion: "drag",
    ...(platform === "darwin" ? { paddingLeft: 78 } : { paddingRight: 138 }),
  };
}
const noDragStyle: AppRegionStyle = { WebkitAppRegion: "no-drag" };

/** Full-window host in the popped-out Developer Tools window. */
export function DevToolsWindow() {
  api.titleBar.useOverlay("--color-surface-2");
  React.useEffect(() => {
    document.title = "SafeLight — Developer Tools";
  }, []);
  return (
    <div className={tw("flex h-screen flex-col bg-surface-1 text-text-primary")}>
      <div
        className={tw("flex h-[38px] shrink-0 items-center justify-between border-b border-border bg-surface-2 px-3")}
        style={dragBarStyle(api.devtools?.native?.platform)}
      >
        <span className={tw("text-[11px] uppercase tracking-widest text-text-secondary")}>Developer Tools</span>
        <button
          onClick={reattachDevtools}
          title="Close and re-dock in the main window"
          style={noDragStyle}
          className={tw(
            "rounded px-2 py-0.5 text-[11px] text-text-muted hover:bg-surface-3 hover:text-text-primary",
          )}
        >
          ⧉ Re-dock
        </button>
      </div>
      <div className={tw("min-h-0 flex-1")}>
        <DevToolsPanel fill />
      </div>
    </div>
  );
}

// ─── Console / Issues ───────────────────────────────────────────────────────

const ALL_LEVELS: LogLevel[] = ["log", "info", "warn", "error", "debug"];

/** The Console tab, or with `issuesOnly` the Issues tab, over `entries`. */
export function ConsoleTab({ entries, issuesOnly = false }: { entries: LogEntry[]; issuesOnly?: boolean }) {
  const [filter, setFilter] = React.useState("");
  const [levels, setLevels] = React.useState<Set<LogLevel>>(new Set(ALL_LEVELS));
  const [autoscroll, setAutoscroll] = React.useState(true);
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const shown = React.useMemo(() => {
    const q = filter.trim().toLowerCase();
    return entries.filter((e) => {
      if (issuesOnly) {
        if (!isIssue(e)) return false;
      } else if (!levels.has(e.level) && e.level !== "exception" && e.level !== "input" && e.level !== "result") {
        return false;
      }
      if (q && !e.parts.join(" ").toLowerCase().includes(q)) return false;
      return true;
    });
  }, [entries, filter, levels, issuesOnly]);

  // Key on the newest entry's identity, not the count: once the buffer hits
  // its cap the length holds steady while ids keep rolling over.
  const newest = shown[shown.length - 1]?.id;
  React.useEffect(() => {
    if (autoscroll && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [shown.length, newest, autoscroll]);

  const toggleLevel = (l: LogLevel) =>
    setLevels((prev) => {
      const next = new Set(prev);
      if (next.has(l)) next.delete(l);
      else next.add(l);
      return next;
    });

  return (
    <div className={tw("flex h-full flex-col")}>
      <div className={tw("flex shrink-0 flex-wrap items-center gap-1.5 border-b border-border-subtle px-2 py-1.5")}>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter…"
          spellCheck={false}
          className={tw(
            "min-w-0 flex-1 rounded bg-surface-2 px-2 py-1 text-text-primary outline-none placeholder:text-text-muted focus:bg-surface-3",
          )}
        />
        {!issuesOnly &&
          ALL_LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => toggleLevel(l)}
              title={`Toggle ${l}`}
              className={cx(
                tw("rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wide"),
                levels.has(l) ? cx(tw("bg-surface-3"), LEVEL_STYLE[l]) : tw("bg-surface-1 text-text-muted opacity-50"),
              )}
            >
              {l}
            </button>
          ))}
        <button
          onClick={() => setAutoscroll((v) => !v)}
          title="Autoscroll to newest"
          className={cx(
            tw("rounded px-1.5 py-0.5 text-[12px] leading-none"),
            autoscroll ? tw("text-accent") : tw("text-text-muted"),
          )}
        >
          ↓
        </button>
        <button
          onClick={clearLog}
          title="Clear log"
          className={tw("rounded px-1.5 py-0.5 text-text-muted hover:text-text-primary")}
        >
          🗑
        </button>
      </div>

      <div ref={scrollRef} className={tw("min-h-0 flex-1 overflow-y-auto font-code")}>
        {shown.length === 0 ? (
          <div className={tw("px-3 py-4 text-center text-text-muted")}>
            {issuesOnly ? "No warnings or errors." : "No console output yet."}
          </div>
        ) : (
          shown.map((e) => {
            const hasStack = !!e.stack;
            const isOpen = expanded === e.id;
            return (
              <div
                key={e.id}
                onClick={() => hasStack && setExpanded(isOpen ? null : e.id)}
                className={cx(
                  tw("flex gap-1.5 border-b border-border-subtle/50 px-2 py-1"),
                  e.level === "error" || e.level === "exception"
                    ? tw("bg-red-500/5")
                    : e.level === "warn"
                      ? tw("bg-amber-500/5")
                      : null,
                  hasStack && tw("cursor-pointer"),
                )}
              >
                <span className={cx(tw("w-3 shrink-0 text-center"), LEVEL_STYLE[e.level])}>{LEVEL_GLYPH[e.level]}</span>
                <span className={tw("shrink-0 text-text-muted")}>{clockTime(e.time)}</span>
                <div className={tw("min-w-0 flex-1")}>
                  <span className={cx(tw("whitespace-pre-wrap break-words"), LEVEL_STYLE[e.level])}>
                    {e.parts.join(" ")}
                  </span>
                  {hasStack && isOpen && (
                    <pre className={tw("mt-1 whitespace-pre-wrap break-words text-[11px] text-text-muted")}>{e.stack}</pre>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {!issuesOnly && <Repl />}
    </div>
  );
}

/** A best-effort REPL. The desktop app ships a strict CSP without
 *  'unsafe-eval', so eval() is refused there: the error shows inline, and the
 *  Native tab opens the full DevTools console. */
function Repl() {
  const [code, setCode] = React.useState("");
  const [history, setHistory] = React.useState<string[]>([]);
  const [hi, setHi] = React.useState(-1);

  const run = () => {
    const src = code.trim();
    if (!src) return;
    pushEntry("input", [src]);
    setHistory((h) => [...h, src]);
    setHi(-1);
    setCode("");
    try {
      // Indirect eval runs in global scope.
      const result: unknown = (0, eval)(src);
      pushEntry("result", [formatArg(result)]);
    } catch (err) {
      pushEntry(
        "exception",
        [err instanceof Error ? `${err.name}: ${err.message}` : formatArg(err)],
        err instanceof Error ? err.stack : undefined,
      );
    }
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      run();
    } else if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const idx = hi < 0 ? history.length - 1 : Math.max(0, hi - 1);
      setHi(idx);
      setCode(history[idx]);
    } else if (e.key === "ArrowDown" && hi >= 0) {
      e.preventDefault();
      const idx = hi + 1;
      if (idx >= history.length) {
        setHi(-1);
        setCode("");
      } else {
        setHi(idx);
        setCode(history[idx]);
      }
    }
  };

  return (
    <div className={tw("flex shrink-0 items-center gap-1.5 border-t border-border-subtle bg-surface-2 px-2 py-1")}>
      <span className={tw("text-accent")}>›</span>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={onKey}
        placeholder="Evaluate JavaScript…"
        spellCheck={false}
        autoComplete="off"
        className={tw(
          "min-w-0 flex-1 bg-transparent font-code text-text-primary outline-none placeholder:text-text-muted",
        )}
      />
    </div>
  );
}

// ─── System ─────────────────────────────────────────────────────────────────

interface SysRow {
  label: string;
  value: string;
}

const SECTION_LABEL = tw("text-[10px] uppercase tracking-widest text-text-muted");
const SECTION_HEADER = tw(
  "border-b border-t border-border-subtle px-2 py-1.5 text-[10px] uppercase tracking-widest text-text-muted",
);

function SystemTab() {
  const [rows, setRows] = React.useState<SysRow[]>([]);
  const [gpu, setGpu] = React.useState<Record<string, string> | null>(null);

  const collect = React.useCallback(async () => {
    const devtools = api.devtools;
    const native = devtools?.native;
    const out: SysRow[] = [];

    const appVersion = devtools ? await devtools.appVersion() : "";
    out.push({ label: "App version", value: appVersion || "unknown" });
    out.push({
      label: "Runtime",
      value: native
        ? `Electron ${native.versions.electron} · Chromium ${native.versions.chrome}`
        : "Browser (no Electron bridge)",
    });
    out.push({ label: "Platform", value: native?.platform ?? navigator.platform });
    out.push({ label: "User agent", value: navigator.userAgent });
    out.push({ label: "Language", value: navigator.language });
    const isolated = window.crossOriginIsolated === true;
    out.push({
      label: "Cross-origin isolated",
      value: String(isolated) + (isolated ? " (SharedArrayBuffer OK)" : " — RAW decode degraded"),
    });
    out.push({ label: "Hardware threads", value: String(navigator.hardwareConcurrency ?? "?") });
    out.push({
      label: "Screen",
      value: `${screen.width}×${screen.height} · DPR ${window.devicePixelRatio} · ${window.innerWidth}×${window.innerHeight} viewport`,
    });

    const gl = devtools?.webglInfo() ?? null;
    if (gl) {
      out.push({ label: "WebGL vendor", value: gl.vendor });
      out.push({ label: "WebGL renderer", value: gl.renderer });
      out.push({ label: "GLSL version", value: gl.glsl });
      out.push({ label: "Max texture size", value: String(gl.maxTexture) });
    } else {
      out.push({ label: "WebGL", value: "unavailable" });
    }

    const mem = (performance as { memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
    if (mem) {
      out.push({ label: "JS heap", value: `${mb(mem.usedJSHeapSize)} / ${mb(mem.jsHeapSizeLimit)} limit` });
    }
    out.push({ label: "localStorage keys", value: String(localStorage.length) });

    setRows(out);

    if (native?.gpuInfo) {
      try {
        setGpu(await native.gpuInfo());
      } catch {
        setGpu(null);
      }
    }
  }, []);

  React.useEffect(() => {
    void collect();
  }, [collect]);

  return (
    <div className={tw("h-full overflow-y-auto")}>
      <div className={tw("flex items-center justify-between border-b border-border-subtle px-2 py-1.5")}>
        <span className={SECTION_LABEL}>Environment</span>
        <button
          onClick={() => void collect()}
          className={tw("rounded px-1.5 py-0.5 text-text-muted hover:text-text-primary")}
        >
          ↻ Refresh
        </button>
      </div>
      <table className={tw("w-full")}>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className={tw("border-b border-border-subtle/50 align-top")}>
              <td className={tw("w-36 shrink-0 px-2 py-1 text-text-secondary")}>{r.label}</td>
              <td className={tw("px-2 py-1 font-code text-text-primary")}>
                <span className={tw("break-all")}>{r.value}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {gpu && (
        <>
          <div className={SECTION_HEADER}>GPU feature status</div>
          <table className={tw("w-full")}>
            <tbody>
              {Object.entries(gpu).map(([k, v]) => (
                <tr key={k} className={tw("border-b border-border-subtle/50")}>
                  <td className={tw("w-36 px-2 py-1 text-text-secondary")}>{k}</td>
                  <td
                    className={cx(
                      tw("px-2 py-1 font-code"),
                      /software|disabled|unavailable/i.test(v) ? tw("text-amber-400") : tw("text-emerald-400"),
                    )}
                  >
                    {v}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

// ─── Storage ────────────────────────────────────────────────────────────────

function StorageTab() {
  const [keys, setKeys] = React.useState<string[]>([]);
  const [sel, setSel] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState("");
  const [saveError, setSaveError] = React.useState<string | null>(null);

  const refresh = React.useCallback(() => {
    const all: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) all.push(k);
    }
    all.sort();
    setKeys(all);
  }, []);

  React.useEffect(refresh, [refresh]);

  const select = (k: string) => {
    setSel(k);
    setDraft(localStorage.getItem(k) ?? "");
    setSaveError(null);
  };
  const save = () => {
    if (sel == null) return;
    try {
      localStorage.setItem(sel, draft);
      setSaveError(null);
      refresh();
    } catch (e) {
      setSaveError(`Save failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  };
  const remove = (k: string) => {
    localStorage.removeItem(k);
    if (sel === k) setSel(null);
    refresh();
  };

  return (
    <div className={tw("flex h-full flex-col")}>
      <div className={tw("flex shrink-0 items-center justify-between border-b border-border-subtle px-2 py-1.5")}>
        <span className={SECTION_LABEL}>localStorage · {keys.length} keys</span>
        <button onClick={refresh} className={tw("rounded px-1.5 py-0.5 text-text-muted hover:text-text-primary")}>
          ↻
        </button>
      </div>
      <div className={tw("flex min-h-0 flex-1")}>
        <div className={tw("w-1/2 shrink-0 overflow-y-auto border-r border-border-subtle")}>
          {keys.map((k) => (
            <div
              key={k}
              onClick={() => select(k)}
              className={cx(
                tw("group flex items-center justify-between gap-1 px-2 py-1"),
                sel === k ? tw("bg-surface-3") : tw("hover:bg-surface-2"),
              )}
            >
              <span
                className={cx(
                  tw("min-w-0 flex-1 cursor-pointer truncate font-code"),
                  k.startsWith("sl_") ? tw("text-text-primary") : tw("text-text-muted"),
                )}
                title={k}
              >
                {k}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  remove(k);
                }}
                title="Delete key"
                className={tw("shrink-0 px-1 text-text-muted opacity-0 hover:text-red-400 group-hover:opacity-100")}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className={tw("flex min-w-0 flex-1 flex-col p-2")}>
          {sel == null ? (
            <div className={tw("m-auto text-text-muted")}>Select a key to inspect.</div>
          ) : (
            <>
              <div className={tw("mb-1 truncate font-code text-text-secondary")} title={sel}>
                {sel}
              </div>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                spellCheck={false}
                className={tw(
                  "min-h-0 flex-1 resize-none rounded bg-surface-2 p-2 font-code text-[11px] text-text-primary outline-none focus:bg-surface-3",
                )}
              />
              <div className={tw("mt-1.5 flex items-center justify-end gap-1.5")}>
                {saveError && <span className={tw("mr-auto text-red-400")}>{saveError}</span>}
                <button
                  onClick={() => void navigator.clipboard?.writeText(draft)}
                  className={tw("rounded bg-surface-3 px-2 py-1 text-text-secondary hover:text-text-primary")}
                >
                  Copy
                </button>
                <button
                  onClick={save}
                  className={tw("rounded bg-slider-fill px-2 py-1 font-medium text-white hover:opacity-80")}
                >
                  Save
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Native (Electron) ──────────────────────────────────────────────────────

function NativeButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={tw("rounded bg-surface-3 px-2.5 py-1 text-text-secondary hover:bg-surface-4 hover:text-text-primary")}
    >
      {children}
    </button>
  );
}

const METRIC_HEAD = tw("px-2 py-1 text-right font-normal");
const METRIC_CELL = tw("px-2 py-1 text-right text-text-secondary");

function NativeTab() {
  const dt = api.devtools?.electron;
  const native = api.devtools?.native;
  const [metrics, setMetrics] = React.useState<ProcessMetric[] | null>(null);
  const [note, setNote] = React.useState<string | null>(null);

  const loadMetrics = React.useCallback(async () => {
    if (!native?.metrics) return;
    try {
      setMetrics(await native.metrics());
    } catch {
      setMetrics(null);
    }
  }, [native]);

  React.useEffect(() => {
    void loadMetrics();
  }, [loadMetrics]);

  if (!dt && !native) {
    return (
      <div className={tw("flex h-full items-center justify-center px-6 text-center text-text-muted")}>
        Native tools require the SafeLight desktop app. In a browser, use your browser's own DevTools (F12).
      </div>
    );
  }

  const act = async (fn: () => Promise<void>, label: string) => {
    try {
      await fn();
      setNote(null);
    } catch (e) {
      setNote(`${label} failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <div className={tw("flex h-full flex-col overflow-y-auto")}>
      <div className={tw("border-b border-border-subtle px-2 py-1.5 text-[10px] uppercase tracking-widest text-text-muted")}>
        Chrome DevTools
      </div>
      <div className={tw("flex flex-wrap gap-1.5 p-2")}>
        {dt ? (
          <>
            <NativeButton onClick={() => void act(() => dt.open("detach"), "Open DevTools")}>Open ⧉</NativeButton>
            <NativeButton onClick={() => void act(() => dt.open("bottom"), "Dock bottom")}>Dock ▾</NativeButton>
            <NativeButton onClick={() => void act(() => dt.toggle(), "Toggle")}>Toggle</NativeButton>
            <NativeButton onClick={() => void act(() => dt.close(), "Close")}>Close</NativeButton>
          </>
        ) : (
          <span className={tw("text-text-muted")}>DevTools control unavailable (older desktop build).</span>
        )}
      </div>

      <div className={SECTION_HEADER}>Renderer</div>
      <div className={tw("flex flex-wrap gap-1.5 p-2")}>
        <NativeButton onClick={() => (dt ? void act(() => dt.reload(false), "Reload") : location.reload())}>
          Reload
        </NativeButton>
        {dt && <NativeButton onClick={() => void act(() => dt.reload(true), "Hard reload")}>Hard reload</NativeButton>}
      </div>

      <div className={tw("flex items-center justify-between border-b border-t border-border-subtle px-2 py-1.5")}>
        <span className={SECTION_LABEL}>Process metrics</span>
        <button
          onClick={() => void loadMetrics()}
          title="Refresh metrics"
          className={tw("rounded px-1.5 py-0.5 text-text-muted hover:text-text-primary")}
        >
          ↻
        </button>
      </div>
      {metrics ? (
        <table className={tw("w-full font-code")}>
          <thead>
            <tr className={tw("text-text-muted")}>
              <th className={tw("px-2 py-1 text-left font-normal")}>Process</th>
              <th className={METRIC_HEAD}>PID</th>
              <th className={METRIC_HEAD}>CPU %</th>
              <th className={METRIC_HEAD}>Memory</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.pid} className={tw("border-t border-border-subtle/50")}>
                <td className={tw("px-2 py-1 text-text-primary")}>{m.type}</td>
                <td className={METRIC_CELL}>{m.pid}</td>
                <td className={METRIC_CELL}>{m.cpuPercent.toFixed(1)}</td>
                <td className={METRIC_CELL}>{m.memoryMB.toFixed(0)} MB</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className={tw("px-2 py-2 text-text-muted")}>Metrics unavailable (older desktop build).</div>
      )}

      {note && <div className={tw("px-2 py-2 text-amber-400")}>{note}</div>}
    </div>
  );
}

// ─── helpers ────────────────────────────────────────────────────────────────

function clockTime(ms: number): string {
  const d = new Date(ms);
  const p = (n: number, w = 2) => String(n).padStart(w, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}.${p(d.getMilliseconds(), 3)}`;
}

const mb = (bytes: number) => `${(bytes / 1048576).toFixed(1)} MB`;
