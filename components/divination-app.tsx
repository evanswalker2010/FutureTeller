"use client";

import { useEffect, useState } from "react";
import { DeviceFrame } from "@/components/device-frame";
import { MacStage } from "@/components/mac-stage";
import { PhoneStage } from "@/components/phone-stage";
import { ShellSwitch, type ShellId } from "@/components/shell-switch";
import { useDivination } from "@/lib/use-divination";

export function DivinationApp() {
  const ritual = useDivination();
  const { phase, cast } = ritual;
  const [choice, setChoice] = useState<ShellId>("mac");
  const [uaPlatform, setUaPlatform] = useState<"ios" | "android">("ios");

  useEffect(() => {
    const android = /Android/i.test(navigator.userAgent);
    setUaPlatform(android ? "android" : "ios");
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (choice !== "mac") return;
      if (!window.matchMedia("(min-width: 840px)").matches) return;
      if (event.repeat) return;
      if (event.key !== " " && event.key !== "Enter") return;
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("button, a, input, textarea, select")) return;
      if (phase !== "idle") return;
      event.preventDefault();
      cast();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cast, choice, phase]);

  return (
    <>
      <div className="phone-shell h-dvh min-[840px]:hidden">
        <PhoneStage ritual={ritual} platform={uaPlatform} mode="device" />
      </div>
      <div className="desktop-shell hidden h-dvh min-[840px]:block">
        {choice === "mac" ? (
          <MacStage ritual={ritual} choice={choice} onChoice={setChoice} />
        ) : (
          <div className="flex h-dvh flex-col bg-ink text-paper">
            <header className="mac-chrome flex shrink-0 items-center justify-between gap-4 border-b border-gold/20 bg-ink-soft px-8 py-4">
              <div className="min-w-0">
                <p className="font-serif text-xl tracking-[0.24em] text-paper">易经算卦</p>
                <p className="mt-1 text-xs tracking-[0.32em] text-gold-soft">
                  {choice === "ios" ? "iPhone 预览" : "Android 预览"}
                </p>
              </div>
              <ShellSwitch value={choice} onChange={setChoice} />
            </header>
            <DeviceFrame platform={choice}>
              <PhoneStage ritual={ritual} platform={choice} mode="preview" />
            </DeviceFrame>
          </div>
        )}
      </div>
    </>
  );
}
