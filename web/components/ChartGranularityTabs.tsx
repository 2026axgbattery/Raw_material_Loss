import type { Granularity } from "@/lib/timeseries";

const OPTIONS: { key: Granularity; label: string }[] = [
  { key: "year", label: "연도별" },
  { key: "quarter", label: "분기별" },
  { key: "month", label: "월별" },
];

export default function ChartGranularityTabs({ value, onChange }: { value: Granularity; onChange: (g: Granularity) => void }) {
  return (
    <div className="chart-gtabs" role="group" aria-label="차트 기간 단위">
      {OPTIONS.map((opt) => (
        <button key={opt.key} type="button" className="chart-gtab" aria-pressed={value === opt.key} onClick={() => onChange(opt.key)}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}
