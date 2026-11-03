"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { castLine, type Yao } from "@/lib/cast";

export type Phase = "idle" | "spinning" | "shrinking" | "growing" | "reading";

const SPIN_MS = 1400;
const SHRINK_MS = 1100;
const GROW_MS = 1400;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useDivination() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [lines, setLines] = useState<Yao[]>([]);
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
  }, [clearTimers]);

  const cast = useCallback(() => {
    if (phaseRef.current !== "idle") return;
    const drawn = Array.from({ length: 6 }, () => castLine());
    clearTimers();

    if (prefersReducedMotion()) {
      setLines(drawn);
      phaseRef.current = "reading";
      setPhase("reading");
      return;
    }

    phaseRef.current = "spinning";
    setPhase("spinning");
    setLines([]);

    later(() => {
      phaseRef.current = "shrinking";
      setPhase("shrinking");
    }, SPIN_MS);

    later(() => {
      setLines(drawn);
      phaseRef.current = "growing";
      setPhase("growing");
    }, SPIN_MS + SHRINK_MS);

    later(() => {
      phaseRef.current = "reading";
      setPhase("reading");
    }, SPIN_MS + SHRINK_MS + GROW_MS);
  }, [clearTimers, later]);

  return { phase, lines, reduced, cast, reset };
}

export type Ritual = ReturnType<typeof useDivination>;
