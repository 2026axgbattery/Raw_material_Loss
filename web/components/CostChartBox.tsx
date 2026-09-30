"use client";

import { useState } from "react";
import { Granularity, costPointsForGranularity, monthlyLabels } from "@/lib/timeseries";
import MiniLineChart from "./MiniLineChart";
import MiniBarChart from "./MiniBarChart";
import ChartGranularityTabs from "./ChartGranularityTabs";

interface Props {
  monthly: number[];
  color: string;
  baseCostFirstYear: number;
  defaultGranularity: Granularity;
}

export default function CostChartBox({ monthly, color, baseCostFirstYear, defaultGranularity }: Props) {
  const [granularity, setGranularity] = useState<Granularity>(defaultGranularity);
  const points = costPointsForGranularity(monthly, baseCostFirstYear, granularity);

  return (
    <div className="chart-box">
      <div className="chart-box-head">
        <h4>발생 비용 추이 (만원)</h4>
        <ChartGranularityTabs value={granularity} onChange={setGranularity} />
      </div>
      {granularity === "month" ? (
        // 44개월치를 막대로 그리면 너무 촘촘해 선 그래프로 표시한다 (연도/분기는 막대 유지)
        <MiniLineChart points={points} color={color} formatValue={(v) => Math.round(v).toLocaleString()} axisLabels={monthlyLabels()} />
      ) : (
        <MiniBarChart points={points} color={color} />
      )}
    </div>
  );
}
