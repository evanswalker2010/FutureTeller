import type { Yao } from "@/lib/cast";
import { cn } from "cn";

export function HexagramFigure({
  lines,
  animateNewest = false,
  compact = false,
  label,
}: {
  lines: readonly Yao[];
  animateNewest?: boolean;
  compact?: boolean;
  label?: string;
}) {
  const order = [5, 4, 3, 2, 1, 0];
  const newest = lines.length - 1;

  return (
    <figure className={cn("w-full", compact ? "max-w-[220px]" : "max-w-[280px]")}>
      {label ? (
        <figcaption className="mb-3 text-center font-serif text-sm tracking-[0.28em] text-gold">
          {label}
        </figcaption>
      ) : null}
      <div className="mb-2 text-right font-serif text-xs tracking-[0.35em] text-gold/70">上</div>
      <div className={cn("flex flex-col", compact ? "gap-2" : "gap-3")}>
        {order.map((index) => {
          const yao = lines[index];
          const appear = Boolean(yao) && animateNewest && index === newest;
          return (
            <div
              key={index}
              className={cn("flex items-center gap-3", appear && "line-in")}
            >
              <div className="flex h-2.5 flex-1 items-center gap-2">
                {yao ? (
                  yao.yin ? (
                    <>
                      <span className="h-2.5 flex-1 rounded-full bg-paper" />
                      <span className="h-2.5 w-3" />
                      <span className="h-2.5 flex-1 rounded-full bg-paper" />
                    </>
                  ) : (
                    <span className="h-2.5 w-full rounded-full bg-paper" />
                  )
                ) : (
                  <span className="h-2.5 w-full rounded-full bg-gold/15" />
                )}
              </div>
              <span className="w-4 text-center font-serif text-sm text-cinnabar">
                {yao?.changing ? (yao.value === 9 ? "○" : "×") : ""}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 text-right font-serif text-xs tracking-[0.35em] text-gold/70">初</div>
    </figure>
  );
}
