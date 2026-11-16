// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// The Dev module's footer: extension and stage counts, the last live frame's
// request-to-answer time, and how old the live data is.

import { React } from "../rt";
import { tw } from "../styles";
import type { LiveSource } from "./relay";
import { useLive, useModel } from "./sources";

/** Live data younger than this reads as live rather than with its age. */
const FRESH_MS = 3000;

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export function liveAge(source: LiveSource | null, now: number): string {
  if (!source) return "Open Develop, or pop out Dev, to see what runs";
  const age = now - source.live.at;
  if (age < FRESH_MS) return `live from ${source.window}`;
  const s = Math.round(age / 1000);
  return s < 120 ? `${s} s ago` : `${Math.round(s / 60)} min ago`;
}

function useNow(everyMs: number): number {
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), everyMs);
    return () => clearInterval(timer);
  }, [everyMs]);
  return now;
}

export function DevStatusBar() {
  const { stats } = useModel();
  const source = useLive();
  const now = Math.max(useNow(1000), source?.live.at ?? 0);
  const frameMs = source?.live.frameMs ?? null;
  const { extensions: e, stages: s } = stats;
  return (
    <div className={tw("flex min-w-0 items-center gap-4 text-[11px] text-text-secondary")}>
      <span>
        Extensions: {e.running} running · {e.failed} failed · {e.off} off
      </span>
      <span>
        Stages: {s.running} running · {s.notBuilt} not built · {plural(s.problems, "problem")}
      </span>
      {frameMs !== null && <span>Frame {Math.round(frameMs)} ms</span>}
      <span className={tw("truncate")}>{liveAge(source, now)}</span>
    </div>
  );
}
