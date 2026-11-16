// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// The Dev view's own state, shared by the module and its panels in a window:
// the selection, the toolbar's toggles and search, the bands the user has
// collapsed or expanded, and where the graph sits in the viewport.

import type { StoreApi, UseBoundStore } from "zustand";
import { api } from "../rt";
import type { Selection } from "./model";
import type { View } from "./view-math";

export interface DevViewState {
  selection: Selection;
  /** The band whose registration edges show: the band of the last node or
   *  port selected, kept while an edge or a core port is selected. */
  registrationBand: string | null;
  showAll: boolean;
  showEmpty: boolean;
  search: string;
  /** Band id → collapsed, for the bands the user has toggled. */
  collapsed: Readonly<Record<string, boolean>>;
  view: View;
  /** Bumped to ask the graph view to fit. */
  fitRequest: number;
  /** A node to bring into view; `n` tells repeat requests apart. */
  focus: { id: string; n: number } | null;
  /** Select; clearing the selection drops the registration band too. */
  select(selection: Selection): void;
  setRegistrationBand(bandId: string | null): void;
  setSearch(search: string): void;
  toggleShowAll(): void;
  setShowAll(showAll: boolean): void;
  toggleShowEmpty(): void;
  setCollapsed(bandIds: readonly string[], collapsed: boolean): void;
  setView(view: View): void;
  requestFit(): void;
  focusOn(id: string): void;
}

type Data = Pick<
  DevViewState,
  "selection" | "registrationBand" | "showAll" | "showEmpty" | "search" | "collapsed" | "view" | "fitRequest" | "focus"
>;

const initial = (): Data => ({
  selection: null,
  registrationBand: null,
  showAll: false,
  showEmpty: false,
  search: "",
  collapsed: {},
  view: { x: 24, y: 24, k: 1 },
  fitRequest: 0,
  focus: null,
});

let store: UseBoundStore<StoreApi<DevViewState>> | null = null;

/** The view state, made with the app's zustand on first use. */
export function devView(): UseBoundStore<StoreApi<DevViewState>> {
  store ??= api.stores.create<DevViewState>()((set) => ({
    ...initial(),
    select: (selection) => set(selection === null ? { selection, registrationBand: null } : { selection }),
    setRegistrationBand: (registrationBand) => set({ registrationBand }),
    setSearch: (search) => set({ search }),
    toggleShowAll: () => set((s) => ({ showAll: !s.showAll })),
    setShowAll: (showAll) => set({ showAll }),
    toggleShowEmpty: () => set((s) => ({ showEmpty: !s.showEmpty })),
    setCollapsed: (bandIds, collapsed) =>
      set((s) => ({ collapsed: { ...s.collapsed, ...Object.fromEntries(bandIds.map((id) => [id, collapsed])) } })),
    setView: (view) => set({ view }),
    requestFit: () => set((s) => ({ fitRequest: s.fitRequest + 1 })),
    focusOn: (id) => set((s) => ({ focus: { id, n: (s.focus?.n ?? 0) + 1 } })),
  }));
  return store;
}

/** Back to a fresh view: nothing selected, defaults, unpanned. */
export function resetDevView(): void {
  store?.setState(initial());
}
