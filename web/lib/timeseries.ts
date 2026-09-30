/**
 * 시계열 생성·집계·이상치 판정 로직.
 * Output/박상열_로스율 이상탐지_대시보드.html 의 동일 로직을 TypeScript로 포팅했다.
 * 실제 ERP/MES 데이터가 확보되기 전까지는 시드 고정 의사난수로 만든 예시(mock) 데이터를 쓴다.
 */

export type Granularity = "month" | "quarter" | "year";

export interface Point {
  label: string;
  value: number;
}

export const YEAR_INFO = [
  { y: 2023, m: 12 },
  { y: 2024, m: 12 },
  { y: 2025, m: 12 },
  { y: 2026, m: 8 },
];
export const TOTAL_MONTHS = YEAR_INFO.reduce((sum, yi) => sum + yi.m, 0); // 44

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(h, 31) + str.charCodeAt(i)) >>> 0;
  return h || 1;
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildMonthly(key: string, base: number, slope: number, amp: number, override?: number[]): number[] {
  const rnd = mulberry32(hashSeed(key));
  const arr: number[] = [];
  for (let i = 0; i < TOTAL_MONTHS; i++) {
    const v = base + slope * i + (rnd() - 0.5) * amp * 2;
    arr.push(Math.max(0.05, Math.round(v * 100) / 100));
  }
  if (override) {
    for (let j = 0; j < override.length; j++) arr[arr.length - override.length + j] = override[j];
  }
  return arr;
}

// 월별 미니 차트 축용 희소 라벨 (1월만 "YY'1월" 표시, 나머지는 공백)
export function monthlyLabels(): string[] {
  const labels: string[] = [];
  YEAR_INFO.forEach((yi) => {
    for (let m = 1; m <= yi.m; m++) labels.push(m === 1 ? String(yi.y).slice(2) + "'1월" : "");
  });
  return labels;
}

// 판정 근거·상단 추이 차트용 "YYYY-MM" 전체 라벨
export function monthlyPointLabels(): string[] {
  const labels: string[] = [];
  YEAR_INFO.forEach((yi) => {
    for (let m = 1; m <= yi.m; m++) labels.push(`${yi.y}-${m < 10 ? "0" + m : m}`);
  });
  return labels;
}

export function toQuarterly(monthly: number[]): Point[] {
  const q: Point[] = [];
  let idx = 0;
  YEAR_INFO.forEach((yi) => {
    let left = yi.m;
    let qn = 0;
    while (left > 0) {
      const take = Math.min(3, left);
      const slice = monthly.slice(idx, idx + take);
      const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
      q.push({ label: (qn === 0 ? String(yi.y).slice(2) + "'" : "") + "Q" + (qn + 1), value: Math.round(avg * 100) / 100 });
      idx += take;
      left -= take;
      qn++;
    }
  });
  return q;
}

export function toYearly(monthly: number[]): Point[] {
  const y: Point[] = [];
  let idx = 0;
  YEAR_INFO.forEach((yi) => {
    const slice = monthly.slice(idx, idx + yi.m);
    const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
    y.push({ label: String(yi.y) + (yi.m < 12 ? "(1~8월)" : ""), value: Math.round(avg * 100) / 100 });
    idx += yi.m;
  });
  return y;
}

export interface CostPoint {
  label: string;
  value: number;
}

function costFactor(monthly: number[], baseCostFirstYear: number): number {
  const firstYearAvg = toYearly(monthly)[0].value;
  return baseCostFirstYear / (12 * firstYearAvg);
}

export function toCostYearly(monthly: number[], baseCostFirstYear: number): CostPoint[] {
  const factor = costFactor(monthly, baseCostFirstYear);
  let idx = 0;
  const out: CostPoint[] = [];
  YEAR_INFO.forEach((yi) => {
    const slice = monthly.slice(idx, idx + yi.m);
    const sum = slice.reduce((a, b) => a + b * factor, 0);
    out.push({ label: String(yi.y) + (yi.m < 12 ? "(누적)" : ""), value: Math.round(sum) });
    idx += yi.m;
  });
  return out;
}

export function toCostQuarterly(monthly: number[], baseCostFirstYear: number): CostPoint[] {
  const factor = costFactor(monthly, baseCostFirstYear);
  const out: CostPoint[] = [];
  let idx = 0;
  YEAR_INFO.forEach((yi) => {
    let left = yi.m;
    let qn = 0;
    while (left > 0) {
      const take = Math.min(3, left);
      const slice = monthly.slice(idx, idx + take);
      const sum = slice.reduce((a, b) => a + b * factor, 0);
      out.push({ label: (qn === 0 ? String(yi.y).slice(2) + "'" : "") + "Q" + (qn + 1), value: Math.round(sum) });
      idx += take;
      left -= take;
      qn++;
    }
  });
  return out;
}

export function toCostMonthly(monthly: number[], baseCostFirstYear: number): CostPoint[] {
  const factor = costFactor(monthly, baseCostFirstYear);
  const labels = monthlyPointLabels();
  return monthly.map((v, i) => ({ label: labels[i], value: Math.round(v * factor) }));
}

export function costPointsForGranularity(monthly: number[], baseCostFirstYear: number, granularity: Granularity): CostPoint[] {
  if (granularity === "quarter") return toCostQuarterly(monthly, baseCostFirstYear);
  if (granularity === "year") return toCostYearly(monthly, baseCostFirstYear);
  return toCostMonthly(monthly, baseCostFirstYear);
}

