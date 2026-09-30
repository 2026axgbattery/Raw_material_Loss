# Loss Insight — Next.js 프론트엔드

`Output/박상열_로스율 이상탐지_대시보드.html` 목업의 디자인·데이터·이상치 판정 로직을 Next.js(App Router, TypeScript)로 포팅한 것입니다.

## 실행 방법

```
cd web
npm install
npm run dev   # http://localhost:3000
```

## 현재 범위

- 종합 / 광주공장 / 창원공장 3개 탭, 왼쪽 세로 레일 + 16:9 화면 프레임 레이아웃
- 월별 / 분기별 / 연도별 보기 전환 토글 — 트렌드 차트와 이상치 판정 4개 룰이 선택된 기간 단위로 다시 계산됨
- 로스유형 7종(§7-1) × 공장 2개 = 14개 항목의 이상치 판정, 카드별 연도/분기/월/비용 미니 차트, 기여도 분해
- `003_design.md` 디자인 시스템(세방고딕, 컬러 토큰, 8px 간격 등)을 CSS 커스텀 프로퍼티로 그대로 이식

## 아직 없는 것 (알려진 한계)

- **백엔드 연동 없음.** PRD §11에서 결정한 FastAPI 백엔드는 아직 만들지 않았습니다. 현재는 Output HTML 목업과 마찬가지로 브라우저 안에서 시드 고정 의사난수로 만든 **예시(mock) 데이터**를 그대로 씁니다. 실제 FR-1~FR-4(업로드·검증·집계·이상치 탐지)는 FastAPI API로 옮기고, 이 프론트는 그 API를 호출하도록 바꿔야 합니다.
- FR-1(파일 업로드), FR-2(정합성 검증), FR-3(집계) 화면은 없습니다. 지금 있는 건 FR-4(이상치 탐지)·FR-6(종합 대시보드)·FR-5(드릴다운의 일부: 판정 근거·기여도) 화면뿐입니다.
- FR-7 이후(소명 요청서 자동 생성 등) 버튼은 화면에 있지만 동작하지 않는 자리표시자입니다.

## 구조

```
app/
  layout.tsx       루트 레이아웃, globals.css 로드
  page.tsx         <Dashboard /> 렌더
  globals.css      003_design.md 디자인 토큰 + 컴포넌트 스타일 (Output HTML의 <style> 그대로 이식)
components/
  Dashboard.tsx        탭·기간단위 상태를 들고 있는 최상위 클라이언트 컴포넌트
  SummaryPanel.tsx     "종합" 탭 — 광주·창원 통합 Top 5
  GwangjuPanel.tsx     "광주공장" 탭 — 로스유형 7종 전체 + 폐극판 발생공정별 현황
  ChangwonPanel.tsx    "창원공장" 탭 — 로스유형 7종 전체 + 로스유형별 현황
  AnomalyList.tsx / AnomalyCard.tsx   이상 항목 카드 (펼치면 판정 근거·기여도·미니차트)
  RuleEvalBlock.tsx    4개 판정 룰 상세 표시
  TrendChart.tsx       상단 로스율 추이 차트 (SVG, 기간 단위별로 재계산)
  MiniLineChart.tsx / MiniBarChart.tsx   카드 내부의 연도/분기/월/비용 미니 차트
  GranularityToggle.tsx   월별/분기별/연도별 토글
lib/
  schema.ts        확정된 로스유형 7종·자재 10종·광주 폐극판 공정 매핑 (PRD §7-1~7-3)
  timeseries.ts     시계열 생성, 월→분기/연도 집계, 이상치 판정(computeRuleEval) 로직
  lossItems.ts      로스유형×공장별 예시 데이터 14건
  topAnomalies.ts   "종합" 탭의 Top-N 선정 로직
```
