// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// Dev ▸ Variables, Pipeline and Console: the Developer Tools panel's tabs as
// panels of their own. The tabs take their text size from the panel around
// them, and core draws a panel's component with nothing around it, so each is
// given the size the Developer Tools panel gives it.

import type { ReactNode } from "react";
import { ConsoleTab } from "../../DevToolsPanel";
import { devLog } from "../../log-capture";
import { PipelineTab } from "../../PipelineTab";
import { React } from "../../rt";
import { tw } from "../../styles";
import { VariablesTab } from "../../VariablesTab";

function TabPanel({ children }: { children: ReactNode }) {
  return <div className={tw("h-full text-[11px] text-text-primary")}>{children}</div>;
}

export function VariablesPanel() {
  return (
    <TabPanel>
      <VariablesTab />
    </TabPanel>
  );
}

export function PipelinePanel() {
  return (
    <TabPanel>
      <PipelineTab />
    </TabPanel>
  );
}

export function ConsolePanel() {
  const entries = devLog()((s) => s.entries);
  return (
    <TabPanel>
      <ConsoleTab entries={entries} />
    </TabPanel>
  );
}
