//#region src/rt.ts
var e, t;
function n(n) {
	t = n, e = n.react;
}
//#endregion
//#region src/styles.ts
var r = (e) => `${e * .25}rem`, i = (e, t) => `color-mix(in oklab, ${e} ${t}%, transparent)`, a = "oklch(74.6% 0.16 232.661)", o = "oklch(82.8% 0.189 84.429)", s = "oklch(76.9% 0.188 70.08)", c = "oklch(70.4% 0.191 22.216)", l = "oklch(63.7% 0.237 25.331)", u = "oklch(76.5% 0.177 163.223)";
function d(e) {
	return {
		absolute: "position: absolute",
		relative: "position: relative",
		"inset-x-1.5": `inset-inline: ${r(1.5)}`,
		"-bottom-px": "bottom: -1px",
		block: "display: block",
		flex: "display: flex",
		grid: "display: grid",
		"grid-cols-[auto_1fr]": "grid-template-columns: auto 1fr",
		"flex-1": "flex: 1",
		"flex-col": "flex-direction: column",
		"flex-wrap": "flex-wrap: wrap",
		"shrink-0": "flex-shrink: 0",
		"items-baseline": "align-items: baseline",
		"items-center": "align-items: center",
		"justify-between": "justify-content: space-between",
		"justify-center": "justify-content: center",
		"justify-end": "justify-content: flex-end",
		"gap-0.5": `gap: ${r(.5)}`,
		"gap-1": `gap: ${r(1)}`,
		"gap-1.5": `gap: ${r(1.5)}`,
		"gap-2": `gap: ${r(2)}`,
		"gap-4": `gap: ${r(4)}`,
		"gap-x-2.5": `column-gap: ${r(2.5)}`,
		"gap-x-3": `column-gap: ${r(3)}`,
		"gap-y-0.5": `row-gap: ${r(.5)}`,
		"w-3": `width: ${r(3)}`,
		"w-36": `width: ${r(36)}`,
		"w-56": `width: ${r(56)}`,
		"w-1/2": "width: 50%",
		"w-full": "width: 100%",
		"min-w-0": "min-width: 0",
		"h-0.5": `height: ${r(.5)}`,
		"h-40": `height: ${r(40)}`,
		"h-[38px]": "height: 38px",
		"h-[420px]": "height: 420px",
		"h-full": "height: 100%",
		"h-screen": "height: 100vh",
		"min-h-0": "min-height: 0",
		"max-h-64": `max-height: ${r(64)}`,
		"m-auto": "margin: auto",
		"my-1": `margin-block: ${r(1)}`,
		"mb-1": `margin-bottom: ${r(1)}`,
		"ml-1": `margin-left: ${r(1)}`,
		"ml-1.5": `margin-left: ${r(1.5)}`,
		"ml-2": `margin-left: ${r(2)}`,
		"ml-auto": "margin-left: auto",
		"mr-1": `margin-right: ${r(1)}`,
		"mr-auto": "margin-right: auto",
		"mt-0.5": `margin-top: ${r(.5)}`,
		"mt-1": `margin-top: ${r(1)}`,
		"mt-1.5": `margin-top: ${r(1.5)}`,
		"p-1.5": `padding: ${r(1.5)}`,
		"p-2": `padding: ${r(2)}`,
		"p-3": `padding: ${r(3)}`,
		"px-1": `padding-inline: ${r(1)}`,
		"px-1.5": `padding-inline: ${r(1.5)}`,
		"px-2": `padding-inline: ${r(2)}`,
		"px-2.5": `padding-inline: ${r(2.5)}`,
		"px-3": `padding-inline: ${r(3)}`,
		"px-6": `padding-inline: ${r(6)}`,
		"py-0.5": `padding-block: ${r(.5)}`,
		"py-1": `padding-block: ${r(1)}`,
		"py-1.5": `padding-block: ${r(1.5)}`,
		"py-2": `padding-block: ${r(2)}`,
		"py-4": `padding-block: ${r(4)}`,
		"pl-3": `padding-left: ${r(3)}`,
		"pr-2": `padding-right: ${r(2)}`,
		"overflow-auto": "overflow: auto",
		"overflow-y-auto": "overflow-y: auto",
		truncate: "overflow: hidden; text-overflow: ellipsis; white-space: nowrap",
		"whitespace-pre-wrap": "white-space: pre-wrap",
		"break-all": "word-break: break-all",
		"break-words": "overflow-wrap: break-word",
		"align-top": "vertical-align: top",
		"text-center": "text-align: center",
		"text-left": "text-align: left",
		"text-right": "text-align: right",
		"resize-none": "resize: none",
		"cursor-pointer": "cursor: pointer",
		"outline-none": "outline-style: none",
		rounded: "border-radius: 0.25rem",
		"rounded-full": "border-radius: 9999px",
		border: "border-style: solid; border-width: 1px",
		"border-b": "border-bottom-style: solid; border-bottom-width: 1px",
		"border-r": "border-right-style: solid; border-right-width: 1px",
		"border-t": "border-top-style: solid; border-top-width: 1px",
		"border-border": `border-color: ${e.border}`,
		"border-border-subtle": `border-color: ${e.borderSubtle}`,
		"border-border-subtle/50": `border-color: ${i(e.borderSubtle, 50)}`,
		"bg-transparent": "background-color: transparent",
		"bg-surface-1": `background-color: ${e.surface1}`,
		"bg-surface-2": `background-color: ${e.surface2}`,
		"bg-surface-3": `background-color: ${e.surface3}`,
		"bg-surface-4": `background-color: ${e.surface4}`,
		"bg-accent": `background-color: ${e.accent}`,
		"bg-slider-fill": `background-color: ${e.sliderFill}`,
		"bg-red-500/5": `background-color: ${i(l, 5)}`,
		"bg-red-500/80": `background-color: ${i(l, 80)}`,
		"bg-amber-500/5": `background-color: ${i(s, 5)}`,
		"bg-amber-500/80": `background-color: ${i(s, 80)}`,
		"font-code": `font-family: ${e.fontCode}`,
		"font-normal": "font-weight: 400",
		"font-medium": "font-weight: 500",
		"text-[9px]": "font-size: 9px",
		"text-[10px]": "font-size: 10px",
		"text-[11px]": "font-size: 11px",
		"text-[12px]": "font-size: 12px",
		"leading-none": "line-height: 1",
		"leading-relaxed": "line-height: 1.625",
		"tracking-wide": "letter-spacing: 0.025em",
		"tracking-widest": "letter-spacing: 0.1em",
		uppercase: "text-transform: uppercase",
		"text-text-primary": `color: ${e.textPrimary}`,
		"text-text-secondary": `color: ${e.textSecondary}`,
		"text-text-muted": `color: ${e.textMuted}`,
		"text-accent": `color: ${e.accent}`,
		"text-white": `color: ${e.white}`,
		"text-sky-400": `color: ${a}`,
		"text-amber-400": `color: ${o}`,
		"text-red-400": `color: ${c}`,
		"text-emerald-400": `color: ${u}`,
		"opacity-0": "opacity: 0",
		"opacity-50": "opacity: 0.5",
		"opacity-80": "opacity: 0.8",
		"opacity-100": "opacity: 1",
		"transition-colors": "transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms",
		group: "",
		"space-y-px": ""
	};
}
var f = [
	"group-hover:opacity-100",
	"placeholder:text-text-muted",
	"focus:bg-surface-3",
	"hover:bg-surface-2",
	"hover:bg-surface-3",
	"hover:bg-surface-4",
	"hover:opacity-80",
	"hover:text-red-400",
	"hover:text-text-primary",
	"hover:text-text-secondary"
], p = (e) => "sldt-" + e.replace(/[^a-zA-Z0-9-]/g, "_");
function m(e) {
	return e.split(" ").map((e) => p(e)).join(" ");
}
function h(...e) {
	return e.filter(Boolean).join(" ");
}
function g(e, t) {
	let n = `.${p(e)}`;
	return e.startsWith("group-hover:") ? `@media (hover: hover) { :where(.${p("group")}:hover ${n}) { ${t}; } }` : e.startsWith("placeholder:") ? `:where(${n})::placeholder { ${t}; }` : e.startsWith("focus:") ? `:where(${n}:focus) { ${t}; }` : `@media (hover: hover) { :where(${n}:hover) { ${t}; } }`;
}
function ee(e) {
	let t = d(e), n = Object.entries(t).filter(([, e]) => e !== "").map(([e, t]) => `:where(.${p(e)}) { ${t}; }`), r = f.map((e) => g(e, t[e.slice(e.indexOf(":") + 1)])), i = (e) => `.${p(e)}`;
	return [
		...n,
		`:where(${i("space-y-px")} > :not(:last-child)) { margin-block-end: 1px; }`,
		...r,
		`html.sl-larger-text ${i("text-[9px]")} { font-size: 11px !important; }`,
		`html.sl-larger-text ${i("text-[10px]")} { font-size: 12px !important; }`,
		`html.sl-larger-text ${i("text-[11px]")} { font-size: 13px !important; line-height: 1.45 !important; }`,
		`html.sl-larger-text ${i("uppercase")} { text-transform: none !important; }`,
		`html.sl-larger-text ${i("tracking-widest")} { letter-spacing: normal !important; }`,
		`html.sl-title-headings ${i("uppercase")} { text-transform: capitalize !important; }`,
		""
	].join("\n");
}
//#endregion
//#region src/Unavailable.tsx
var _ = "Not available in this version of Safelight.";
function v() {
	return /* @__PURE__ */ e.createElement("div", { className: m("p-3 text-text-muted") }, _);
}
//#endregion
//#region src/DevSettings.tsx
var y = m("text-[11px] text-text-muted");
function te() {
	let n = t.devtools;
	return /* @__PURE__ */ e.createElement("div", { className: m("flex flex-col gap-4") }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("div", { className: m("text-[10px] uppercase tracking-widest text-text-muted") }, "Development extensions folder"), /* @__PURE__ */ e.createElement("p", { className: m("mt-1.5 text-[10px] leading-relaxed text-text-muted") }, "Point Safelight at a local folder of built extensions to load them live, without installing through GitHub. Point at a single extension's folder — a ", /* @__PURE__ */ e.createElement("code", null, "safelight.json"), " manifest plus its built bundle, the same layout an installed extension uses — or at a parent folder whose immediate subfolders are each one. Loaded extensions appear under Extensions ▸ Dev.")), n ? n.electron ? /* @__PURE__ */ e.createElement(n.devFolder.Controls, { variant: "settings" }) : /* @__PURE__ */ e.createElement("p", { className: y }, "Loading extensions from a folder requires the desktop app.") : /* @__PURE__ */ e.createElement("p", { className: y }, _));
}
//#endregion
//#region src/detach.ts
var b = "core.devtools", x = "devtools", ne = "safelight-devtools", re = "safelight-devtools-ctl";
function S() {
	return new URLSearchParams(window.location.search).get(x) === "1";
}
var C = null, w = null;
function ie() {
	t.dock.isPanelOpen("core.devtools") || t.dock.togglePanel(b);
}
function ae() {
	t.dock.isPanelOpen("core.devtools") && t.dock.togglePanel(b);
}
function oe() {
	if (C && !C.closed) {
		C.focus();
		return;
	}
	let e = `${window.location.origin}${window.location.pathname}?${x}=1`, t = window.open(e, ne, "width=760,height=600");
	t && (C = t, ae(), t.focus());
}
function se() {
	(w ?? new BroadcastChannel("safelight-devtools-ctl")).postMessage({ type: "reattach" }), window.close();
}
function ce() {
	w || (w = new BroadcastChannel(re), w.onmessage = (e) => {
		e.data?.type === "reattach" && !S() && (C = null, ie());
	});
}
function le() {
	w?.close(), w = null;
}
//#endregion
//#region src/format-arg.ts
function T(e, t = 0) {
	if (e === null) return "null";
	if (e === void 0) return "undefined";
	let n = typeof e;
	if (n === "string") return e;
	if (n === "number" || n === "boolean" || n === "bigint") return String(e);
	if (n === "function") return `ƒ ${e.name || "anonymous"}()`;
	if (n === "symbol") return e.toString();
	if (e instanceof Error) return e.stack || `${e.name}: ${e.message}`;
	if (typeof Element < "u" && e instanceof Element) {
		let t = e.id ? `#${e.id}` : "", n = e.className && typeof e.className == "string" ? `.${e.className.trim().split(/\s+/).join(".")}` : "";
		return `<${e.tagName.toLowerCase()}${t}${n}>`;
	}
	if (t > 2) return Array.isArray(e) ? "[…]" : "{…}";
	try {
		let t = /* @__PURE__ */ new WeakSet(), n = JSON.stringify(e, (e, n) => {
			if (typeof n == "object" && n) {
				if (t.has(n)) return "[Circular]";
				t.add(n);
			}
			return typeof n == "bigint" ? `${n}n` : typeof n == "function" ? `ƒ ${n.name || "anonymous"}()` : n;
		}, 0);
		return n === void 0 ? String(e) : n.length > 2e3 ? `${n.slice(0, 2e3)}…` : n;
	} catch {
		return String(e);
	}
}
//#endregion
//#region src/log-capture.ts
var ue = 2e3, E = null;
function D() {
	return E ??= t.stores.create()(() => ({ entries: [] })), E;
}
var de = "safelight-devtools-log", fe = Math.random().toString(36).slice(2, 8), pe = 1, O = null;
function k(e) {
	let t = (Array.isArray(e) ? e : [e]).filter(Boolean);
	t.length && D().setState((e) => {
		let n = new Set(e.entries.map((e) => e.id)), r = t.filter((e) => !n.has(e.id));
		if (!r.length) return e;
		let i = [...e.entries, ...r].sort((e, t) => e.time - t.time);
		return { entries: i.length > 2e3 ? i.slice(i.length - ue) : i };
	});
}
function A(e, t, n) {
	let r = {
		id: `${fe}-${pe++}`,
		level: e,
		parts: t,
		stack: n,
		time: Date.now()
	};
	k(r), O?.postMessage({
		kind: "entry",
		entry: r
	});
}
function me() {
	D().setState({ entries: [] });
}
var he = (e) => e.map((e) => T(e)), j = [
	"log",
	"info",
	"warn",
	"error",
	"debug"
], M = !1, N = /* @__PURE__ */ new Map(), P = null, F = null;
function ge() {
	if (!M) {
		M = !0;
		try {
			O = new BroadcastChannel(de), O.onmessage = (e) => {
				let t = e.data;
				if (t.kind === "entry") k(t.entry);
				else if (t.kind === "sync-response") k(t.entries);
				else if (t.kind === "sync-request") {
					let e = D().getState().entries;
					e.length && O?.postMessage({
						kind: "sync-response",
						entries: e.slice(-500)
					});
				}
			}, O.postMessage({ kind: "sync-request" });
		} catch {
			O = null;
		}
		for (let e of j) {
			let t = console[e];
			N.set(e, t), console[e] = (...n) => {
				try {
					A(e, he(n));
				} catch {}
				t.apply(console, n);
			};
		}
		P = (e) => {
			let t = e.error instanceof Error ? e.error : null;
			A("exception", [t ? `${t.name}: ${t.message}` : e.message || "Uncaught error"], t?.stack ?? (e.filename ? `at ${e.filename}:${e.lineno}:${e.colno}` : void 0));
		}, F = (e) => {
			let t = e.reason, n = t instanceof Error ? t : null;
			A("exception", [`Unhandled rejection: ${n ? `${n.name}: ${n.message}` : T(t)}`], n?.stack);
		}, window.addEventListener("error", P), window.addEventListener("unhandledrejection", F);
	}
}
function _e() {
	if (M) {
		M = !1;
		for (let e of j) {
			let t = N.get(e);
			t && (console[e] = t);
		}
		N.clear(), P && window.removeEventListener("error", P), F && window.removeEventListener("unhandledrejection", F), P = null, F = null, O?.close(), O = null;
	}
}
//#endregion
//#region src/PipelineTab.tsx
var ve = [
	{
		value: "srgb",
		label: "sRGB"
	},
	{
		value: "display-p3",
		label: "Display P3"
	},
	{
		value: "adobe-rgb",
		label: "Adobe RGB"
	},
	{
		value: "prophoto-rgb",
		label: "ProPhoto RGB"
	}
];
function ye(e, t) {
	return `${e?.encoding ?? (t === "scene" ? "linear" : "perceptual")}/${e?.primaries === "rec2020" ? "rec2020" : "rec709"}`;
}
var be = {
	input: "input",
	result: "result",
	"pass-input": "what its passes read, not the frame"
}, xe = {
	always: "always",
	"while-active": "while in use",
	"per-mask": "inside each mask that uses it, blended by coverage",
	"fallback-preview": "fallback preview only",
	"non-srgb-output": "only when the output isn't sRGB",
	"no-float-targets": "only without float render targets or mipmaps"
};
function Se(e) {
	let t = [], n = /* @__PURE__ */ new Map(), r = [], i;
	for (let a of e) if (a.kind === "clamp" && a.reason !== "core") r.push(a);
	else if (i && (a.kind === "transform" || a.kind === "clamp")) i.under.push(a);
	else {
		let e = {
			head: a,
			under: []
		};
		t.push(e), a.kind === "core" && (i = e), a.kind === "stage" && n.set(a.id, e);
	}
	let a = t.find((e) => e.head.kind === "output");
	for (let e of r) {
		let r = "stageId" in e ? n.get(e.stageId) : a;
		r ? r.under.push(e) : t.push({
			head: e,
			under: []
		});
	}
	return t;
}
var I = m("rounded bg-surface-3 px-1 text-text-secondary");
function Ce({ row: t }) {
	let { domain: n } = t, r = [
		t.owner ?? "Safelight",
		`${t.phase}, priority ${t.priority}`,
		...n ? [t.space ? ye(t.space, n) : `${n} values`] : [],
		...t.reads === "current" ? ["reads the current image"] : [],
		...t.maskable && t.copies ? [`per mask, ${t.copies} ${t.copies === 1 ? "copy" : "copies"}`] : [],
		...t.maskable && !t.copies ? ["maskable"] : []
	];
	return /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("div", { className: m("flex items-baseline gap-2") }, /* @__PURE__ */ e.createElement("span", { className: m("text-text-primary") }, t.name), /* @__PURE__ */ e.createElement("span", { className: m("font-code text-[10px] text-text-muted") }, t.id)), /* @__PURE__ */ e.createElement("div", { className: m("flex flex-wrap gap-x-2.5 text-[10px] text-text-secondary") }, r.map((t) => /* @__PURE__ */ e.createElement("span", { key: t }, t))), t.note && /* @__PURE__ */ e.createElement("div", { className: m("text-[10px] text-text-muted") }, t.note), t.floors.map((t, n) => /* @__PURE__ */ e.createElement("div", {
		key: n,
		className: m("font-code text-[10px] text-amber-400")
	}, `found in GLSL: ${t}`)));
}
function we({ row: t, screen: n }) {
	return /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("span", { className: I }, `${be[t.where]} · ${xe[t.when]}`), t.when === "non-srgb-output" && /* @__PURE__ */ e.createElement("span", { className: h(m("ml-1.5"), n.profile ? m("text-amber-400") : m("text-text-muted")) }, n.profile ? "Runs for this screen's monitor profile." : "Doesn't run for this screen."), /* @__PURE__ */ e.createElement("span", { className: m("ml-1.5 text-text-muted") }, t.detail));
}
function Te({ row: t, screen: n }) {
	let r = n.profile ? `${n.profile} (monitor profile)` : ve.find((e) => e.value === n.space)?.label ?? n.space;
	return /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("div", { className: m("flex items-baseline gap-2") }, /* @__PURE__ */ e.createElement("span", { className: m("text-text-muted") }, "Output"), /* @__PURE__ */ e.createElement("span", { className: h(I, m("text-[10px]")) }, t.mapped ? "mapped" : "clipped")), /* @__PURE__ */ e.createElement("div", { className: m("text-[10px] text-text-muted") }, t.detail), t.mapped && /* @__PURE__ */ e.createElement("div", { className: m("text-[10px] text-text-secondary") }, `On this screen: ${r}`));
}
function L({ row: t, screen: n }) {
	switch (t.kind) {
		case "core": return /* @__PURE__ */ e.createElement("div", { className: m("text-text-muted") }, /* @__PURE__ */ e.createElement("span", null, t.label), t.note && /* @__PURE__ */ e.createElement("span", { className: m("ml-2 text-[10px]") }, t.note));
		case "stage": return /* @__PURE__ */ e.createElement(Ce, { row: t });
		case "convert": return /* @__PURE__ */ e.createElement("div", { className: m("pl-3 font-code text-[10px] text-text-secondary") }, t.elided ? `stays in ${t.to}` : `${t.from} → ${t.to}`);
		case "clamp": return /* @__PURE__ */ e.createElement(we, {
			row: t,
			screen: n
		});
		case "transform": return /* @__PURE__ */ e.createElement("div", { className: m("flex flex-wrap gap-x-2.5 text-text-secondary") }, /* @__PURE__ */ e.createElement("span", null, `Transform: ${t.id ?? "Built-in"}`), t.flags.map((t) => /* @__PURE__ */ e.createElement("span", {
			key: t.flag,
			className: t.honoured ? void 0 : m("text-amber-400")
		}, `${t.flag}: ${t.honoured ? "honoured" : "ignored on this version"}`)));
		case "output": return /* @__PURE__ */ e.createElement(Te, {
			row: t,
			screen: n
		});
	}
}
function Ee({ rows: t, versions: n, version: r, onVersion: i, photoVersion: a = null, screen: o = {
	space: "srgb",
	profile: null
}, popped: s = !1 }) {
	let c = e.useMemo(() => Se(t), [t]), l = a ? `Open photo: v${a}` : s ? "Dock Developer Tools to see the open photo." : "No photo open";
	return /* @__PURE__ */ e.createElement("div", { className: m("flex h-full flex-col") }, /* @__PURE__ */ e.createElement("div", { className: m("flex shrink-0 items-center gap-1.5 border-b border-border-subtle px-2 py-1.5") }, /* @__PURE__ */ e.createElement("span", { className: m("text-text-muted") }, "Process version"), n.map((t) => /* @__PURE__ */ e.createElement("button", {
		key: t,
		type: "button",
		onClick: () => i(t),
		"aria-pressed": t === r,
		className: h(m("rounded px-1.5 py-0.5"), m(t === r ? "bg-surface-3 text-text-primary" : "text-text-muted hover:text-text-secondary"))
	}, "v", t)), /* @__PURE__ */ e.createElement("span", { className: m("ml-auto text-text-muted") }, l)), /* @__PURE__ */ e.createElement("ol", {
		"aria-label": "Pipeline",
		className: m("min-h-0 flex-1 overflow-y-auto")
	}, c.map(({ head: t, under: n }, r) => /* @__PURE__ */ e.createElement("li", {
		key: r,
		className: m("border-b border-border-subtle/50 px-2 py-1")
	}, /* @__PURE__ */ e.createElement(L, {
		row: t,
		screen: o
	}), n.length > 0 && /* @__PURE__ */ e.createElement("ul", { className: m("mt-0.5 space-y-px pl-3 text-[10px]") }, n.map((t, n) => /* @__PURE__ */ e.createElement("li", { key: n }, /* @__PURE__ */ e.createElement(L, {
		row: t,
		screen: o
	}))))))));
}
function De() {
	let n = t.devtools?.pipeline;
	return n ? /* @__PURE__ */ e.createElement(Oe, { pipeline: n }) : /* @__PURE__ */ e.createElement(v, null);
}
function Oe({ pipeline: t }) {
	let { photoId: n, version: r } = t.useOpenVersion(), [i, a] = e.useState(null), o = `${n}:${r}`;
	i && i.on !== o && a(null);
	let s = i?.on === o ? i.version : r, c = t.useRows(s), l = t.useScreen();
	return /* @__PURE__ */ e.createElement(Ee, {
		rows: c,
		versions: t.versions,
		version: s,
		onVersion: (e) => a({
			version: e,
			on: o
		}),
		photoVersion: n ? r : null,
		screen: l,
		popped: S()
	});
}
//#endregion
//#region src/VariablesTab.tsx
var R = 2e5;
function z(e) {
	return e < 1024 ? `${e} B` : e < 1048576 ? `${(e / 1024).toFixed(1)} KB` : `${(e / 1048576).toFixed(1)} MB`;
}
function B(e, t) {
	return `${t.extension} (${e.windowName(t.window)})`;
}
function ke() {
	let n = t.devtools?.variables;
	return n ? /* @__PURE__ */ e.createElement(Ae, {
		inspector: n,
		variables: t.variables
	}) : /* @__PURE__ */ e.createElement(v, null);
}
function Ae({ inspector: t, variables: n }) {
	let r = e.useSyncExternalStore(t.subscribeChanges, t.changeCount), i = e.useMemo(() => t.inspect(), [t, r]), [a, o] = e.useState(null), s = i.find((e) => e.snapshot.name === a) ?? i[0] ?? null;
	return s ? /* @__PURE__ */ e.createElement("div", { className: m("flex h-full min-h-0") }, /* @__PURE__ */ e.createElement("ul", {
		"aria-label": "Variables",
		className: m("w-56 shrink-0 overflow-y-auto border-r border-border-subtle")
	}, i.map((n) => {
		let r = n.snapshot.name, i = n.history.filter((e) => e.outcome !== "accepted").length, a = s.snapshot.name === r;
		return /* @__PURE__ */ e.createElement("li", { key: r }, /* @__PURE__ */ e.createElement("button", {
			type: "button",
			onClick: () => o(r),
			"aria-current": a,
			className: h(m("flex w-full flex-col px-2 py-1 text-left hover:bg-surface-3"), m(a ? "bg-surface-3 text-text-primary" : "text-text-secondary"))
		}, /* @__PURE__ */ e.createElement("span", { className: m("flex w-full items-center gap-1") }, /* @__PURE__ */ e.createElement("span", { className: m("min-w-0 flex-1 truncate font-code") }, r), /* @__PURE__ */ e.createElement("span", { className: m("shrink-0 text-text-muted") }, "rev ", n.snapshot.revision.n, " · ", z(n.size)), i > 0 && /* @__PURE__ */ e.createElement("span", {
			"aria-label": `${i} refused or lost`,
			className: m("shrink-0 rounded-full bg-amber-500/80 px-1 text-[9px] text-white")
		}, i)), /* @__PURE__ */ e.createElement("span", { className: m("block truncate text-text-muted") }, B(t, n.snapshot.writer))));
	})), /* @__PURE__ */ e.createElement(je, {
		key: s.snapshot.name,
		v: s,
		inspector: t,
		variables: n
	})) : /* @__PURE__ */ e.createElement("div", { className: m("p-3 text-text-muted") }, "No shared variables yet. Extensions create them with api.variables.register().");
}
var V = m("rounded px-1.5 py-0.5 text-text-secondary hover:bg-surface-3 hover:text-text-primary"), H = m("text-text-muted");
function je({ v: t, inspector: n, variables: r }) {
	let [i, a] = e.useState(null), [o, s] = e.useState(null), c = t.snapshot, l = e.useMemo(() => JSON.stringify(c.value, null, 2), [c.value]), u = l.length > R ? `${l.slice(0, R)}\n… cut off: ${z(l.length)} of JSON` : l, d = [...t.history].reverse().find((e) => e.outcome === "accepted"), f = () => {
		let e = r.get(c.name);
		a(JSON.stringify(e?.value ?? null, null, 2)), s(null);
	}, p = () => {
		let e;
		try {
			e = JSON.parse(i ?? "");
		} catch (e) {
			s(`Not valid JSON: ${e instanceof Error ? e.message : String(e)}`);
			return;
		}
		let t = r.set(c.name, e);
		t.ok ? (a(null), s(`Saved as revision ${t.revision.n}.`)) : t.reason === "stale" ? s(`${B(n, t.current.writer)} changed it since you opened the editor. Cancel and edit again to start from the new value.`) : t.reason === "invalid" ? s(`Refused: ${t.message}.`) : s("Refused: nobody has registered this variable.");
	}, h = (e) => {
		switch (e.outcome) {
			case "accepted": return "accepted";
			case "stale": return `refused: hadn't seen rev ${e.revision.n}${e.other ? ` by ${B(n, e.other)}` : ""}`;
			case "invalid": return `refused: ${e.message ?? "not JSON data"}`;
			case "lost": return `lost to ${e.other ? B(n, e.other) : "another window"}`;
		}
	};
	return /* @__PURE__ */ e.createElement("div", { className: m("flex min-w-0 flex-1 flex-col gap-2 overflow-y-auto p-2") }, /* @__PURE__ */ e.createElement("dl", { className: m("grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5") }, /* @__PURE__ */ e.createElement("dt", { className: H }, "Name"), /* @__PURE__ */ e.createElement("dd", { className: m("font-code") }, c.name), c.description && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("dt", { className: H }, "Description"), /* @__PURE__ */ e.createElement("dd", null, c.description)), /* @__PURE__ */ e.createElement("dt", { className: H }, "Registered by"), /* @__PURE__ */ e.createElement("dd", null, B(n, c.registeredBy)), /* @__PURE__ */ e.createElement("dt", { className: H }, "Last write"), /* @__PURE__ */ e.createElement("dd", null, B(n, c.writer), ", revision ", c.revision.n, d ? `, ${new Date(d.time).toLocaleTimeString()}` : ""), /* @__PURE__ */ e.createElement("dt", { className: H }, "Subscribers here"), /* @__PURE__ */ e.createElement("dd", null, t.subscribers.length > 0 ? t.subscribers.join(", ") : "none")), /* @__PURE__ */ e.createElement("details", { open: !0 }, /* @__PURE__ */ e.createElement("summary", { className: m("cursor-pointer text-text-muted") }, "Value"), /* @__PURE__ */ e.createElement("div", { className: m("my-1 flex items-center gap-2") }, i === null ? /* @__PURE__ */ e.createElement("button", {
		type: "button",
		onClick: f,
		className: V
	}, "Edit value") : /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", {
		type: "button",
		onClick: p,
		className: m("rounded px-1.5 py-0.5 text-accent hover:bg-surface-3")
	}, "Save"), /* @__PURE__ */ e.createElement("button", {
		type: "button",
		onClick: () => {
			a(null), s(null);
		},
		className: V
	}, "Cancel"))), i === null ? /* @__PURE__ */ e.createElement("pre", { className: m("max-h-64 overflow-auto rounded bg-surface-2 p-1.5 font-code text-[10px]") }, u) : /* @__PURE__ */ e.createElement("textarea", {
		"aria-label": "New value (JSON)",
		value: i,
		onChange: (e) => a(e.target.value),
		spellCheck: !1,
		className: m("h-40 w-full rounded border border-border-subtle bg-surface-2 p-1.5 font-code text-[10px] text-text-primary")
	}), o && /* @__PURE__ */ e.createElement("p", { className: m("mt-1 text-text-secondary") }, o)), /* @__PURE__ */ e.createElement("section", null, /* @__PURE__ */ e.createElement("div", { className: m("mb-1 text-text-muted") }, "History (newest first)"), /* @__PURE__ */ e.createElement("table", { className: m("w-full") }, /* @__PURE__ */ e.createElement("tbody", null, [...t.history].reverse().map((t, r) => /* @__PURE__ */ e.createElement("tr", {
		key: `${t.time}-${r}`,
		className: t.outcome === "accepted" ? void 0 : m("text-amber-400")
	}, /* @__PURE__ */ e.createElement("td", { className: m("pr-2 align-top text-text-muted") }, new Date(t.time).toLocaleTimeString()), /* @__PURE__ */ e.createElement("td", { className: m("pr-2 align-top") }, B(n, t.writer)), /* @__PURE__ */ e.createElement("td", { className: m("pr-2 align-top") }, "rev ", t.revision.n), /* @__PURE__ */ e.createElement("td", { className: m("align-top") }, h(t))))))));
}
//#endregion
//#region src/DevToolsPanel.tsx
var Me = [
	"Console",
	"Issues",
	"System",
	"Storage",
	"Variables",
	"Pipeline",
	"Native"
], U = {
	log: m("text-text-primary"),
	info: m("text-sky-400"),
	debug: m("text-text-muted"),
	warn: m("text-amber-400"),
	error: m("text-red-400"),
	exception: m("text-red-400"),
	input: m("text-accent"),
	result: m("text-emerald-400")
}, Ne = {
	log: "",
	info: "ⓘ",
	debug: "",
	warn: "▲",
	error: "✕",
	exception: "✕",
	input: "›",
	result: "‹"
}, W = (e) => e.level === "warn" || e.level === "error" || e.level === "exception";
function Pe() {
	return S() ? /* @__PURE__ */ e.createElement(Le, null) : /* @__PURE__ */ e.createElement(G, null);
}
function G({ fill: t = !1 } = {}) {
	let [n, r] = e.useState("Console"), i = D()((e) => e.entries), a = e.useMemo(() => i.filter(W).length, [i]), o = S();
	return /* @__PURE__ */ e.createElement("div", { className: h(m("flex flex-col text-[11px]"), m(t ? "h-full" : "h-[420px]")) }, /* @__PURE__ */ e.createElement("div", { className: m("flex shrink-0 items-center gap-0.5 border-b border-border-subtle bg-surface-2 px-1") }, Me.map((t) => /* @__PURE__ */ e.createElement("button", {
		key: t,
		onClick: () => r(t),
		className: h(m("relative px-2.5 py-1.5 tracking-wide transition-colors"), m(n === t ? "text-text-primary" : "text-text-muted hover:text-text-secondary"))
	}, t, t === "Issues" && a > 0 && /* @__PURE__ */ e.createElement("span", { className: m("ml-1 rounded-full bg-red-500/80 px-1 text-[9px] text-white") }, a > 999 ? "999+" : a), n === t && /* @__PURE__ */ e.createElement("span", { className: m("absolute inset-x-1.5 -bottom-px h-0.5 rounded bg-accent") }))), /* @__PURE__ */ e.createElement("div", { className: m("flex-1") }), !o && /* @__PURE__ */ e.createElement("button", {
		onClick: oe,
		title: "Open in a separate window",
		className: m("mr-1 rounded px-1.5 py-0.5 text-[12px] leading-none text-text-muted hover:bg-surface-3 hover:text-text-primary")
	}, "⧉")), /* @__PURE__ */ e.createElement("div", { className: m("min-h-0 flex-1") }, n === "Console" && /* @__PURE__ */ e.createElement(q, { entries: i }), n === "Issues" && /* @__PURE__ */ e.createElement(q, {
		entries: i,
		issuesOnly: !0
	}), n === "System" && /* @__PURE__ */ e.createElement(ze, null), n === "Storage" && /* @__PURE__ */ e.createElement(Be, null), n === "Variables" && /* @__PURE__ */ e.createElement(ke, null), n === "Pipeline" && /* @__PURE__ */ e.createElement(De, null), n === "Native" && /* @__PURE__ */ e.createElement(Ve, null)));
}
function Fe(e) {
	return {
		WebkitAppRegion: "drag",
		...e === "darwin" ? { paddingLeft: 78 } : { paddingRight: 138 }
	};
}
var Ie = { WebkitAppRegion: "no-drag" };
function Le() {
	return t.titleBar.useOverlay("--color-surface-2"), e.useEffect(() => {
		document.title = "SafeLight — Developer Tools";
	}, []), /* @__PURE__ */ e.createElement("div", { className: m("flex h-screen flex-col bg-surface-1 text-text-primary") }, /* @__PURE__ */ e.createElement("div", {
		className: m("flex h-[38px] shrink-0 items-center justify-between border-b border-border bg-surface-2 px-3"),
		style: Fe(t.devtools?.native?.platform)
	}, /* @__PURE__ */ e.createElement("span", { className: m("text-[11px] uppercase tracking-widest text-text-secondary") }, "Developer Tools"), /* @__PURE__ */ e.createElement("button", {
		onClick: se,
		title: "Close and re-dock in the main window",
		style: Ie,
		className: m("rounded px-2 py-0.5 text-[11px] text-text-muted hover:bg-surface-3 hover:text-text-primary")
	}, "⧉ Re-dock")), /* @__PURE__ */ e.createElement("div", { className: m("min-h-0 flex-1") }, /* @__PURE__ */ e.createElement(G, { fill: !0 })));
}
var K = [
	"log",
	"info",
	"warn",
	"error",
	"debug"
];
function q({ entries: t, issuesOnly: n = !1 }) {
	let [r, i] = e.useState(""), [a, o] = e.useState(new Set(K)), [s, c] = e.useState(!0), [l, u] = e.useState(null), d = e.useRef(null), f = e.useMemo(() => {
		let e = r.trim().toLowerCase();
		return t.filter((t) => {
			if (n) {
				if (!W(t)) return !1;
			} else if (!a.has(t.level) && t.level !== "exception" && t.level !== "input" && t.level !== "result") return !1;
			return !(e && !t.parts.join(" ").toLowerCase().includes(e));
		});
	}, [
		t,
		r,
		a,
		n
	]), p = f[f.length - 1]?.id;
	e.useEffect(() => {
		s && d.current && (d.current.scrollTop = d.current.scrollHeight);
	}, [
		f.length,
		p,
		s
	]);
	let g = (e) => o((t) => {
		let n = new Set(t);
		return n.has(e) ? n.delete(e) : n.add(e), n;
	});
	return /* @__PURE__ */ e.createElement("div", { className: m("flex h-full flex-col") }, /* @__PURE__ */ e.createElement("div", { className: m("flex shrink-0 flex-wrap items-center gap-1.5 border-b border-border-subtle px-2 py-1.5") }, /* @__PURE__ */ e.createElement("input", {
		value: r,
		onChange: (e) => i(e.target.value),
		placeholder: "Filter…",
		spellCheck: !1,
		className: m("min-w-0 flex-1 rounded bg-surface-2 px-2 py-1 text-text-primary outline-none placeholder:text-text-muted focus:bg-surface-3")
	}), !n && K.map((t) => /* @__PURE__ */ e.createElement("button", {
		key: t,
		onClick: () => g(t),
		title: `Toggle ${t}`,
		className: h(m("rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wide"), a.has(t) ? h(m("bg-surface-3"), U[t]) : m("bg-surface-1 text-text-muted opacity-50"))
	}, t)), /* @__PURE__ */ e.createElement("button", {
		onClick: () => c((e) => !e),
		title: "Autoscroll to newest",
		className: h(m("rounded px-1.5 py-0.5 text-[12px] leading-none"), m(s ? "text-accent" : "text-text-muted"))
	}, "↓"), /* @__PURE__ */ e.createElement("button", {
		onClick: me,
		title: "Clear log",
		className: m("rounded px-1.5 py-0.5 text-text-muted hover:text-text-primary")
	}, "🗑")), /* @__PURE__ */ e.createElement("div", {
		ref: d,
		className: m("min-h-0 flex-1 overflow-y-auto font-code")
	}, f.length === 0 ? /* @__PURE__ */ e.createElement("div", { className: m("px-3 py-4 text-center text-text-muted") }, n ? "No warnings or errors." : "No console output yet.") : f.map((t) => {
		let n = !!t.stack, r = l === t.id;
		return /* @__PURE__ */ e.createElement("div", {
			key: t.id,
			onClick: () => n && u(r ? null : t.id),
			className: h(m("flex gap-1.5 border-b border-border-subtle/50 px-2 py-1"), t.level === "error" || t.level === "exception" ? m("bg-red-500/5") : t.level === "warn" ? m("bg-amber-500/5") : null, n && m("cursor-pointer"))
		}, /* @__PURE__ */ e.createElement("span", { className: h(m("w-3 shrink-0 text-center"), U[t.level]) }, Ne[t.level]), /* @__PURE__ */ e.createElement("span", { className: m("shrink-0 text-text-muted") }, He(t.time)), /* @__PURE__ */ e.createElement("div", { className: m("min-w-0 flex-1") }, /* @__PURE__ */ e.createElement("span", { className: h(m("whitespace-pre-wrap break-words"), U[t.level]) }, t.parts.join(" ")), n && r && /* @__PURE__ */ e.createElement("pre", { className: m("mt-1 whitespace-pre-wrap break-words text-[10px] text-text-muted") }, t.stack)));
	})), !n && /* @__PURE__ */ e.createElement(Re, null));
}
function Re() {
	let [t, n] = e.useState(""), [r, i] = e.useState([]), [a, o] = e.useState(-1), s = () => {
		let e = t.trim();
		if (e) {
			A("input", [e]), i((t) => [...t, e]), o(-1), n("");
			try {
				A("result", [T((0, eval)(e))]);
			} catch (e) {
				A("exception", [e instanceof Error ? `${e.name}: ${e.message}` : T(e)], e instanceof Error ? e.stack : void 0);
			}
		}
	};
	return /* @__PURE__ */ e.createElement("div", { className: m("flex shrink-0 items-center gap-1.5 border-t border-border-subtle bg-surface-2 px-2 py-1") }, /* @__PURE__ */ e.createElement("span", { className: m("text-accent") }, "›"), /* @__PURE__ */ e.createElement("input", {
		value: t,
		onChange: (e) => n(e.target.value),
		onKeyDown: (e) => {
			if (e.key === "Enter") e.preventDefault(), s();
			else if (e.key === "ArrowUp" && r.length) {
				e.preventDefault();
				let t = a < 0 ? r.length - 1 : Math.max(0, a - 1);
				o(t), n(r[t]);
			} else if (e.key === "ArrowDown" && a >= 0) {
				e.preventDefault();
				let t = a + 1;
				t >= r.length ? (o(-1), n("")) : (o(t), n(r[t]));
			}
		},
		placeholder: "Evaluate JavaScript…",
		spellCheck: !1,
		autoComplete: "off",
		className: m("min-w-0 flex-1 bg-transparent font-code text-text-primary outline-none placeholder:text-text-muted")
	}));
}
var J = m("text-[10px] uppercase tracking-widest text-text-muted"), Y = m("border-b border-t border-border-subtle px-2 py-1.5 text-[10px] uppercase tracking-widest text-text-muted");
function ze() {
	let [n, r] = e.useState([]), [i, a] = e.useState(null), o = e.useCallback(async () => {
		let e = t.devtools, n = e?.native, i = [], o = e ? await e.appVersion() : "";
		i.push({
			label: "App version",
			value: o || "unknown"
		}), i.push({
			label: "Runtime",
			value: n ? `Electron ${n.versions.electron} · Chromium ${n.versions.chrome}` : "Browser (no Electron bridge)"
		}), i.push({
			label: "Platform",
			value: n?.platform ?? navigator.platform
		}), i.push({
			label: "User agent",
			value: navigator.userAgent
		}), i.push({
			label: "Language",
			value: navigator.language
		});
		let s = window.crossOriginIsolated === !0;
		i.push({
			label: "Cross-origin isolated",
			value: String(s) + (s ? " (SharedArrayBuffer OK)" : " — RAW decode degraded")
		}), i.push({
			label: "Hardware threads",
			value: String(navigator.hardwareConcurrency ?? "?")
		}), i.push({
			label: "Screen",
			value: `${screen.width}×${screen.height} · DPR ${window.devicePixelRatio} · ${window.innerWidth}×${window.innerHeight} viewport`
		});
		let c = e?.webglInfo() ?? null;
		c ? (i.push({
			label: "WebGL vendor",
			value: c.vendor
		}), i.push({
			label: "WebGL renderer",
			value: c.renderer
		}), i.push({
			label: "GLSL version",
			value: c.glsl
		}), i.push({
			label: "Max texture size",
			value: String(c.maxTexture)
		})) : i.push({
			label: "WebGL",
			value: "unavailable"
		});
		let l = performance.memory;
		if (l && i.push({
			label: "JS heap",
			value: `${Ue(l.usedJSHeapSize)} / ${Ue(l.jsHeapSizeLimit)} limit`
		}), i.push({
			label: "localStorage keys",
			value: String(localStorage.length)
		}), r(i), n?.gpuInfo) try {
			a(await n.gpuInfo());
		} catch {
			a(null);
		}
	}, []);
	return e.useEffect(() => {
		o();
	}, [o]), /* @__PURE__ */ e.createElement("div", { className: m("h-full overflow-y-auto") }, /* @__PURE__ */ e.createElement("div", { className: m("flex items-center justify-between border-b border-border-subtle px-2 py-1.5") }, /* @__PURE__ */ e.createElement("span", { className: J }, "Environment"), /* @__PURE__ */ e.createElement("button", {
		onClick: () => void o(),
		className: m("rounded px-1.5 py-0.5 text-text-muted hover:text-text-primary")
	}, "↻ Refresh")), /* @__PURE__ */ e.createElement("table", { className: m("w-full") }, /* @__PURE__ */ e.createElement("tbody", null, n.map((t) => /* @__PURE__ */ e.createElement("tr", {
		key: t.label,
		className: m("border-b border-border-subtle/50 align-top")
	}, /* @__PURE__ */ e.createElement("td", { className: m("w-36 shrink-0 px-2 py-1 text-text-secondary") }, t.label), /* @__PURE__ */ e.createElement("td", { className: m("px-2 py-1 font-code text-text-primary") }, /* @__PURE__ */ e.createElement("span", { className: m("break-all") }, t.value)))))), i && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("div", { className: Y }, "GPU feature status"), /* @__PURE__ */ e.createElement("table", { className: m("w-full") }, /* @__PURE__ */ e.createElement("tbody", null, Object.entries(i).map(([t, n]) => /* @__PURE__ */ e.createElement("tr", {
		key: t,
		className: m("border-b border-border-subtle/50")
	}, /* @__PURE__ */ e.createElement("td", { className: m("w-36 px-2 py-1 text-text-secondary") }, t), /* @__PURE__ */ e.createElement("td", { className: h(m("px-2 py-1 font-code"), /software|disabled|unavailable/i.test(n) ? m("text-amber-400") : m("text-emerald-400")) }, n)))))));
}
function Be() {
	let [t, n] = e.useState([]), [r, i] = e.useState(null), [a, o] = e.useState(""), [s, c] = e.useState(null), l = e.useCallback(() => {
		let e = [];
		for (let t = 0; t < localStorage.length; t++) {
			let n = localStorage.key(t);
			n && e.push(n);
		}
		e.sort(), n(e);
	}, []);
	e.useEffect(l, [l]);
	let u = (e) => {
		i(e), o(localStorage.getItem(e) ?? ""), c(null);
	}, d = () => {
		if (r != null) try {
			localStorage.setItem(r, a), c(null), l();
		} catch (e) {
			c(`Save failed: ${e instanceof Error ? e.message : String(e)}`);
		}
	}, f = (e) => {
		localStorage.removeItem(e), r === e && i(null), l();
	};
	return /* @__PURE__ */ e.createElement("div", { className: m("flex h-full flex-col") }, /* @__PURE__ */ e.createElement("div", { className: m("flex shrink-0 items-center justify-between border-b border-border-subtle px-2 py-1.5") }, /* @__PURE__ */ e.createElement("span", { className: J }, "localStorage · ", t.length, " keys"), /* @__PURE__ */ e.createElement("button", {
		onClick: l,
		className: m("rounded px-1.5 py-0.5 text-text-muted hover:text-text-primary")
	}, "↻")), /* @__PURE__ */ e.createElement("div", { className: m("flex min-h-0 flex-1") }, /* @__PURE__ */ e.createElement("div", { className: m("w-1/2 shrink-0 overflow-y-auto border-r border-border-subtle") }, t.map((t) => /* @__PURE__ */ e.createElement("div", {
		key: t,
		onClick: () => u(t),
		className: h(m("group flex items-center justify-between gap-1 px-2 py-1"), m(r === t ? "bg-surface-3" : "hover:bg-surface-2"))
	}, /* @__PURE__ */ e.createElement("span", {
		className: h(m("min-w-0 flex-1 cursor-pointer truncate font-code"), t.startsWith("sl_") ? m("text-text-primary") : m("text-text-muted")),
		title: t
	}, t), /* @__PURE__ */ e.createElement("button", {
		onClick: (e) => {
			e.stopPropagation(), f(t);
		},
		title: "Delete key",
		className: m("shrink-0 px-1 text-text-muted opacity-0 hover:text-red-400 group-hover:opacity-100")
	}, "×")))), /* @__PURE__ */ e.createElement("div", { className: m("flex min-w-0 flex-1 flex-col p-2") }, r == null ? /* @__PURE__ */ e.createElement("div", { className: m("m-auto text-text-muted") }, "Select a key to inspect.") : /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("div", {
		className: m("mb-1 truncate font-code text-text-secondary"),
		title: r
	}, r), /* @__PURE__ */ e.createElement("textarea", {
		value: a,
		onChange: (e) => o(e.target.value),
		spellCheck: !1,
		className: m("min-h-0 flex-1 resize-none rounded bg-surface-2 p-2 font-code text-[10px] text-text-primary outline-none focus:bg-surface-3")
	}), /* @__PURE__ */ e.createElement("div", { className: m("mt-1.5 flex items-center justify-end gap-1.5") }, s && /* @__PURE__ */ e.createElement("span", { className: m("mr-auto text-red-400") }, s), /* @__PURE__ */ e.createElement("button", {
		onClick: () => void navigator.clipboard?.writeText(a),
		className: m("rounded bg-surface-3 px-2 py-1 text-text-secondary hover:text-text-primary")
	}, "Copy"), /* @__PURE__ */ e.createElement("button", {
		onClick: d,
		className: m("rounded bg-slider-fill px-2 py-1 font-medium text-white hover:opacity-80")
	}, "Save"))))));
}
function X({ onClick: t, children: n }) {
	return /* @__PURE__ */ e.createElement("button", {
		onClick: t,
		className: m("rounded bg-surface-3 px-2.5 py-1 text-text-secondary hover:bg-surface-4 hover:text-text-primary")
	}, n);
}
var Z = m("px-2 py-1 text-right font-normal"), Q = m("px-2 py-1 text-right text-text-secondary");
function Ve() {
	let n = t.devtools?.electron, r = t.devtools?.native, [i, a] = e.useState(null), [o, s] = e.useState(null), c = e.useCallback(async () => {
		if (r?.metrics) try {
			a(await r.metrics());
		} catch {
			a(null);
		}
	}, [r]);
	if (e.useEffect(() => {
		c();
	}, [c]), !n && !r) return /* @__PURE__ */ e.createElement("div", { className: m("flex h-full items-center justify-center px-6 text-center text-text-muted") }, "Native tools require the SafeLight desktop app. In a browser, use your browser's own DevTools (F12).");
	let l = async (e, t) => {
		try {
			await e(), s(null);
		} catch (e) {
			s(`${t} failed: ${e instanceof Error ? e.message : String(e)}`);
		}
	};
	return /* @__PURE__ */ e.createElement("div", { className: m("flex h-full flex-col overflow-y-auto") }, /* @__PURE__ */ e.createElement("div", { className: m("border-b border-border-subtle px-2 py-1.5 text-[10px] uppercase tracking-widest text-text-muted") }, "Chrome DevTools"), /* @__PURE__ */ e.createElement("div", { className: m("flex flex-wrap gap-1.5 p-2") }, n ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(X, { onClick: () => void l(() => n.open("detach"), "Open DevTools") }, "Open ⧉"), /* @__PURE__ */ e.createElement(X, { onClick: () => void l(() => n.open("bottom"), "Dock bottom") }, "Dock ▾"), /* @__PURE__ */ e.createElement(X, { onClick: () => void l(() => n.toggle(), "Toggle") }, "Toggle"), /* @__PURE__ */ e.createElement(X, { onClick: () => void l(() => n.close(), "Close") }, "Close")) : /* @__PURE__ */ e.createElement("span", { className: m("text-text-muted") }, "DevTools control unavailable (older desktop build).")), /* @__PURE__ */ e.createElement("div", { className: Y }, "Renderer"), /* @__PURE__ */ e.createElement("div", { className: m("flex flex-wrap gap-1.5 p-2") }, /* @__PURE__ */ e.createElement(X, { onClick: () => n ? void l(() => n.reload(!1), "Reload") : location.reload() }, "Reload"), n && /* @__PURE__ */ e.createElement(X, { onClick: () => void l(() => n.reload(!0), "Hard reload") }, "Hard reload")), /* @__PURE__ */ e.createElement("div", { className: m("flex items-center justify-between border-b border-t border-border-subtle px-2 py-1.5") }, /* @__PURE__ */ e.createElement("span", { className: J }, "Process metrics"), /* @__PURE__ */ e.createElement("button", {
		onClick: () => void c(),
		title: "Refresh metrics",
		className: m("rounded px-1.5 py-0.5 text-text-muted hover:text-text-primary")
	}, "↻")), i ? /* @__PURE__ */ e.createElement("table", { className: m("w-full font-code") }, /* @__PURE__ */ e.createElement("thead", null, /* @__PURE__ */ e.createElement("tr", { className: m("text-text-muted") }, /* @__PURE__ */ e.createElement("th", { className: m("px-2 py-1 text-left font-normal") }, "Process"), /* @__PURE__ */ e.createElement("th", { className: Z }, "PID"), /* @__PURE__ */ e.createElement("th", { className: Z }, "CPU %"), /* @__PURE__ */ e.createElement("th", { className: Z }, "Memory"))), /* @__PURE__ */ e.createElement("tbody", null, i.map((t) => /* @__PURE__ */ e.createElement("tr", {
		key: t.pid,
		className: m("border-t border-border-subtle/50")
	}, /* @__PURE__ */ e.createElement("td", { className: m("px-2 py-1 text-text-primary") }, t.type), /* @__PURE__ */ e.createElement("td", { className: Q }, t.pid), /* @__PURE__ */ e.createElement("td", { className: Q }, t.cpuPercent.toFixed(1)), /* @__PURE__ */ e.createElement("td", { className: Q }, t.memoryMB.toFixed(0), " MB"))))) : /* @__PURE__ */ e.createElement("div", { className: m("px-2 py-2 text-text-muted") }, "Metrics unavailable (older desktop build)."), o && /* @__PURE__ */ e.createElement("div", { className: m("px-2 py-2 text-amber-400") }, o));
}
function He(e) {
	let t = new Date(e), n = (e, t = 2) => String(e).padStart(t, "0");
	return `${n(t.getHours())}:${n(t.getMinutes())}:${n(t.getSeconds())}.${n(t.getMilliseconds(), 3)}`;
}
var Ue = (e) => `${(e / 1048576).toFixed(1)} MB`, We = "core.devtools.toggle", $ = "safelight.devtools.styles";
function Ge(e) {
	n(e), e.registerStylesheet({
		id: $,
		css: ee(e.ui.tokens)
	}), ge(), ce(), e.devtools?.devFolder.init(), e.registerPanel({
		id: b,
		title: "Developer Tools",
		component: Pe
	}), e.registerSettings({
		title: "Developer Tools",
		fields: [],
		component: te
	}), e.registerKeybinding({
		id: We,
		label: "Toggle Developer Tools Panel",
		category: "General",
		defaultCombo: "Ctrl+Alt+I",
		handler: () => e.dock.togglePanel(b)
	});
}
function Ke() {
	_e(), le(), t.devtools?.devFolder.teardown();
}
//#endregion
export { We as KEYBINDING_ID, b as PANEL_ID, $ as STYLESHEET_ID, Ge as activate, Ke as deactivate };

//# sourceMappingURL=index.js.map