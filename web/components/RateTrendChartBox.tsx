"use client";

import { useState } from "react";
import { Granularity, GRANULARITY_META } from "@/lib/timeseries";
import TrendChart, { TrendSeries } from "./TrendChart";
import ChartGranularityTabs from "./ChartGranularityTabs";

interface Props {
  series: TrendSeries[];
  defaultGranularity: Granularity;
}

export default function RateTrendChartBox({ series, defaultGranularity }: Props) {
  const [granularity, setGranularity] = useState<Granularity>(defaultGranularity);
  const g = GRANULARITY_META[granularity];

  return (
    <div className="card">
      <div className="card-head">
        <h2>{g.chartTitle} 로스율 추이 (2023~2026)</h2>
        <div className="legend">
          <span>
            <i style={{ background: "var(--accent2)" }} />
            광주 (목표 2.0%)
          </span>
          <span>
            <i style={{ background: "var(--accent)" }} />
            창원 (목표 4.0%)
          </span>
        </div>
      </div>
      <div className="chart-box-head" style={{ padding: "0 0 8px" }}>
        <span />
        <ChartGranularityTabs value={granularity} onChange={setGranularity} />
      </div>
      <div className="chart-wrap">
        <TrendChart granularity={granularity} series={series} />
      </div>
    </div>
  );
}
