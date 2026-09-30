import type { Granularity } from "@/lib/timeseries";

const OPTIONS: { key: Granularity; label: string }[] = [
  { key: "month", label: "월별" },
  { key: "quarter", label: "분기별" },
  { key: "year", label: "연도별" },
];

export default function GranularityToggle({ value, onChange }: { value: Granularity; onChange: (g: Granularity) => void }) {
  return (
    <div className="granularity-toggle" role="group" aria-label="분석 기간 단위">
      {OPTIONS.map((opt) => (
        <button key={opt.key} type="button" className="gtab" aria-pressed={value === opt.key} onClick={() => onChange(opt.key)}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}
