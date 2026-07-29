import { useState } from "react";
import { CrtOverlay } from "./components/CrtOverlay";
import { TopBar } from "./components/TopBar";
import { HintBar } from "./components/HintBar";
import { BootSequence } from "./components/BootSequence";
import { Terminal } from "./components/Terminal";

export default function App() {
  const [phase, setPhase] = useState<"boot" | "ready">("boot");

  return (
    <>
      <CrtOverlay />
      <TopBar />
      {phase === "boot"
        ? <BootSequence onDone={() => setPhase("ready")} />
        : <Terminal />}
      <HintBar />
    </>
  );
}