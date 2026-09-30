import type { Factory } from "@/lib/schema";
import type { LossItem } from "@/lib/lossItems";
import type { Granularity } from "@/lib/timeseries";
import AnomalyCard from "./AnomalyCard";

export interface AnomalyEntry {
  key: string;
  factory: Factory;
  item: LossItem;
}

export default function AnomalyList({ entries, granularity }: { entries: AnomalyEntry[]; granularity: Granularity }) {
  return (
    <div className="anomaly-list">
      {entries.map((entry, i) => (
        <AnomalyCard key={entry.key} factory={entry.factory} item={entry.item} granularity={granularity} defaultOpen={i === 0} />
      ))}
    </div>
  );
}
