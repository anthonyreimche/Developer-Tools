// A one-window stand-in for core's shared-variable registry, with the rule the
// Variables tab shows: a set() is refused as stale when another writer changed
// the variable after the latest revision the writing extension saw (through
// register, get, or its own write). Every change bumps the change count.

import type {
  SharedVariablesAPI,
  VariableHistoryItem,
  VariableInspection,
  VariableInspector,
  VariableSnapshot,
  VariableWriteResult,
  VariableWriter,
} from "../../src/safelight";

export interface FakeScope extends SharedVariablesAPI {
  register<T>(name: string, init: { initial: T; description?: string }): VariableSnapshot<T>;
  subscribe(name: string): void;
}

export interface FakeVariables extends VariableInspector {
  scoped(extension: string): FakeScope;
}

interface Entry {
  snapshot: VariableSnapshot<unknown>;
  history: VariableHistoryItem[];
  subscribers: string[];
}

export function fakeVariables(windowId = "w1"): FakeVariables {
  const entries = new Map<string, Entry>();
  const seen = new Map<string, number>();
  const listeners = new Set<() => void>();
  let changes = 0;
  let clock = 1_700_000_000_000;

  const changed = () => {
    changes++;
    for (const l of listeners) l();
  };
  const seenKey = (extension: string, name: string) => `${extension}\u0000${name}`;
  const writer = (extension: string): VariableWriter => ({ extension, window: windowId });

  function scoped(extension: string): FakeScope {
    const see = (e: Entry) => seen.set(seenKey(extension, e.snapshot.name), e.snapshot.revision.n);
    return {
      register<T>(name: string, init: { initial: T; description?: string }): VariableSnapshot<T> {
        let e = entries.get(name);
        if (!e) {
          const by = writer(extension);
          e = {
            snapshot: {
              name,
              value: init.initial,
              revision: { n: 0, window: windowId },
              writer: by,
              registeredBy: by,
              description: init.description,
            },
            history: [],
            subscribers: [],
          };
          entries.set(name, e);
          changed();
        }
        see(e);
        return e.snapshot as VariableSnapshot<T>;
      },
      get<T>(name: string): VariableSnapshot<T> | undefined {
        const e = entries.get(name);
        if (e) see(e);
        return e?.snapshot as VariableSnapshot<T> | undefined;
      },
      set<T>(name: string, value: T): VariableWriteResult<T> {
        const e = entries.get(name);
        if (!e) return { ok: false, reason: "unregistered" };
        const current = e.snapshot;
        if (seen.get(seenKey(extension, name)) !== current.revision.n) {
          e.history.push({
            time: clock++,
            writer: writer(extension),
            revision: current.revision,
            outcome: "stale",
            other: current.writer,
          });
          changed();
          return { ok: false, reason: "stale", current: current as VariableSnapshot<T> };
        }
        const revision = { n: current.revision.n + 1, window: windowId };
        e.snapshot = { ...current, value, revision, writer: writer(extension) };
        e.history.push({ time: clock++, writer: writer(extension), revision, outcome: "accepted" });
        see(e);
        changed();
        return { ok: true, revision };
      },
      subscribe(name: string): void {
        entries.get(name)?.subscribers.push(extension);
        changed();
      },
    };
  }

  return {
    scoped,
    inspect: (): VariableInspection[] =>
      [...entries.values()].map((e) => ({
        snapshot: e.snapshot,
        size: JSON.stringify(e.snapshot.value).length,
        history: [...e.history],
        subscribers: [...e.subscribers],
      })),
    subscribeChanges: (listener) => {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
    changeCount: () => changes,
    windowName: (id) => (id === windowId ? "this window" : id.slice(0, 4)),
  };
}
