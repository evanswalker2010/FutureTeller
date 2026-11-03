import type { Yao } from "@/lib/cast";

const DIGIT = "零一二三四五六七八九";

export function ordinal(number: number): string {
  if (number < 10) return `第${DIGIT[number]}卦`;
  if (number === 10) return "第十卦";
  if (number < 20) return `第十${DIGIT[number - 10]}卦`;
  const tens = Math.floor(number / 10);
  const ones = number % 10;
  return `第${DIGIT[tens]}十${ones ? DIGIT[ones] : ""}卦`;
}

const VALUE_NAME: Record<Yao["value"], string> = {
  6: "老阴",
  7: "少阳",
  8: "少阴",
  9: "老阳",
};

const PLACE = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"] as const;

export function lineCaption(index: number, yao: Yao): string {
  return `${PLACE[index]} · ${VALUE_NAME[yao.value]}`;
}

/** 动爻用九、六记。初与上写在数词外侧。 */
export function changingName(index: number, yao: Yao): string | null {
  if (!yao.changing) return null;
  const numeral = yao.value === 9 ? "九" : "六";
  if (index === 0) return `初${numeral}`;
  if (index === 5) return `上${numeral}`;
  return `${numeral}${"二三四五"[index - 1]}`;
}
