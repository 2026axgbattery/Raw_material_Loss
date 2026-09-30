"use client";

import { useState } from "react";
import { Granularity } from "@/lib/timeseries";
import { factoryCostPoints } from "@/lib/factoryStats";
import CostTrendChart from "./CostTrendChart";
import ChartGranularityTabs from "./ChartGranularityTabs";

interface Props {
  defaultGranularity: Granularity;
}

export default function CostTrendChartBox({ defaultGranularity }: Props) {
  const [granularity, setGranularity] = useState<Granularity>(defaultGranularity);
  const gjPoints = factoryCostPoints("광주", granularity);
  const cwPoints = factoryCostPoints("창원", granularity);

  return (
    <div className="card">
      <div className="card-head">
        <h2>공장별 로스 비용 추이 (만원)</h2>
        <div className="legend">
          <span>
            <i style={{ background: "var(--accent2)" }} />
            광주
          </span>
          <span>
            <i style={{ background: "var(--accent)" }} />
            창원
          </span>
        </div>
      </div>
      <div className="chart-box-head" style={{ padding: "0 0 8px" }}>
        <span />
        <ChartGranularityTabs value={granularity} onChange={setGranularity} />
      </div>
      <div className="chart-wrap">
        <CostTrendChart
          granularity={granularity}
          series={[
            { points: gjPoints, color: "#0097A9" },
            { points: cwPoints, color: "#EB3300" },
          ]}
        />
      </div>
    </div>
  );
}
