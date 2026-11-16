// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// The graph on screen: lanes, band backgrounds and the SVG edges under the
// HTML nodes, all in one layer that pan and zoom move with a CSS transform,
// so a pan re-renders none of the nodes. Dragging empty space pans and stops
// when the pointer lifts; the wheel zooms about the pointer; a double-click on
// empty space fits; Esc clears the selection. Pointer positions are read in
// the untransformed viewport's own pixels (view-math toLocal).

import type { ComponentType, CSSProperties, KeyboardEvent, MouseEvent, PointerEvent } from "react";
import { React, api } from "../rt";
import { cx, tw } from "../styles";
import {
  BAND_PORTS_W,
  NODE_HEAD_H,
  NODE_W,
  PORT_DOT,
  PORT_ROW,
  type LaidBand,
  type LaidCorePort,
  type LaidEdge,
  type LaidNode,
  type Layout,
} from "./layout";
import { CORE_NODE, type Linked, type Port, type Selection } from "./model";
import { extensionColour, tint, toneColour } from "./palette";
import type { ExtensionState, Tone } from "./status";
import { devView } from "./store";
import { holdTextSelection } from "./hold-text-selection";
import { centreOn, fitView, openingView, toLocal, wheelFactor, zoomAt, type Point, type View } from "./view-math";

/** Elements that take their own clicks: panning starts anywhere else. */
const HIT = "[data-hit], button, input";

const isHit = (target: EventTarget | null): boolean => target instanceof Element && target.closest(HIT) !== null;

interface Drag {
  pointer: number;
  start: Point;
  view: View;
  moved: boolean;
}

interface ContentProps {
  layout: Layout;
  linked: Linked | null;
  selection: Selection;
}

