import type { ReactNode } from "react";
import { changedKey, lineKey, type Yao } from "@/lib/cast";
import { byLines, imageTitle, placement, type Hexagram } from "@/lib/hexagrams";
import { changingName, ordinal } from "@/lib/labels";
import { cn } from "cn";

export function ReadingScroll({
  lines,
  compact = false,
}: {
  lines: readonly Yao[];
  compact?: boolean;
}) {
  const hex = byLines.get(lineKey(lines));
  const changed = byLines.get(changedKey(lines));

  if (!hex || !changed) {
    return (
      <article className="scroll-card scroll-enter px-6 py-8 text-ink">
        <h3 className="font-serif text-2xl">卦象未能对应经文</h3>
        <p className="mt-3 leading-7">这一次的六爻没有对上六十四卦。请再占一次。</p>
      </article>
    );
  }

  const moving = lines.flatMap((yao, index) => {
    const name = changingName(index, yao);
    return name ? [name] : [];
  });
  const transformed = changed.key !== hex.key;

  return (
    <article
      className={cn("scroll-card scroll-enter text-ink", compact ? "px-5 py-6" : "px-8 py-8 sm:px-10")}
      aria-live="polite"
    >
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs tracking-[0.35em] text-cinnabar">{ordinal(hex.number)}</p>
          <h3 className={cn("mt-2 font-serif leading-none", compact ? "text-4xl" : "text-5xl")}>
            {hex.name}
          </h3>
          <p className="mt-3 text-sm tracking-[0.18em] text-ink/70">
            {imageTitle(hex)} · {placement(hex)}
          </p>
        </div>
        <div className="seal" aria-hidden>
          易
        </div>
      </header>

      <Section title="卦辞">
        <p className="font-serif text-lg leading-8">{hex.judgment}</p>
      </Section>
      <Section title="象曰">
        <p className="font-serif leading-8">{hex.image}</p>
      </Section>
      <Section title="卦批">
        <p className="leading-8">{hex.comment}</p>
        <div className={cn("mt-5 grid gap-3", !compact && "sm:grid-cols-2")}>
          <Advice label="宜" text={hex.suited} />
          <Advice label="忌" text={hex.avoid} caution />
        </div>
      </Section>
      <Section title="动爻">
        {transformed ? (
          <ChangedLines moving={moving} changed={changed} />
        ) : (
          <p className="leading-8">六爻安静，只看本卦。</p>
        )}
      </Section>
      <p className="mt-8 text-xs leading-5 tracking-wide text-ink/50">
        此为周易文化体验，不是对人事的断言。
      </p>
    </article>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6 border-t border-cinnabar/20 pt-4">
      <h4 className="text-xs tracking-[0.35em] text-cinnabar">{title}</h4>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function Advice({ label, text, caution = false }: { label: string; text: string; caution?: boolean }) {
  return (
    <div className="flex items-start gap-3 rounded-md bg-ink/5 px-3 py-3">
      <span
        className={cn(
          "grid size-7 shrink-0 place-items-center rounded-sm font-serif text-sm",
          caution ? "bg-ink text-paper" : "bg-cinnabar text-paper",
        )}
      >
        {label}
      </span>
      <p className="pt-0.5 leading-6">{text}</p>
    </div>
  );
}

function ChangedLines({ moving, changed }: { moving: string[]; changed: Hexagram }) {
  return (
    <div className="space-y-3 leading-8">
      <p>
        {moving.join("、")} 在变，之卦为{imageTitle(changed)}。
      </p>
      <p className="font-serif">{changed.judgment}</p>
      <p>{changed.comment}</p>
    </div>
  );
}
