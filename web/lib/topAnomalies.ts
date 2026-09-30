import type { Factory } from "./schema";
import { LOSS_ITEMS } from "./lossItems";
import { Granularity, buildMonthly, pointsForGranularity, computeRuleEval, matchedCount } from "./timeseries";

export interface RankedItem {
  factory: Factory;
  idx: number;
  matched: number;
  cur: number;
}

/** 광주·창원 로스유형 14개(7종×2공장)를 선택된 기간 단위로 판정해 상위 N개를 뽑는다. */
export function getTopAnomalies(granularity: Granularity, count = 5): RankedItem[] {
  const all: RankedItem[] = [];
  (Object.keys(LOSS_ITEMS) as Factory[]).forEach((factory) => {
    LOSS_ITEMS[factory].forEach((item, idx) => {
      const monthly = buildMonthly(item.key, item.base, item.slope, item.amp, item.override);
      const points = pointsForGranularity(monthly, granularity);
      const re = computeRuleEval(points, item.target, granularity);
      all.push({ factory, idx, matched: matchedCount(re), cur: re.cur });
    });
  });
  all.sort((a, b) => b.matched - a.matched || b.cur - a.cur);
  return all.slice(0, count);
}
