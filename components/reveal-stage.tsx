"use client";

import { Bagua } from "@/components/bagua";
import { HexagramFigure } from "@/components/hexagram-figure";
import { ReadingScroll } from "@/components/reading-scroll";
import { changedKey, lineKey, type Yao } from "@/lib/cast";
import { byLines, imageTitle, placement } from "@/lib/hexagrams";
import { ordinal } from "@/lib/labels";
import type { Ritual } from "@/lib/use-divination";
import { cn } from "cn";

export function RevealStage({
  ritual,
  hint,
  large = false,
}: {
  ritual: Ritual;
  hint: string;
  large?: boolean;
}) {
  const { phase, lines } = ritual;
  const showBagua = phase === "idle" || phase === "spinning" || phase === "shrinking";
  const showHex = (phase === "growing" || phase === "reading") && lines.length === 6;
  const hex = lines.length === 6 ? byLines.get(lineKey(lines)) : undefined;
  const changed = lines.length === 6 ? byLines.get(changedKey(lines)) : undefined;
  const transformed = Boolean(hex && changed && changed.key !== hex.key);
  const motion = phase === "shrinking" ? "shrink" : phase === "spinning" ? "spin" : "still";

  return (
    <div className={cn("flex flex-col items-center", phase === "reading" ? "px-4 py-6" : "h-full justify-center px-6 py-8")}>
      <div className={cn("relative", large ? "w-[min(420px,70vw,calc(100dvh-16rem))]" : "w-[min(16.5rem,78%)]")}>
        <div className="relative aspect-square">
          {showBagua ? (
            <div className="absolute inset-0 z-10">
              <Bagua motion={motion} onCast={ritual.cast} />
            </div>
          ) : null}
          {phase === "shrinking" || phase === "growing" ? (
            <span className={cn("seed-dot", phase === "shrinking" ? "is-shrinking" : "is-growing")} />
          ) : null}
          {showHex ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className={phase === "growing" ? "hex-bloom w-[82%]" : "w-[82%]"}>
                <HexagramFigure lines={lines} compact={!large} />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <p className="mt-6 min-h-8 text-center font-serif tracking-[0.28em] text-paper" aria-live="polite">
        {phase === "idle" ? hint : null}
        {phase === "spinning" ? "八卦运转" : null}
        {phase === "shrinking" ? "收为一点" : null}
        {phase === "growing" ? "卦象生成" : null}
        {phase === "reading" && hex ? `${hex.name} · ${imageTitle(hex)}` : null}
      </p>
      {phase === "reading" && hex ? (
        <p className="mt-2 text-sm tracking-[0.2em] text-gold-soft">
          {ordinal(hex.number)} · {placement(hex)}
        </p>
      ) : null}

      {phase === "reading" && lines.length === 6 ? (
        <div className={cn("scroll-enter mt-8 w-full", large ? "max-w-3xl" : "max-w-sm")}>
          {transformed && changed ? (
            <div className="mx-auto mb-6 w-36">
              <HexagramFigure lines={settledLines(lines)} compact label={`之卦 · ${changed.name}`} />
            </div>
          ) : null}
          <ReadingScroll lines={lines} compact={!large} />
        </div>
      ) : null}
    </div>
  );
}

function settledLines(lines: readonly Yao[]): Yao[] {
  return lines.map((line) =>
    line.changing
      ? { ...line, yin: !line.yin, changing: false, value: line.yin ? 7 : 8 }
      : line,
  );
}
