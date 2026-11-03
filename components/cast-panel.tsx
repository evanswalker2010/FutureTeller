"use client";

import { Coins } from "@/components/coins";
import { HexagramFigure } from "@/components/hexagram-figure";
import { ReadingScroll } from "@/components/reading-scroll";
import { changedKey, lineKey } from "@/lib/cast";
import { byLines, imageTitle, placement } from "@/lib/hexagrams";
import { ordinal } from "@/lib/labels";
import type { Ritual } from "@/lib/use-divination";
import { cn } from "cn";

export function CastPanel({ ritual, layout }: { ritual: Ritual; layout: "mac" | "phone" }) {
  const compact = layout === "phone";
  const ready = ritual.lines.length === 6;
  const hex = ready ? byLines.get(lineKey(ritual.lines)) : undefined;
  const changed = ready ? byLines.get(changedKey(ritual.lines)) : undefined;
  const transformed = Boolean(hex && changed && changed.key !== hex.key);
  const showReading = ritual.phase === "reading" && ready;

  return (
    <div className={compact ? "flex flex-col gap-6" : "mac-cast"}>
      <section className={cn(compact ? "mx-auto w-full max-w-sm" : "mac-cast-figure")}>
        <p className="text-xs tracking-[0.35em] text-gold">{hex ? ordinal(hex.number) : "铜钱六掷"}</p>
        <h2 className={cn("mt-2 font-serif text-paper", compact ? "text-4xl" : "text-5xl")}>{hex ? hex.name : "起卦"}</h2>
        <p className="mt-2 text-sm tracking-[0.16em] text-gold-soft">
          {hex ? `${imageTitle(hex)} · ${placement(hex)}` : "自下而上"}
        </p>
        <div className="mt-6">
          <HexagramFigure
            lines={ritual.lines}
            animateNewest={ritual.phase === "casting" && !ritual.reduced}
            compact={compact}
          />
        </div>
        {transformed && changed ? (
          <div className="mt-6 border-t border-gold/20 pt-4">
            <HexagramFigure lines={flipLines(ritual.lines)} compact label={`之卦 · ${changed.name}`} />
          </div>
        ) : null}
      </section>

      <section className="min-w-0">
        {ritual.phase === "casting" ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-2 py-4">
            <Coins
              coins={ritual.coins}
              caption={ritual.coins ? "铜钱翻转" : ritual.throwCaption}
              size={compact ? "sm" : "md"}
            />
            <p className="text-sm tracking-[0.2em] text-paper/70">
              第 {Math.min(ritual.lines.length + (ritual.coins ? 1 : 0), 6)} 掷
            </p>
          </div>
        ) : null}
        {ritual.phase === "named" ? (
          <p className="py-10 text-center font-serif text-xl tracking-[0.28em] text-gold-soft">卦象已成</p>
        ) : null}
        {showReading ? <ReadingScroll lines={ritual.lines} compact={compact} /> : null}
      </section>
    </div>
  );
}

function flipLines(lines: Ritual["lines"]) {
  return lines.map((line) =>
    line.changing
      ? { ...line, yin: !line.yin, value: (line.yin ? 7 : 8) as 7 | 8, changing: false, coins: line.coins }
      : line,
  );
}