// 이미 "비용(만원)" 단위인 월별 시계열을 그대로 합산만 해서 기간 단위로 바꾼다.
// (toCostYearly 등은 로스율 → 비용 환산 계수를 곱하는 반면, 이 함수들은 계수 없이 순수 합산만 한다.)
export function sumYearly(monthly: number[]): Point[] {
  const y: Point[] = [];
  let idx = 0;
  YEAR_INFO.forEach((yi) => {
    const slice = monthly.slice(idx, idx + yi.m);
    const sum = slice.reduce((a, b) => a + b, 0);
    y.push({ label: String(yi.y) + (yi.m < 12 ? "(누적)" : ""), value: Math.round(sum) });
    idx += yi.m;
  });
  return y;
}

export function sumQuarterly(monthly: number[]): Point[] {
  const out: Point[] = [];
  let idx = 0;
  YEAR_INFO.forEach((yi) => {
    let left = yi.m;
    let qn = 0;
    while (left > 0) {
      const take = Math.min(3, left);
      const slice = monthly.slice(idx, idx + take);
      const sum = slice.reduce((a, b) => a + b, 0);
      out.push({ label: (qn === 0 ? String(yi.y).slice(2) + "'" : "") + "Q" + (qn + 1), value: Math.round(sum) });
      idx += take;
      left -= take;
      qn++;
    }
  });
  return out;
}

export function sumPointsForGranularity(monthly: number[], granularity: Granularity): Point[] {
  if (granularity === "quarter") return sumQuarterly(monthly);
  if (granularity === "year") return sumYearly(monthly);
  const labels = monthlyPointLabels();
  return monthly.map((v, i) => ({ label: labels[i], value: Math.round(v) }));
}

export function pointsForGranularity(monthly: number[], granularity: Granularity): Point[] {
  if (granularity === "quarter") return toQuarterly(monthly);
  if (granularity === "year") return toYearly(monthly);
  const labels = monthlyPointLabels();
  return monthly.map((v, i) => ({ label: labels[i], value: v }));
}

export interface GranularityMeta {
  unit: string;
  prevWord: string;
  period3: string;
  histLabel: string;
  priorMax: string;
  priorMaxWord: string;
  chartTitle: string;
}

export const GRANULARITY_META: Record<Granularity, GranularityMeta> = {
  month: { unit: "당월", prevWord: "전월", period3: "3개월", histLabel: "최근 12개월", priorMax: "연내 최고치", priorMaxWord: "연중", chartTitle: "월별" },
  quarter: { unit: "당분기", prevWord: "전분기", period3: "3개 분기", histLabel: "최근 4개 분기", priorMax: "역대 최고치", priorMaxWord: "역대", chartTitle: "분기별" },
  year: { unit: "당해", prevWord: "전년", period3: "3개 연도", histLabel: "최근 3개 연도", priorMax: "역대 최고치", priorMaxWord: "역대", chartTitle: "연도별" },
};

export interface RuleEval {
  cur: number;
  prev: number;
  curLabel: string;
  mean: number;
  sigma: number;
  ucl: number;
  m3: Point[];
  increasing3: boolean;
  priorMax: number;
  priorMaxLabel: string;
  uslBreak: boolean;
  uclBreak: boolean;
  newHigh: boolean;
}

export function computeRuleEval(points: Point[], target: number, granularity: Granularity): RuleEval {
  const vals = points.map((p) => p.value);
  const n = vals.length;
  const cur = vals[n - 1];
  const prev = n >= 2 ? vals[n - 2] : cur;

  const windowSize = granularity === "month" ? 12 : granularity === "quarter" ? 4 : 3;
  const histStart = Math.max(0, n - 1 - windowSize);
  const hist = vals.slice(histStart, n - 1);
  const mean = hist.length ? hist.reduce((a, b) => a + b, 0) / hist.length : cur;
  const variance = hist.length ? hist.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / hist.length : 0;
  const sigma = Math.sqrt(variance);
  const ucl = mean + 2 * sigma;

  const m3n = Math.min(3, n);
  const m3 = points.slice(n - m3n);
  const increasing3 = m3n === 3 && m3[0].value < m3[1].value && m3[1].value < m3[2].value;

  let priorPoints: Point[];
  if (granularity === "month") {
    const curYear = points[n - 1].label.slice(0, 4);
    priorPoints = points.slice(0, n - 1).filter((p) => p.label.slice(0, 4) === curYear);
  } else {
    priorPoints = points.slice(0, n - 1);
  }
  const priorMax = priorPoints.length ? Math.max(...priorPoints.map((p) => p.value)) : -Infinity;
  const priorMaxLabel = priorPoints.length ? priorPoints.find((p) => p.value === priorMax)!.label : "-";

  return {
    cur,
    prev,
    curLabel: points[n - 1].label,
    mean,
    sigma,
    ucl,
    m3,
    increasing3,
    priorMax,
    priorMaxLabel,
    uslBreak: cur > target,
    uclBreak: hist.length > 0 && cur > ucl,
    newHigh: priorPoints.length > 0 && cur > priorMax,
  };
}

export function fmtPct(v: number): string {
  return (Math.round(v * 100) / 100).toFixed(1) + "%";
}

export function matchedCount(re: RuleEval): number {
  return [re.uslBreak, re.uclBreak, re.increasing3, re.newHigh].filter(Boolean).length;
}
