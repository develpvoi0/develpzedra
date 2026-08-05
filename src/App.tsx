import { useState } from "react";
import { AuroraBg } from "./components/AuroraBg";
import { CrtOverlay } from "./components/CrtOverlay";
import { TopBar } from "./components/TopBar";
import { HintBar } from "./components/HintBar";
import { BootSequence } from "./components/BootSequence";
import { Terminal } from "./components/Terminal";
import { LangProvider } from "./i18n/lang";

export default function App() {
  const [phase, setPhase] = useState<"boot" | "ready">("boot");

  return (
    <LangProvider>
      <AuroraBg />
      <CrtOverlay />
      <TopBar />
      {phase === "boot"
        ? <BootSequence onDone={() => setPhase("ready")} />
        : <Terminal />}
      <HintBar />
    </LangProvider>
  );
}
