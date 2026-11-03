"use client";

import { cn } from "cn";

export type ShellId = "mac" | "ios" | "android";

const OPTIONS: { id: ShellId; label: string; title: string }[] = [
  { id: "mac", label: "Mac", title: "Mac 桌面版" },
  { id: "ios", label: "iPhone", title: "苹果手机版" },
  { id: "android", label: "Android", title: "安卓手机版" },
];

export function ShellSwitch({
  value,
  onChange,
}: {
  value: ShellId;
  onChange: (value: ShellId) => void;
}) {
  return (
    <div className="flex rounded-full border border-gold/30 bg-black/30 p-1" role="group" aria-label="选择版本">
      {OPTIONS.map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            title={option.title}
            aria-pressed={selected}
            onClick={() => onChange(option.id)}
            className={cn(
              "min-h-10 rounded-full px-3.5 text-sm tracking-wide transition-colors sm:px-4",
              selected ? "bg-gold text-ink" : "text-gold-soft hover:text-paper",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
