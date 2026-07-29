import { Section } from "../Icons";
import { TypedBlock } from "../TypedBlock";

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
  return (
    <div>
      <Section icon="server">systems · clúster</Section>
      <div className="text-dim">Conectando a k3s://contabo-vps ...</div>
      <div>
        <span className="text-grn">✓</span> handshake ok ·{" "}
        <span className="text-amb">demo data</span>
      </div>
      <pre className="out text-[12.5px] leading-[1.85] overflow-x-auto">{PODS}</pre>
      <pre className="out text-[12.5px] leading-[1.85] overflow-x-auto">{DEPLOYS}</pre>
      <TypedBlock
        className="note"
        onDone={onDone}
        segs={[{
          text:
            "// Tumbé el clúster entero un domingo por un ingress mal escrito.\n" +
            "// Desde entonces todo entra por pull request, incluso lo mío.",
        }]}
      />
      <div className="text-dim">
        Nota: Paneles en modo <span className="text-amb">demo</span>. se conectan a
        endpoints reales antes de publicar.
      </div>
    </div>
  );
}