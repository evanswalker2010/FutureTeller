import type { CoinFace } from "@/lib/cast";

export function Coins({
  coins,
  caption,
  size = "md",
}: {
  coins: readonly CoinFace[] | null;
  caption?: string | null;
  size?: "md" | "sm";
}) {
  const faces = coins ?? (["yang", "yin", "yang"] as const);
  const scene = size === "sm" ? "h-14 w-14" : "h-[4.5rem] w-[4.5rem]";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-center gap-4" aria-hidden={!coins}>
        {faces.map((face, index) => (
          <div key={`${coins ? "live" : "wait"}-${index}-${face}`} className={`coin-scene ${scene}`}>
            <div className={coins ? (face === "yang" ? "coin is-yang" : "coin is-yin") : "coin"}>
              <div className="coin-face">阳</div>
              <div className="coin-face back">阴</div>
            </div>
          </div>
        ))}
      </div>
      <p className="min-h-6 font-serif text-sm tracking-[0.2em] text-gold-soft">
        {caption ?? (coins ? "铜钱翻转" : "三钱待掷")}
      </p>
    </div>
  );
}
