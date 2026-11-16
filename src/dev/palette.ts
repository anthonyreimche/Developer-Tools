// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// Colours the graph draws with that the theme has no token for: one hue per
// extension, hashed from its id so it holds across sessions and windows, and
// the failure and problem colours. Extension hues stay out of the red-to-amber
// range the statuses use. Text never takes these colours; the theme's text
// tokens sit on top of them, so they read on dark and light themes alike.

import type { UiTokens } from "../safelight";
import { STATUS_AMBER, STATUS_RED } from "../styles";
import type { Tone } from "./status";

const HUE_FROM = 110;
const HUE_SPAN = 240;

/** FNV-1a over the id, folded into the hues clear of the status colours. */
export function extensionHue(id: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return HUE_FROM + ((h >>> 0) % HUE_SPAN);
}

/** The extension's colour: the accent for Safelight's own band. */
export function extensionColour(id: string, tokens: UiTokens): string {
  return id === "core" ? tokens.accent : `oklch(64% 0.13 ${extensionHue(id)})`;
}

/** What a tone draws in: the status colour, or `base` where the status has
 *  none of its own. */
export function toneColour(tone: Tone, base: string): string {
  if (tone === "failure") return STATUS_RED;
  if (tone === "problem") return STATUS_AMBER;
  return base;
}

/** `colour` laid thinly over a theme surface, for a band or node header. */
export function tint(colour: string, surface: string, percent: number): string {
  return `color-mix(in oklab, ${colour} ${percent}%, ${surface})`;
}
