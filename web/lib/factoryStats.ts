import type { Factory } from "./schema";
import { LOSS_ITEMS } from "./lossItems";
import { Granularity, buildMonthly, costPointsForGranularity, sumPointsForGranularity, CostPoint } from "./timeseries";

/** 해당 공장의 로스유형 7종 비용을 모두 합산한 총 로스 비용(만원) 시계열. */
export function factoryCostPoints(factory: Factory, granularity: Granularity): CostPoint[] {
  const items = LOSS_ITEMS[factory];
  const perItem = items.map((item) => {
    const monthly = buildMonthly(item.key, item.base, item.slope, item.amp, item.override);
    return costPointsForGranularity(monthly, item.baseCostFirstYear, granularity);
  });
  const n = perItem[0].length;
  const out: CostPoint[] = [];
  for (let i = 0; i < n; i++) {
    const sum = perItem.reduce((acc, arr) => acc + (arr[i]?.value ?? 0), 0);
    out.push({ label: perItem[0][i].label, value: Math.round(sum) });
  }
  return out;
}

/** 당월(가장 최근 월) 기준 총 로스 비용. */
export function factoryCurrentMonthCost(factory: Factory): number {
  const points = factoryCostPoints(factory, "month");
  return points[points.length - 1].value;
}

/**
 * "전체 재료비 = BOM구성 + 공정로스(슬러그·폐연호·초기연분) + 부적합(폐극판·폐전지·주부자재폐기)" 구성비 그래프용 집계.
 * 코드대체·재고보정 로스는 사용자 확인에 따라 별도 구분하지 않고 BOM구성(잔여값)에 포함시킨다.
 */
const PROCESS_LOSS_TYPES = ["슬러그", "폐연호", "초기연분"];
const NONCONFORMING_TYPES = ["폐극판", "폐전지"];

/**
 * '주부자재폐기'는 확정된 로스유형 7종(코드대체·재고보정·슬러그·폐연호·초기연분·폐극판·폐전지, PRD §7-1)에는
 * 없는 항목이다. 사용자가 요청한 재료비 구성비 그래프에서만 참고용으로 쓰는 목데이터이며, 실제 확정값이 아니므로
 * 이상탐지 Top 5·공장별 로스 카드 목록에는 노출하지 않는다.
 */
const ANCILLARY_DISPOSAL_SEED: Record<Factory, { key: string; base: number; slope: number; amp: number }> = {
  광주: { key: "gj-ancillary-disposal-mock", base: 380, slope: 1.2, amp: 40 },
  창원: { key: "cw-ancillary-disposal-mock", base: 460, slope: 1.6, amp: 50 },
};

/** 로스·부적합 합계가 전체 재료비에서 차지하는 비중을 이 정도로 가정한 목데이터 상수 (실제 확정값 아님). */
const ASSUMED_LOSS_SHARE_OF_TOTAL_MATERIAL_COST = 0.08;

export interface MaterialCostBreakdown {
  total: number;
  bom: number;
  processLoss: number;
  nonconforming: number;
}

export function factoryMaterialCostBreakdown(factory: Factory, granularity: Granularity): MaterialCostBreakdown {
  const items = LOSS_ITEMS[factory];
  let processLoss = 0;
  let nonconforming = 0;
  items.forEach((item) => {
    const monthly = buildMonthly(item.key, item.base, item.slope, item.amp, item.override);
    const points = costPointsForGranularity(monthly, item.baseCostFirstYear, granularity);
    const cur = points[points.length - 1].value;
    if (PROCESS_LOSS_TYPES.includes(item.breadcrumbType)) processLoss += cur;
    else if (NONCONFORMING_TYPES.includes(item.breadcrumbType)) nonconforming += cur;
  });

  const ancillarySeed = ANCILLARY_DISPOSAL_SEED[factory];
  const ancillaryMonthly = buildMonthly(ancillarySeed.key, ancillarySeed.base, ancillarySeed.slope, ancillarySeed.amp);
  const ancillaryPoints = sumPointsForGranularity(ancillaryMonthly, granularity);
  nonconforming += ancillaryPoints[ancillaryPoints.length - 1].value;

  const lossAndNonconforming = processLoss + nonconforming;
  const total = Math.round(lossAndNonconforming / ASSUMED_LOSS_SHARE_OF_TOTAL_MATERIAL_COST);
  const bom = total - Math.round(lossAndNonconforming);

  return { total, bom, processLoss: Math.round(processLoss), nonconforming: Math.round(nonconforming) };
}
