import { usePrefersReducedMotion } from "./TypedBlock";

export function CrtOverlay() {
  const still = usePrefersReducedMotion();
  return <div className={`crt ${still ? "" : "crt-flicker"}`} aria-hidden />;
}