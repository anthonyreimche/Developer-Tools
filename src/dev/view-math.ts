// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// Pan, zoom and fit for the graph view. The graph is drawn in its own pixels
// and shown through `translate(x, y) scale(k)`.

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

/** The graph's placement in the viewport: its origin's offset and its scale. */
export interface View {
  x: number;
  y: number;
  k: number;
}

export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 3;

const clampZoom = (k: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, k));

/** Scale by `factor` about `p` (viewport pixels), so the graph point under it
 *  stays under it. */
export function zoomAt(view: View, p: Point, factor: number): View {
  const k = clampZoom(view.k * factor);
  const r = k / view.k;
  return { x: p.x - (p.x - view.x) * r, y: p.y - (p.y - view.y) * r, k };
}

/** A wheel event's zoom factor: lines and pages read as pixels. */
export function wheelFactor(deltaY: number, deltaMode: number): number {
  const px = deltaMode === 1 ? deltaY * 16 : deltaMode === 2 ? deltaY * 400 : deltaY;
  return Math.exp(-px * 0.002);
}

/** The whole graph centred in the viewport with a small margin, never
 *  enlarged past 1:1. */
export function fitView(content: Size, viewport: Size): View {
  const k = clampZoom(Math.min(1, Math.min(viewport.width / content.width, viewport.height / content.height) * 0.95));
  return { x: (viewport.width - content.width * k) / 2, y: (viewport.height - content.height * k) / 2, k };
}

/** The smallest zoom the graph opens at: its labels stay legible there. */
export const READABLE_ZOOM = 1;
const OPENING_MARGIN = 16;

/** The view the graph opens with: fitted when that keeps it at a readable
 *  zoom, else at that zoom from its top-left corner, to pan from. Fit (the
 *  button, a double-click) still shows the whole of it. */
export function openingView(content: Size, viewport: Size): View {
  const fitted = fitView(content, viewport);
  return fitted.k >= READABLE_ZOOM ? fitted : { x: OPENING_MARGIN, y: OPENING_MARGIN, k: READABLE_ZOOM };
}

/** The view that puts graph point `p` at the viewport's centre at scale k. */
export function centreOn(p: Point, viewport: Size, k: number): View {
  return { x: viewport.width / 2 - p.x * k, y: viewport.height / 2 - p.y * k, k };
}