export function GraphView({ layout, linked, selection }: ContentProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const store = devView();
  const view = store((s) => s.view);
  const fitRequest = store((s) => s.fitRequest);
  const focus = store((s) => s.focus);
  const [panning, setPanning] = React.useState(false);
  const drag = React.useRef<Drag | null>(null);
  const layoutRef = React.useRef(layout);
  layoutRef.current = layout;
  const Content = content();

  const fit = React.useCallback((opening = false) => {
    const el = ref.current;
    if (!el || el.offsetWidth === 0 || el.offsetHeight === 0) return;
    const { width, height } = layoutRef.current;
    const place = opening ? openingView : fitView;
    devView().getState().setView(place({ width, height }, { width: el.offsetWidth, height: el.offsetHeight }));
  }, []);

  React.useEffect(() => fit(fitRequest === 0), [fit, fitRequest]);

  React.useEffect(() => {
    const el = ref.current;
    if (!focus || !el || el.offsetWidth === 0) return;
    const l = layoutRef.current;
    const rect = l.nodes.find((n) => n.id === focus.id)?.rect ?? l.bands.find((b) => b.id === focus.id)?.header;
    if (!rect) return;
    const s = devView().getState();
    const centre = { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 };
    s.setView(centreOn(centre, { width: el.offsetWidth, height: el.offsetHeight }, s.view.k));
  }, [focus]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // React's onWheel is passive, and only an active listener may stop the
    // page from scrolling.
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const s = devView().getState();
      s.setView(zoomAt(s.view, toLocal(el, e.clientX, e.clientY), wheelFactor(e.deltaY, e.deltaMode)));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const releaseSelection = React.useRef<(() => void) | null>(null);
  const letSelectionGo = () => {
    releaseSelection.current?.();
    releaseSelection.current = null;
  };
  React.useEffect(() => letSelectionGo, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || isHit(e.target)) return;
    letSelectionGo();
    releaseSelection.current = holdTextSelection();
    const el = e.currentTarget;
    drag.current = {
      pointer: e.pointerId,
      start: toLocal(el, e.clientX, e.clientY),
      view: devView().getState().view,
      moved: false,
    };
    el.setPointerCapture?.(e.pointerId);
    setPanning(true);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.pointer) return;
    const p = toLocal(e.currentTarget, e.clientX, e.clientY);
    const dx = p.x - d.start.x;
    const dy = p.y - d.start.y;
    if (Math.abs(dx) + Math.abs(dy) > 2) d.moved = true;
    devView().getState().setView({ x: d.view.x + dx, y: d.view.y + dy, k: d.view.k });
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.pointer) return;
    drag.current = null;
    letSelectionGo();
    const el = e.currentTarget;
    if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId);
    setPanning(false);
    if (!d.moved && e.type === "pointerup") devView().getState().select(null);
  };

  const onDoubleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!isHit(e.target)) fit();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") devView().getState().select(null);
  };

  return (
    <div
      ref={ref}
      data-testid="dev-viewport"
      tabIndex={0}
      aria-label="Extension graph"
      className={tw("relative h-full w-full overflow-hidden outline-none")}
      style={{ cursor: panning ? "grabbing" : undefined, touchAction: "none" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDoubleClick={onDoubleClick}
      onKeyDown={onKeyDown}
    >
      <div
        data-testid="dev-world"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transformOrigin: "0 0",
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`,
        }}
      >
        <Content layout={layout} linked={linked} selection={selection} />
      </div>
    </div>
  );
}

const SOURCE_LABEL: Readonly<Record<"builtin" | "installed" | "dev", string>> = {
  builtin: "built-in",
  installed: "installed",
  dev: "dev folder",
};

const DIM_OPACITY = 0.5;

const box = (r: { x: number; y: number; w: number; h: number }): CSSProperties => ({
  left: r.x,
  top: r.y,
  width: r.w,
  height: r.h,
});

/** A status's mark colour: its own for failures and problems, the owner's
 *  while running, and quiet theme colours otherwise. */
function markColour(tone: Tone, owner: string): string {
  const t = api.ui.tokens;
  if (tone === "running") return owner;
  if (tone === "dim") return t.textMuted;
  if (tone === "neutral") return t.border;
  return toneColour(tone, owner);
}

export function StatusBadge({ state }: { state: ExtensionState }) {
  const t = api.ui.tokens;
  const colour = markColour(state.tone, t.accent);
  return (
    <span
      className={tw("shrink-0 rounded-full px-1.5 text-[11px] text-text-primary")}
      style={{ background: tint(colour, "transparent", 28) }}
      title={state.message ?? undefined}
    >
      {state.label}
    </span>
  );
}

/** A port's dot, centred on the row's `side` edge: the port's point. */
function PortDot({ side, colour }: { side: "left" | "right"; colour: string }) {
  return (
    <span
      data-dot=""
      className={tw("absolute rounded-full")}
      style={{
        [side]: -PORT_DOT / 2,
        top: (PORT_ROW - PORT_DOT) / 2,
        width: PORT_DOT,
        height: PORT_DOT,
        background: colour,
      }}
    />
  );
}

let memoContent: ComponentType<ContentProps> | null = null;

/** GraphContent memoised, made on first use: React is the host's, bound at
 *  activation, after this module loads. Its props don't change on a pan, so a
 *  pan re-renders none of the graph. */
function content(): ComponentType<ContentProps> {
  memoContent ??= React.memo(GraphContent);
  return memoContent;
}

function GraphContent({ layout, linked, selection }: ContentProps) {
  const t = api.ui.tokens;
  const select = devView().getState().select;
  const dimmed = (id: string) => (linked ? !linked.nodes.has(id) : false);
  const portSelected = (node: string, port: string) =>
    selection?.kind === "port" && selection.node === node && selection.port === port;
  const nodeSelected = (id: string) => selection?.kind === "node" && selection.id === id;
  const last = layout.lanes[layout.lanes.length - 1];

  return (
    <div className={tw("relative text-[11px]")} style={{ width: layout.width, height: layout.height }}>
      {layout.lanes.map((lane) => (
        <div
          key={lane.id}
          className={tw("absolute")}
          style={{
            left: lane.x,
            top: 0,
            width: lane.w,
            height: layout.height,
            borderLeft: `1px dashed ${t.borderSubtle}`,
            borderRight: lane === last ? `1px dashed ${t.borderSubtle}` : undefined,
          }}
        >
          <div
            title={lane.label}
            className={tw("truncate px-2 py-2 text-[11px] uppercase tracking-widest text-text-secondary")}
            style={lane.empty && lane.w < NODE_W ? { writingMode: "vertical-rl", padding: "8px 4px", overflow: "visible" } : undefined}
          >
            {lane.label}
          </div>
        </div>
      ))}

      {layout.bands.map((b) => (
        <div
          key={b.id}
          className={tw("absolute rounded border border-border-subtle")}
          style={{
            ...box(b.rect),
            background: tint(extensionColour(b.band.extensionId, t), "transparent", 5),
            opacity: dimmed(b.id) ? DIM_OPACITY : 1,
          }}
        />
      ))}

      <svg
        width={layout.width}
        height={layout.height}
        className={tw("absolute")}
        style={{ left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}
      >
        {layout.edges.map((e) => (
          <EdgePath
            key={e.id}
            laid={e}
            dimmed={linked ? !linked.edges.has(e.id) : false}
            emphasised={linked?.edges.has(e.id) ?? false}
            selected={selection?.kind === "edge" && selection.id === e.id}
          />
        ))}
      </svg>

      <CoreNode
        layout={layout}
        dimmed={dimmed(CORE_NODE)}
        selected={nodeSelected(CORE_NODE)}
        portSelected={(p) => portSelected(CORE_NODE, p)}
      />

      {layout.bands.map((b) => (
        <BandView
          key={b.id}
          laid={b}
          dimmed={dimmed(b.id)}
          selected={nodeSelected(b.id)}
          portSelected={(p) => portSelected(b.id, p)}
        />
      ))}

      {layout.nodes.map((n) => (
        <StageView
          key={n.id}
          laid={n}
          dimmed={dimmed(n.id)}
          selected={nodeSelected(n.id)}
          portSelected={(p) => portSelected(n.id, p)}
          onSelect={select}
        />
      ))}
    </div>
  );
}

function EdgePath({
  laid,
  dimmed,
  emphasised,
  selected,
}: {
  laid: LaidEdge;
  dimmed: boolean;
  emphasised: boolean;
  selected: boolean;
}) {
  const t = api.ui.tokens;
  const e = laid.edge;
  const colour = selected ? t.accent : toneColour(e.tone, extensionColour(e.owner, t));
  const quiet = e.tone === "dim" || e.tone === "neutral";
  const bus = e.kind === "resource";
  const opacity = dimmed ? DIM_OPACITY : emphasised ? 1 : quiet ? 0.75 : bus ? 0.7 : 1;
  const width = selected ? 2.5 : bus && !emphasised ? 1 : 1.5;
  return (
    <g data-edge={e.id} data-dimmed={String(dimmed)} style={{ opacity }}>
      <path
        data-hit=""
        d={laid.d}
        fill="none"
        stroke="transparent"
        strokeWidth={9}
        style={{ pointerEvents: "stroke", cursor: "pointer" }}
        onClick={() => devView().getState().select({ kind: "edge", id: e.id })}
      >
        <title>{e.label}</title>
      </path>
      <path
        d={laid.d}
        fill="none"
        stroke={colour}
        strokeWidth={width}
        strokeDasharray={quiet ? "4 3" : undefined}
        strokeLinejoin="round"
      />
      <path d={laid.arrow} fill={colour} />
    </g>
  );
}

function selectPort(e: MouseEvent, node: string, port: string) {
  e.stopPropagation();
  devView().getState().select({ kind: "port", node, port });
}

function CoreNode({
  layout,
  dimmed,
  selected,
  portSelected,
}: {
  layout: Layout;
  dimmed: boolean;
  selected: boolean;
  portSelected: (port: string) => boolean;
}) {
  const t = api.ui.tokens;
  const { core } = layout;
  return (
    <div
      data-node={CORE_NODE}
      data-hit=""
      data-dimmed={String(dimmed)}
      className={tw("absolute rounded border bg-surface-2")}
      style={{ ...box(core), borderColor: selected ? t.accent : t.border, opacity: dimmed ? DIM_OPACITY : 1 }}
      onClick={() => devView().getState().select({ kind: "node", id: CORE_NODE })}
    >
      <div
        className={tw("border-b border-border-subtle px-2 py-1.5 text-[12px] font-medium text-text-primary")}
        style={{ background: tint(t.accent, t.surface3, 22) }}
      >
        Safelight core
      </div>
      {layout.coreGroups.map((g) => (
        <div
          key={g.label}
          className={tw("absolute text-right text-[11px] uppercase tracking-widest text-text-secondary")}
          style={{ top: g.y - core.y + 6, right: 10 }}
        >
          {g.label}
        </div>
      ))}
      {layout.corePorts.map((p) => (
        <CorePortRow key={p.id} port={p} top={p.y - core.y - PORT_ROW / 2} selected={portSelected(p.id)} />
      ))}
    </div>
  );
}

function CorePortRow({ port, top, selected }: { port: LaidCorePort; top: number; selected: boolean }) {
  const t = api.ui.tokens;
  return (
    <div
      data-hit=""
      data-port={port.id}
      data-used={String(port.used)}
      className={tw("absolute flex items-center justify-end pr-2 text-[11px]")}
      style={{ top, left: 8, right: 0, height: PORT_ROW }}
      onClick={(e) => selectPort(e, CORE_NODE, port.id)}
    >
      <span
        className={cx(tw("truncate"), port.used ? tw("text-text-primary") : tw("text-text-muted"))}
        style={selected ? { color: t.accent } : undefined}
      >
        {port.label}
      </span>
      <PortDot side="right" colour={port.used ? t.textSecondary : t.border} />
    </div>
  );
}

function BandView({
  laid,
  dimmed,
  selected,
  portSelected,
}: {
  laid: LaidBand;
  dimmed: boolean;
  selected: boolean;
  portSelected: (port: string) => boolean;
}) {
  const t = api.ui.tokens;
  const b = laid.band;
  const colour = extensionColour(b.extensionId, t);
  const opacity = dimmed ? DIM_OPACITY : 1;
  const toggle = (e: MouseEvent) => {
    e.stopPropagation();
    devView().getState().setCollapsed([b.id], !laid.collapsed);
  };
  return (
    <>
      <div
        data-band={b.extensionId}
        data-node={b.id}
        data-hit=""
        data-dimmed={String(dimmed)}
        className={tw("absolute flex items-center gap-1.5 rounded px-2")}
        style={{
          ...box(laid.header),
          background: tint(colour, t.surface2, 26),
          borderLeft: `3px solid ${colour}`,
          outline: selected ? `1px solid ${t.accent}` : undefined,
          opacity,
        }}
        onClick={() => devView().getState().select({ kind: "node", id: b.id })}
      >
        <button
          type="button"
          aria-label={`${laid.collapsed ? "Expand" : "Collapse"} ${b.name}`}
          onClick={toggle}
          className={tw("shrink-0 rounded px-1 font-code text-text-secondary hover:bg-surface-3 hover:text-text-primary")}
        >
          {laid.collapsed ? "[+]" : "[-]"}
        </button>
        <span className={tw("min-w-0 truncate text-[12px] font-medium text-text-primary")}>{b.name}</span>
        {b.name !== b.extensionId && (
          <span className={tw("min-w-0 truncate font-code text-[11px] text-text-secondary")}>{b.extensionId}</span>
        )}
        {b.version && <span className={tw("shrink-0 text-[11px] text-text-secondary")}>v{b.version}</span>}
        {b.source && <span className={tw("shrink-0 text-[11px] text-text-secondary")}>{SOURCE_LABEL[b.source]}</span>}
        <StatusBadge state={b.status} />
        {b.stages.length > 0 && (
          <span className={tw("ml-auto shrink-0 text-[11px] text-text-secondary")}>
            {b.stages.length} {b.stages.length === 1 ? "stage" : "stages"}
          </span>
        )}
      </div>
      {laid.ports.map((p) => (
        <div
          key={p.id}
          data-hit=""
          data-port={p.id}
          data-band-port={`${b.id}|${p.id}`}
          className={tw("absolute flex items-center px-2 text-[11px]")}
          style={{ left: p.x, top: p.y - PORT_ROW / 2, width: BAND_PORTS_W - 8, height: PORT_ROW, opacity }}
          onClick={(e) => selectPort(e, b.id, p.id)}
        >
          <PortDot side="left" colour={colour} />
          <span
            className={tw("truncate text-text-primary")}
            style={portSelected(p.id) ? { color: t.accent } : undefined}
          >
            {p.side === "in" ? "→ " : "← "}
            {p.label}
          </span>
        </div>
      ))}
    </>
  );
}

function PortRows({
  ports,
  side,
  other,
  node,
  portSelected,
}: {
  ports: readonly Port[];
  side: "in" | "out";
  other: number;
  node: string;
  portSelected: (port: string) => boolean;
}) {
  const t = api.ui.tokens;
  return (
    <>
      {ports.map((p, i) => {
        const shared = i < other;
        const style: CSSProperties = {
          top: NODE_HEAD_H + i * PORT_ROW,
          height: PORT_ROW,
          left: side === "in" ? 0 : shared ? NODE_W / 2 : 8,
          right: side === "out" ? 0 : shared ? NODE_W / 2 : 8,
        };
        return (
          <div
            key={p.id}
            data-hit=""
            data-port={p.id}
            className={cx(tw("absolute flex items-center text-[11px]"), side === "out" ? tw("justify-end pr-2") : tw("px-2"))}
            style={style}
            onClick={(e) => selectPort(e, node, p.id)}
          >
            <PortDot side={side === "in" ? "left" : "right"} colour={t.textSecondary} />
            <span
              className={tw("truncate text-text-primary")}
              title={p.label}
              style={portSelected(p.id) ? { color: t.accent } : undefined}
            >
              {p.label}
            </span>
          </div>
        );
      })}
    </>
  );
}

function StageView({
  laid,
  dimmed,
  selected,
  portSelected,
  onSelect,
}: {
  laid: LaidNode;
  dimmed: boolean;
  selected: boolean;
  portSelected: (port: string) => boolean;
  onSelect: (selection: Selection) => void;
}) {
  const t = api.ui.tokens;
  const s = laid.stage;
  const owner = extensionColour(s.extensionId, t);
  const mark = markColour(s.state.tone, owner);
  const flagged = s.state.tone === "failure" || s.state.tone === "problem";
  return (
    <div
      data-node={s.id}
      data-hit=""
      data-status={s.state.status}
      data-dimmed={String(dimmed)}
      className={tw("absolute rounded border bg-surface-2")}
      style={{
        ...box(laid.rect),
        borderColor: selected ? t.accent : flagged ? mark : t.border,
        borderStyle: s.state.tone === "dim" || s.state.tone === "neutral" ? "dashed" : "solid",
        opacity: dimmed ? DIM_OPACITY : 1,
      }}
      onClick={() => onSelect({ kind: "node", id: s.id })}
    >
      <div
        className={tw("flex items-center gap-1 rounded px-2")}
        style={{ height: NODE_HEAD_H, background: tint(owner, t.surface3, 22) }}
        title={`${s.stageId}: ${s.state.label}. ${s.state.reason}`}
      >
        <span className={tw("shrink-0 rounded-full")} style={{ width: 7, height: 7, background: mark }} />
        <span className={tw("min-w-0 flex-1 truncate text-[12px] font-medium text-text-primary")}>{s.name}</span>
        {s.anchor && (
          <span className={tw("shrink-0 rounded bg-surface-3 px-1 text-[11px] text-text-secondary")}>at {s.anchor}</span>
        )}
        {s.state.copies > 0 && <span className={tw("shrink-0 text-[11px] text-text-secondary")}>×{s.state.copies}</span>}
      </div>
      <PortRows ports={s.inPorts} side="in" other={s.outPorts.length} node={s.id} portSelected={portSelected} />
      <PortRows ports={s.outPorts} side="out" other={s.inPorts.length} node={s.id} portSelected={portSelected} />
    </div>
  );
}
