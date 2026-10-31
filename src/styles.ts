// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// The panel's look as it was in core, where it was drawn with Tailwind
// utilities. The app's Tailwind build never scans an extension, so the
// utilities this extension uses are written out here under a prefix, with the
// values core's built CSS gives them, and registered as one stylesheet.
//
// `tw("flex px-2 hover:bg-surface-3")` takes Tailwind's names and returns the
// prefixed classes; the type rejects a name this sheet doesn't define. Every
// rule sits in `:where()`, at zero specificity, so a stylesheet that restyles
// buttons or inputs (Custom Input Styling, a user's own CSS) wins over it as it
// wins over core's layered utilities. The accessibility rules at the end
// repeat core's Larger text and Title-case headings rules for these classes.

import type { UiTokens } from "./safelight";

export const PREFIX = "sldt-";

const sp = (n: number): string => `${n * 0.25}rem`;
const mix = (color: string, percent: number): string => `color-mix(in oklab, ${color} ${percent}%, transparent)`;

const SKY_400 = "oklch(74.6% 0.16 232.661)";
const AMBER_400 = "oklch(82.8% 0.189 84.429)";
const AMBER_500 = "oklch(76.9% 0.188 70.08)";
const RED_400 = "oklch(70.4% 0.191 22.216)";
const RED_500 = "oklch(63.7% 0.237 25.331)";
const EMERALD_400 = "oklch(76.5% 0.177 163.223)";

function utilities(t: UiTokens) {
  return {
    absolute: "position: absolute",
    relative: "position: relative",
    "inset-x-1.5": `inset-inline: ${sp(1.5)}`,
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
    "gap-0.5": `gap: ${sp(0.5)}`,
    "gap-1": `gap: ${sp(1)}`,
    "gap-1.5": `gap: ${sp(1.5)}`,
    "gap-2": `gap: ${sp(2)}`,
    "gap-4": `gap: ${sp(4)}`,
    "gap-x-2.5": `column-gap: ${sp(2.5)}`,
    "gap-x-3": `column-gap: ${sp(3)}`,
    "gap-y-0.5": `row-gap: ${sp(0.5)}`,

    "w-3": `width: ${sp(3)}`,
    "w-36": `width: ${sp(36)}`,
    "w-56": `width: ${sp(56)}`,
    "w-1/2": "width: 50%",
    "w-full": "width: 100%",
    "min-w-0": "min-width: 0",
    "h-0.5": `height: ${sp(0.5)}`,
    "h-40": `height: ${sp(40)}`,
    "h-[38px]": "height: 38px",
    "h-[420px]": "height: 420px",
    "h-full": "height: 100%",
    "h-screen": "height: 100vh",
    "min-h-0": "min-height: 0",
    "max-h-64": `max-height: ${sp(64)}`,

    "m-auto": "margin: auto",
    "my-1": `margin-block: ${sp(1)}`,
    "mb-1": `margin-bottom: ${sp(1)}`,
    "ml-1": `margin-left: ${sp(1)}`,
    "ml-1.5": `margin-left: ${sp(1.5)}`,
    "ml-2": `margin-left: ${sp(2)}`,
    "ml-auto": "margin-left: auto",
    "mr-1": `margin-right: ${sp(1)}`,
    "mr-auto": "margin-right: auto",
    "mt-0.5": `margin-top: ${sp(0.5)}`,
    "mt-1": `margin-top: ${sp(1)}`,
    "mt-1.5": `margin-top: ${sp(1.5)}`,
    "p-1.5": `padding: ${sp(1.5)}`,
    "p-2": `padding: ${sp(2)}`,
    "p-3": `padding: ${sp(3)}`,
    "px-1": `padding-inline: ${sp(1)}`,
    "px-1.5": `padding-inline: ${sp(1.5)}`,
    "px-2": `padding-inline: ${sp(2)}`,
    "px-2.5": `padding-inline: ${sp(2.5)}`,
    "px-3": `padding-inline: ${sp(3)}`,
    "px-6": `padding-inline: ${sp(6)}`,
    "py-0.5": `padding-block: ${sp(0.5)}`,
    "py-1": `padding-block: ${sp(1)}`,
    "py-1.5": `padding-block: ${sp(1.5)}`,
    "py-2": `padding-block: ${sp(2)}`,
    "py-4": `padding-block: ${sp(4)}`,
    "pl-3": `padding-left: ${sp(3)}`,
    "pr-2": `padding-right: ${sp(2)}`,

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
    "border-border": `border-color: ${t.border}`,
    "border-border-subtle": `border-color: ${t.borderSubtle}`,
    "border-border-subtle/50": `border-color: ${mix(t.borderSubtle, 50)}`,

    "bg-transparent": "background-color: transparent",
    "bg-surface-1": `background-color: ${t.surface1}`,
    "bg-surface-2": `background-color: ${t.surface2}`,
    "bg-surface-3": `background-color: ${t.surface3}`,
    "bg-surface-4": `background-color: ${t.surface4}`,
    "bg-accent": `background-color: ${t.accent}`,
    "bg-slider-fill": `background-color: ${t.sliderFill}`,
    "bg-red-500/5": `background-color: ${mix(RED_500, 5)}`,
    "bg-red-500/80": `background-color: ${mix(RED_500, 80)}`,
    "bg-amber-500/5": `background-color: ${mix(AMBER_500, 5)}`,
    "bg-amber-500/80": `background-color: ${mix(AMBER_500, 80)}`,

    "font-code": `font-family: ${t.fontCode}`,
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

    "text-text-primary": `color: ${t.textPrimary}`,
    "text-text-secondary": `color: ${t.textSecondary}`,
    "text-text-muted": `color: ${t.textMuted}`,
    "text-accent": `color: ${t.accent}`,
    "text-white": `color: ${t.white}`,
    "text-sky-400": `color: ${SKY_400}`,
    "text-amber-400": `color: ${AMBER_400}`,
    "text-red-400": `color: ${RED_400}`,
    "text-emerald-400": `color: ${EMERALD_400}`,

    "opacity-0": "opacity: 0",
    "opacity-50": "opacity: 0.5",
    "opacity-80": "opacity: 0.8",
    "opacity-100": "opacity: 1",
    "transition-colors":
      "transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms",

    group: "",
    "space-y-px": "",
  };
}

