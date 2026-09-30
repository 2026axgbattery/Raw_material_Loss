"use client";

import { useState } from "react";
import { Granularity, monthlyLabels, pointsForGranularity } from "@/lib/timeseries";
import MiniLineChart from "./MiniLineChart";
import ChartGranularityTabs from "./ChartGranularityTabs";

interface Props {
  monthly: number[];
  color: string;
  target: number;
  defaultGranularity: Granularity;
}

export default function LossRateChartBox({ monthly, color, target, defaultGranularity }: Props) {
  const [granularity, setGranularity] = useState<Granularity>(defaultGranularity);
  const points = pointsForGranularity(monthly, granularity);
  // 월별 보기에서는 44개 라벨이 다 찍히면 겹치므로, 연도 1월만 표기하는 희소 라벨을 쓴다.
  const axisLabels = granularity === "month" ? monthlyLabels() : undefined;

  return (
    <div className="chart-box">
      <div className="chart-box-head">
        <h4>로스율 추이</h4>
        <ChartGranularityTabs value={granularity} onChange={setGranularity} />
      </div>
      <MiniLineChart points={points} color={color} target={target} axisLabels={axisLabels} />
    </div>
  );
}
