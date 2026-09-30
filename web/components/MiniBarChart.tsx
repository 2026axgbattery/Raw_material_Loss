import type { CostPoint } from "@/lib/timeseries";

interface Props {
  points: CostPoint[];
  color: string;
  /** 막대가 많을 때(분기별 등) 막대 위 수치 라벨을 생략할지 여부. 기본은 막대 6개 이하일 때만 표시. */
  showValues?: boolean;
}

export default function MiniBarChart({ points, color, showValues }: Props) {
  const W = 300,
    H = 140,
    padL = 34,
    padR = 8,
    padT = 10,
    padB = 16;
  const plotW = W - padL - padR,
    plotH = H - padT - padB;
  const yMax = Math.max(...points.map((p) => p.value)) * 1.25 || 1;
  const n = points.length;
  const gap = n > 8 ? 3 : 10;
  const barW = (plotW - gap * (n - 1)) / n;
  const steps = 3;
  const gridValues = Array.from({ length: steps + 1 }, (_, s) => (yMax * s) / steps);
  const shouldShowValues = showValues ?? n <= 6;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img">
      {gridValues.map((v, i) => {
        const yy = padT + plotH - (v / yMax) * plotH;
        return (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={yy} y2={yy} className="chart-grid-line" strokeWidth={1} />
            <text x={1} y={yy + 3} fontSize={7} className="chart-axis-label">
              {Math.round(v).toLocaleString()}
            </text>
          </g>
        );
      })}
      {points.map((p, i) => {
        const bx = padL + i * (barW + gap);
        const bh = (p.value / yMax) * plotH;
        const by = padT + plotH - bh;
        return (
          <g key={i}>
            <rect x={bx} y={by} width={barW} height={bh} rx={Math.min(3, barW / 2)} fill={color} />
            <text x={bx + barW / 2} y={H - 3} fontSize={7} textAnchor="middle" className="chart-axis-label-kr">
              {p.label}
            </text>
            {shouldShowValues && (
              <text x={bx + barW / 2} y={by - 4} fontSize={7} textAnchor="middle" className="chart-axis-label">
                {p.value.toLocaleString()}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
