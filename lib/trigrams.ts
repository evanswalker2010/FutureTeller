export type TrigramId =
  | "qian"
  | "dui"
  | "li"
  | "zhen"
  | "xun"
  | "kan"
  | "gen"
  | "kun";

export type Trigram = {
  id: TrigramId;
  name: string;
  nature: string;
  lines: readonly [0 | 1, 0 | 1, 0 | 1];
};

/** 三爻自下而上。 */
export const TRIGRAMS: Record<TrigramId, Trigram> = {
  qian: { id: "qian", name: "乾", nature: "天", lines: [1, 1, 1] },
  dui: { id: "dui", name: "兑", nature: "泽", lines: [1, 1, 0] },
  li: { id: "li", name: "离", nature: "火", lines: [1, 0, 1] },
  zhen: { id: "zhen", name: "震", nature: "雷", lines: [1, 0, 0] },
  xun: { id: "xun", name: "巽", nature: "风", lines: [0, 1, 1] },
  kan: { id: "kan", name: "坎", nature: "水", lines: [0, 1, 0] },
  gen: { id: "gen", name: "艮", nature: "山", lines: [0, 0, 1] },
  kun: { id: "kun", name: "坤", nature: "地", lines: [0, 0, 0] },
};

/** 后天八卦，从正南（屏幕上方）起顺时针。 */
export const LATER_HEAVEN: readonly TrigramId[] = [
  "li",
  "kun",
  "dui",
  "qian",
  "kan",
  "gen",
  "zhen",
  "xun",
];

export const LATER_HEAVEN_DIRECTION = [
  "南",
  "西南",
  "西",
  "西北",
  "北",
  "东北",
  "东",
  "东南",
] as const;

export function trigramKey(id: TrigramId): string {
  return TRIGRAMS[id].lines.join("");
}
