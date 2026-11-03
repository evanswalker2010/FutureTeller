"use client";

import { Bagua } from "@/components/bagua";
import { CastPanel } from "@/components/cast-panel";
import { Button } from "@/components/ui/button";
import type { Ritual } from "@/lib/use-divination";
import { cn } from "cn";

export function PhoneStage({
  ritual,
  platform,
  mode,
}: {
  ritual: Ritual;
  platform: "ios" | "android";
  mode: "device" | "preview";
}) {
  const ios = platform === "ios";
  const idle = ritual.phase === "idle";
  const topPad =
    mode === "preview"
      ? ios
        ? "pt-14"
        : "pt-8"
      : "pt-[max(env(safe-area-inset-top),0.75rem)]";
  const bottomPad =
    mode === "preview"
      ? ios
        ? "pb-7"
        : "pb-4"
      : "pb-[max(env(safe-area-inset-bottom),0.75rem)]";

  return (
    <div className={cn("flex h-full min-h-0 flex-col bg-ink text-paper", topPad)}>
      <header className={cn("shrink-0 px-4", ios ? "pb-1 text-center" : "flex h-12 items-center")}>
        <h1
          className={cn(
            "font-serif text-paper",
            ios ? "text-[17px] tracking-[0.28em]" : "text-lg tracking-[0.12em]",
          )}
        >
          易经算卦
        </h1>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {idle ? (
          <div className="flex h-full flex-col items-center justify-center px-6 py-4">
            <div className="w-[min(16.5rem,78%)]">
              <Bagua onCast={ritual.cast} />
            </div>
            <p className="mt-6 font-serif text-lg tracking-[0.22em]">轻触八卦起卦</p>
          </div>
        ) : (
          <div className="px-4 py-4">
            <CastPanel ritual={ritual} layout="phone" />
          </div>
        )}
      </main>

      <footer className={cn("shrink-0 px-4 pt-2", bottomPad)}>
        {ritual.phase === "reading" ? (
          <Button
            type="button"
            className={cn(
              "mb-2 h-12 w-full bg-cinnabar text-base tracking-[0.2em] text-paper hover:bg-[#b33a3a]",
              ios ? "rounded-full" : "rounded-lg",
            )}
            onClick={ritual.reset}
          >
            再占一卦
          </Button>
        ) : null}
        <p className="pb-1 text-center text-[10px] leading-4 tracking-wide text-gold-soft">
          此为周易文化体验，不是对人事的断言。
        </p>
      </footer>
    </div>
  );
}
