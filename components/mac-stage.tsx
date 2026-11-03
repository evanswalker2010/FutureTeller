"use client";

import { RevealStage } from "@/components/reveal-stage";
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
        <RevealStage ritual={ritual} hint="点击八卦起卦，或按空格" large />
        {ritual.phase === "reading" ? (
          <div className="flex justify-center px-6 pb-8">
            <Button
              type="button"
              className="h-11 rounded-full bg-cinnabar px-8 text-base tracking-[0.22em] text-paper hover:bg-[#b33a3a]"
              onClick={ritual.reset}
            >
              再占一卦
            </Button>
          </div>
        ) : null}
      </main>

      <footer className="shrink-0 border-t border-gold/20 bg-ink-soft px-6 py-3 text-center text-xs tracking-wide text-gold-soft">
        此为周易文化体验，不是对人事的断言。
      </footer>
    </div>
  );
}
