import type { Factory } from "./schema";

export interface Contrib {
  name: string;
  pct: number;
}

export interface LossItem {
  key: string;
  title: string;
  /** 로스유형(+자재) 표기. React 노드로 렌더링하기 위해 텍스트+강조부만 분리해서 갖는다. */
  breadcrumbFactory: string;
  breadcrumbType: string;
  breadcrumbMaterial?: string;
  target: number;
  base: number;
  slope: number;
  amp: number;
  override?: number[];
  color: string;
  baseCostFirstYear: number;
  contrib?: Contrib[];
  summary: string;
}

export const LOSS_ITEMS: Record<Factory, LossItem[]> = {
  광주: [
    {
      key: "gj-codechange-v0",
      title: "코드대체 로스 현황",
      breadcrumbFactory: "광주공장",
      breadcrumbType: "코드대체",
      target: 2.0,
      base: 0.4,
      slope: 0,
      amp: 0.05,
      color: "#0097A9",
      baseCostFirstYear: 600,
      summary: "당월 코드대체 로스율은 목표 이내이며, 규격 이탈·관리한계·3개월 연속 증가·연내 최고치 4개 판정 기준에 모두 해당하지 않아 이상치로 탐지되지 않았습니다.",
    },
    {
      key: "gj-stock",
      title: "재고보정 로스 현황",
      breadcrumbFactory: "광주공장",
      breadcrumbType: "재고보정",
      target: 2.0,
      base: 0.6,
      slope: 0,
      amp: 0.05,
      color: "#0097A9",
      baseCostFirstYear: 900,
      summary: "당월 재고보정 로스율은 목표 이내이며, 4개 판정 기준 모두 비해당으로 정상 범위에서 관리되고 있습니다.",
    },
    {
      key: "gj-sludge",
      title: "슬러그 로스 연중 최고치",
      breadcrumbFactory: "광주공장",
      breadcrumbType: "슬러그",
      breadcrumbMaterial: "경연",
      target: 2.0,
      base: 1.55,
      slope: 0.012,
      amp: 0.08,
      override: [2.1, 2.0, 2.1, 2.1, 2.2],
      color: "#0097A9",
      baseCostFirstYear: 2200,
      contrib: [
        { name: "경연 슬러지화", pct: 72 },
        { name: "기타", pct: 28 },
      ],
      summary: "규격 상한(USL 2.0%)과 관리한계를 모두 소폭 초과했습니다. 경연 자재의 슬러지화가 72%로 대부분을 차지하며, 6~7월은 정체 구간이라 3개월 연속 증가 조건에는 해당하지 않으나 연내 최고치 갱신 규칙이 이를 보완해 탐지했습니다.",
    },
    {
      key: "gj-pyeonho",
      title: "폐연호 로스 현황",
      breadcrumbFactory: "광주공장",
      breadcrumbType: "폐연호",
      target: 2.0,
      base: 1.3,
      slope: 0,
      amp: 0.06,
      color: "#0097A9",
      baseCostFirstYear: 1500,
      summary: "당월 폐연호 로스율은 목표 이내이며 4개 판정 기준 모두 비해당으로 이상치가 탐지되지 않았습니다.",
    },
    {
      key: "gj-chogi",
      title: "초기연분 로스 현황",
      breadcrumbFactory: "광주공장",
      breadcrumbType: "초기연분",
      target: 2.0,
      base: 1.5,
      slope: 0,
      amp: 0.06,
      color: "#0097A9",
      baseCostFirstYear: 1700,
      summary: "당월 초기연분 로스율은 목표 이내이며 4개 판정 기준 모두 비해당으로 안정적으로 관리되고 있습니다.",
    },
    {
      key: "gj-pyegeukpan",
      title: "폐극판 로스 이례적 변동",
      breadcrumbFactory: "광주공장",
      breadcrumbType: "폐극판",
      breadcrumbMaterial: "순연",
      target: 2.0,
      base: 1.75,
      slope: 0.012,
      amp: 0.08,
      override: [2.1, 2.3, 2.6],
      color: "#0097A9",
      baseCostFirstYear: 3800,
      contrib: [
        { name: "EX1호기", pct: 38 },
        { name: "11라인", pct: 27 },
        { name: "EX5호기 외 발생공정", pct: 35 },
      ],
      summary: "규격 상한(USL 2.0%)을 이미 초과했으며, 6월부터 3개월 연속 증가 중입니다. 광주공장 폐극판 발생공정 중 극판 EX1호기가 38%로 가장 큰 비중을 차지하며, 관리한계·연내 최고치 기준까지 모두 해당하는 이례적 변동입니다.",
    },
    {
      key: "gj-pyejeonji",
      title: "폐전지 로스 현황",
      breadcrumbFactory: "광주공장",
      breadcrumbType: "폐전지",
      target: 2.0,
      base: 1.6,
      slope: 0,
      amp: 0.06,
      color: "#0097A9",
      baseCostFirstYear: 3000,
      summary: "당월 폐전지 로스율은 목표 이내로 4개 판정 기준 모두 비해당입니다. 광주·창원 공통 폐전지 발생공정 목록은 아직 확정되지 않아 공장 단위로만 집계됩니다.",
    },
  ],
  창원: [
    {
      key: "cw-codechange",
      title: "코드대체 로스 현황",
      breadcrumbFactory: "창원공장",
      breadcrumbType: "코드대체",
      target: 4.0,
      base: 0.8,
      slope: 0,
      amp: 0.08,
      color: "#EB3300",
      baseCostFirstYear: 700,
      summary: "당월 코드대체 로스율은 목표 이내이며 4개 판정 기준 모두 비해당으로 이상치가 탐지되지 않았습니다.",
    },
    {
      key: "cw-stock-v0",
      title: "재고보정 로스 현황",
      breadcrumbFactory: "창원공장",
      breadcrumbType: "재고보정",
      target: 4.0,
      base: 1.2,
      slope: 0,
      amp: 0.08,
      color: "#EB3300",
      baseCostFirstYear: 1000,
      summary: "당월 재고보정 로스율은 목표 이내로 정상 범위에서 관리되고 있습니다.",
    },
    {
      key: "cw-sludge",
      title: "슬러그 로스 현황",
      breadcrumbFactory: "창원공장",
      breadcrumbType: "슬러그",
      target: 4.0,
      base: 3.0,
      slope: 0,
      amp: 0.08,
      color: "#EB3300",
      baseCostFirstYear: 2600,
      summary: "당월 슬러그 로스율은 목표 이내이며 4개 판정 기준 모두 비해당으로 이상치가 탐지되지 않았습니다.",
    },
    {
      key: "cw-pyeonho",
      title: "폐연호 로스 규격 이탈",
      breadcrumbFactory: "창원공장",
      breadcrumbType: "폐연호",
      breadcrumbMaterial: "포장재",
      target: 4.0,
      base: 3.5,
      slope: 0.012,
      amp: 0.1,
      override: [4.0, 3.9, 4.1],
      color: "#EB3300",
      baseCostFirstYear: 1900,
      contrib: [
        { name: "포장재 운반 파손", pct: 81 },
        { name: "기타", pct: 19 },
      ],
      summary: "규격 상한(USL 4.0%)과 관리한계를 근소하게 초과했고 연내 최고치도 갱신했습니다. 다만 7월에 일시 하락했다가 급등한 형태라 3개월 연속 증가에는 해당하지 않습니다. 포장재 운반 중 파손이 81%로 단일 원인이 뚜렷해 현장 확인이 빠르게 가능할 것으로 판단됩니다.",
    },
    {
      key: "cw-chogi",
      title: "초기연분 로스 조기 신호",
      breadcrumbFactory: "창원공장",
      breadcrumbType: "초기연분",
      breadcrumbMaterial: "전조",
      target: 4.0,
      base: 2.6,
      slope: 0.012,
      amp: 0.1,
      override: [3.0, 3.2, 3.5],
      color: "#EB3300",
      baseCostFirstYear: 2100,
      contrib: [
        { name: "전조 정량 편차", pct: 47 },
        { name: "칭량 오차", pct: 33 },
        { name: "기타", pct: 20 },
      ],
      summary: "규격 한도(USL 4.0%)는 아직 넘지 않았지만 관리한계는 이미 초과했고 3개월 연속 증가·연내 최고치 갱신까지 겹쳤습니다. 전조 자재의 정량 편차 비중이 커지고 있어 다음 달 규격 이탈 가능성에 대한 조기 확인이 필요합니다. 창원공장은 초기연분 발생공정 매핑이 아직 확보되지 않아 공장 단위로만 집계됩니다.",
    },
    {
      key: "cw-pyegeukpan",
      title: "폐극판 로스 현황",
      breadcrumbFactory: "창원공장",
      breadcrumbType: "폐극판",
      target: 4.0,
      base: 3.4,
      slope: 0,
      amp: 0.08,
      color: "#EB3300",
      baseCostFirstYear: 3200,
      summary: "당월 폐극판 로스율은 목표 이내로 4개 판정 기준 모두 비해당입니다. 창원공장은 공정 목록·품목 코드 매핑표가 아직 확정되지 않아 공장 단위로만 집계됩니다.",
    },
    {
      key: "cw-pyejeonji",
      title: "폐전지 로스 급증",
      breadcrumbFactory: "창원공장",
      breadcrumbType: "폐전지",
      breadcrumbMaterial: "격리판",
      target: 4.0,
      base: 3.7,
      slope: 0.014,
      amp: 0.1,
      override: [4.3, 4.0, 4.2, 4.8],
      color: "#EB3300",
      baseCostFirstYear: 5400,
      contrib: [
        { name: "격리판 손상", pct: 68 },
        { name: "극판 탈락", pct: 21 },
        { name: "기타", pct: 11 },
      ],
      summary: "8월 창원 폐전지 로스율 증가는 격리판 자재의 손상에 의한 폐전지 발생이 전체 증가분의 68%를 차지합니다. 규격 이탈(USL), 통계적 관리한계, 3개월 연속 증가, 연내 최고치 갱신까지 4개 판정 기준에 모두 해당하는 최우선 확인 대상입니다. 창원공장은 폐전지 발생공정 매핑이 아직 확보되지 않아 공장 단위로만 집계됩니다.",
    },
  ],
};

// 상단 "로스율 추이" 카드용 공장 단위 집계 시계열. 기존 8월 실적(광주 2.6%/창원 4.8%)과
// 6~7월 값을 그대로 잇는 44개월 시계열이다 (Output HTML 목업과 동일한 앵커값).
export const FACTORY_TREND_SEED: Record<Factory, { key: string; base: number; slope: number; amp: number; override: number[]; target: number; color: string }> = {
  광주: { key: "factory-gj-agg", base: 1.3, slope: 0.018, amp: 0.09, override: [2.1, 2.3, 2.6], target: 2.0, color: "#0097A9" },
  창원: { key: "factory-cw-agg", base: 2.7, slope: 0.024, amp: 0.12, override: [4.0, 4.2, 4.8], target: 4.0, color: "#EB3300" },
};