type Base = keyof ReturnType<typeof utilities>;
type Variant = "group-hover" | "placeholder" | "focus" | "hover";

/** The variants in use, in Tailwind's order: a later rule wins a tie. */
const VARIANTS = [
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
] as const satisfies readonly `${Variant}:${Base}`[];

export type Utility = Base | (typeof VARIANTS)[number];

/** The first name in `S` this sheet doesn't define; never when all are. */
type Unknown<S extends string> = S extends `${infer Head} ${infer Rest}`
  ? Head extends Utility
    ? Unknown<Rest>
    : Head
  : S extends Utility
    ? never
    : S;

/** The prefixed class for one utility name. */
export const classOf = (name: Utility): string => PREFIX + name.replace(/[^a-zA-Z0-9-]/g, "_");

/** Tailwind names, space-separated, as this sheet's classes. */
export function tw<S extends string>(names: S & ([Unknown<S>] extends [never] ? unknown : never)): string {
  return names
    .split(" ")
    .map((n) => classOf(n as Utility))
    .join(" ");
}

/** Join class strings, skipping the empty and the switched-off. */
export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

function variantRule(name: (typeof VARIANTS)[number], decls: string): string {
  const c = `.${classOf(name)}`;
  if (name.startsWith("group-hover:")) {
    return `@media (hover: hover) { :where(.${classOf("group")}:hover ${c}) { ${decls}; } }`;
  }
  if (name.startsWith("placeholder:")) return `:where(${c})::placeholder { ${decls}; }`;
  if (name.startsWith("focus:")) return `:where(${c}:focus) { ${decls}; }`;
  return `@media (hover: hover) { :where(${c}:hover) { ${decls}; } }`;
}

export function devtoolsCss(t: UiTokens): string {
  const table: Record<string, string> = utilities(t);
  const base = Object.entries(table)
    .filter(([, decls]) => decls !== "")
    .map(([name, decls]) => `:where(.${classOf(name as Base)}) { ${decls}; }`);
  const variants = VARIANTS.map((name) => variantRule(name, table[name.slice(name.indexOf(":") + 1)]));
  const c = (name: Base) => `.${classOf(name)}`;
  return [
    ...base,
    `:where(${c("space-y-px")} > :not(:last-child)) { margin-block-end: 1px; }`,
    ...variants,
    `html.sl-larger-text ${c("text-[9px]")} { font-size: 11px !important; }`,
    `html.sl-larger-text ${c("text-[10px]")} { font-size: 12px !important; }`,
    `html.sl-larger-text ${c("text-[11px]")} { font-size: 13px !important; line-height: 1.45 !important; }`,
    `html.sl-larger-text ${c("uppercase")} { text-transform: none !important; }`,
    `html.sl-larger-text ${c("tracking-widest")} { letter-spacing: normal !important; }`,
    `html.sl-title-headings ${c("uppercase")} { text-transform: capitalize !important; }`,
    "",
  ].join("\n");
}
