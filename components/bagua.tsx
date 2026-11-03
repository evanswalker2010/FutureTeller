"use client";

import {
  LATER_HEAVEN,
  LATER_HEAVEN_DIRECTION,
  TRIGRAMS,
} from "@/lib/trigrams";

const CX = 200;
const CY = 200;

function polar(radius: number, angle: number): [number, number] {
  return [CX + radius * Math.cos(angle), CY + radius * Math.sin(angle)];
}

function sectorPath(start: number, end: number, inner: number, outer: number): string {
  const [x0, y0] = polar(outer, start);
  const [x1, y1] = polar(outer, end);
  const [x2, y2] = polar(inner, end);
  const [x3, y3] = polar(inner, start);
  return `M ${x0} ${y0} A ${outer} ${outer} 0 0 1 ${x1} ${y1} L ${x2} ${y2} A ${inner} ${inner} 0 0 0 ${x3} ${y3} Z`;
}

export function Bagua({
  spinning,
  disabled,
  onCast,
}: {
  spinning?: boolean;
  disabled?: boolean;
  onCast: () => void;
}) {
  return (
    <button
      type="button"
      className="bagua-button group relative block w-full cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-ink disabled:cursor-default"
      onClick={onCast}
      disabled={disabled}
      aria-label="点击八卦起卦"
    >
      <span className="pointer-events-none absolute inset-[14%] rounded-full bg-gold/10 blur-3xl" />
      <svg viewBox="0 0 400 400" className="relative w-full" role="img" aria-hidden>
        <circle cx={CX} cy={CY} r="194" fill="none" stroke="#c6a15b" strokeWidth="1.2" opacity="0.55" />
        <g className={spinning ? "bagua-ring is-fast" : "bagua-ring"}>
          <circle cx={CX} cy={CY} r="190" fill="none" />
          {LATER_HEAVEN.map((id, index) => {
            const mid = -Math.PI / 2 + index * (Math.PI / 4);
            const start = mid - Math.PI / 8;
            const end = mid + Math.PI / 8;
            const trigram = TRIGRAMS[id];
            const [labelX, labelY] = polar(154, mid);
            return (
              <g key={id} className="bagua-sector">
                <path
                  className="sector-fill"
                  d={sectorPath(start, end, 74, 176)}
                  fill={index % 2 === 0 ? "#1c1712" : "#261d15"}
                  stroke="#c6a15b"
                  strokeOpacity="0.35"
                  strokeWidth="1"
                />
                {trigram.lines.map((yang, lineIndex) => {
                  const radius = 104 + lineIndex * 14;
                  const [x, y] = polar(radius, mid);
                  const tx = -Math.sin(mid);
                  const ty = Math.cos(mid);
                  const length = 16;
                  if (yang) {
                    return (
                      <line
                        key={lineIndex}
                        className="yao-stroke"
                        x1={x - tx * length}
                        y1={y - ty * length}
                        x2={x + tx * length}
                        y2={y + ty * length}
                        stroke="#e6d3a4"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    );
                  }
                  const gap = 4.5;
                  return (
                    <g key={lineIndex}>
                      <line
                        className="yao-stroke"
                        x1={x - tx * length}
                        y1={y - ty * length}
                        x2={x - tx * gap}
                        y2={y - ty * gap}
                        stroke="#e6d3a4"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <line
                        className="yao-stroke"
                        x1={x + tx * gap}
                        y1={y + ty * gap}
                        x2={x + tx * length}
                        y2={y + ty * length}
                        stroke="#e6d3a4"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </g>
                  );
                })}
                <text
                  className="sector-label"
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#c6a15b"
                  fontSize="16"
                  fontFamily='var(--font-noto-serif), "Noto Serif SC", "Songti SC", serif'
                >
                  {trigram.name}
                </text>
                <title>{`${LATER_HEAVEN_DIRECTION[index]} · ${trigram.name}`}</title>
              </g>
            );
          })}
        </g>
        <g transform={`translate(${CX} ${CY})`}>
          <circle r="60" fill="#f3ead7" />
          <path
            d="M0 -58 A58 58 0 0 1 58 0 A58 58 0 0 1 0 58 A29 29 0 0 1 -29 29 A29 29 0 0 1 0 0 A29 29 0 0 0 29 -29 A29 29 0 0 0 0 -58 Z"
            fill="#14110e"
          />
          <circle cy="-29" r="8" fill="#14110e" />
          <circle cy="29" r="8" fill="#f3ead7" />
          <circle r="60" fill="none" stroke="#c6a15b" strokeWidth="1.4" />
        </g>
      </svg>
    </button>
  );
}
