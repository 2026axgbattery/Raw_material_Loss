import { Granularity, CostPoint, monthlyLabels } from "@/lib/timeseries";

export interface CostTrendSeries {
  points: CostPoint[];
  color: string;
}

interface Props {
  series: CostTrendSeries[];
  granularity: Granularity;
}

export default function CostTrendChart({ series, granularity }: Props) {
  const W = 640,
    H = 220,
    padL = 44,
    padR = 14,
    padT = 14,
    padB = 26;
  const plotW = W - padL - padR,
    plotH = H - padT - padB;

  const n = series[0].points.length;
  const axisLabels = granularity === "month" ? monthlyLabels() : series[0].points.map((p) => p.label);

  const allVals: number[] = [];
  series.forEach((s) => s.points.forEach((p) => allVals.push(p.value)));
  const maxV = Math.max(1, ...allVals);
  const yMax = Math.ceil((maxV * 1.2) / 100) * 100;
  const yMin = 0;
  const step = yMax / 4;

  const x = (i: number) => (n <= 1 ? padL + plotW / 2 : padL + (i / (n - 1)) * plotW);
  const y = (v: number) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const gridValues: number[] = [];
  for (let v = 0; v <= yMax + 0.001; v += step) gridValues.push(v);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img">
      {gridValues.map((v, i) => (
        <g key={i}>
          <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)} className="chart-grid-line" strokeWidth={1} />
          <text x={6} y={y(v) + 3} fontSize={9} className="chart-axis-label">
            {Math.round(v).toLocaleString()}
          </text>
        </g>
      ))}
      {series[0].points.map(
        (_, i) =>
          axisLabels[i] && (
            <text key={i} x={x(i)} y={H - 6} fontSize={9} textAnchor="middle" className="chart-axis-label-kr">
              {axisLabels[i]}
            </text>
          )
      )}
      {series.map((s, si) => {
        const d = s.points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
        return (
          <g key={si}>
            <path d={d} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            {s.points.map((p, i) => (
              <circle key={i} cx={x(i)} cy={y(p.value)} r={i === s.points.length - 1 ? 4 : 2.5} fill={s.color} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
