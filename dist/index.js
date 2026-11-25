//#region src/rt.ts
var e, t;
function n(n) {
	t = n, e = n.react;
}
//#endregion
//#region src/styles.ts
var r = (e) => `${e * .25}rem`, i = (e, t) => `color-mix(in oklab, ${e} ${t}%, transparent)`, a = "oklch(74.6% 0.16 232.661)", o = "oklch(82.8% 0.189 84.429)", s = "oklch(76.9% 0.188 70.08)", c = "oklch(70.4% 0.191 22.216)", l = "oklch(63.7% 0.237 25.331)", u = "oklch(76.5% 0.177 163.223)", d = c, f = o;
function p(e) {
	return {
		absolute: "position: absolute",
		relative: "position: relative",
		"inset-x-1.5": `inset-inline: ${r(1.5)}`,
		"-bottom-px": "bottom: -1px",
		"@container": "container-type: inline-size",
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
		"max-h-32": `max-height: ${r(32)}`,
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
		"pl-6": `padding-left: ${r(6)}`,
		"pr-1": `padding-right: ${r(1)}`,
		"pr-2": `padding-right: ${r(2)}`,
		"overflow-auto": "overflow: auto",
		"overflow-hidden": "overflow: hidden",
		"overflow-y-auto": "overflow-y: auto",
		truncate: "overflow: hidden; text-overflow: ellipsis; white-space: nowrap",
		"whitespace-pre-wrap": "white-space: pre-wrap",
		"break-all": "word-break: break-all",
		"break-words": "overflow-wrap: break-word",
		"wrap-anywhere": "overflow-wrap: anywhere",
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
		"border-r-0": "border-right-width: 0",
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
var m = [
	"group-hover:opacity-100",
	"placeholder:text-text-muted",
	"focus:bg-surface-3",
	"hover:bg-surface-2",
	"hover:bg-surface-3",
	"hover:bg-surface-4",
	"hover:opacity-80",
	"hover:text-red-400",
	"hover:text-text-primary",
	"hover:text-text-secondary",
	"@max-lg:flex-col",
	"@max-lg:w-full",
	"@max-lg:max-h-32",
	"@max-lg:border-r-0",
	"@max-lg:border-b"
], h = (e) => "sldt-" + e.replace(/[^a-zA-Z0-9-]/g, "_");
function g(e) {
	return e.split(" ").map((e) => h(e)).join(" ");
}
function _(...e) {
	return e.filter(Boolean).join(" ");
}
function v(e, t) {
	let n = `.${h(e)}`;
	return e.startsWith("group-hover:") ? `@media (hover: hover) { :where(.${h("group")}:hover ${n}) { ${t}; } }` : e.startsWith("placeholder:") ? `:where(${n})::placeholder { ${t}; }` : e.startsWith("focus:") ? `:where(${n}:focus) { ${t}; }` : e.startsWith("@max-lg:") ? `@container (width < 32rem) { :where(${n}) { ${t}; } }` : `@media (hover: hover) { :where(${n}:hover) { ${t}; } }`;
}
function ee(e) {
	let t = p(e), n = Object.entries(t).filter(([, e]) => e !== "").map(([e, t]) => `:where(.${h(e)}) { ${t}; }`), r = m.map((e) => v(e, t[e.slice(e.indexOf(":") + 1)])), i = (e) => `.${h(e)}`;
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
//#region src/dev/phases.ts
var y = [
	"geometry",
	"decode",
	"noise-reduction",
	"scene-linear",
	"tone-map",
	"display-adjust",
	"effects",
	"output-encode"
], b = [...y, "other"], te = {
	geometry: "Geometry",
	decode: "Decode",
	"noise-reduction": "Noise reduction",
	"scene-linear": "Scene-linear",
	"tone-map": "Tone map",
	"display-adjust": "Display adjust",
	effects: "Effects",
	"output-encode": "Output encode",
	other: "Other"
}, ne = new Set(y);
function re(e) {
	return ne.has(e);
}
function ie(e) {
	return re(e) ? e : "other";
}
function ae(e) {
	return b.indexOf(e);
}
//#endregion
//#region src/dev/status.ts
var oe = {
	crashed: "Crashed",
	quarantined: "Quarantined",
	"left-out": "Left out",
	overflowed: "Overflowed",
	"not-built": "Not built",
	running: "Running",
	registered: "Registered"
}, se = {
	crashed: "failure",
	quarantined: "failure",
	"left-out": "problem",
	overflowed: "problem",
	"not-built": "dim",
	running: "running",
	registered: "neutral"
}, ce = /@\d+$/;
function le(e) {
	return e.replace(ce, "");
}
function ue(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
	e?.programStages.forEach((e, t) => {
		let n = le(e);
		r.has(n) || r.set(n, t), n !== e && i.set(n, (i.get(n) ?? 0) + 1);
	});
	let a = /* @__PURE__ */ new Map();
	for (let [e, n] of Object.entries(t)) {
		let t = le(e);
		a.get(t)?.crashed || a.set(t, n);
	}
	let o = /* @__PURE__ */ new Set();
	for (let e of n) if (!a.has(e.id)) for (let t of e.produces ?? []) o.add(t.name);
	let s = /* @__PURE__ */ new Map();
	for (let t of e?.dormant ?? []) {
		let e = le(t);
		e !== t && s.set(e, (s.get(e) ?? 0) + 1);
	}
	return {
		live: e,
		program: r,
		copies: i,
		dormant: new Set(e?.dormant),
		dormantCopies: s,
		overflowed: new Set(e?.overflowed.map(le)),
		failures: a,
		produced: o
	};
}
function de(e) {
	return e.split("\n").find((e) => e.trim() !== "") ?? e;
}
function x(e, t, n = 0, r = 0, i = null) {
	return {
		status: e,
		tone: se[e],
		label: oe[e],
		reason: t,
		copies: n,
		dormantCopies: r,
		failure: i
	};
}
var fe = (e) => `${e} mask ${e === 1 ? "copy" : "copies"}`;
function pe(e, t) {
	let n = t.failures.get(e.id);
	if (n?.crashed) return x("crashed", `Lost the GPU: ${de(n.log)}`, 0, 0, n);
	if (n) return x("quarantined", `Taken out after a failure: ${de(n.log)}`, 0, 0, n);
	if (!t.live) return x("registered", "No live view: open Develop, or pop out Dev, to see what runs.");
	let r = t.program.has(e.id), i = (e.consumes ?? []).filter((e) => !t.produced.has(e));
	if (!r && i.length > 0) return x("left-out", `Left out: no stage the renderer can build produces ${i.map((e) => `isv_${e}`).join(", ")}.`);
	if (t.overflowed.has(e.id)) return x("overflowed", "Didn't fit in the last frame's limits.");
	if (t.dormant.has(e.id)) return x("not-built", "Not built this session: no frame has needed it since the renderer started.");
	if (r) {
		let n = t.copies.get(e.id) ?? 0, r = t.dormantCopies.get(e.id) ?? 0, i = [...n > 0 ? [`with ${fe(n)}`] : [], ...r > 0 ? [`${fe(r)} not built`] : []];
		return x("running", `In the live program${i.length > 0 ? `, ${i.join("; ")}` : ""}.`, n, r);
	}
	return x("registered", "Not in the live program.");
}
function me(e) {
	return ArrayBuffer.isView(e) && !(e instanceof DataView) && !(e instanceof BigInt64Array) && !(e instanceof BigUint64Array);
}
function he(e) {
	return Array.isArray(e) ? e : me(e) ? Array.from(e) : null;
}
function ge(e, t) {
	if (!Array.isArray(e)) return e === t;
	let n = he(t);
	return n !== null && e.length === n.length && e.every((e, t) => e === n[t]);
}
function _e(e, t) {
	let n = e.dormantWhen;
	if (!n || !t) return !1;
	let r = Object.keys(n);
	return r.length !== 0 && r.every((r) => {
		let i = r in t ? t[r] : t[`${e.id}.${r}`];
		return i !== void 0 && ge(n[r], i);
	});
}
function ve(e) {
	return e ? e.failure ? {
		kind: "failed",
		tone: "failure",
		label: "Failed to start",
		message: e.failure.message
	} : e.devError ? {
		kind: "dev-error",
		tone: "failure",
		label: "Dev folder error",
		message: e.devError
	} : e.enabled ? e.callbackFailures > 0 ? {
		kind: "callback-failures",
		tone: "problem",
		label: "A callback failed",
		message: null
	} : e.running ? {
		kind: "running",
		tone: "running",
		label: "Running",
		message: null
	} : {
		kind: "installed",
		tone: "neutral",
		label: "Installed, not running",
		message: null
	} : {
		kind: "off",
		tone: "dim",
		label: "Turned off",
		message: null
	} : {
		kind: "running",
		tone: "running",
		label: "Running",
		message: null
	};
}
//#endregion
//#region src/dev/model.ts
var S = "core", ye = "core", be = "header", xe = (e) => `band:${e}`, Se = (e) => `stage:${e}`, Ce = {
	"to-extensions": "to extensions",
	"from-extensions": "from extensions",
	"to-stages": "to stages",
	"from-stages": "from stages"
}, we = [
	{
		id: "param-bag",
		label: "param bag",
		group: "to-extensions"
	},
	{
		id: "catalogue",
		label: "catalogue",
		group: "to-extensions"
	},
	{
		id: "renderer",
		label: "renderer",
		group: "to-extensions"
	},
	{
		id: "ui-shell",
		label: "UI shell",
		group: "to-extensions"
	},
	{
		id: "settings-variables-out",
		label: "settings + variables",
		group: "to-extensions"
	},
	{
		id: "ui-registrations",
		label: "UI registrations",
		group: "from-extensions"
	},
	{
		id: "settings-variables-in",
		label: "settings + variables",
		group: "from-extensions"
	},
	{
		id: "stage-textures",
		label: "stage textures",
		group: "from-extensions"
	},
	{
		id: "stage-declarations",
		label: "stage declarations",
		group: "from-extensions"
	},
	{
		id: "image",
		label: "image",
		group: "to-stages"
	},
	{
		id: "uniforms",
		label: "uniforms",
		group: "to-stages"
	},
	{
		id: "derived",
		label: "derived",
		group: "to-stages"
	},
	{
		id: "prepass",
		label: "prepass",
		group: "to-stages"
	},
	{
		id: "textures",
		label: "textures",
		group: "to-stages"
	},
	{
		id: "brush",
		label: "brush",
		group: "to-stages"
	},
	{
		id: "mask",
		label: "mask",
		group: "to-stages"
	},
	{
		id: "geometry",
		label: "geometry",
		group: "from-stages"
	},
	{
		id: "display-export",
		label: "display + export",
		group: "from-stages"
	}
], Te = /* @__PURE__ */ new Set([
	"uniforms",
	"derived",
	"prepass",
	"textures",
	"brush",
	"mask"
]), Ee = {
	params: {
		label: "params",
		core: "param-bag"
	},
	catalogue: {
		label: "photo / catalogue",
		core: "catalogue"
	},
	settings: {
		label: "settings",
		core: "settings-variables-out"
	},
	variables: {
		label: "variables",
		core: "settings-variables-out"
	}
}, De = {
	ui: {
		label: "UI register",
		core: "ui-registrations"
	},
	"settings-variables": {
		label: "settings + variables",
		core: "settings-variables-in"
	},
	"stage-texture": {
		label: "stage texture",
		core: "stage-textures"
	},
	"stage-declaration": {
		label: "stage declaration",
		core: "stage-declarations"
	}
}, Oe = [
	{
		kind: "panels",
		label: "Panels",
		port: "ui"
	},
	{
		kind: "modules",
		label: "Modules",
		port: "ui"
	},
	{
		kind: "slots",
		label: "Slots",
		port: "ui"
	},
	{
		kind: "stylesheets",
		label: "Stylesheets",
		port: "ui"
	},
	{
		kind: "themes",
		label: "Themes",
		port: "ui"
	},
	{
		kind: "layouts",
		label: "Layouts",
		port: "ui"
	},
	{
		kind: "panelHeaderAccessories",
		label: "Panel header accessories",
		port: "ui"
	},
	{
		kind: "sliderIcons",
		label: "Slider icons",
		port: "ui"
	},
	{
		kind: "catalogHooks",
		label: "Catalogue hooks",
		port: "catalogue"
	},
	{
		kind: "gridFilters",
		label: "Grid filters",
		port: "catalogue"
	},
	{
		kind: "gridMenuItems",
		label: "Grid menu items",
		port: "catalogue"
	},
	{
		kind: "librarySorts",
		label: "Library sorts",
		port: "catalogue"
	},
	{
		kind: "settings",
		label: "Settings",
		port: "settings"
	},
	{
		kind: "pipelines",
		label: "Display transforms",
		port: null
	},
	{
		kind: "exportProcessors",
		label: "Export processors",
		port: null
	},
	{
		kind: "filenameTemplates",
		label: "Filename templates",
		port: null
	},
	{
		kind: "presetImporters",
		label: "Preset importers",
		port: null
	}
], ke = /* @__PURE__ */ new Set([
	"coverage",
	"atlas",
	"paint"
]);
function Ae(e, t, n) {
	let r = e.get(t);
	r ? r.push(n) : e.set(t, [n]);
}
function je(e, t) {
	let n = /* @__PURE__ */ new Map(), r = (e) => {
		let t = n.get(e);
		return t || (t = {
			stages: [],
			contributions: /* @__PURE__ */ new Map()
		}, n.set(e, t)), t;
	};
	for (let e of t ?? []) r(e.id);
	for (let { kind: t } of Oe) for (let [n, i] of Object.entries(e[t])) Ae(r(i.extensionId).contributions, t, n);
	for (let t of Object.values(e.processingStages)) {
		let e = r(t.extensionId);
		e.stages.push(t), Ae(e.contributions, "processingStages", t.id);
	}
	return n;
}
function Me(e, t) {
	let n = [], r = [];
	t || n.push({
		id: "colour",
		label: "colour in"
	});
	for (let t of e.consumes ?? []) n.push({
		id: `consumes:${t}`,
		label: `consumes ${t}`
	});
	let i = e.uniforms.length + (e.passes ?? []).reduce((e, t) => e + (t.uniforms?.length ?? 0), 0);
	i > 0 && n.push({
		id: "uniforms",
		label: `uniforms (${i})`
	}), e.derive && n.push({
		id: "derived",
		label: "derived"
	});
	let a = e.passes?.length ?? 0;
	a > 0 && n.push({
		id: "prepass",
		label: `prepass (${a})`
	});
	let o = e.textures ?? [], s = o.filter((e) => ke.has(e.kind)).length;
	o.length > s && n.push({
		id: "textures",
		label: `textures (${o.length - s})`
	}), s > 0 && n.push({
		id: "brush",
		label: `brush (${s})`
	}), e.mask?.maskable && n.push({
		id: "mask",
		label: "mask"
	}), t || r.push({
		id: "colour",
		label: "colour out"
	});
	for (let t of e.produces ?? []) r.push({
		id: `produces:${t.name}`,
		label: `produces ${t.name}`
	});
	return t && r.push({
		id: "geometry",
		label: "geometry"
	}), {
		inPorts: n,
		outPorts: r
	};
}
function Ne(e) {
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = (e, t, n) => {
		let r = e.get(t) ?? [];
		r.includes(n) || r.push(n), e.set(t, r);
	};
	for (let i of e) {
		let e = i.snapshot.name;
		for (let n of i.subscribers) r(t, n, e);
		r(n, i.snapshot.registeredBy.extension, e), r(n, i.snapshot.writer.extension, e);
		for (let t of i.history) t.outcome === "accepted" && r(n, t.writer.extension, e);
	}
	return {
		subscribed: t,
		written: n
	};
}
var Pe = (e, t) => [...e.contributions.keys()].some((e) => t.has(e)), Fe = (e) => new Set(Oe.filter((t) => t.port === e).map((e) => e.kind)), Ie = Fe("ui"), Le = Fe("catalogue"), Re = Fe("settings"), ze = {
	running: 0,
	neutral: 1,
	dim: 2,
	problem: 3,
	failure: 4
}, Be = (e, t) => ze[e] >= ze[t] ? e : t, Ve = (e) => e === "problem" || e === "failure";
function He(e) {
	let { registry: t, extensions: n } = e, r = new Map((n ?? []).map((e) => [e.id, e])), i = je(t, n), a = Object.values(t.processingStages), o = ue(e.live, e.failures, a), s = /* @__PURE__ */ new Map();
	e.rows.forEach((e, t) => {
		e.kind === "stage" && !s.has(e.id) && s.set(e.id, t);
	});
	let c = new Map(a.map((e) => [e.id, [
		ae(ie(e.phase)),
		o.program.get(e.id) ?? Infinity,
		s.get(e.id) ?? Infinity,
		e.priority ?? 100
	]])), l = [...a].sort((e, t) => {
		let n = c.get(e.id) ?? [], r = c.get(t.id) ?? [];
		for (let e = 0; e < n.length; e++) if (n[e] !== r[e]) return n[e] - r[e];
		return e.id < t.id ? -1 : +(e.id > t.id);
	}).map((e, t) => {
		let n = e.phase === "geometry";
		return {
			id: Se(e.id),
			stageId: e.id,
			name: e.name,
			extensionId: e.extensionId,
			bandId: xe(e.extensionId),
			lane: ie(e.phase),
			anchor: e.anchor ?? null,
			geometry: n,
			stage: e,
			...Me(e, n),
			state: pe(e, o),
			rank: t
		};
	}), u = /* @__PURE__ */ new Map();
	for (let e of l) Ae(u, e.extensionId, e);
	let d = /* @__PURE__ */ new Map();
	for (let e of l) for (let t of e.stage.produces ?? []) d.has(t.name) || d.set(t.name, e);
	let f = Ne(e.variables), p = [...i.entries()].map(([t, n]) => {
		let i = r.get(t) ?? null, a = t === ye, o = u.get(t) ?? [], s = f.subscribed.get(t) ?? [], c = f.written.get(t) ?? [], l = [], d = [], p = (e) => l.push({
			id: e,
			label: Ee[e].label
		}), m = (e) => d.push({
			id: e,
			label: De[e].label
		});
		o.some((e) => e.inPorts.some((e) => e.id === "uniforms")) && p("params"), Pe(n, Le) && p("catalogue"), Pe(n, Re) && p("settings"), s.length > 0 && p("variables"), Pe(n, Ie) && m("ui"), c.length > 0 && m("settings-variables"), o.some((e) => (e.stage.textures?.length ?? 0) > 0) && m("stage-texture"), o.length > 0 && m("stage-declaration");
		let h = ve(i), g = new Map(Oe.map((e) => [e.kind, e.label]));
		return g.set("processingStages", "Processing stages"), {
			id: xe(t),
			extensionId: t,
			name: i?.name ?? (a ? "Safelight" : t),
			version: i?.version ?? (a ? e.appVersion : null),
			source: i?.source ?? (a ? "builtin" : null),
			info: i,
			status: h,
			stages: o,
			inPorts: l,
			outPorts: d,
			contributions: [...n.contributions.entries()].map(([e, t]) => ({
				kind: e,
				label: g.get(e) ?? e,
				ids: t
			})),
			subscribed: s,
			written: c,
			problem: Ve(h.tone) || o.some((e) => Ve(e.state.tone))
		};
	});
	p.sort((e, t) => e.extensionId === "core" || t.extensionId === "core" ? e.extensionId === "core" ? -1 : 1 : e.name.localeCompare(t.name, void 0, { sensitivity: "base" }) || (e.extensionId < t.extensionId ? -1 : 1));
	let m = {
		extensions: {
			running: 0,
			failed: 0,
			off: 0
		},
		stages: {
			running: 0,
			notBuilt: 0,
			problems: 0
		}
	};
	for (let e of p) e.status.kind === "running" || e.status.kind === "callback-failures" ? m.extensions.running++ : e.status.kind === "failed" || e.status.kind === "dev-error" ? m.extensions.failed++ : e.status.kind === "off" && m.extensions.off++;
	for (let e of l) e.state.status === "running" ? m.stages.running++ : e.state.status === "not-built" ? m.stages.notBuilt++ : Ve(e.state.tone) && m.stages.problems++;
	return {
		bands: p,
		stages: l,
		producers: d,
		stats: m
	};
}
function Ue(e, t) {
	return t[e.id] ?? e.stages.length === 0;
}
function We(e, t) {
	let n = (e) => e.toLowerCase().includes(t);
	return n(e.name) || n(e.extensionId) || e.stages.some((e) => n(e.name) || n(e.stageId));
}
function Ge(e, t) {
	if (!e || e.kind === "edge") return null;
	let n = e.kind === "node" ? e.id : e.node;
	return n.startsWith("band:") ? n : t.stages.find((e) => e.id === n)?.bandId ?? null;
}
var Ke = (e) => `${e.node}.${e.port}`;
function qe(e, t) {
	let n = t.search.trim().toLowerCase(), r = e.bands.filter((e) => n ? We(e, n) : t.showAll || e.stages.length > 0 || e.problem).map((e) => ({
		...e,
		collapsed: Ue(e, t.collapsed)
	})), i = new Map(r.map((e) => [e.id, e])), a = e.stages.filter((e) => i.has(e.bandId)), o = (e, t) => i.get(e.bandId)?.collapsed ? {
		node: e.bandId,
		port: be
	} : {
		node: e.id,
		port: t
	}, s = [], c = /* @__PURE__ */ new Set(), l = (e, t, n, r, i, a) => {
		if (t.node === n.node && t.port === n.port) return;
		let o = `${e}:${Ke(t)}>${Ke(n)}`;
		c.has(o) || (c.add(o), s.push({
			id: o,
			kind: e,
			from: t,
			to: n,
			owner: r,
			tone: i,
			label: a
		}));
	}, u = (e) => ({
		node: S,
		port: e
	}), d = null;
	for (let e of a) {
		if (e.geometry) continue;
		let t = d ? Be(d.state.tone, e.state.tone) : e.state.tone;
		l("colour", d ? o(d, "colour") : u("image"), o(e, "colour"), e.extensionId, t, "colour"), d = e;
	}
	d && l("colour", o(d, "colour"), u("display-export"), d.extensionId, d.state.tone, "colour");
	for (let t of a) for (let n of t.stage.consumes ?? []) {
		let r = e.producers.get(n);
		if (!r || !i.has(r.bandId)) continue;
		let a = Be(r.state.tone, t.state.tone);
		l("isv", o(r, `produces:${n}`), o(t, `consumes:${n}`), t.extensionId, a, `isv_${n}`);
	}
	for (let e of a) for (let t of e.inPorts) Te.has(t.id) && l("resource", u(t.id), o(e, t.id), e.extensionId, e.state.tone, t.id);
	for (let e of a) e.geometry && l("geometry", o(e, "geometry"), u("geometry"), e.extensionId, e.state.tone, "geometry");
	let f = i.get(Ge(t.selection, e) ?? "");
	if (f) {
		let e = (e) => f.collapsed ? {
			node: f.id,
			port: be
		} : {
			node: f.id,
			port: e
		}, t = f.status.tone;
		for (let n of f.inPorts) l("registration", u(Ee[n.id].core), e(n.id), f.extensionId, t, n.label);
		for (let n of f.outPorts) l("registration", e(n.id), u(De[n.id].core), f.extensionId, t, n.label);
	}
	let p = /* @__PURE__ */ new Map(), m = !1;
	for (let e of a) e.lane === "other" && (m = !0), i.get(e.bandId)?.collapsed || p.set(e.lane, (p.get(e.lane) ?? 0) + 1);
	let h = (m ? b : y).map((e) => ({
		id: e,
		label: te[e],
		stages: p.get(e) ?? 0
	})), g = /* @__PURE__ */ new Set();
	for (let e of s) e.from.node === "core" && g.add(e.from.port), e.to.node === "core" && g.add(e.to.port);
	return {
		lanes: h,
		core: we.map((e) => ({
			...e,
			used: g.has(e.id)
		})),
		bands: r,
		edges: s
	};
}
function Je(e, t) {
	if (!t) return null;
	let n = /* @__PURE__ */ new Map();
	for (let t of e.bands) for (let e of t.stages) n.set(e.id, t.id);
	let r = /* @__PURE__ */ new Set(), i;
	if (t.kind === "edge") i = (e) => e.id === t.id;
	else if (t.kind === "port") r.add(t.node), i = (e) => e.from.node === t.node && e.from.port === t.port || e.to.node === t.node && e.to.port === t.port;
	else {
		let n = e.bands.find((e) => e.id === t.id);
		r.add(t.id);
		for (let e of n?.stages ?? []) r.add(e.id);
		let a = new Set(r);
		i = (e) => a.has(e.from.node) || a.has(e.to.node);
	}
	let a = /* @__PURE__ */ new Set();
	for (let t of e.edges) i(t) && (a.add(t.id), r.add(t.from.node), r.add(t.to.node));
	for (let e of [...r]) {
		let t = n.get(e);
		t && r.add(t);
	}
	return {
		nodes: r,
		edges: a
	};
}
var Ye = 420, Xe = 18, C = 40, Ze = 6, Qe = 14, $e = 10, et = 18, tt = 14, nt = 8, rt = 20, it = 8, at = 24, w = (e, t) => `${e}|${t}`, T = (e) => String(Math.round(e * 10) / 10);
function E(e, ...t) {
	return t.reduce((e, t, n) => `${e} ${n % 2 == 0 ? "H" : "V"} ${T(t)}`, `M ${T(e.x)} ${T(e.y)}`);
}
function ot(e) {
	let t = e.x + e.facing * 6;
	return `M ${T(e.x)} ${T(e.y)} L ${T(t)} ${T(e.y - 3)} L ${T(t)} ${T(e.y + 3)} Z`;
}
var st = (e) => 24 + Math.max(e.inPorts.length, e.outPorts.length, 1) * 16 + Ze, ct = (e) => 180 + e * 5;
function lt(e, t) {
	let n = /* @__PURE__ */ new Map(), r = Ye, i = e.lanes.map((e) => {
		let n = e.stages === 0, i = n && !t.showEmptyPhases ? 26 : 220, a = {
			id: e.id,
			label: e.label,
			x: r,
			w: i,
			empty: n
		};
		return r += i, a;
	}), a = r + at, o = new Map(i.map((e) => [e.id, e])), s = C, c = [], l = [], u = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map();
	for (let t of e.bands) {
		u.set(t.id, s);
		let e = {
			x: 288,
			y: s,
			w: a - at - 288,
			h: 28
		};
		if (n.set(w(t.id, be), {
			x: 288,
			y: s + 14,
			facing: -1
		}), t.collapsed) {
			c.push({
				id: t.id,
				band: t,
				rect: { ...e },
				header: e,
				collapsed: !0,
				ports: []
			}), d.set(t.id, s + 28), s += 42;
			continue;
		}
		let r = s + 28 + $e, i = [...t.inPorts.map((e) => ({
			...e,
			side: "in"
		})), ...t.outPorts.map((e) => ({
			...e,
			side: "out"
		}))].map((e, t) => ({
			...e,
			x: 288,
			y: r + t * 16 + 8
		}));
		for (let e of i) n.set(w(t.id, e.id), {
			x: e.x,
			y: e.y,
			facing: -1
		});
		let f = /* @__PURE__ */ new Map(), p = 0;
		for (let e of t.stages) {
			let i = o.get(e.lane);
			if (!i) continue;
			let a = f.get(e.lane) ?? r, s = st(e), c = {
				x: i.x + Xe,
				y: a,
				w: 184,
				h: s
			};
			l.push({
				id: e.id,
				band: t.id,
				lane: e.lane,
				stage: e,
				rect: c
			}), e.inPorts.forEach((t, r) => n.set(w(e.id, t.id), {
				x: c.x,
				y: c.y + 24 + r * 16 + 8,
				facing: -1
			})), e.outPorts.forEach((t, r) => n.set(w(e.id, t.id), {
				x: c.x + 184,
				y: c.y + 24 + r * 16 + 8,
				facing: 1
			})), f.set(e.lane, a + s + Qe), p = Math.max(p, a + s - r);
		}
		let m = 38 + Math.max(i.length * 16, p) + et;
		c.push({
			id: t.id,
			band: t,
			rect: {
				...e,
				h: m
			},
			header: e,
			collapsed: !1,
			ports: i
		}), d.set(t.id, s + m), s += m + tt;
	}
	let f = [], p = [], m = 74, h = null;
	for (let t of e.core) {
		t.group !== h && (h !== null && (m += it), h = t.group, f.push({
			label: Ce[t.group],
			y: m
		}), m += rt);
		let e = m + 8;
		p.push({
			...t,
			y: e
		}), n.set(w(S, t.id), {
			x: 168,
			y: e,
			facing: 1
		}), m += 16;
	}
	let g = c.length > 0 ? s - tt : C, _ = {
		x: 0,
		y: C,
		w: 168,
		h: Math.max(m + 10, g) - C
	}, v = Math.max(_.y + _.h, g) + at, ee = new Map(e.core.map((e, t) => [e.id, t])), y = new Map(l.map((e) => [e.id, e])), b = /* @__PURE__ */ new Map();
	for (let e of l) {
		let t = b.get(e.band);
		t ? t.push(e) : b.set(e.band, [e]);
	}
	let te = (e) => (d.get(e) ?? 0) + tt / 2, ne = (e) => (u.get(e) ?? C) - tt / 2, re = (e) => (o.get(e.lane)?.x ?? e.rect.x - Xe) + 6, ie = (e, t, n, r, i) => !(b.get(r) ?? []).some((r) => r.id !== i && r.rect.y < e && e < r.rect.y + r.rect.h && r.rect.x < Math.max(t, n) && r.rect.x + r.rect.w > Math.min(t, n)), ae = [];
	for (let t of e.edges) {
		let e = n.get(w(t.from.node, t.from.port)), r = n.get(w(t.to.node, t.to.port));
		if (!e || !r) continue;
		let i = t.from.node === S, a = t.to.node === S, o = ct(ee.get(i ? t.from.port : t.to.port) ?? 0), s = y.get(t.from.node), c = y.get(t.to.node), l;
		if (s && a) l = E(e, e.x + nt, te(s.band), o, r.y, r.x);
		else if (s && c) {
			let t = re(c);
			l = t >= e.x + nt && ie(e.y, e.x, t, s.band, s.id) ? E(e, t, r.y, r.x) : E(e, e.x + nt, te(s.band), t, r.y, r.x);
		} else if (s) l = E(e, e.x + nt, te(s.band), 280, r.y, r.x);
		else if (c) {
			let t = i ? o : 280;
			l = ie(r.y, t, r.x, c.band, c.id) ? E(e, t, r.y, r.x) : E(e, t, ne(c.band), re(c), r.y, r.x);
		} else l = E(e, i || a ? o : 280, r.y, r.x);
		ae.push({
			id: t.id,
			edge: t,
			d: l,
			arrow: ot(r)
		});
	}
	return {
		width: a,
		height: v,
		lanes: i,
		core: _,
		corePorts: p,
		coreGroups: f,
		bands: c,
		nodes: l,
		ports: n,
		edges: ae
	};
}
//#endregion
//#region src/dev/palette.ts
var ut = 110, dt = 240;
function ft(e) {
	let t = 2166136261;
	for (let n = 0; n < e.length; n++) t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
	return ut + (t >>> 0) % dt;
}
function D(e, t) {
	return e === "core" ? t.accent : `oklch(64% 0.13 ${ft(e)})`;
}
function pt(e, t) {
	return e === "failure" ? d : e === "problem" ? f : t;
}
function O(e, t, n) {
	return `color-mix(in oklab, ${e} ${n}%, ${t})`;
}
//#endregion
//#region src/dev/store.ts
var mt = () => ({
	selection: null,
	registrationBand: null,
	showAll: !1,
	showEmpty: !1,
	search: "",
	collapsed: {},
	view: {
		x: 24,
		y: 24,
		k: 1
	},
	fitRequest: 0,
	focus: null
}), ht = null;
function k() {
	return ht ??= t.stores.create()((e) => ({
		...mt(),
		select: (t) => e(t === null ? {
			selection: t,
			registrationBand: null
		} : { selection: t }),
		setRegistrationBand: (t) => e({ registrationBand: t }),
		setSearch: (t) => e({ search: t }),
		toggleShowAll: () => e((e) => ({ showAll: !e.showAll })),
		setShowAll: (t) => e({ showAll: t }),
		toggleShowEmpty: () => e((e) => ({ showEmpty: !e.showEmpty })),
		setCollapsed: (t, n) => e((e) => ({ collapsed: {
			...e.collapsed,
			...Object.fromEntries(t.map((e) => [e, n]))
		} })),
		setView: (t) => e({ view: t }),
		requestFit: () => e((e) => ({ fitRequest: e.fitRequest + 1 })),
		focusOn: (t) => e((e) => ({ focus: {
			id: t,
			n: (e.focus?.n ?? 0) + 1
		} }))
	})), ht;
}
//#endregion
//#region src/dev/hold-text-selection.ts
function gt(e = document) {
	let t = (e) => e.preventDefault();
	e.addEventListener("selectstart", t, !0);
	let n = !0;
	return () => {
		n && (n = !1, e.removeEventListener("selectstart", t, !0));
	};
}
//#endregion
//#region src/dev/view-math.ts
var _t = .1, vt = (e) => Math.min(3, Math.max(_t, e));
function yt(e, t, n) {
	let r = vt(e.k * n), i = r / e.k;
	return {
		x: t.x - (t.x - e.x) * i,
		y: t.y - (t.y - e.y) * i,
		k: r
	};
}
function bt(e, t) {
	let n = t === 1 ? e * 16 : t === 2 ? e * 400 : e;
	return Math.exp(-n * .002);
}
function xt(e, t) {
	let n = vt(Math.min(1, Math.min(t.width / e.width, t.height / e.height) * .95));
	return {
		x: (t.width - e.width * n) / 2,
		y: (t.height - e.height * n) / 2,
		k: n
	};
}
var St = 16;
function Ct(e, t) {
	let n = xt(e, t);
	return n.k >= 1 ? n : {
		x: St,
		y: St,
		k: 1
	};
}
function wt(e, t, n) {
	return {
		x: t.width / 2 - e.x * n,
		y: t.height / 2 - e.y * n,
		k: n
	};
}
//#endregion
//#region src/dev/GraphView.tsx
var Tt = "[data-hit], button, input", Et = (e) => e instanceof Element && e.closest(Tt) !== null;
function Dt({ layout: n, linked: r, selection: i }) {
	let a = e.useRef(null), o = k(), s = o((e) => e.view), c = o((e) => e.fitRequest), l = o((e) => e.focus), [u, d] = e.useState(!1), f = e.useRef(null), p = e.useRef(n);
	p.current = n;
	let m = Pt(), h = e.useCallback((e = !1) => {
		let t = a.current;
		if (!t || t.offsetWidth === 0 || t.offsetHeight === 0) return;
		let { width: n, height: r } = p.current, i = e ? Ct : xt;
		k().getState().setView(i({
			width: n,
			height: r
		}, {
			width: t.offsetWidth,
			height: t.offsetHeight
		}));
	}, []);
	e.useEffect(() => h(c === 0), [h, c]), e.useEffect(() => {
		let e = a.current;
		if (!l || !e || e.offsetWidth === 0) return;
		let t = p.current, n = t.nodes.find((e) => e.id === l.id)?.rect ?? t.bands.find((e) => e.id === l.id)?.header;
		if (!n) return;
		let r = k().getState(), i = {
			x: n.x + n.w / 2,
			y: n.y + n.h / 2
		};
		r.setView(wt(i, {
			width: e.offsetWidth,
			height: e.offsetHeight
		}, r.view.k));
	}, [l]), e.useEffect(() => {
		let e = a.current;
		if (!e) return;
		let n = (n) => {
			n.preventDefault();
			let r = k().getState();
			r.setView(yt(r.view, t.develop.framePoint(e, n.clientX, n.clientY), bt(n.deltaY, n.deltaMode)));
		};
		return e.addEventListener("wheel", n, { passive: !1 }), () => e.removeEventListener("wheel", n);
	}, []);
	let _ = e.useRef(null), v = () => {
		_.current?.(), _.current = null;
	};
	e.useEffect(() => v, []);
	let ee = (e) => {
		if (e.button !== 0 || Et(e.target)) return;
		v(), _.current = gt();
		let n = e.currentTarget;
		f.current = {
			pointer: e.pointerId,
			start: t.develop.framePoint(n, e.clientX, e.clientY),
			view: k().getState().view,
			moved: !1
		}, n.setPointerCapture?.(e.pointerId), d(!0);
	}, y = (e) => {
		let n = f.current;
		if (!n || e.pointerId !== n.pointer) return;
		let r = t.develop.framePoint(e.currentTarget, e.clientX, e.clientY), i = r.x - n.start.x, a = r.y - n.start.y;
		Math.abs(i) + Math.abs(a) > 2 && (n.moved = !0), k().getState().setView({
			x: n.view.x + i,
			y: n.view.y + a,
			k: n.view.k
		});
	}, b = (e) => {
		let t = f.current;
		if (!t || e.pointerId !== t.pointer) return;
		f.current = null, v();
		let n = e.currentTarget;
		n.hasPointerCapture?.(e.pointerId) && n.releasePointerCapture(e.pointerId), d(!1), !t.moved && e.type === "pointerup" && k().getState().select(null);
	};
	return /* @__PURE__ */ e.createElement("div", {
		ref: a,
		"data-testid": "dev-viewport",
		tabIndex: 0,
		"aria-label": "Extension graph",
		className: g("relative h-full w-full overflow-hidden outline-none"),
		style: {
			cursor: u ? t.cursors.resolve("panning") : void 0,
			touchAction: "none"
		},
		onPointerDown: ee,
		onPointerMove: y,
		onPointerUp: b,
		onPointerCancel: b,
		onDoubleClick: (e) => {
			Et(e.target) || h();
		},
		onKeyDown: (e) => {
			e.key === "Escape" && k().getState().select(null);
		}
	}, /* @__PURE__ */ e.createElement("div", {
		"data-testid": "dev-world",
		style: {
			position: "absolute",
			left: 0,
			top: 0,
			transformOrigin: "0 0",
			transform: `translate(${s.x}px, ${s.y}px) scale(${s.k})`
		}
	}, /* @__PURE__ */ e.createElement(m, {
		layout: n,
		linked: r,
		selection: i
	})));
}
var Ot = {
	builtin: "built-in",
	installed: "installed",
	dev: "dev folder"
}, A = .5, kt = (e) => ({
	left: e.x,
	top: e.y,
	width: e.w,
	height: e.h
});
function At(e, n) {
	let r = t.ui.tokens;
	return e === "running" ? n : e === "dim" ? r.textMuted : e === "neutral" ? r.border : pt(e, n);
}
function jt({ state: n }) {
	let r = t.ui.tokens, i = At(n.tone, r.accent);
	return /* @__PURE__ */ e.createElement("span", {
		className: g("shrink-0 rounded-full px-1.5 text-[11px] text-text-primary"),
		style: { background: O(i, "transparent", 28) },
		title: n.message ?? void 0
	}, n.label);
}
function Mt({ side: t, colour: n }) {
	return /* @__PURE__ */ e.createElement("span", {
		"data-dot": "",
		className: g("absolute rounded-full"),
		style: {
			[t]: -3,
			top: 5,
			width: 6,
			height: 6,
			background: n
		}
	});
}
var Nt = null;
function Pt() {
	return Nt ??= e.memo(Ft), Nt;
}
function Ft({ layout: n, linked: r, selection: i }) {
	let a = t.ui.tokens, o = k().getState().select, s = (e) => r ? !r.nodes.has(e) : !1, c = (e, t) => i?.kind === "port" && i.node === e && i.port === t, l = (e) => i?.kind === "node" && i.id === e, u = n.lanes[n.lanes.length - 1];
	return /* @__PURE__ */ e.createElement("div", {
		className: g("relative text-[11px]"),
		style: {
			width: n.width,
			height: n.height
		}
	}, n.lanes.map((t) => /* @__PURE__ */ e.createElement("div", {
		key: t.id,
		className: g("absolute"),
		style: {
			left: t.x,
			top: 0,
			width: t.w,
			height: n.height,
			borderLeft: `1px dashed ${a.borderSubtle}`,
			borderRight: t === u ? `1px dashed ${a.borderSubtle}` : void 0
		}
	}, /* @__PURE__ */ e.createElement("div", {
		title: t.label,
		className: g("truncate px-2 py-2 text-[11px] uppercase tracking-widest text-text-secondary"),
		style: t.empty && t.w < 184 ? {
			writingMode: "vertical-rl",
			padding: "8px 4px",
			overflow: "visible"
		} : void 0
	}, t.label))), n.bands.map((t) => /* @__PURE__ */ e.createElement("div", {
		key: t.id,
		className: g("absolute rounded border border-border-subtle"),
		style: {
			...kt(t.rect),
			background: O(D(t.band.extensionId, a), "transparent", 5),
			opacity: s(t.id) ? A : 1
		}
	})), /* @__PURE__ */ e.createElement("svg", {
		width: n.width,
		height: n.height,
		className: g("absolute"),
		style: {
			left: 0,
			top: 0,
			overflow: "visible",
			pointerEvents: "none"
		}
	}, n.edges.map((t) => /* @__PURE__ */ e.createElement(It, {
		key: t.id,
		laid: t,
		dimmed: r ? !r.edges.has(t.id) : !1,
		emphasised: r?.edges.has(t.id) ?? !1,
		selected: i?.kind === "edge" && i.id === t.id
	}))), /* @__PURE__ */ e.createElement(Rt, {
		layout: n,
		dimmed: s(S),
		selected: l(S),
		portSelected: (e) => c(S, e)
	}), n.bands.map((t) => /* @__PURE__ */ e.createElement(Bt, {
		key: t.id,
		laid: t,
		dimmed: s(t.id),
		selected: l(t.id),
		portSelected: (e) => c(t.id, e)
	})), n.nodes.map((t) => /* @__PURE__ */ e.createElement(Ht, {
		key: t.id,
		laid: t,
		dimmed: s(t.id),
		selected: l(t.id),
		portSelected: (e) => c(t.id, e),
		onSelect: o
	})));
}
function It({ laid: n, dimmed: r, emphasised: i, selected: a }) {
	let o = t.ui.tokens, s = n.edge, c = a ? o.accent : pt(s.tone, D(s.owner, o)), l = s.tone === "dim" || s.tone === "neutral", u = s.kind === "resource", d = r ? A : i ? 1 : l ? .75 : u ? .7 : 1, f = a ? 2.5 : u && !i ? 1 : 1.5;
	return /* @__PURE__ */ e.createElement("g", {
		"data-edge": s.id,
		"data-dimmed": String(r),
		style: { opacity: d }
	}, /* @__PURE__ */ e.createElement("path", {
		"data-hit": "",
		d: n.d,
		fill: "none",
		stroke: "transparent",
		strokeWidth: 9,
		style: {
			pointerEvents: "stroke",
			cursor: "pointer"
		},
		onClick: () => k().getState().select({
			kind: "edge",
			id: s.id
		})
	}, /* @__PURE__ */ e.createElement("title", null, s.label)), /* @__PURE__ */ e.createElement("path", {
		d: n.d,
		fill: "none",
		stroke: c,
		strokeWidth: f,
		strokeDasharray: l ? "4 3" : void 0,
		strokeLinejoin: "round"
	}), /* @__PURE__ */ e.createElement("path", {
		d: n.arrow,
		fill: c
	}));
}
function Lt(e, t, n) {
	e.stopPropagation(), k().getState().select({
		kind: "port",
		node: t,
		port: n
	});
}
function Rt({ layout: n, dimmed: r, selected: i, portSelected: a }) {
	let o = t.ui.tokens, { core: s } = n;
	return /* @__PURE__ */ e.createElement("div", {
		"data-node": S,
		"data-hit": "",
		"data-dimmed": String(r),
		className: g("absolute rounded border bg-surface-2"),
		style: {
			...kt(s),
			borderColor: i ? o.accent : o.border,
			opacity: r ? A : 1
		},
		onClick: () => k().getState().select({
			kind: "node",
			id: S
		})
	}, /* @__PURE__ */ e.createElement("div", {
		className: g("border-b border-border-subtle px-2 py-1.5 text-[12px] font-medium text-text-primary"),
		style: { background: O(o.accent, o.surface3, 22) }
	}, "Safelight core"), n.coreGroups.map((t) => /* @__PURE__ */ e.createElement("div", {
		key: t.label,
		className: g("absolute text-right text-[11px] uppercase tracking-widest text-text-secondary"),
		style: {
			top: t.y - s.y + 6,
			right: 10
		}
	}, t.label)), n.corePorts.map((t) => /* @__PURE__ */ e.createElement(zt, {
		key: t.id,
		port: t,
		top: t.y - s.y - 8,
		selected: a(t.id)
	})));
}
function zt({ port: n, top: r, selected: i }) {
	let a = t.ui.tokens;
	return /* @__PURE__ */ e.createElement("div", {
		"data-hit": "",
		"data-port": n.id,
		"data-used": String(n.used),
		className: g("absolute flex items-center justify-end pr-2 text-[11px]"),
		style: {
			top: r,
			left: 8,
			right: 0,
			height: 16
		},
		onClick: (e) => Lt(e, S, n.id)
	}, /* @__PURE__ */ e.createElement("span", {
		className: _(g("truncate"), n.used ? g("text-text-primary") : g("text-text-muted")),
		style: i ? { color: a.accent } : void 0
	}, n.label), /* @__PURE__ */ e.createElement(Mt, {
		side: "right",
		colour: n.used ? a.textSecondary : a.border
	}));
}
function Bt({ laid: n, dimmed: r, selected: i, portSelected: a }) {
	let o = t.ui.tokens, s = n.band, c = D(s.extensionId, o), l = r ? A : 1, u = (e) => {
		e.stopPropagation(), k().getState().setCollapsed([s.id], !n.collapsed);
	};
	return /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("div", {
		"data-band": s.extensionId,
		"data-node": s.id,
		"data-hit": "",
		"data-dimmed": String(r),
		className: g("absolute flex items-center gap-1.5 rounded px-2"),
		style: {
			...kt(n.header),
			background: O(c, o.surface2, 26),
			borderLeft: `3px solid ${c}`,
			outline: i ? `1px solid ${o.accent}` : void 0,
			opacity: l
		},
		onClick: () => k().getState().select({
			kind: "node",
			id: s.id
		})
	}, /* @__PURE__ */ e.createElement("button", {
		type: "button",
		"aria-label": `${n.collapsed ? "Expand" : "Collapse"} ${s.name}`,
		onClick: u,
		className: g("shrink-0 rounded px-1 font-code text-text-secondary hover:bg-surface-3 hover:text-text-primary")
	}, n.collapsed ? "[+]" : "[-]"), /* @__PURE__ */ e.createElement("span", { className: g("min-w-0 truncate text-[12px] font-medium text-text-primary") }, s.name), s.name !== s.extensionId && /* @__PURE__ */ e.createElement("span", { className: g("min-w-0 truncate font-code text-[11px] text-text-secondary") }, s.extensionId), s.version && /* @__PURE__ */ e.createElement("span", { className: g("shrink-0 text-[11px] text-text-secondary") }, "v", s.version), s.source && /* @__PURE__ */ e.createElement("span", { className: g("shrink-0 text-[11px] text-text-secondary") }, Ot[s.source]), /* @__PURE__ */ e.createElement(jt, { state: s.status }), s.stages.length > 0 && /* @__PURE__ */ e.createElement("span", { className: g("ml-auto shrink-0 text-[11px] text-text-secondary") }, s.stages.length, " ", s.stages.length === 1 ? "stage" : "stages")), n.ports.map((t) => /* @__PURE__ */ e.createElement("div", {
		key: t.id,
		"data-hit": "",
		"data-port": t.id,
		"data-band-port": `${s.id}|${t.id}`,
		className: g("absolute flex items-center px-2 text-[11px]"),
		style: {
			left: t.x,
			top: t.y - 8,
			width: 124,
			height: 16,
			opacity: l
		},
		onClick: (e) => Lt(e, s.id, t.id)
	}, /* @__PURE__ */ e.createElement(Mt, {
		side: "left",
		colour: c
	}), /* @__PURE__ */ e.createElement("span", {
		className: g("truncate text-text-primary"),
		style: a(t.id) ? { color: o.accent } : void 0
	}, t.side === "in" ? "→ " : "← ", t.label))));
}
function Vt({ ports: n, side: r, other: i, node: a, portSelected: o }) {
	let s = t.ui.tokens;
	return /* @__PURE__ */ e.createElement(e.Fragment, null, n.map((t, n) => {
		let c = n < i, l = {
			top: 24 + n * 16,
			height: 16,
			left: r === "in" ? 0 : c ? 92 : 8,
			right: r === "out" ? 0 : c ? 92 : 8
		};
		return /* @__PURE__ */ e.createElement("div", {
			key: t.id,
			"data-hit": "",
			"data-port": t.id,
			className: _(g("absolute flex items-center text-[11px]"), g(r === "out" ? "justify-end pr-2" : "px-2")),
			style: l,
			onClick: (e) => Lt(e, a, t.id)
		}, /* @__PURE__ */ e.createElement(Mt, {
			side: r === "in" ? "left" : "right",
			colour: s.textSecondary
		}), /* @__PURE__ */ e.createElement("span", {
			className: g("truncate text-text-primary"),
			title: t.label,
			style: o(t.id) ? { color: s.accent } : void 0
		}, t.label));
	}));
}
function Ht({ laid: n, dimmed: r, selected: i, portSelected: a, onSelect: o }) {
	let s = t.ui.tokens, c = n.stage, l = D(c.extensionId, s), u = At(c.state.tone, l), d = c.state.tone === "failure" || c.state.tone === "problem";
	return /* @__PURE__ */ e.createElement("div", {
		"data-node": c.id,
		"data-hit": "",
		"data-status": c.state.status,
		"data-dimmed": String(r),
		className: g("absolute rounded border bg-surface-2"),
		style: {
			...kt(n.rect),
			borderColor: i ? s.accent : d ? u : s.border,
			borderStyle: c.state.tone === "dim" || c.state.tone === "neutral" ? "dashed" : "solid",
			opacity: r ? A : 1
		},
		onClick: () => o({
			kind: "node",
			id: c.id
		})
	}, /* @__PURE__ */ e.createElement("div", {
		className: g("flex items-center gap-1 rounded px-2"),
		style: {
			height: 24,
			background: O(l, s.surface3, 22)
		},
		title: `${c.stageId}: ${c.state.label}. ${c.state.reason}`
	}, /* @__PURE__ */ e.createElement("span", {
		className: g("shrink-0 rounded-full"),
		style: {
			width: 7,
			height: 7,
			background: u
		}
	}), /* @__PURE__ */ e.createElement("span", { className: g("min-w-0 flex-1 truncate text-[12px] font-medium text-text-primary") }, c.name), c.anchor && /* @__PURE__ */ e.createElement("span", { className: g("shrink-0 rounded bg-surface-3 px-1 text-[11px] text-text-secondary") }, "at ", c.anchor), c.state.copies > 0 && /* @__PURE__ */ e.createElement("span", { className: g("shrink-0 text-[11px] text-text-secondary") }, "×", c.state.copies)), /* @__PURE__ */ e.createElement(Vt, {
		ports: c.inPorts,
		side: "in",
		other: c.outPorts.length,
		node: c.id,
		portSelected: a
	}), /* @__PURE__ */ e.createElement(Vt, {
		ports: c.outPorts,
		side: "out",
		other: c.inPorts.length,
		node: c.id,
		portSelected: a
	}));
}
//#endregion
//#region src/dev/relay.ts
var Ut = "safelight-devtools-live", Wt = 2e3, Gt = 5e3, Kt = 2e3;
function qt(e = Ut) {
	if (typeof BroadcastChannel > "u") return null;
	let t = new BroadcastChannel(e);
	return {
		post: (e) => t.postMessage(e),
		listen: (e) => {
			t.onmessage = (t) => e(t.data);
		},
		close: () => t.close()
	};
}
var j = (e) => typeof e == "object" && !!e && !Array.isArray(e), M = (e) => typeof e == "string", N = (e) => typeof e == "number" && Number.isFinite(e), Jt = (e) => Array.isArray(e) && e.every(M), Yt = (e) => e === 1 || e === 2 || e === 3;
function Xt(e) {
	if (!j(e)) return null;
	let { at: t, photoId: n, processVersion: r, programStages: i, dormant: a, overflowed: o, frameMs: s, lastError: c } = e;
	if (!N(t) || !(n === null || M(n)) || !Yt(r) || !Jt(i) || !Jt(a) || !Jt(o) || !(s === null || N(s))) return null;
	let l = null;
	if (c !== null) {
		if (!j(c) || !N(c.at) || !M(c.message)) return null;
		l = {
			at: c.at,
			message: c.message
		};
	}
	return {
		at: t,
		photoId: n,
		processVersion: r,
		programStages: i,
		dormant: a,
		overflowed: o,
		frameMs: s,
		lastError: l
	};
}
function Zt(e) {
	if (!j(e)) return null;
	let t = {};
	for (let [n, r] of Object.entries(e)) {
		if (!j(r) || !M(r.log) || typeof r.crashed != "boolean") return null;
		t[n] = {
			log: r.log,
			crashed: r.crashed
		};
	}
	return t;
}
function Qt(e) {
	if (!j(e) || !M(e.from)) return null;
	let t = e.from;
	switch (e.type) {
		case "hello": return {
			type: "hello",
			from: t
		};
		case "live": {
			let n = Xt(e.live), r = Zt(e.failures);
			return !M(e.window) || !n || !r ? null : {
				type: "live",
				from: t,
				window: e.window,
				live: n,
				failures: r
			};
		}
		case "values": return !M(e.to) || !N(e.id) || !M(e.stageId) ? null : {
			type: "values",
			from: t,
			to: e.to,
			id: e.id,
			stageId: e.stageId
		};
		case "values-answer": {
			let { to: n, id: r, stageId: i, values: a } = e;
			return !M(n) || !N(r) || !M(i) || a !== null && !j(a) ? null : {
				type: "values-answer",
				from: t,
				to: n,
				id: r,
				stageId: i,
				values: a
			};
		}
		default: return null;
	}
}
function $t({ port: e, windowId: t, windowLabel: n, render: r }) {
	let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map(), s = 1, c = !1, l = (t) => {
		c || e.post(t);
	}, u = -Infinity, d = -Infinity, f = null, p = null, m = () => {
		let e = r?.live.get();
		r && e && (d = Date.now(), l({
			type: "live",
			from: t,
			window: n,
			live: e,
			failures: r.stageFailures.get()
		}));
	}, h = () => {
		p?.(), p = null, f && clearTimeout(f), f = null;
	}, g = () => Date.now() - u <= Gt, _ = () => {
		if (!g()) {
			h();
			return;
		}
		if (f) return;
		let e = d + 250 - Date.now();
		e <= 0 ? m() : f = setTimeout(() => {
			f = null, g() && m();
		}, e);
	}, v = () => {
		if (p || !r) return;
		let e = r.live.subscribe(_), t = r.stageFailures.subscribe(_);
		p = () => {
			e(), t();
		};
	}, ee = (e, n, i) => {
		let a = r?.liveValues(i) ?? null;
		try {
			l({
				type: "values-answer",
				from: t,
				to: e,
				id: n,
				stageId: i,
				values: a
			});
		} catch {
			l({
				type: "values-answer",
				from: t,
				to: e,
				id: n,
				stageId: i,
				values: null
			});
		}
	};
	return e.listen((e) => {
		let n = Qt(e);
		if (n && n.from !== t) switch (n.type) {
			case "hello":
				u = Date.now(), m(), v();
				break;
			case "live": {
				let e = new Map(i);
				e.set(n.from, {
					windowId: n.from,
					window: n.window,
					live: n.live,
					failures: n.failures
				}), i = e;
				for (let e of [...a]) e();
				break;
			}
			case "values":
				n.to === t && ee(n.from, n.id, n.stageId);
				break;
			case "values-answer": {
				let e = n.to === t ? o.get(n.id) : void 0;
				if (!e) break;
				clearTimeout(e.timer), o.delete(n.id), e.resolve(n.values);
				break;
			}
		}
	}), {
		hello: () => l({
			type: "hello",
			from: t
		}),
		remotes: () => i,
		subscribe: (e) => (a.add(e), () => void a.delete(e)),
		requestValues: (e, n) => new Promise((r) => {
			if (c) {
				r(null);
				return;
			}
			let i = s++, a = setTimeout(() => {
				o.delete(i), r(null);
			}, Kt);
			o.set(i, {
				resolve: r,
				timer: a
			}), l({
				type: "values",
				from: t,
				to: e,
				id: i,
				stageId: n
			});
		}),
		close: () => {
			c = !0, h();
			for (let { resolve: e, timer: t } of o.values()) clearTimeout(t), e(null);
			o.clear(), a.clear(), e.close();
		}
	};
}
function en(e, t) {
	let n = e?.live ? {
		windowId: null,
		window: "this window",
		live: e.live,
		failures: e.failures
	} : null;
	for (let e of t.values()) (!n || e.live.at > n.live.at) && (n = { ...e });
	return n;
}
//#endregion
//#region src/dev/sources.ts
var tn = Math.random().toString(36).slice(2, 10);
function nn() {
	let e = t.navigation.ownModule();
	return e ? `the ${e.charAt(0).toUpperCase()}${e.slice(1)} window` : new URLSearchParams(window.location.search).get("devtools") === "1" ? "the Developer Tools window" : "the main window";
}
var rn = {
	post: () => void 0,
	listen: () => void 0,
	close: () => void 0
}, P = null, an = null, on = !1;
function sn() {
	return on ? (an ??= $t({
		port: rn,
		windowId: tn,
		windowLabel: "",
		render: void 0
	}), an) : (P ??= $t({
		port: qt() ?? rn,
		windowId: tn,
		windowLabel: nn(),
		render: t.devtools?.render
	}), P);
}
function cn() {
	on = !1, sn();
}
function ln() {
	P?.close(), P = null, on = !0, F = null, kn = null, vn = null, yn = !1;
}
function un() {
	e.useEffect(() => {
		let e = () => sn().hello();
		e();
		let t = setInterval(e, Wt);
		return () => clearInterval(t);
	}, []);
}
var dn = {}, fn = [], pn = [], mn = () => () => void 0, hn = () => 0;
function gn(t, n) {
	let r = e.useCallback((e) => t ? t.subscribe(e) : () => void 0, [t]), i = e.useCallback(() => t ? t.get() : n, [t, n]);
	return e.useSyncExternalStore(r, i);
}
function _n() {
	let e = t.devtools?.pipeline;
	return e ? e.useRows(e.useOpenVersion().version) : fn;
}
var vn = null, yn = !1, bn = /* @__PURE__ */ new Set();
function xn(e) {
	return bn.add(e), yn || (yn = !0, t.devtools?.appVersion().then((e) => {
		vn = e;
		for (let e of [...bn]) e();
	})), () => void bn.delete(e);
}
var Sn = () => vn, Cn = (e) => e;
function wn() {
	let n = t.devtools?.render, r = gn(n?.live, null), i = gn(n?.stageFailures, dn), a = sn(), o = e.useSyncExternalStore(a.subscribe, a.remotes);
	return e.useMemo(() => en({
		live: r,
		failures: i
	}, o), [
		r,
		i,
		o
	]);
}
var Tn = (e, t) => e.registry === t.registry && e.extensions === t.extensions && e.rows === t.rows && e.live === t.live && e.failures === t.failures && e.variables === t.variables && e.appVersion === t.appVersion, En = (e) => e ? [
	e.programStages,
	e.dormant,
	e.overflowed
].map((e) => e.join(",")).join("|") : "", Dn = (e) => e.map((e) => e.kind === "stage" ? e.id : "").join(","), F = null;
function On() {
	let n = t.registry.use(Cn), r = gn(t.devtools?.extensions, null), i = _n(), a = t.devtools?.variables, o = e.useSyncExternalStore(a?.subscribeChanges ?? mn, a?.changeCount ?? hn), s = e.useSyncExternalStore(xn, Sn), c = wn(), l = c?.live ?? null, u = c?.failures ?? dn, d = {
		registry: n,
		extensions: r,
		rows: Dn(i),
		live: En(l),
		failures: JSON.stringify(u),
		variables: o,
		appVersion: s
	};
	return (!F || !Tn(F.key, d)) && (F = {
		key: d,
		model: He({
			registry: n,
			extensions: r,
			rows: i,
			live: l,
			failures: u,
			variables: a?.inspect() ?? pn,
			appVersion: s
		})
	}), F.model;
}
var kn = null;
function An(t) {
	let n = k(), r = n((e) => e.showAll), i = n((e) => e.search), a = n((e) => e.collapsed), o = n((e) => e.selection), s = n((e) => e.registrationBand), c = Ge(o, t), l = o === null ? null : c ?? s;
	e.useEffect(() => {
		let e = k().getState();
		c && c !== e.registrationBand && e.setRegistrationBand(c);
	}, [c]);
	let u = kn;
	if (u && u.model === t && u.band === l && u.options.showAll === r && u.options.search === i && u.options.collapsed === a) return u.graph;
	let d = {
		showAll: r,
		search: i,
		collapsed: a,
		selection: l ? {
			kind: "node",
			id: l
		} : null
	};
	return kn = {
		model: t,
		options: d,
		band: l,
		graph: qe(t, d)
	}, kn.graph;
}
function jn(e, n) {
	return e.windowId === null ? Promise.resolve(t.devtools?.render?.liveValues(n) ?? null) : sn().requestValues(e.windowId, n);
}
function Mn(t, n) {
	let [r, i] = e.useState(null), a = n?.live.at, o = e.useRef(n);
	return o.current = n, e.useEffect(() => {
		let e = o.current;
		if (!t || !e) return;
		let n = !0;
		return jn(e, t).then((e) => n && i({
			stageId: t,
			values: e
		})), () => {
			n = !1;
		};
	}, [
		t,
		n?.windowId,
		a
	]), r?.stageId === t ? r.values : null;
}
//#endregion
//#region src/dev/DevModule.tsx
var Nn = g("rounded px-2 py-0.5 text-text-secondary hover:bg-surface-3 hover:text-text-primary");
function Pn({ pressed: t, onClick: n, children: r }) {
	return /* @__PURE__ */ e.createElement("button", {
		type: "button",
		"aria-pressed": t,
		onClick: n,
		className: _(g("rounded px-2 py-0.5"), g(t ? "bg-surface-3 text-text-primary" : "text-text-secondary hover:text-text-primary"))
	}, r);
}
function Fn({ bandIds: t }) {
	let n = k(), r = n((e) => e.search), i = n((e) => e.showAll), a = n((e) => e.showEmpty), o = n.getState();
	return /* @__PURE__ */ e.createElement("div", { className: g("flex shrink-0 flex-wrap items-center gap-1.5 border-b border-border-subtle bg-surface-2 px-2 py-1.5") }, /* @__PURE__ */ e.createElement("input", {
		value: r,
		onChange: (e) => o.setSearch(e.target.value),
		placeholder: "Search extensions and stages…",
		spellCheck: !1,
		className: g("w-56 min-w-0 rounded bg-surface-1 px-2 py-1 text-text-primary outline-none placeholder:text-text-muted focus:bg-surface-3")
	}), /* @__PURE__ */ e.createElement(Pn, {
		pressed: i,
		onClick: o.toggleShowAll
	}, "All extensions"), /* @__PURE__ */ e.createElement(Pn, {
		pressed: a,
		onClick: o.toggleShowEmpty
	}, "Empty phases"), /* @__PURE__ */ e.createElement("span", { className: g("flex-1") }), /* @__PURE__ */ e.createElement("button", {
		type: "button",
		className: Nn,
		onClick: o.requestFit
	}, "Fit"), /* @__PURE__ */ e.createElement("button", {
		type: "button",
		className: Nn,
		onClick: () => o.setCollapsed(t, !0)
	}, "Collapse all"), /* @__PURE__ */ e.createElement("button", {
		type: "button",
		className: Nn,
		onClick: () => o.setCollapsed(t, !1)
	}, "Expand all"));
}
function In() {
	un();
	let t = On(), n = An(t), r = k(), i = r((e) => e.showEmpty), a = r((e) => e.selection), o = e.useMemo(() => lt(n, { showEmptyPhases: i }), [n, i]), s = e.useMemo(() => Je(n, a), [n, a]), c = e.useMemo(() => t.bands.map((e) => e.id), [t]);
	return /* @__PURE__ */ e.createElement("div", { className: g("flex h-full w-full flex-col bg-surface-1 text-[11px] text-text-primary") }, /* @__PURE__ */ e.createElement(Fn, { bandIds: c }), /* @__PURE__ */ e.createElement("div", { className: g("relative min-h-0 flex-1") }, /* @__PURE__ */ e.createElement(Dt, {
		layout: o,
		linked: s,
		selection: a
	})));
}
//#endregion
//#region src/detach.ts
var I = "core.devtools", Ln = "devtools", Rn = "safelight-devtools", zn = "safelight-devtools-ctl";
function Bn() {
	return new URLSearchParams(window.location.search).get(Ln) === "1";
}
var L = null, R = null;
function Vn() {
	t.dock.isPanelOpen("core.devtools") || t.dock.togglePanel(I);
}
function Hn() {
	t.dock.isPanelOpen("core.devtools") && t.dock.togglePanel(I);
}
function Un() {
	if (L && !L.closed) {
		L.focus();
		return;
	}
	let e = `${window.location.origin}${window.location.pathname}?${Ln}=1`, t = window.open(e, Rn, "width=760,height=600");
	t && (L = t, Hn(), t.focus());
}
function Wn() {
	(R ?? new BroadcastChannel("safelight-devtools-ctl")).postMessage({ type: "reattach" }), window.close();
}
function Gn() {
	R || (R = new BroadcastChannel(zn), R.onmessage = (e) => {
		e.data?.type === "reattach" && !Bn() && (L = null, Vn());
	});
}
function Kn() {
	R?.close(), R = null;
}
//#endregion
//#region src/format-arg.ts
function qn(e, t = 0) {
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
var Jn = 2e3, Yn = null;
function z() {
	return Yn ??= t.stores.create()(() => ({ entries: [] })), Yn;
}
var Xn = "safelight-devtools-log", Zn = Math.random().toString(36).slice(2, 8), Qn = 1, B = null;
function $n(e) {
	let t = (Array.isArray(e) ? e : [e]).filter(Boolean);
	t.length && z().setState((e) => {
		let n = new Set(e.entries.map((e) => e.id)), r = t.filter((e) => !n.has(e.id));
		if (!r.length) return e;
		let i = [...e.entries, ...r].sort((e, t) => e.time - t.time);
		return { entries: i.length > 2e3 ? i.slice(i.length - Jn) : i };
	});
}
function V(e, t, n) {
	let r = {
		id: `${Zn}-${Qn++}`,
		level: e,
		parts: t,
		stack: n,
		time: Date.now()
	};
	$n(r), B?.postMessage({
		kind: "entry",
		entry: r
	});
}
function er() {
	z().setState({ entries: [] });
}
var tr = (e) => e.map((e) => qn(e)), nr = [
	"log",
	"info",
	"warn",
	"error",
	"debug"
], rr = !1, ir = /* @__PURE__ */ new Map(), H = null, U = null;
function ar() {
	if (!rr) {
		rr = !0;
		try {
			B = new BroadcastChannel(Xn), B.onmessage = (e) => {
				let t = e.data;
				if (t.kind === "entry") $n(t.entry);
				else if (t.kind === "sync-response") $n(t.entries);
				else if (t.kind === "sync-request") {
					let e = z().getState().entries;
					e.length && B?.postMessage({
						kind: "sync-response",
						entries: e.slice(-500)
					});
				}
			}, B.postMessage({ kind: "sync-request" });
		} catch {
			B = null;
		}
		for (let e of nr) {
			let t = console[e];
			ir.set(e, t), console[e] = (...n) => {
				try {
					V(e, tr(n));
				} catch {}
				t.apply(console, n);
			};
		}
		H = (e) => {
			let t = e.error instanceof Error ? e.error : null;
			V("exception", [t ? `${t.name}: ${t.message}` : e.message || "Uncaught error"], t?.stack ?? (e.filename ? `at ${e.filename}:${e.lineno}:${e.colno}` : void 0));
		}, U = (e) => {
			let t = e.reason, n = t instanceof Error ? t : null;
			V("exception", [`Unhandled rejection: ${n ? `${n.name}: ${n.message}` : qn(t)}`], n?.stack);
		}, window.addEventListener("error", H), window.addEventListener("unhandledrejection", U);
	}
}
function or() {
	if (rr) {
		rr = !1;
		for (let e of nr) {
			let t = ir.get(e);
			t && (console[e] = t);
		}
		ir.clear(), H && window.removeEventListener("error", H), U && window.removeEventListener("unhandledrejection", U), H = null, U = null, B?.close(), B = null;
	}
}
//#endregion
//#region src/Unavailable.tsx
var sr = "Not available in this version of Safelight.";
function cr() {
	return /* @__PURE__ */ e.createElement("div", { className: g("p-3 text-text-muted") }, sr);
}
//#endregion
//#region src/PipelineTab.tsx
var lr = [
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
function ur(e, t) {
	return `${e?.encoding ?? (t === "scene" ? "linear" : "perceptual")}/${e?.primaries === "rec2020" ? "rec2020" : "rec709"}`;
}
var dr = {
	input: "input",
	result: "result",
	"pass-input": "what its passes read, not the frame"
}, fr = {
	always: "always",
	"while-active": "while in use",
	"per-mask": "inside each mask that uses it, blended by coverage",
	"fallback-preview": "fallback preview only",
	"non-srgb-output": "only when the output isn't sRGB",
	"no-float-targets": "only without float render targets or mipmaps"
};
function pr(e) {
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
var mr = g("rounded bg-surface-3 px-1 text-text-secondary");
function hr({ row: t }) {
	let { domain: n } = t, r = [
		t.owner ?? "Safelight",
		`${t.phase}, priority ${t.priority}`,
		...n ? [t.space ? ur(t.space, n) : `${n} values`] : [],
		...t.reads === "current" ? ["reads the current image"] : [],
		...t.maskable && t.copies ? [`per mask, ${t.copies} ${t.copies === 1 ? "copy" : "copies"}`] : [],
		...t.maskable && !t.copies ? ["maskable"] : []
	];
	return /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("div", { className: g("flex items-baseline gap-2") }, /* @__PURE__ */ e.createElement("span", { className: g("text-text-primary") }, t.name), /* @__PURE__ */ e.createElement("span", { className: g("font-code text-[11px] text-text-secondary") }, t.id)), /* @__PURE__ */ e.createElement("div", { className: g("flex flex-wrap gap-x-2.5 text-[11px] text-text-secondary") }, r.map((t) => /* @__PURE__ */ e.createElement("span", { key: t }, t))), t.note && /* @__PURE__ */ e.createElement("div", { className: g("text-[11px] text-text-secondary") }, t.note), t.floors.map((t, n) => /* @__PURE__ */ e.createElement("div", {
		key: n,
		className: g("font-code text-[11px] text-amber-400")
	}, `found in GLSL: ${t}`)));
}
function gr({ row: t, screen: n }) {
	return /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("span", { className: mr }, `${dr[t.where]} · ${fr[t.when]}`), t.when === "non-srgb-output" && /* @__PURE__ */ e.createElement("span", { className: _(g("ml-1.5"), n.profile ? g("text-amber-400") : g("text-text-muted")) }, n.profile ? "Runs for this screen's monitor profile." : "Doesn't run for this screen."), /* @__PURE__ */ e.createElement("span", { className: g("ml-1.5 text-text-muted") }, t.detail));
}
function _r({ row: t, screen: n }) {
	let r = n.profile ? `${n.profile} (monitor profile)` : lr.find((e) => e.value === n.space)?.label ?? n.space;
	return /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("div", { className: g("flex items-baseline gap-2") }, /* @__PURE__ */ e.createElement("span", { className: g("text-text-muted") }, "Output"), /* @__PURE__ */ e.createElement("span", { className: _(mr, g("text-[11px]")) }, t.mapped ? "mapped" : "clipped")), /* @__PURE__ */ e.createElement("div", { className: g("text-[11px] text-text-secondary") }, t.detail), t.mapped && /* @__PURE__ */ e.createElement("div", { className: g("text-[11px] text-text-secondary") }, `On this screen: ${r}`));
}
function vr({ row: t, screen: n }) {
	switch (t.kind) {
		case "core": return /* @__PURE__ */ e.createElement("div", { className: g("text-text-secondary") }, /* @__PURE__ */ e.createElement("span", null, t.label), t.note && /* @__PURE__ */ e.createElement("span", { className: g("ml-2 text-[11px]") }, t.note));
		case "stage": return /* @__PURE__ */ e.createElement(hr, { row: t });
		case "convert": return /* @__PURE__ */ e.createElement("div", { className: g("pl-3 font-code text-[11px] text-text-secondary") }, t.elided ? `stays in ${t.to}` : `${t.from} → ${t.to}`);
		case "clamp": return /* @__PURE__ */ e.createElement(gr, {
			row: t,
			screen: n
		});
		case "transform": return /* @__PURE__ */ e.createElement("div", { className: g("flex flex-wrap gap-x-2.5 text-text-secondary") }, /* @__PURE__ */ e.createElement("span", null, `Transform: ${t.id ?? "Built-in"}`), t.flags.map((t) => /* @__PURE__ */ e.createElement("span", {
			key: t.flag,
			className: t.honoured ? void 0 : g("text-amber-400")
		}, `${t.flag}: ${t.honoured ? "honoured" : "ignored on this version"}`)));
		case "output": return /* @__PURE__ */ e.createElement(_r, {
			row: t,
			screen: n
		});
	}
}
function yr({ rows: t, versions: n, version: r, onVersion: i, photoVersion: a = null, screen: o = {
	space: "srgb",
	profile: null
}, popped: s = !1 }) {
	let c = e.useMemo(() => pr(t), [t]), l = a ? `Open photo: v${a}` : s ? "Dock Developer Tools to see the open photo." : "No photo open";
	return /* @__PURE__ */ e.createElement("div", { className: g("flex h-full flex-col") }, /* @__PURE__ */ e.createElement("div", { className: g("flex shrink-0 items-center gap-1.5 border-b border-border-subtle px-2 py-1.5") }, /* @__PURE__ */ e.createElement("span", { className: g("text-text-muted") }, "Process version"), n.map((t) => /* @__PURE__ */ e.createElement("button", {
		key: t,
		type: "button",
		onClick: () => i(t),
		"aria-pressed": t === r,
		className: _(g("rounded px-1.5 py-0.5"), g(t === r ? "bg-surface-3 text-text-primary" : "text-text-muted hover:text-text-secondary"))
	}, "v", t)), /* @__PURE__ */ e.createElement("span", { className: g("ml-auto text-text-muted") }, l)), /* @__PURE__ */ e.createElement("ol", {
		"aria-label": "Pipeline",
		className: g("min-h-0 flex-1 overflow-y-auto")
	}, c.map(({ head: t, under: n }, r) => /* @__PURE__ */ e.createElement("li", {
		key: r,
		className: g("border-b border-border-subtle/50 px-2 py-1")
	}, /* @__PURE__ */ e.createElement(vr, {
		row: t,
		screen: o
	}), n.length > 0 && /* @__PURE__ */ e.createElement("ul", { className: g("mt-0.5 space-y-px pl-3 text-[11px]") }, n.map((t, n) => /* @__PURE__ */ e.createElement("li", { key: n }, /* @__PURE__ */ e.createElement(vr, {
		row: t,
		screen: o
	}))))))));
}
function br() {
	let n = t.devtools?.pipeline;
	return n ? /* @__PURE__ */ e.createElement(xr, { pipeline: n }) : /* @__PURE__ */ e.createElement(cr, null);
}
function xr({ pipeline: t }) {
	let { photoId: n, version: r } = t.useOpenVersion(), [i, a] = e.useState(null), o = `${n}:${r}`;
	i && i.on !== o && a(null);
	let s = i?.on === o ? i.version : r, c = t.useRows(s), l = t.useScreen();
	return /* @__PURE__ */ e.createElement(yr, {
		rows: c,
		versions: t.versions,
		version: s,
		onVersion: (e) => a({
			version: e,
			on: o
		}),
		photoVersion: n ? r : null,
		screen: l,
		popped: Bn()
	});
}
//#endregion
//#region src/VariablesTab.tsx
var Sr = 2e5;
function Cr(e) {
	return e < 1024 ? `${e} B` : e < 1048576 ? `${(e / 1024).toFixed(1)} KB` : `${(e / 1048576).toFixed(1)} MB`;
}
function W(e, t) {
	return `${t.extension} (${e.windowName(t.window)})`;
}
function wr() {
	let n = t.devtools?.variables;
	return n ? /* @__PURE__ */ e.createElement(Tr, {
		inspector: n,
		variables: t.variables
	}) : /* @__PURE__ */ e.createElement(cr, null);
}
function Tr({ inspector: t, variables: n }) {
	let r = e.useSyncExternalStore(t.subscribeChanges, t.changeCount), i = e.useMemo(() => t.inspect(), [t, r]), [a, o] = e.useState(null), s = i.find((e) => e.snapshot.name === a) ?? i[0] ?? null;
	return s ? /* @__PURE__ */ e.createElement("div", { className: g("@container h-full min-h-0") }, /* @__PURE__ */ e.createElement("div", { className: g("flex h-full min-h-0 @max-lg:flex-col") }, /* @__PURE__ */ e.createElement("ul", {
		"aria-label": "Variables",
		className: g("w-56 shrink-0 overflow-y-auto border-r border-border-subtle @max-lg:w-full @max-lg:max-h-32 @max-lg:border-r-0 @max-lg:border-b")
	}, i.map((n) => {
		let r = n.snapshot.name, i = n.history.filter((e) => e.outcome !== "accepted").length, a = s.snapshot.name === r;
		return /* @__PURE__ */ e.createElement("li", { key: r }, /* @__PURE__ */ e.createElement("button", {
			type: "button",
			onClick: () => o(r),
			"aria-current": a,
			className: _(g("flex w-full flex-col px-2 py-1 text-left hover:bg-surface-3"), g(a ? "bg-surface-3 text-text-primary" : "text-text-secondary"))
		}, /* @__PURE__ */ e.createElement("span", { className: g("flex w-full items-center gap-1") }, /* @__PURE__ */ e.createElement("span", { className: g("min-w-0 flex-1 truncate font-code") }, r), /* @__PURE__ */ e.createElement("span", { className: g("shrink-0 text-text-muted") }, "rev ", n.snapshot.revision.n, " · ", Cr(n.size)), i > 0 && /* @__PURE__ */ e.createElement("span", {
			"aria-label": `${i} refused or lost`,
			className: g("shrink-0 rounded-full bg-amber-500/80 px-1 text-[9px] text-white")
		}, i)), /* @__PURE__ */ e.createElement("span", { className: g("block truncate text-text-muted") }, W(t, n.snapshot.writer))));
	})), /* @__PURE__ */ e.createElement(Dr, {
		key: s.snapshot.name,
		v: s,
		inspector: t,
		variables: n
	}))) : /* @__PURE__ */ e.createElement("div", { className: g("p-3 text-text-muted") }, "No shared variables yet. Extensions create them with api.variables.register().");
}
var Er = g("rounded px-1.5 py-0.5 text-text-secondary hover:bg-surface-3 hover:text-text-primary"), G = g("text-text-muted");
function Dr({ v: t, inspector: n, variables: r }) {
	let [i, a] = e.useState(null), [o, s] = e.useState(null), c = t.snapshot, l = e.useMemo(() => JSON.stringify(c.value, null, 2), [c.value]), u = l.length > Sr ? `${l.slice(0, Sr)}\n… cut off: ${Cr(l.length)} of JSON` : l, d = [...t.history].reverse().find((e) => e.outcome === "accepted"), f = () => {
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
		t.ok ? (a(null), s(`Saved as revision ${t.revision.n}.`)) : t.reason === "stale" ? s(`${W(n, t.current.writer)} changed it since you opened the editor. Cancel and edit again to start from the new value.`) : t.reason === "invalid" ? s(`Refused: ${t.message}.`) : s("Refused: nobody has registered this variable.");
	}, m = (e) => {
		switch (e.outcome) {
			case "accepted": return "accepted";
			case "stale": return `refused: hadn't seen rev ${e.revision.n}${e.other ? ` by ${W(n, e.other)}` : ""}`;
			case "invalid": return `refused: ${e.message ?? "not JSON data"}`;
			case "lost": return `lost to ${e.other ? W(n, e.other) : "another window"}`;
		}
	};
	return /* @__PURE__ */ e.createElement("div", { className: g("flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-y-auto p-2 wrap-anywhere") }, /* @__PURE__ */ e.createElement("dl", { className: g("grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5") }, /* @__PURE__ */ e.createElement("dt", { className: G }, "Name"), /* @__PURE__ */ e.createElement("dd", { className: g("font-code") }, c.name), c.description && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("dt", { className: G }, "Description"), /* @__PURE__ */ e.createElement("dd", null, c.description)), /* @__PURE__ */ e.createElement("dt", { className: G }, "Registered by"), /* @__PURE__ */ e.createElement("dd", null, W(n, c.registeredBy)), /* @__PURE__ */ e.createElement("dt", { className: G }, "Last write"), /* @__PURE__ */ e.createElement("dd", null, W(n, c.writer), ", revision ", c.revision.n, d ? `, ${new Date(d.time).toLocaleTimeString()}` : ""), /* @__PURE__ */ e.createElement("dt", { className: G }, "Subscribers here"), /* @__PURE__ */ e.createElement("dd", null, t.subscribers.length > 0 ? t.subscribers.join(", ") : "none")), /* @__PURE__ */ e.createElement("details", { open: !0 }, /* @__PURE__ */ e.createElement("summary", { className: g("cursor-pointer text-text-muted") }, "Value"), /* @__PURE__ */ e.createElement("div", { className: g("my-1 flex items-center gap-2") }, i === null ? /* @__PURE__ */ e.createElement("button", {
		type: "button",
		onClick: f,
		className: Er
	}, "Edit value") : /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("button", {
		type: "button",
		onClick: p,
		className: g("rounded px-1.5 py-0.5 text-accent hover:bg-surface-3")
	}, "Save"), /* @__PURE__ */ e.createElement("button", {
		type: "button",
		onClick: () => {
			a(null), s(null);
		},
		className: Er
	}, "Cancel"))), i === null ? /* @__PURE__ */ e.createElement("pre", { className: g("max-h-64 overflow-auto rounded bg-surface-2 p-1.5 font-code text-[11px]") }, u) : /* @__PURE__ */ e.createElement("textarea", {
		"aria-label": "New value (JSON)",
		value: i,
		onChange: (e) => a(e.target.value),
		spellCheck: !1,
		className: g("h-40 w-full rounded border border-border-subtle bg-surface-2 p-1.5 font-code text-[11px] text-text-primary")
	}), o && /* @__PURE__ */ e.createElement("p", { className: g("mt-1 text-text-secondary") }, o)), /* @__PURE__ */ e.createElement("section", null, /* @__PURE__ */ e.createElement("div", { className: g("mb-1 text-text-muted") }, "History (newest first)"), /* @__PURE__ */ e.createElement("table", { className: g("w-full") }, /* @__PURE__ */ e.createElement("tbody", null, [...t.history].reverse().map((t, r) => /* @__PURE__ */ e.createElement("tr", {
		key: `${t.time}-${r}`,
		className: t.outcome === "accepted" ? void 0 : g("text-amber-400")
	}, /* @__PURE__ */ e.createElement("td", { className: g("pr-2 align-top text-text-muted") }, new Date(t.time).toLocaleTimeString()), /* @__PURE__ */ e.createElement("td", { className: g("pr-2 align-top") }, W(n, t.writer)), /* @__PURE__ */ e.createElement("td", { className: g("pr-2 align-top") }, "rev ", t.revision.n), /* @__PURE__ */ e.createElement("td", { className: g("align-top") }, m(t))))))));
}
//#endregion
//#region src/DevToolsPanel.tsx
var Or = [
	"Console",
	"Issues",
	"System",
	"Storage",
	"Variables",
	"Pipeline",
	"Native"
], kr = {
	log: g("text-text-primary"),
	info: g("text-sky-400"),
	debug: g("text-text-muted"),
	warn: g("text-amber-400"),
	error: g("text-red-400"),
	exception: g("text-red-400"),
	input: g("text-accent"),
	result: g("text-emerald-400")
}, Ar = {
	log: "",
	info: "ⓘ",
	debug: "",
	warn: "▲",
	error: "✕",
	exception: "✕",
	input: "›",
	result: "‹"
}, jr = (e) => e.level === "warn" || e.level === "error" || e.level === "exception";
function Mr() {
	return Bn() ? /* @__PURE__ */ e.createElement(Ir, null) : /* @__PURE__ */ e.createElement(Nr, null);
}
function Nr({ fill: t = !1 } = {}) {
	let [n, r] = e.useState("Console"), i = z()((e) => e.entries), a = e.useMemo(() => i.filter(jr).length, [i]), o = Bn();
	return /* @__PURE__ */ e.createElement("div", { className: _(g("flex flex-col text-[11px]"), g(t ? "h-full" : "h-[420px]")) }, /* @__PURE__ */ e.createElement("div", { className: g("flex shrink-0 items-center gap-0.5 border-b border-border-subtle bg-surface-2 px-1") }, Or.map((t) => /* @__PURE__ */ e.createElement("button", {
		key: t,
		onClick: () => r(t),
		className: _(g("relative px-2.5 py-1.5 tracking-wide transition-colors"), g(n === t ? "text-text-primary" : "text-text-muted hover:text-text-secondary"))
	}, t, t === "Issues" && a > 0 && /* @__PURE__ */ e.createElement("span", { className: g("ml-1 rounded-full bg-red-500/80 px-1 text-[9px] text-white") }, a > 999 ? "999+" : a), n === t && /* @__PURE__ */ e.createElement("span", { className: g("absolute inset-x-1.5 -bottom-px h-0.5 rounded bg-accent") }))), /* @__PURE__ */ e.createElement("div", { className: g("flex-1") }), !o && /* @__PURE__ */ e.createElement("button", {
		onClick: Un,
		title: "Open in a separate window",
		className: g("mr-1 rounded px-1.5 py-0.5 text-[12px] leading-none text-text-muted hover:bg-surface-3 hover:text-text-primary")
	}, "⧉")), /* @__PURE__ */ e.createElement("div", { className: g("min-h-0 flex-1") }, n === "Console" && /* @__PURE__ */ e.createElement(Rr, { entries: i }), n === "Issues" && /* @__PURE__ */ e.createElement(Rr, {
		entries: i,
		issuesOnly: !0
	}), n === "System" && /* @__PURE__ */ e.createElement(Hr, null), n === "Storage" && /* @__PURE__ */ e.createElement(Ur, null), n === "Variables" && /* @__PURE__ */ e.createElement(wr, null), n === "Pipeline" && /* @__PURE__ */ e.createElement(br, null), n === "Native" && /* @__PURE__ */ e.createElement(Kr, null)));
}
function Pr(e) {
	return {
		WebkitAppRegion: "drag",
		...e === "darwin" ? { paddingLeft: 78 } : { paddingRight: 138 }
	};
}
var Fr = { WebkitAppRegion: "no-drag" };
function Ir() {
	return t.titleBar.useOverlay("--color-surface-2"), e.useEffect(() => {
		document.title = "SafeLight — Developer Tools";
	}, []), /* @__PURE__ */ e.createElement("div", { className: g("flex h-screen flex-col bg-surface-1 text-text-primary") }, /* @__PURE__ */ e.createElement("div", {
		className: g("flex h-[38px] shrink-0 items-center justify-between border-b border-border bg-surface-2 px-3"),
		style: Pr(t.devtools?.native?.platform)
	}, /* @__PURE__ */ e.createElement("span", { className: g("text-[11px] uppercase tracking-widest text-text-secondary") }, "Developer Tools"), /* @__PURE__ */ e.createElement("button", {
		onClick: Wn,
		title: "Close and re-dock in the main window",
		style: Fr,
		className: g("rounded px-2 py-0.5 text-[11px] text-text-muted hover:bg-surface-3 hover:text-text-primary")
	}, "⧉ Re-dock")), /* @__PURE__ */ e.createElement("div", { className: g("min-h-0 flex-1") }, /* @__PURE__ */ e.createElement(Nr, { fill: !0 })));
}
var Lr = [
	"log",
	"info",
	"warn",
	"error",
	"debug"
];
function Rr({ entries: t, issuesOnly: n = !1 }) {
	let [r, i] = e.useState(""), [a, o] = e.useState(new Set(Lr)), [s, c] = e.useState(!0), [l, u] = e.useState(null), d = e.useRef(null), f = e.useMemo(() => {
		let e = r.trim().toLowerCase();
		return t.filter((t) => {
			if (n) {
				if (!jr(t)) return !1;
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
	let m = (e) => o((t) => {
		let n = new Set(t);
		return n.has(e) ? n.delete(e) : n.add(e), n;
	});
	return /* @__PURE__ */ e.createElement("div", { className: g("flex h-full flex-col") }, /* @__PURE__ */ e.createElement("div", { className: g("flex shrink-0 flex-wrap items-center gap-1.5 border-b border-border-subtle px-2 py-1.5") }, /* @__PURE__ */ e.createElement("input", {
		value: r,
		onChange: (e) => i(e.target.value),
		placeholder: "Filter…",
		spellCheck: !1,
		className: g("min-w-0 flex-1 rounded bg-surface-2 px-2 py-1 text-text-primary outline-none placeholder:text-text-muted focus:bg-surface-3")
	}), !n && Lr.map((t) => /* @__PURE__ */ e.createElement("button", {
		key: t,
		onClick: () => m(t),
		title: `Toggle ${t}`,
		className: _(g("rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wide"), a.has(t) ? _(g("bg-surface-3"), kr[t]) : g("bg-surface-1 text-text-muted opacity-50"))
	}, t)), /* @__PURE__ */ e.createElement("button", {
		onClick: () => c((e) => !e),
		title: "Autoscroll to newest",
		className: _(g("rounded px-1.5 py-0.5 text-[12px] leading-none"), g(s ? "text-accent" : "text-text-muted"))
	}, "↓"), /* @__PURE__ */ e.createElement("button", {
		onClick: er,
		title: "Clear log",
		className: g("rounded px-1.5 py-0.5 text-text-muted hover:text-text-primary")
	}, "🗑")), /* @__PURE__ */ e.createElement("div", {
		ref: d,
		className: g("min-h-0 flex-1 overflow-y-auto font-code")
	}, f.length === 0 ? /* @__PURE__ */ e.createElement("div", { className: g("px-3 py-4 text-center text-text-muted") }, n ? "No warnings or errors." : "No console output yet.") : f.map((t) => {
		let n = !!t.stack, r = l === t.id;
		return /* @__PURE__ */ e.createElement("div", {
			key: t.id,
			onClick: () => n && u(r ? null : t.id),
			className: _(g("flex gap-1.5 border-b border-border-subtle/50 px-2 py-1"), t.level === "error" || t.level === "exception" ? g("bg-red-500/5") : t.level === "warn" ? g("bg-amber-500/5") : null, n && g("cursor-pointer"))
		}, /* @__PURE__ */ e.createElement("span", { className: _(g("w-3 shrink-0 text-center"), kr[t.level]) }, Ar[t.level]), /* @__PURE__ */ e.createElement("span", { className: g("shrink-0 text-text-muted") }, qr(t.time)), /* @__PURE__ */ e.createElement("div", { className: g("min-w-0 flex-1") }, /* @__PURE__ */ e.createElement("span", { className: _(g("whitespace-pre-wrap break-words"), kr[t.level]) }, t.parts.join(" ")), n && r && /* @__PURE__ */ e.createElement("pre", { className: g("mt-1 whitespace-pre-wrap break-words text-[11px] text-text-muted") }, t.stack)));
	})), !n && /* @__PURE__ */ e.createElement(zr, null));
}
function zr() {
	let [t, n] = e.useState(""), [r, i] = e.useState([]), [a, o] = e.useState(-1), s = () => {
		let e = t.trim();
		if (e) {
			V("input", [e]), i((t) => [...t, e]), o(-1), n("");
			try {
				V("result", [qn((0, eval)(e))]);
			} catch (e) {
				V("exception", [e instanceof Error ? `${e.name}: ${e.message}` : qn(e)], e instanceof Error ? e.stack : void 0);
			}
		}
	};
	return /* @__PURE__ */ e.createElement("div", { className: g("flex shrink-0 items-center gap-1.5 border-t border-border-subtle bg-surface-2 px-2 py-1") }, /* @__PURE__ */ e.createElement("span", { className: g("text-accent") }, "›"), /* @__PURE__ */ e.createElement("input", {
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
		className: g("min-w-0 flex-1 bg-transparent font-code text-text-primary outline-none placeholder:text-text-muted")
	}));
}
var Br = g("text-[10px] uppercase tracking-widest text-text-muted"), Vr = g("border-b border-t border-border-subtle px-2 py-1.5 text-[10px] uppercase tracking-widest text-text-muted");
function Hr() {
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
			value: `${Jr(l.usedJSHeapSize)} / ${Jr(l.jsHeapSizeLimit)} limit`
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
	}, [o]), /* @__PURE__ */ e.createElement("div", { className: g("h-full overflow-y-auto") }, /* @__PURE__ */ e.createElement("div", { className: g("flex items-center justify-between border-b border-border-subtle px-2 py-1.5") }, /* @__PURE__ */ e.createElement("span", { className: Br }, "Environment"), /* @__PURE__ */ e.createElement("button", {
		onClick: () => void o(),
		className: g("rounded px-1.5 py-0.5 text-text-muted hover:text-text-primary")
	}, "↻ Refresh")), /* @__PURE__ */ e.createElement("table", { className: g("w-full") }, /* @__PURE__ */ e.createElement("tbody", null, n.map((t) => /* @__PURE__ */ e.createElement("tr", {
		key: t.label,
		className: g("border-b border-border-subtle/50 align-top")
	}, /* @__PURE__ */ e.createElement("td", { className: g("w-36 shrink-0 px-2 py-1 text-text-secondary") }, t.label), /* @__PURE__ */ e.createElement("td", { className: g("px-2 py-1 font-code text-text-primary") }, /* @__PURE__ */ e.createElement("span", { className: g("break-all") }, t.value)))))), i && /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("div", { className: Vr }, "GPU feature status"), /* @__PURE__ */ e.createElement("table", { className: g("w-full") }, /* @__PURE__ */ e.createElement("tbody", null, Object.entries(i).map(([t, n]) => /* @__PURE__ */ e.createElement("tr", {
		key: t,
		className: g("border-b border-border-subtle/50")
	}, /* @__PURE__ */ e.createElement("td", { className: g("w-36 px-2 py-1 text-text-secondary") }, t), /* @__PURE__ */ e.createElement("td", { className: _(g("px-2 py-1 font-code"), /software|disabled|unavailable/i.test(n) ? g("text-amber-400") : g("text-emerald-400")) }, n)))))));
}
function Ur() {
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
	return /* @__PURE__ */ e.createElement("div", { className: g("flex h-full flex-col") }, /* @__PURE__ */ e.createElement("div", { className: g("flex shrink-0 items-center justify-between border-b border-border-subtle px-2 py-1.5") }, /* @__PURE__ */ e.createElement("span", { className: Br }, "localStorage · ", t.length, " keys"), /* @__PURE__ */ e.createElement("button", {
		onClick: l,
		className: g("rounded px-1.5 py-0.5 text-text-muted hover:text-text-primary")
	}, "↻")), /* @__PURE__ */ e.createElement("div", { className: g("flex min-h-0 flex-1") }, /* @__PURE__ */ e.createElement("div", { className: g("w-1/2 shrink-0 overflow-y-auto border-r border-border-subtle") }, t.map((t) => /* @__PURE__ */ e.createElement("div", {
		key: t,
		onClick: () => u(t),
		className: _(g("group flex items-center justify-between gap-1 px-2 py-1"), g(r === t ? "bg-surface-3" : "hover:bg-surface-2"))
	}, /* @__PURE__ */ e.createElement("span", {
		className: _(g("min-w-0 flex-1 cursor-pointer truncate font-code"), t.startsWith("sl_") ? g("text-text-primary") : g("text-text-muted")),
		title: t
	}, t), /* @__PURE__ */ e.createElement("button", {
		onClick: (e) => {
			e.stopPropagation(), f(t);
		},
		title: "Delete key",
		className: g("shrink-0 px-1 text-text-muted opacity-0 hover:text-red-400 group-hover:opacity-100")
	}, "×")))), /* @__PURE__ */ e.createElement("div", { className: g("flex min-w-0 flex-1 flex-col p-2") }, r == null ? /* @__PURE__ */ e.createElement("div", { className: g("m-auto text-text-muted") }, "Select a key to inspect.") : /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("div", {
		className: g("mb-1 truncate font-code text-text-secondary"),
		title: r
	}, r), /* @__PURE__ */ e.createElement("textarea", {
		value: a,
		onChange: (e) => o(e.target.value),
		spellCheck: !1,
		className: g("min-h-0 flex-1 resize-none rounded bg-surface-2 p-2 font-code text-[11px] text-text-primary outline-none focus:bg-surface-3")
	}), /* @__PURE__ */ e.createElement("div", { className: g("mt-1.5 flex items-center justify-end gap-1.5") }, s && /* @__PURE__ */ e.createElement("span", { className: g("mr-auto text-red-400") }, s), /* @__PURE__ */ e.createElement("button", {
		onClick: () => void navigator.clipboard?.writeText(a),
		className: g("rounded bg-surface-3 px-2 py-1 text-text-secondary hover:text-text-primary")
	}, "Copy"), /* @__PURE__ */ e.createElement("button", {
		onClick: d,
		className: g("rounded bg-slider-fill px-2 py-1 font-medium text-white hover:opacity-80")
	}, "Save"))))));
}
function K({ onClick: t, children: n }) {
	return /* @__PURE__ */ e.createElement("button", {
		onClick: t,
		className: g("rounded bg-surface-3 px-2.5 py-1 text-text-secondary hover:bg-surface-4 hover:text-text-primary")
	}, n);
}
var Wr = g("px-2 py-1 text-right font-normal"), Gr = g("px-2 py-1 text-right text-text-secondary");
function Kr() {
	let n = t.devtools?.electron, r = t.devtools?.native, [i, a] = e.useState(null), [o, s] = e.useState(null), c = e.useCallback(async () => {
		if (r?.metrics) try {
			a(await r.metrics());
		} catch {
			a(null);
		}
	}, [r]);
	if (e.useEffect(() => {
		c();
	}, [c]), !n && !r) return /* @__PURE__ */ e.createElement("div", { className: g("flex h-full items-center justify-center px-6 text-center text-text-muted") }, "Native tools require the SafeLight desktop app. In a browser, use your browser's own DevTools (F12).");
	let l = async (e, t) => {
		try {
			await e(), s(null);
		} catch (e) {
			s(`${t} failed: ${e instanceof Error ? e.message : String(e)}`);
		}
	};
	return /* @__PURE__ */ e.createElement("div", { className: g("flex h-full flex-col overflow-y-auto") }, /* @__PURE__ */ e.createElement("div", { className: g("border-b border-border-subtle px-2 py-1.5 text-[10px] uppercase tracking-widest text-text-muted") }, "Chrome DevTools"), /* @__PURE__ */ e.createElement("div", { className: g("flex flex-wrap gap-1.5 p-2") }, n ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(K, { onClick: () => void l(() => n.open("detach"), "Open DevTools") }, "Open ⧉"), /* @__PURE__ */ e.createElement(K, { onClick: () => void l(() => n.open("bottom"), "Dock bottom") }, "Dock ▾"), /* @__PURE__ */ e.createElement(K, { onClick: () => void l(() => n.toggle(), "Toggle") }, "Toggle"), /* @__PURE__ */ e.createElement(K, { onClick: () => void l(() => n.close(), "Close") }, "Close")) : /* @__PURE__ */ e.createElement("span", { className: g("text-text-muted") }, "DevTools control unavailable (older desktop build).")), /* @__PURE__ */ e.createElement("div", { className: Vr }, "Renderer"), /* @__PURE__ */ e.createElement("div", { className: g("flex flex-wrap gap-1.5 p-2") }, /* @__PURE__ */ e.createElement(K, { onClick: () => n ? void l(() => n.reload(!1), "Reload") : location.reload() }, "Reload"), n && /* @__PURE__ */ e.createElement(K, { onClick: () => void l(() => n.reload(!0), "Hard reload") }, "Hard reload")), /* @__PURE__ */ e.createElement("div", { className: g("flex items-center justify-between border-b border-t border-border-subtle px-2 py-1.5") }, /* @__PURE__ */ e.createElement("span", { className: Br }, "Process metrics"), /* @__PURE__ */ e.createElement("button", {
		onClick: () => void c(),
		title: "Refresh metrics",
		className: g("rounded px-1.5 py-0.5 text-text-muted hover:text-text-primary")
	}, "↻")), i ? /* @__PURE__ */ e.createElement("table", { className: g("w-full font-code") }, /* @__PURE__ */ e.createElement("thead", null, /* @__PURE__ */ e.createElement("tr", { className: g("text-text-muted") }, /* @__PURE__ */ e.createElement("th", { className: g("px-2 py-1 text-left font-normal") }, "Process"), /* @__PURE__ */ e.createElement("th", { className: Wr }, "PID"), /* @__PURE__ */ e.createElement("th", { className: Wr }, "CPU %"), /* @__PURE__ */ e.createElement("th", { className: Wr }, "Memory"))), /* @__PURE__ */ e.createElement("tbody", null, i.map((t) => /* @__PURE__ */ e.createElement("tr", {
		key: t.pid,
		className: g("border-t border-border-subtle/50")
	}, /* @__PURE__ */ e.createElement("td", { className: g("px-2 py-1 text-text-primary") }, t.type), /* @__PURE__ */ e.createElement("td", { className: Gr }, t.pid), /* @__PURE__ */ e.createElement("td", { className: Gr }, t.cpuPercent.toFixed(1)), /* @__PURE__ */ e.createElement("td", { className: Gr }, t.memoryMB.toFixed(0), " MB"))))) : /* @__PURE__ */ e.createElement("div", { className: g("px-2 py-2 text-text-muted") }, "Metrics unavailable (older desktop build)."), o && /* @__PURE__ */ e.createElement("div", { className: g("px-2 py-2 text-amber-400") }, o));
}
function qr(e) {
	let t = new Date(e), n = (e, t = 2) => String(e).padStart(t, "0");
	return `${n(t.getHours())}:${n(t.getMinutes())}:${n(t.getSeconds())}.${n(t.getMilliseconds(), 3)}`;
}
var Jr = (e) => `${(e / 1048576).toFixed(1)} MB`;
//#endregion
//#region src/dev/panels/TabPanels.tsx
function Yr({ children: t }) {
	return /* @__PURE__ */ e.createElement("div", { className: g("h-full text-[11px] text-text-primary") }, t);
}
function Xr() {
	return /* @__PURE__ */ e.createElement(Yr, null, /* @__PURE__ */ e.createElement(wr, null));
}
function Zr() {
	return /* @__PURE__ */ e.createElement(Yr, null, /* @__PURE__ */ e.createElement(br, null));
}
function Qr() {
	let t = z()((e) => e.entries);
	return /* @__PURE__ */ e.createElement(Yr, null, /* @__PURE__ */ e.createElement(Rr, { entries: t }));
}
//#endregion
//#region src/dev/panels/ExtensionsPanel.tsx
var $r = {
	running: g("text-accent"),
	neutral: g("text-text-secondary"),
	dim: g("text-text-secondary"),
	problem: g("text-amber-400"),
	failure: g("text-red-400")
}, ei = g("flex w-full min-w-0 items-baseline gap-1.5 text-left hover:bg-surface-3");
function ti() {
	let n = On(), r = An(n), i = k()((e) => e.selection), a = i?.kind === "node" ? i.id : null, o = e.useMemo(() => new Map(r.bands.map((e) => [e.id, e])), [r]), s = t.devtools?.extensions?.reloadDev, c = (e, t) => {
		let n = k().getState(), r = o.get(e.id);
		r || (n.setSearch(""), n.setShowAll(!0)), t !== e.id && (r?.collapsed ?? Ue(e, n.collapsed)) && n.setCollapsed([e.id], !1), n.select({
			kind: "node",
			id: t
		}), n.focusOn(t);
	};
	return /* @__PURE__ */ e.createElement("div", { className: g("h-full overflow-y-auto py-1 text-[11px]") }, /* @__PURE__ */ e.createElement("ul", { "aria-label": "Extensions" }, n.bands.map((n) => /* @__PURE__ */ e.createElement("li", { key: n.id }, /* @__PURE__ */ e.createElement("div", { className: g("flex items-center gap-1 pr-1") }, /* @__PURE__ */ e.createElement("button", {
		type: "button",
		"aria-current": a === n.id,
		onClick: () => c(n, n.id),
		className: _(ei, g("px-2 py-1"), a === n.id && g("bg-surface-3"))
	}, /* @__PURE__ */ e.createElement("span", {
		className: g("shrink-0 rounded-full"),
		style: {
			width: 8,
			height: 8,
			background: D(n.extensionId, t.ui.tokens)
		}
	}), /* @__PURE__ */ e.createElement("span", { className: g("min-w-0 truncate text-text-primary") }, n.name), /* @__PURE__ */ e.createElement("span", { className: _(g("ml-auto shrink-0 text-[11px]"), $r[n.status.tone]) }, n.status.label)), n.source === "dev" && s && /* @__PURE__ */ e.createElement("button", {
		type: "button",
		"aria-label": `Reload ${n.name}`,
		title: "Reload from the dev folder",
		onClick: () => void s(n.extensionId),
		className: g("shrink-0 rounded px-1.5 text-text-secondary hover:bg-surface-3 hover:text-text-primary")
	}, "↻")), n.status.message && /* @__PURE__ */ e.createElement("div", { className: g("break-words pl-3 pr-2 text-[11px] text-red-400") }, n.status.message), n.stages.length > 0 && /* @__PURE__ */ e.createElement("ul", null, n.stages.map((t) => /* @__PURE__ */ e.createElement(ni, {
		key: t.id,
		stage: t,
		selected: a === t.id,
		onClick: () => c(n, t.id)
	})))))));
}
function ni({ stage: t, selected: n, onClick: r }) {
	let { tone: i, label: a, reason: o } = t.state, s = i === "failure" || i === "problem";
	return /* @__PURE__ */ e.createElement("li", null, /* @__PURE__ */ e.createElement("button", {
		type: "button",
		"aria-current": n,
		title: `${t.stageId}: ${o}`,
		onClick: r,
		className: _(ei, g("py-0.5 pl-3 pr-2"), n && g("bg-surface-3"))
	}, /* @__PURE__ */ e.createElement("span", { className: g("min-w-0 truncate pl-3 text-text-secondary") }, t.name), /* @__PURE__ */ e.createElement("span", { className: _(g("ml-auto shrink-0 text-[11px]"), $r[i]) }, a)), s && /* @__PURE__ */ e.createElement("div", { className: _(g("break-words pl-6 pr-2 text-[11px]"), $r[i]) }, o));
}
//#endregion
//#region src/dev/panels/InspectorPanel.tsx
var q = g("text-text-secondary"), J = g("font-code text-[11px]");
function Y({ title: t, children: n }) {
	return /* @__PURE__ */ e.createElement("section", { className: g("border-b border-border-subtle/50 px-2 py-1.5") }, /* @__PURE__ */ e.createElement("div", { className: g("mb-1 text-[10px] uppercase tracking-widest text-text-muted") }, t), n);
}
function X({ rows: t }) {
	return /* @__PURE__ */ e.createElement("dl", { className: g("grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5") }, t.map(([t, n]) => /* @__PURE__ */ e.createElement(e.Fragment, { key: t }, /* @__PURE__ */ e.createElement("dt", { className: q }, t), /* @__PURE__ */ e.createElement("dd", { className: g("min-w-0 break-words") }, n))));
}
var Z = "—", ri = (e) => e ? "yes" : "no";
function ii(e) {
	return String(Number.isInteger(e) ? e : Number(e.toPrecision(4)));
}
function ai(e) {
	if (e == null) return Z;
	if (typeof e == "number") return ii(e);
	if (typeof e == "boolean") return String(e);
	let t = he(e);
	if (t) return `[${t.slice(0, 8).map((e) => typeof e == "number" ? ii(e) : String(e)).join(", ")}${t.length > 8 ? `, … ${t.length} in all` : ""}]`;
	let n = JSON.stringify(e) ?? String(e);
	return n.length > 120 ? `${n.slice(0, 120)}…` : n;
}
var oi = (e, t, n) => e ? n in e ? e[n] : e[`${t}.${n}`] : void 0;
function si() {
	let t = On(), n = An(t), r = k()((e) => e.selection), i = wn(), a;
	if (!r) a = /* @__PURE__ */ e.createElement("div", { className: g("p-3 text-text-muted") }, "Select a node, port or edge in the graph.");
	else if (r.kind === "edge") {
		let i = n.edges.find((e) => e.id === r.id);
		a = i ? /* @__PURE__ */ e.createElement(_i, {
			edge: i,
			model: t
		}) : /* @__PURE__ */ e.createElement(ci, null);
	} else {
		let o = r.kind === "node" ? r.id : r.node, s = /* @__PURE__ */ e.createElement(li, {
			id: o,
			model: t,
			graph: n,
			source: i
		});
		a = r.kind === "port" ? /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(vi, {
			node: o,
			port: r.port,
			graph: n,
			model: t
		}), s) : s;
	}
	return /* @__PURE__ */ e.createElement("div", { className: g("h-full overflow-y-auto text-[11px]") }, a);
}
function ci() {
	return /* @__PURE__ */ e.createElement("div", { className: g("p-3 text-text-muted") }, "The selection is no longer in the graph.");
}
function li({ id: t, model: n, graph: r, source: i }) {
	if (t === "core") return /* @__PURE__ */ e.createElement(ui, { graph: r });
	let a = n.bands.find((e) => e.id === t);
	if (a) return /* @__PURE__ */ e.createElement(fi, { band: a });
	let o = n.stages.find((e) => e.id === t);
	return o ? /* @__PURE__ */ e.createElement(mi, {
		node: o,
		source: i
	}) : /* @__PURE__ */ e.createElement(ci, null);
}
function Q(e, t) {
	if (e === "core") return "Safelight core";
	let n = t.bands.find((t) => t.id === e);
	return n ? n.name : t.stages.find((t) => t.id === e)?.name ?? e;
}
function ui({ graph: t }) {
	let n = Object.entries(Ce);
	return /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(Y, { title: "Node" }, /* @__PURE__ */ e.createElement("div", { className: g("font-medium text-text-primary") }, "Safelight core"), /* @__PURE__ */ e.createElement("div", { className: q }, "What core hands extensions and stages, and what it takes back from them.")), n.map(([n, r]) => /* @__PURE__ */ e.createElement(Y, {
		key: n,
		title: r
	}, /* @__PURE__ */ e.createElement("ul", null, t.core.filter((e) => e.group === n).map((t) => /* @__PURE__ */ e.createElement("li", {
		key: t.id,
		className: t.used ? void 0 : q
	}, t.label, !t.used && " (nothing in the graph uses it)"))))));
}
var di = {
	builtin: "built-in",
	installed: "installed",
	dev: "dev folder"
};
function fi({ band: t }) {
	let n = t.info;
	return /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(Y, { title: "Extension" }, /* @__PURE__ */ e.createElement("div", { className: g("font-medium text-text-primary") }, t.name), /* @__PURE__ */ e.createElement("div", { className: J }, t.extensionId), /* @__PURE__ */ e.createElement("div", { className: g("mt-1 flex flex-wrap items-center gap-1.5") }, /* @__PURE__ */ e.createElement(jt, { state: t.status }), t.version && /* @__PURE__ */ e.createElement("span", { className: q }, "v", t.version), t.source && /* @__PURE__ */ e.createElement("span", { className: q }, di[t.source])), t.status.message && /* @__PURE__ */ e.createElement("p", { className: g("mt-1 break-words text-red-400") }, t.status.message)), /* @__PURE__ */ e.createElement(Y, { title: "Contributions" }, t.contributions.length === 0 ? /* @__PURE__ */ e.createElement("div", { className: q }, "Nothing registered in this window.") : /* @__PURE__ */ e.createElement(X, { rows: t.contributions.map((t) => [t.label, /* @__PURE__ */ e.createElement("span", {
		key: t.kind,
		className: J
	}, t.ids.join(", "))]) })), /* @__PURE__ */ e.createElement(Y, { title: "Variables" }, /* @__PURE__ */ e.createElement(X, { rows: [["Subscribed", t.subscribed.length > 0 ? t.subscribed.join(", ") : "none"], ["Written", t.written.length > 0 ? t.written.join(", ") : "none"]] }), /* @__PURE__ */ e.createElement("p", { className: g("mt-1 text-[11px] text-text-secondary") }, "Writers come from each variable's recent history, so an older write may not show.")), n && /* @__PURE__ */ e.createElement(Y, { title: "Failures" }, /* @__PURE__ */ e.createElement(X, { rows: [
		["Start", n.failure ? `${n.failure.reason}: ${n.failure.message}` : "none"],
		["Callbacks", n.callbackFailures > 0 ? "one has failed" : "none failed"],
		["Dev folder", n.devError ?? "none"]
	] })));
}
function pi(e, t) {
	let n = e.stage, r = n.uniforms.map((e) => ({
		key: e.key,
		decl: e,
		where: ""
	}));
	(n.passes ?? []).forEach((e, t) => {
		for (let n of e.uniforms ?? []) r.push({
			key: n.key,
			decl: n,
			where: `pass ${t + 1}`
		});
	});
	let i = new Set(r.map((e) => e.key)), a = `${n.id}.`;
	for (let e of Object.keys(t ?? {})) {
		let t = e.startsWith(a) ? e.slice(a.length) : e;
		i.has(t) || (i.add(t), r.push({
			key: t,
			decl: null,
			where: "derived"
		}));
	}
	return r;
}
function mi({ node: t, source: n }) {
	let r = t.stage, i = Mn(t.stageId, n), a = t.state.status === "running" && r.dormantWhen ? i ? _e(r, i) : null : void 0, o = (r.passes ?? []).map((e) => e.iterations === void 0 ? "1" : typeof e.iterations == "number" ? String(e.iterations) : `${e.iterations.key} (up to ${e.iterations.max})`);
	return /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(Y, { title: "Stage" }, /* @__PURE__ */ e.createElement("div", { className: g("font-medium text-text-primary") }, t.name), /* @__PURE__ */ e.createElement("div", { className: J }, t.stageId), /* @__PURE__ */ e.createElement("div", { className: g("mt-1") }, /* @__PURE__ */ e.createElement("span", { className: $r[t.state.tone] }, t.state.label), /* @__PURE__ */ e.createElement("span", { className: g("ml-1.5 text-text-secondary") }, t.state.reason)), t.state.failure && /* @__PURE__ */ e.createElement("pre", { className: g("mt-1 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded bg-surface-2 p-1.5 font-code text-[11px] text-red-400") }, t.state.failure.log)), /* @__PURE__ */ e.createElement(Y, { title: "Declaration" }, /* @__PURE__ */ e.createElement(X, { rows: [
		["Extension", t.extensionId],
		["Phase", r.phase],
		["Priority", String(r.priority ?? 100)],
		["Anchor", r.anchor ?? Z],
		["After", r.after?.length ? r.after.join(", ") : Z],
		["Reads", r.reads ?? "source"],
		["Space", r.space ? `${r.space.encoding}/${r.space.primaries ?? "rec709"}` : Z],
		["Mask", r.mask?.maskable ? "maskable" : "no"],
		["Geometry", r.geometry ? `region ${r.geometry.region}, inverse ${r.geometry.inverse}` : "no"],
		["View only", ri(r.viewOnly)],
		["Keeps detail", ri(r.keepsDetail)],
		["Dormant when", r.dormantWhen ? ai(r.dormantWhen) : Z],
		["At rest", a === void 0 ? Z : a === null ? "waiting for the drawn values" : a ? "yes: idle, every listed uniform at its rest value" : "no"]
	] })), /* @__PURE__ */ e.createElement(Y, { title: "Uniforms" }, /* @__PURE__ */ e.createElement(hi, {
		node: t,
		values: i,
		source: n
	})), (r.passes?.length ?? 0) > 0 && /* @__PURE__ */ e.createElement(Y, { title: "Passes" }, /* @__PURE__ */ e.createElement("div", null, r.passes?.length, " ", r.passes?.length === 1 ? "pass" : "passes", ", draws: ", o.join(", "))), (r.textures?.length ?? 0) > 0 && /* @__PURE__ */ e.createElement(Y, { title: "Textures" }, /* @__PURE__ */ e.createElement(X, { rows: (r.textures ?? []).map((e) => [e.key, e.kind]) })), ((r.produces?.length ?? 0) > 0 || (r.consumes?.length ?? 0) > 0) && /* @__PURE__ */ e.createElement(Y, { title: "Inter-stage values" }, /* @__PURE__ */ e.createElement(X, { rows: [["Produces", r.produces?.map((e) => `isv_${e.name} (${e.glslType})`).join(", ") || Z], ["Consumes", r.consumes?.map((e) => `isv_${e}`).join(", ") || Z]] })));
}
function hi({ node: t, values: n, source: r }) {
	let i = pi(t, n);
	if (i.length === 0) return /* @__PURE__ */ e.createElement("div", { className: q }, "None.");
	let a = t.stage.derive !== void 0;
	return /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("table", { className: g("w-full") }, /* @__PURE__ */ e.createElement("thead", null, /* @__PURE__ */ e.createElement("tr", { className: q }, /* @__PURE__ */ e.createElement("th", { className: g("pr-2 text-left font-normal") }, "Key"), /* @__PURE__ */ e.createElement("th", { className: g("pr-2 text-left font-normal") }, "Type"), /* @__PURE__ */ e.createElement("th", { className: g("pr-2 text-left font-normal") }, "Default"), /* @__PURE__ */ e.createElement("th", { className: g("text-left font-normal") }, a ? "Live (derived)" : "Live"))), /* @__PURE__ */ e.createElement("tbody", { className: J }, i.map((r) => /* @__PURE__ */ e.createElement("tr", {
		key: `${r.where}:${r.key}`,
		className: g("align-top")
	}, /* @__PURE__ */ e.createElement("td", { className: g("pr-2 break-all") }, r.key, r.where && /* @__PURE__ */ e.createElement("span", { className: g("ml-1 text-text-secondary") }, r.where)), /* @__PURE__ */ e.createElement("td", { className: g("pr-2 text-text-secondary") }, r.decl ? r.decl.glslType : Z), /* @__PURE__ */ e.createElement("td", { className: g("pr-2 text-text-secondary") }, r.decl ? ai(r.decl.default) : Z), /* @__PURE__ */ e.createElement("td", { className: _(g("break-all"), g(n ? "text-text-primary" : "text-text-secondary")) }, ai(oi(n, t.stageId, r.key))))))), /* @__PURE__ */ e.createElement("p", { className: g("mt-1 text-[11px] text-text-secondary") }, r ? `Live values from ${r.window}.` : "Live values show while a window has a live develop view."));
}
var gi = {
	colour: "Colour, from one stage to the next",
	isv: "An inter-stage value",
	resource: "A resource core hands the stage",
	geometry: "The stage's coordinate mapping, back to core",
	registration: "A registration between the extension and core"
};
function _i({ edge: t, model: n }) {
	return /* @__PURE__ */ e.createElement(Y, { title: "Edge" }, /* @__PURE__ */ e.createElement(X, { rows: [
		["From", `${Q(t.from.node, n)} · ${t.from.port}`],
		["To", `${Q(t.to.node, n)} · ${t.to.port}`],
		["Kind", gi[t.kind]],
		["Carries", t.label],
		["Owner", Q(`band:${t.owner}`, n)]
	] }));
}
function vi({ node: t, port: n, graph: r, model: i }) {
	let a = r.edges.filter((e) => e.from.node === t && e.from.port === n || e.to.node === t && e.to.port === n);
	return /* @__PURE__ */ e.createElement(Y, { title: "Port" }, /* @__PURE__ */ e.createElement("div", { className: g("text-text-primary") }, Q(t, i), " · ", /* @__PURE__ */ e.createElement("span", { className: J }, n)), a.length === 0 ? /* @__PURE__ */ e.createElement("div", { className: q }, "No edges in the graph end here.") : /* @__PURE__ */ e.createElement("ul", { className: g("mt-1") }, a.map((r) => {
		let a = r.from.node === t && r.from.port === n ? r.to : r.from;
		return /* @__PURE__ */ e.createElement("li", {
			key: r.id,
			className: g("text-text-secondary")
		}, r.label, " ", r.from.node === t ? "to" : "from", " ", Q(a.node, i));
	})));
}
//#endregion
//#region src/dev/StatusBar.tsx
var yi = 3e3, bi = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`;
function xi(e, t) {
	if (!e) return "Open Develop, or pop out Dev, to see what runs";
	let n = t - e.live.at;
	if (n < yi) return `live from ${e.window}`;
	let r = Math.round(n / 1e3);
	return r < 120 ? `${r} s ago` : `${Math.round(r / 60)} min ago`;
}
function Si(t) {
	let [n, r] = e.useState(() => Date.now());
	return e.useEffect(() => {
		let e = setInterval(() => r(Date.now()), t);
		return () => clearInterval(e);
	}, [t]), n;
}
function Ci() {
	let { stats: t } = On(), n = wn(), r = Math.max(Si(1e3), n?.live.at ?? 0), i = n?.live.frameMs ?? null, { extensions: a, stages: o } = t;
	return /* @__PURE__ */ e.createElement("div", { className: g("flex min-w-0 items-center gap-4 text-[11px] text-text-secondary") }, /* @__PURE__ */ e.createElement("span", null, "Extensions: ", a.running, " running · ", a.failed, " failed · ", a.off, " off"), /* @__PURE__ */ e.createElement("span", null, "Stages: ", o.running, " running · ", o.notBuilt, " not built · ", bi(o.problems, "problem")), i !== null && /* @__PURE__ */ e.createElement("span", null, "Frame ", Math.round(i), " ms"), /* @__PURE__ */ e.createElement("span", { className: g("truncate") }, xi(n, r)));
}
//#endregion
//#region src/DevSettings.tsx
var wi = g("text-[11px] text-text-muted");
function Ti() {
	let n = t.devtools;
	return /* @__PURE__ */ e.createElement("div", { className: g("flex flex-col gap-4") }, /* @__PURE__ */ e.createElement("div", null, /* @__PURE__ */ e.createElement("div", { className: g("text-[10px] uppercase tracking-widest text-text-muted") }, "Development extensions folder"), /* @__PURE__ */ e.createElement("p", { className: g("mt-1.5 text-[10px] leading-relaxed text-text-muted") }, "Point Safelight at a local folder of built extensions to load them live, without installing through GitHub. Point at a single extension's folder — a ", /* @__PURE__ */ e.createElement("code", null, "safelight.json"), " manifest plus its built bundle, the same layout an installed extension uses — or at a parent folder whose immediate subfolders are each one. Loaded extensions appear under Extensions ▸ Dev.")), n ? n.electron ? /* @__PURE__ */ e.createElement(n.devFolder.Controls, { variant: "settings" }) : /* @__PURE__ */ e.createElement("p", { className: wi }, "Loading extensions from a folder requires the desktop app.") : /* @__PURE__ */ e.createElement("p", { className: wi }, sr));
}
//#endregion
//#region src/index.tsx
var Ei = "core.devtools.toggle", Di = "safelight.devtools.styles", Oi = "dev", ki = "safelight.devtools.go", $ = {
	extensions: "safelight.devtools.extensions",
	inspector: "safelight.devtools.inspector",
	variables: "safelight.devtools.variables",
	pipeline: "safelight.devtools.pipeline",
	console: "safelight.devtools.console"
}, Ai = { rails: [
	{
		side: "left",
		width: 260,
		panels: [$.extensions, $.pipeline]
	},
	{
		side: "right",
		width: 320,
		panels: [$.inspector, $.variables]
	},
	{
		side: "bottom",
		height: 200,
		panels: [$.console]
	}
] };
function ji(e) {
	e.registerModule({
		id: "dev",
		label: "Dev",
		order: 900,
		component: In,
		statusBar: Ci,
		defaultLayout: Ai
	}), e.registerPanel({
		id: $.extensions,
		title: "Extensions",
		component: ti,
		fill: !0
	}), e.registerPanel({
		id: $.inspector,
		title: "Inspector",
		component: si,
		fill: !0
	}), e.registerPanel({
		id: $.variables,
		title: "Variables",
		component: Xr,
		fill: !0
	}), e.registerPanel({
		id: $.pipeline,
		title: "Pipeline",
		component: Zr,
		fill: !0
	}), e.registerPanel({
		id: $.console,
		title: "Console",
		component: Qr,
		allowBottomDock: !0
	}), e.registerKeybinding({
		id: ki,
		label: "Go to Dev",
		category: "General",
		defaultCombo: "",
		handler: () => e.navigation.goTo("dev")
	});
}
function Mi(e) {
	n(e), e.registerStylesheet({
		id: Di,
		css: ee(e.ui.tokens)
	}), ar(), Gn(), e.devtools?.devFolder.init(), e.registerPanel({
		id: I,
		title: "Developer Tools",
		component: Mr
	}), e.registerSettings({
		title: "Developer Tools",
		fields: [],
		component: Ti
	}), e.registerKeybinding({
		id: Ei,
		label: "Toggle Developer Tools Panel",
		category: "General",
		defaultCombo: "Ctrl+Alt+I",
		handler: () => e.dock.togglePanel(I)
	}), ji(e), cn();
}
function Ni() {
	or(), Kn(), ln(), t.devtools?.devFolder.teardown();
}
//#endregion
export { ki as DEV_KEYBINDING_ID, Oi as DEV_MODULE_ID, $ as DEV_PANELS, Ei as KEYBINDING_ID, I as PANEL_ID, Di as STYLESHEET_ID, Mi as activate, Ni as deactivate };

//# sourceMappingURL=index.js.map