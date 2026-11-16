// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// Dev ▸ Inspector: the selection in detail. A stage shows its declaration, its
// uniforms with the values the live view last drew, and why it has the status
// it has; an extension its contributions, variables and failures; an edge its
// two ends and what flows along it; a port its node and the edges at it.

import type { ReactNode } from "react";
import { React } from "../../rt";
import type { UniformDeclaration } from "../../safelight";
import { cx, tw } from "../../styles";
import { StatusBadge } from "../GraphView";
import { CORE_GROUP_LABEL, CORE_NODE, type Band, type Edge, type Graph, type Model, type StageNode } from "../model";
import type { LiveSource, StageValues } from "../relay";
import { atRest, elementsOf } from "../status";
import { useGraph, useLive, useLiveValues, useModel } from "../sources";
import { devView } from "../store";
import { TONE_TEXT } from "./ExtensionsPanel";

const MUTED = tw("text-text-secondary");
const CODE = tw("font-code text-[11px]");

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={tw("border-b border-border-subtle/50 px-2 py-1.5")}>
      <div className={tw("mb-1 text-[10px] uppercase tracking-widest text-text-muted")}>{title}</div>
      {children}
    </section>
  );
}

function Facts({ rows }: { rows: readonly (readonly [string, ReactNode])[] }) {
  return (
    <dl className={tw("grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5")}>
      {rows.map(([term, value]) => (
        <React.Fragment key={term}>
          <dt className={MUTED}>{term}</dt>
          <dd className={tw("min-w-0 break-words")}>{value}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

const NONE = "—";
const yesNo = (v: boolean | undefined) => (v ? "yes" : "no");

function formatNumber(n: number): string {
  return Number.isInteger(n) ? String(n) : String(Number(n.toPrecision(4)));
}

/** A drawn value as short text: numbers to four figures, long vectors cut. */
export function formatValue(v: unknown): string {
  if (v === undefined || v === null) return NONE;
  if (typeof v === "number") return formatNumber(v);
  if (typeof v === "boolean") return String(v);
  const list = elementsOf(v);
  if (list) {
    const shown = list.slice(0, 8).map((x) => (typeof x === "number" ? formatNumber(x) : String(x)));
    return `[${shown.join(", ")}${list.length > 8 ? `, … ${list.length} in all` : ""}]`;
  }
  const json = JSON.stringify(v) ?? String(v);
  return json.length > 120 ? `${json.slice(0, 120)}…` : json;
}

const valueOf = (values: StageValues | null, stageId: string, key: string): unknown =>
  values ? (key in values ? values[key] : values[`${stageId}.${key}`]) : undefined;

export function InspectorPanel() {
  const model = useModel();
  const graph = useGraph(model);
  const selection = devView()((s) => s.selection);
  const source = useLive();

  let body: ReactNode;
  if (!selection) {
    body = <div className={tw("p-3 text-text-muted")}>Select a node, port or edge in the graph.</div>;
  } else if (selection.kind === "edge") {
    const edge = graph.edges.find((e) => e.id === selection.id);
    body = edge ? <EdgeInspector edge={edge} model={model} /> : <Gone />;
  } else {
    const node = selection.kind === "node" ? selection.id : selection.node;
    const view = <NodeInspector id={node} model={model} graph={graph} source={source} />;
    body =
      selection.kind === "port" ? (
        <>
          <PortInspector node={node} port={selection.port} graph={graph} model={model} />
          {view}
        </>
      ) : (
        view
      );
  }
  return <div className={tw("h-full overflow-y-auto text-[11px]")}>{body}</div>;
}

function Gone() {
  return <div className={tw("p-3 text-text-muted")}>The selection is no longer in the graph.</div>;
}

function NodeInspector({
  id,
  model,
  graph,
  source,
}: {
  id: string;
  model: Model;
  graph: Graph;
  source: LiveSource | null;
}) {
  if (id === CORE_NODE) return <CoreInspector graph={graph} />;
  const band = model.bands.find((b) => b.id === id);
  if (band) return <BandInspector band={band} />;
  const stage = model.stages.find((s) => s.id === id);
  if (stage) return <StageInspector node={stage} source={source} />;
  return <Gone />;
}

function nodeName(id: string, model: Model): string {
  if (id === CORE_NODE) return "Safelight core";
  const band = model.bands.find((b) => b.id === id);
  if (band) return band.name;
  return model.stages.find((s) => s.id === id)?.name ?? id;
}

function CoreInspector({ graph }: { graph: Graph }) {
  const groups = Object.entries(CORE_GROUP_LABEL);
  return (
    <>
      <Section title="Node">
        <div className={tw("font-medium text-text-primary")}>Safelight core</div>
        <div className={MUTED}>What core hands extensions and stages, and what it takes back from them.</div>
      </Section>
      {groups.map(([group, label]) => (
        <Section key={group} title={label}>
          <ul>
            {graph.core
              .filter((p) => p.group === group)
              .map((p) => (
                <li key={p.id} className={p.used ? undefined : MUTED}>
                  {p.label}
                  {!p.used && " (nothing in the graph uses it)"}
                </li>
              ))}
          </ul>
        </Section>
      ))}
    </>
  );
}

const SOURCE_TEXT = { builtin: "built-in", installed: "installed", dev: "dev folder" } as const;

function BandInspector({ band }: { band: Band }) {
  const info = band.info;
  return (
    <>
      <Section title="Extension">
        <div className={tw("font-medium text-text-primary")}>{band.name}</div>
        <div className={CODE}>{band.extensionId}</div>
        <div className={tw("mt-1 flex flex-wrap items-center gap-1.5")}>
          <StatusBadge state={band.status} />
          {band.version && <span className={MUTED}>v{band.version}</span>}
          {band.source && <span className={MUTED}>{SOURCE_TEXT[band.source]}</span>}
        </div>
        {band.status.message && <p className={tw("mt-1 break-words text-red-400")}>{band.status.message}</p>}
      </Section>
      <Section title="Contributions">
        {band.contributions.length === 0 ? (
          <div className={MUTED}>Nothing registered in this window.</div>
        ) : (
          <Facts
            rows={band.contributions.map((c) => [
              c.label,
              <span key={c.kind} className={CODE}>
                {c.ids.join(", ")}
              </span>,
            ])}
          />
        )}
      </Section>
      <Section title="Variables">
        <Facts
          rows={[
            ["Subscribed", band.subscribed.length > 0 ? band.subscribed.join(", ") : "none"],
            ["Written", band.written.length > 0 ? band.written.join(", ") : "none"],
          ]}
        />
        <p className={tw("mt-1 text-[11px] text-text-secondary")}>
          Writers come from each variable's recent history, so an older write may not show.
        </p>
      </Section>
      {info && (
        <Section title="Failures">
          <Facts
            rows={[
              ["Start", info.failure ? `${info.failure.reason}: ${info.failure.message}` : "none"],
              ["Callbacks", info.callbackFailures > 0 ? "one has failed" : "none failed"],
              ["Dev folder", info.devError ?? "none"],
            ]}
          />
        </Section>
      )}
    </>
  );
}

interface UniformRow {
  key: string;
  decl: UniformDeclaration | null;
  where: string;
}

function uniformRows(node: StageNode, values: StageValues | null): UniformRow[] {
  const s = node.stage;
  const rows: UniformRow[] = s.uniforms.map((u) => ({ key: u.key, decl: u, where: "" }));
  (s.passes ?? []).forEach((p, i) => {
    for (const u of p.uniforms ?? []) rows.push({ key: u.key, decl: u, where: `pass ${i + 1}` });
  });
  const declared = new Set(rows.map((r) => r.key));
  const prefix = `${s.id}.`;
  for (const key of Object.keys(values ?? {})) {
    const bare = key.startsWith(prefix) ? key.slice(prefix.length) : key;
    if (!declared.has(bare)) {
      declared.add(bare);
      rows.push({ key: bare, decl: null, where: "derived" });
    }
  }
  return rows;
}

function StageInspector({ node, source }: { node: StageNode; source: LiveSource | null }) {
  const s = node.stage;
  const values = useLiveValues(node.stageId, source);
  const running = node.state.status === "running";
  const rest = running && s.dormantWhen ? (values ? atRest(s, values) : null) : undefined;
  const iterations = (s.passes ?? []).map((p) =>
    p.iterations === undefined
      ? "1"
      : typeof p.iterations === "number"
        ? String(p.iterations)
        : `${p.iterations.key} (up to ${p.iterations.max})`,
  );

  return (
    <>
      <Section title="Stage">
        <div className={tw("font-medium text-text-primary")}>{node.name}</div>
        <div className={CODE}>{node.stageId}</div>
        <div className={tw("mt-1")}>
          <span className={TONE_TEXT[node.state.tone]}>{node.state.label}</span>
          <span className={tw("ml-1.5 text-text-secondary")}>{node.state.reason}</span>
        </div>
        {node.state.failure && (
          <pre className={tw("mt-1 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded bg-surface-2 p-1.5 font-code text-[11px] text-red-400")}>
            {node.state.failure.log}
          </pre>
        )}
      </Section>
      <Section title="Declaration">
        <Facts
          rows={[
            ["Extension", node.extensionId],
            ["Phase", s.phase],
            ["Priority", String(s.priority ?? 100)],
            ["Anchor", s.anchor ?? NONE],
            ["After", s.after?.length ? s.after.join(", ") : NONE],
            ["Reads", s.reads ?? "source"],
            ["Space", s.space ? `${s.space.encoding}/${s.space.primaries ?? "rec709"}` : NONE],
            ["Mask", s.mask?.maskable ? "maskable" : "no"],
            ["Geometry", s.geometry ? `region ${s.geometry.region}, inverse ${s.geometry.inverse}` : "no"],
            ["View only", yesNo(s.viewOnly)],
            ["Keeps detail", yesNo(s.keepsDetail)],
            ["Dormant when", s.dormantWhen ? formatValue(s.dormantWhen) : NONE],
            [
              "At rest",
              rest === undefined
                ? NONE
                : rest === null
                  ? "waiting for the drawn values"
                  : rest
                    ? "yes: idle, every listed uniform at its rest value"
                    : "no",
            ],
          ]}
        />
      </Section>
      <Section title="Uniforms">
        <UniformTable node={node} values={values} source={source} />
      </Section>
      {(s.passes?.length ?? 0) > 0 && (
        <Section title="Passes">
          <div>
            {s.passes?.length} {s.passes?.length === 1 ? "pass" : "passes"}, draws: {iterations.join(", ")}
          </div>
        </Section>
      )}
      {(s.textures?.length ?? 0) > 0 && (
        <Section title="Textures">
          <Facts rows={(s.textures ?? []).map((t) => [t.key, t.kind])} />
        </Section>
      )}
      {((s.produces?.length ?? 0) > 0 || (s.consumes?.length ?? 0) > 0) && (
        <Section title="Inter-stage values">
          <Facts
            rows={[
              ["Produces", s.produces?.map((p) => `isv_${p.name} (${p.glslType})`).join(", ") || NONE],
              ["Consumes", s.consumes?.map((n) => `isv_${n}`).join(", ") || NONE],
            ]}
          />
        </Section>
      )}
    </>
  );
}

function UniformTable({ node, values, source }: { node: StageNode; values: StageValues | null; source: LiveSource | null }) {
  const rows = uniformRows(node, values);
  if (rows.length === 0) return <div className={MUTED}>None.</div>;
  const derived = node.stage.derive !== undefined;
  return (
    <>
      <table className={tw("w-full")}>
        <thead>
          <tr className={MUTED}>
            <th className={tw("pr-2 text-left font-normal")}>Key</th>
            <th className={tw("pr-2 text-left font-normal")}>Type</th>
            <th className={tw("pr-2 text-left font-normal")}>Default</th>
            <th className={tw("text-left font-normal")}>{derived ? "Live (derived)" : "Live"}</th>
          </tr>
        </thead>
        <tbody className={CODE}>
          {rows.map((r) => (
            <tr key={`${r.where}:${r.key}`} className={tw("align-top")}>
              <td className={tw("pr-2 break-all")}>
                {r.key}
                {r.where && <span className={tw("ml-1 text-text-secondary")}>{r.where}</span>}
              </td>
              <td className={tw("pr-2 text-text-secondary")}>{r.decl ? r.decl.glslType : NONE}</td>
              <td className={tw("pr-2 text-text-secondary")}>{r.decl ? formatValue(r.decl.default) : NONE}</td>
              <td className={cx(tw("break-all"), values ? tw("text-text-primary") : tw("text-text-secondary"))}>
                {formatValue(valueOf(values, node.stageId, r.key))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={tw("mt-1 text-[11px] text-text-secondary")}>
        {source ? `Live values from ${source.window}.` : "Live values show while a window has a live develop view."}
      </p>
    </>
  );
}

const EDGE_KIND: Readonly<Record<Edge["kind"], string>> = {
  colour: "Colour, from one stage to the next",
  isv: "An inter-stage value",
  resource: "A resource core hands the stage",
  geometry: "The stage's coordinate mapping, back to core",
  registration: "A registration between the extension and core",
};

function EdgeInspector({ edge, model }: { edge: Edge; model: Model }) {
  return (
    <Section title="Edge">
      <Facts
        rows={[
          ["From", `${nodeName(edge.from.node, model)} · ${edge.from.port}`],
          ["To", `${nodeName(edge.to.node, model)} · ${edge.to.port}`],
          ["Kind", EDGE_KIND[edge.kind]],
          ["Carries", edge.label],
          ["Owner", nodeName(`band:${edge.owner}`, model)],
        ]}
      />
    </Section>
  );
}

function PortInspector({ node, port, graph, model }: { node: string; port: string; graph: Graph; model: Model }) {
  const edges = graph.edges.filter(
    (e) => (e.from.node === node && e.from.port === port) || (e.to.node === node && e.to.port === port),
  );
  return (
    <Section title="Port">
      <div className={tw("text-text-primary")}>
        {nodeName(node, model)} · <span className={CODE}>{port}</span>
      </div>
      {edges.length === 0 ? (
        <div className={MUTED}>No edges in the graph end here.</div>
      ) : (
        <ul className={tw("mt-1")}>
          {edges.map((e) => {
            const other = e.from.node === node && e.from.port === port ? e.to : e.from;
            return (
              <li key={e.id} className={tw("text-text-secondary")}>
                {e.label} {e.from.node === node ? "to" : "from"} {nodeName(other.node, model)}
              </li>
            );
          })}
        </ul>
      )}
    </Section>
  );
}
