/**
 * 확정된 분류 체계 (박상열_PRD.md §7-1~7-3). 임의로 값을 바꾸지 않는다.
 */

export const FACTORIES = ["광주", "창원"] as const;
export type Factory = (typeof FACTORIES)[number];

// §7-1 로스유형 7종
export const LOSS_TYPES = [
  "코드대체",
  "재고보정",
  "슬러그",
  "폐연호",
  "초기연분",
  "폐극판",
  "폐전지",
] as const;

// §7-2 로스발생자재 10종
export const MATERIALS = [
  "순연",
  "경연",
  "칼슘연",
  "전조",
  "카바",
  "격리판",
  "부자재",
  "의장재",
  "포장재",
  "부대품",
] as const;

// §7-3 광주공장 폐극판 발생공정(7개) + 최종 선별공정
export const GWANGJU_WASTE_PLATE_SOURCE_PROCESSES = [
  "생산_1공장1차조립_11라인",
  "생산_1공장1차조립_12라인",
  "생산_극판_EX1호기",
  "생산_극판_EX2호기",
  "생산_극판_EX5호기",
  "생산_극판_EX6호기",
  "생산_극판_EX9호기",
] as const;

export const GWANGJU_WASTE_PLATE_SORTING_PROCESS = "폐극판선별";
