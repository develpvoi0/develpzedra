import { Section } from "../Icons";
import { TypedBlock } from "../TypedBlock";
import { useContent } from "../../i18n/lang";

const PODS = `$ kubectl get pods -A

NAMESPACE     NAME                  READY  AGE
aromia        landing-aromia-7d4    1/1    41d
aromia        solidarity-energy-2f  1/1    27d
kube-system   traefik-6b9c8         1/1    96d
cert-manager  cert-manager-5f7      1/1    96d

nodo ok   cpu 12%   mem 61%   disco 34%`;

const DEPLOYS = `aromia.com.ve            TLS ok · renueva 58d
aromia.com.ve/solidarity-energy    TLS ok · renueva 58d

— github actions ————————————
✓ deploy landing-aromia    main@8f2a1c  1m42s
✓ build solidarity-energy  main@c04e77  2m08s
✓ lint + typecheck         main@c04e77  0m31s`;

export function InfraPanel({ onDone }: { onDone?: () => void }) {
  const { ui } = useContent();
  return (
    <div>
      <Section icon="server">{ui.sections.infra}</Section>
      <div className="text-dim">{ui.infra.connecting}</div>
      <div>
        <span className="text-grn">✓</span> {ui.infra.handshake} ·{" "}
        <span className="text-amb">{ui.infra.demoData}</span>
      </div>
      <pre className="out text-[12.5px] leading-[1.85] overflow-x-auto">{PODS}</pre>
      <pre className="out text-[12.5px] leading-[1.85] overflow-x-auto">{DEPLOYS}</pre>
      <TypedBlock className="note" onDone={onDone} segs={[{ text: ui.infra.note }]} />
      <div className="text-dim">
        {ui.infra.footerPre} <span className="text-amb">{ui.infra.demo}</span>
        {ui.infra.footerPost}
      </div>
    </div>
  );
}
