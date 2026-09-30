import type { Point } from "@/lib/timeseries";

interface Props {
  points: Point[];
  color: string;
  target?: number;
  /** y축 눈금 표기 방식. 기본은 로스율(%) 포맷. */
  formatValue?: (v: number) => string;
  /** x축 라벨을 points의 label 대신 별도로 지정하고 싶을 때 (예: 월별 희소 라벨) */
  axisLabels?: string[];
}

const defaultFormat = (v: number) => `${Math.round(v * 10) / 10}%`;

export default function MiniLineChart({ points, color, target, formatValue = defaultFormat, axisLabels }: Props) {
  const W = 300,
    H = 140,
    padL = 30,
    padR = 8,
    padT = 10,
    padB = 16;
  const plotW = W - padL - padR,
    plotH = H - padT - padB;
  const allVals = points.map((p) => p.value).concat(target != null ? [target] : []);
  const yMax = Math.max(...allVals) * 1.25 || 1;
  const x = (i: number) => (points.length <= 1 ? padL + plotW / 2 : padL + (i / (points.length - 1)) * plotW);
  const y = (v: number) => padT + plotH - (v / yMax) * plotH;
  const steps = 3;
  const gridValues = Array.from({ length: steps + 1 }, (_, s) => (yMax * s) / steps);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const labels = axisLabels ?? points.map((p) => p.label);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img">
      {gridValues.map((v, i) => (
        <g key={i}>
          <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} className="chart-grid-line" strokeWidth={1} />
          <text x={1} y={y(v) + 3} fontSize={7} className="chart-axis-label">
            {formatValue(v)}
          </text>
        </g>
      ))}
      {target != null && (
        <line x1={padL} x2={W - padR} y1={y(target)} y2={y(target)} stroke={color} strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
      )}
      {points.map(
        (p, i) =>
          labels[i] && (
            <text key={i} x={x(i)} y={H - 3} fontSize={7} textAnchor="middle" className="chart-axis-label-kr">
              {labels[i]}
            </text>
          )
      )}
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={x(i)} cy={y(p.value)} r={i === points.length - 1 ? 3 : 1.6} fill={color} />
      ))}
    </svg>
  );
}
