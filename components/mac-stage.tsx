"use client";

import { Bagua } from "@/components/bagua";
import { CastPanel } from "@/components/cast-panel";
import { ShellSwitch, type ShellId } from "@/components/shell-switch";
import { Button } from "@/components/ui/button";
import type { Ritual } from "@/lib/use-divination";

export function MacStage({
  ritual,
  choice,
  onChoice,
}: {
  ritual: Ritual;
  choice: ShellId;
  onChoice: (value: ShellId) => void;
}) {
  const idle = ritual.phase === "idle";

  return (
    <div className="flex h-dvh flex-col bg-ink text-paper">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-gold/20 bg-ink-soft px-8 py-4">
        <div className="min-w-0">
          <p className="font-serif text-xl tracking-[0.24em] text-paper">易经算卦</p>
          <p className="mt-1 text-xs tracking-[0.32em] text-gold-soft">后天八卦 · 铜钱</p>
        </div>
        <ShellSwitch value={choice} onChange={onChoice} />
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        {idle ? (
          <div className="flex h-full min-h-[28rem] flex-col items-center justify-center px-6 py-8">
            <div className="w-[max(11rem,min(420px,70%,calc(100dvh-20rem)))]">
              <Bagua onCast={ritual.cast} />
            </div>
            <p className="mt-8 font-serif text-2xl tracking-[0.28em] text-paper">点击八卦起卦</p>
            <p className="mt-3 text-sm tracking-[0.38em] text-gold-soft">空格也可以</p>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-5xl px-8 py-8">
            <CastPanel ritual={ritual} layout="mac" />
            {ritual.phase === "reading" ? (
              <div className="mt-8 flex justify-center pb-4">
                <Button
                  type="button"
                  className="h-11 rounded-full bg-cinnabar px-8 text-base tracking-[0.22em] text-paper hover:bg-[#b33a3a]"
                  onClick={ritual.reset}
                >
                  再占一卦
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </main>

      <footer className="shrink-0 border-t border-gold/20 bg-ink-soft px-6 py-3 text-center text-xs tracking-wide text-gold-soft">
        此为周易文化体验，不是对人事的断言。
      </footer>
    </div>
  );
}
