// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// The processing phases in the order the develop program runs them: core's
// PROCESSING_PHASE_ORDER, which the extension API doesn't hand out. A stage
// whose phase this build doesn't know goes in a lane of its own.

import type { ProcessingPhase } from "../safelight";

export const PROCESSING_PHASE_ORDER: readonly ProcessingPhase[] = [
  "geometry",
  "decode",
  "noise-reduction",
  "scene-linear",
  "tone-map",
  "display-adjust",
  "effects",
  "output-encode",
];

/** A swimlane: a phase, or "other" for a phase newer than this extension. */
export type LaneId = ProcessingPhase | "other";

export const LANE_ORDER: readonly LaneId[] = [...PROCESSING_PHASE_ORDER, "other"];

export const LANE_LABEL: Readonly<Record<LaneId, string>> = {
  geometry: "Geometry",
  decode: "Decode",
  "noise-reduction": "Noise reduction",
  "scene-linear": "Scene-linear",
  "tone-map": "Tone map",
  "display-adjust": "Display adjust",
  effects: "Effects",
  "output-encode": "Output encode",
  other: "Other",
};

const KNOWN: ReadonlySet<string> = new Set(PROCESSING_PHASE_ORDER);

function isPhase(phase: string): phase is ProcessingPhase {
  return KNOWN.has(phase);
}

export function laneOf(phase: string): LaneId {
  return isPhase(phase) ? phase : "other";
}

export function laneIndex(lane: LaneId): number {
  return LANE_ORDER.indexOf(lane);
}
