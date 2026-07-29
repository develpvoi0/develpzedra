import {createContext, useContext, useEffect, useMemo, useRef, useState} from "react";
import { audio } from "../engine/audio";

export type Seg = { text:string; className?: string};

export const SkipCtx = createContext(0);

export function usePrefersReducedMotion(): boolean{
    return useMemo(() => matchMedia("(prefers-reduced-motion: reduce)").matches, []);
}

export function TypedBlock({ segs, className, onDone }: {
  segs: Seg[];
  className?: string;
  onDone?: () => void;
}) {
  const skip = useContext(SkipCtx);


  const skip0 = useRef(skip);

  const still = usePrefersReducedMotion();
  const total = useMemo(() => segs.reduce((n, s) => n + s.text.length, 0), [segs]);

 
  const [count, setCount] = useState(still ? total : 0);

  const doneRef = useRef(false);


  useEffect(() => {
    if (skip !== skip0.current) setCount(total);
  }, [skip, total]);


  useEffect(() => {
    if (count >= total) {
      if (!doneRef.current) { doneRef.current = true; onDone?.(); }
      return;
    }
    if (count % 27 === 0) audio.keyClick(false, true);
    const id = setTimeout(() => setCount(c => Math.min(total, c + 3)), 12);
    return () => clearTimeout(id);
  }, [count, total, onDone]);

  /* Render: repartir `count` caracteres entre los segmentos en
     orden. `left` es cuántos quedan por asignar. */
  let left = count;
  return (
    <div className={`whitespace-pre-wrap ${className ?? ""}`}>
      {segs.map((s, i) => {
        const take = Math.max(0, Math.min(s.text.length, left));
        left -= take;
        return (
          <span key={i} className={s.className}>
            {s.text.slice(0, take)}
          </span>
        );
      })}
    </div>
  );
}

export function useSteps(){
    const [step, setStep] = useState<number>(0);
    return {step, next: () => setStep(dot => dot + 1) };
}