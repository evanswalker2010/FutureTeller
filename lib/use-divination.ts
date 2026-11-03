"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { castLine, type Yao } from "@/lib/cast";
import { lineCaption } from "@/lib/labels";

export type Phase = "idle" | "casting" | "named" | "reading";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useDivination() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [lines, setLines] = useState<Yao[]>([]);
  const [coins, setCoins] = useState<Yao["coins"] | null>(null);
  const [reduced, setReduced] = useState(false);
  const timers = useRef<number[]>([]);
  const phaseRef = useRef<Phase>("idle");

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    phaseRef.current = "idle";
    setPhase("idle");
    setLines([]);
    setCoins(null);
  }, [clearTimers]);

  const cast = useCallback(() => {
    if (phaseRef.current !== "idle") return;
    const drawn = Array.from({ length: 6 }, () => castLine());
    clearTimers();
    phaseRef.current = "casting";

    if (prefersReducedMotion()) {
      setLines(drawn);
      setCoins(null);
      phaseRef.current = "reading";
      setPhase("reading");
      return;
    }

    setPhase("casting");
    setLines([]);
    setCoins(null);

    const reveal = (index: number) => {
      setCoins(drawn[index].coins);
      later(() => {
        setLines(drawn.slice(0, index + 1));
        setCoins(null);
        if (index < 5) {
          later(() => reveal(index + 1), 240);
          return;
        }
        phaseRef.current = "named";
        setPhase("named");
        later(() => {
          phaseRef.current = "reading";
          setPhase("reading");
        }, 720);
      }, 640);
    };

    later(() => reveal(0), 280);
  }, [clearTimers, later]);

  const last = lines[lines.length - 1];
  const throwCaption = last ? lineCaption(lines.length - 1, last) : null;

  return { phase, lines, coins, throwCaption, reduced, cast, reset };
}

export type Ritual = ReturnType<typeof useDivination>;
