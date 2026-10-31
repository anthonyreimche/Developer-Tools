// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// Shown in place of a tab whose core reads (api.devtools) the host didn't hand over.

import { React } from "./rt";
import { tw } from "./styles";

export const UNAVAILABLE_TEXT = "Not available in this version of Safelight.";

export function Unavailable() {
  return <div className={tw("p-3 text-text-muted")}>{UNAVAILABLE_TEXT}</div>;
}
