import { Granularity, Point, monthlyLabels, pointsForGranularity } from "@/lib/timeseries";

export interface TrendSeries {
  monthly: number[];
  color: string;
  target?: number;
}

interface Props {
  series: TrendSeries[];
  granularity: Granularity;
}

export default function TrendChart({ series, granularity }: Props) {
  const W = 640,
    H = 220,
    padL = 34,
    padR = 14,
    padT = 14,
    padB = 26;
  const plotW = W - padL - padR,
    plotH = H - padT - padB;

  const seriesPoints = series.map((s) => ({ points: pointsForGranularity(s.monthly, granularity), color: s.color, target: s.target }));
  const n = seriesPoints[0].points.length;
  const axisLabels = granularity === "month" ? monthlyLabels() : seriesPoints[0].points.map((p: Point) => p.label);

  const allVals: number[] = [];
  seriesPoints.forEach((s) => {
    s.points.forEach((p) => allVals.push(p.value));
    if (s.target != null) allVals.push(s.target);
  });
  const maxV = Math.max(...allVals);
  const yMax = Math.max(1, Math.ceil(maxV * 1.2 * 2) / 2);
  const yMin = 0;
  const step = yMax > 5 ? 1 : 0.5;

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
            {Math.round(v * 10) / 10}%
          </text>
        </g>
      ))}
      {seriesPoints[0].points.map(
        (_, i) =>
          axisLabels[i] && (
            <text key={i} x={x(i)} y={H - 6} fontSize={9} textAnchor="middle" className="chart-axis-label-kr">
              {axisLabels[i]}
            </text>
          )
      )}
      {seriesPoints.map(
        (s, si) =>
          s.target != null && (
            <line key={si} x1={padL} x2={W - padR} y1={y(s.target)} y2={y(s.target)} stroke={s.color} strokeWidth={1} strokeDasharray="4 4" opacity={0.6} />
          )
      )}
      {seriesPoints.map((s, si) => {
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
