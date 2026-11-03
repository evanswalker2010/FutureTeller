export type CoinFace = "yang" | "yin";

export type YaoValue = 6 | 7 | 8 | 9;

export type Yao = {
  value: YaoValue;
  yin: boolean;
  changing: boolean;
  coins: readonly [CoinFace, CoinFace, CoinFace];
};

function randomBit(): number {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0] & 1;
}

/** 三枚铜钱：阳面计三，阴面计二。六老阴，七少阳，八少阴，九老阳。 */
export function castLine(): Yao {
  const coins = [0, 1, 2].map(() => (randomBit() ? "yang" : "yin")) as [
    CoinFace,
    CoinFace,
    CoinFace,
  ];
  const value = coins.reduce<number>(
    (sum, face) => sum + (face === "yang" ? 3 : 2),
    0,
  ) as YaoValue;

  return {
    value,
    yin: value % 2 === 0,
    changing: value === 6 || value === 9,
    coins,
  };
}

/** 自下而上的六爻。阳为 1，阴为 0。动爻仍按本卦的阴阳记。 */
export function lineKey(lines: readonly Yao[]): string {
  return lines.map((line) => (line.yin ? "0" : "1")).join("");
}

/** 动爻阴阳互变，静爻不动。 */
export function changedKey(lines: readonly Yao[]): string {
  return lines
    .map((line) => {
      const yang = !line.yin;
      const nextYang = line.changing ? !yang : yang;
      return nextYang ? "1" : "0";
    })
    .join("");
}
