"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "cn";

const SPECS = {
  ios: { width: 390, height: 844, bezel: 12 },
  android: { width: 360, height: 800, bezel: 10 },
} as const;

export function DeviceFrame({
  platform,
  children,
}: {
  platform: "ios" | "android";
  children: ReactNode;
}) {
  const spec = SPECS[platform];
  const outerW = spec.width + spec.bezel * 2;
  const outerH = spec.height + spec.bezel * 2;
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.72);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const update = () => {
      const rect = host.getBoundingClientRect();
      if (rect.width < 48 || rect.height < 48) return;
      const next = Math.min((rect.width - 36) / outerW, (rect.height - 36) / outerH, 1);
      if (Number.isFinite(next) && next > 0) setScale(next);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(host);
    return () => observer.disconnect();
  }, [outerW, outerH]);

  return (
    <div ref={hostRef} className="relative min-h-0 flex-1 overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: outerW,
          height: outerH,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        <div
          className={cn(
            "relative bg-[#2a241c] shadow-[0_28px_70px_rgba(0,0,0,0.45)]",
            platform === "ios" ? "rounded-[54px]" : "rounded-[32px]",
          )}
          style={{ width: outerW, height: outerH, padding: spec.bezel }}
        >
          {platform === "ios" ? (
            <>
              <span className="absolute -left-[3px] top-28 h-7 w-[3px] rounded-l bg-[#4a4034]" />
              <span className="absolute -left-[3px] top-44 h-12 w-[3px] rounded-l bg-[#4a4034]" />
              <span className="absolute -left-[3px] top-[15.5rem] h-12 w-[3px] rounded-l bg-[#4a4034]" />
              <span className="absolute -right-[3px] top-40 h-16 w-[3px] rounded-r bg-[#4a4034]" />
            </>
          ) : (
            <>
              <span className="absolute -right-[3px] top-28 h-14 w-[3px] rounded-r bg-[#4a4034]" />
              <span className="absolute -right-[3px] top-48 h-10 w-[3px] rounded-r bg-[#4a4034]" />
            </>
          )}
          <div
            className={cn(
              "relative overflow-hidden bg-ink",
              platform === "ios" ? "rounded-[42px]" : "rounded-[24px]",
            )}
            style={{ width: spec.width, height: spec.height }}
          >
            {children}
            {platform === "ios" ? (
              <>
                <div className="pointer-events-none absolute left-1/2 top-[11px] z-20 h-[34px] w-[118px] -translate-x-1/2 rounded-full bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" />
                <div className="pointer-events-none absolute bottom-[7px] left-1/2 z-20 h-[5px] w-28 -translate-x-1/2 rounded-full bg-paper/35" />
              </>
            ) : (
              <div className="pointer-events-none absolute left-1/2 top-[9px] z-20 size-3 -translate-x-1/2 rounded-full bg-black ring-2 ring-[#3a3228]" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
