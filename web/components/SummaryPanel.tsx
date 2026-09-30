import { Granularity, buildMonthly } from "@/lib/timeseries";
import { FACTORY_TREND_SEED, LOSS_ITEMS } from "@/lib/lossItems";
import { factoryCostPoints } from "@/lib/factoryStats";
import { getTopAnomalies } from "@/lib/topAnomalies";
import RateTrendChartBox from "./RateTrendChartBox";
import CostTrendChartBox from "./CostTrendChartBox";
import MaterialCostCompositionCard from "./MaterialCostCompositionCard";
import AnomalyList, { AnomalyEntry } from "./AnomalyList";

export default function SummaryPanel({ granularity }: { granularity: Granularity }) {
  const gjMonthly = buildMonthly(FACTORY_TREND_SEED.광주.key, FACTORY_TREND_SEED.광주.base, FACTORY_TREND_SEED.광주.slope, FACTORY_TREND_SEED.광주.amp, FACTORY_TREND_SEED.광주.override);
  const cwMonthly = buildMonthly(FACTORY_TREND_SEED.창원.key, FACTORY_TREND_SEED.창원.base, FACTORY_TREND_SEED.창원.slope, FACTORY_TREND_SEED.창원.amp, FACTORY_TREND_SEED.창원.override);

  const top = getTopAnomalies(granularity, 5);
  const entries: AnomalyEntry[] = top.map((t) => ({ key: `${t.factory}-${t.idx}`, factory: t.factory, item: LOSS_ITEMS[t.factory][t.idx] }));

  const gjCostMonthly = factoryCostPoints("광주", "month");
  const cwCostMonthly = factoryCostPoints("창원", "month");
  const gjCurCost = gjCostMonthly[gjCostMonthly.length - 1].value;
  const gjPrevCost = gjCostMonthly[gjCostMonthly.length - 2].value;
  const cwCurCost = cwCostMonthly[cwCostMonthly.length - 1].value;
  const cwPrevCost = cwCostMonthly[cwCostMonthly.length - 2].value;
  const gjCostDelta = gjCurCost - gjPrevCost;
  const cwCostDelta = cwCurCost - cwPrevCost;
  const totalCost = gjCurCost + cwCurCost;

  return (
    <section className="tab-panel">
      <div className="page-head">
        <h1>2026년 8월 로스 이상탐지 결과 · 종합</h1>
        <p>
          업로드 완료 09:12 · 분석 소요 <strong className="num">47분</strong> (목표 1시간 이내) · 광주 · 창원 2개 공장 통합 순위
        </p>
        <div className="head-stats">
          <div className="head-stat">
            <span className="head-stat-label">로스 비용</span>
            <span className="head-stat-value num">{totalCost.toLocaleString()}만원</span>
            <span className="head-stat-sub">
              광주 <span className="num">{gjCurCost.toLocaleString()}</span>만원 · 창원 <span className="num">{cwCurCost.toLocaleString()}</span>만원
            </span>
          </div>
          <div className="head-stat">
            <span className="head-stat-label">로스율</span>
            <span className="head-stat-value num">광주 2.6% · 창원 4.8%</span>
            <span className="head-stat-sub">목표 대비 광주 130% · 창원 120%</span>
          </div>
          <div className="head-stat">
            <span className="head-stat-label">이상치</span>
            <span className="head-stat-value num">5건 탐지</span>
            <span className="head-stat-sub">로스유형 7종 전수 점검 · 기존 수기 결과 전량 재현</span>
          </div>
        </div>
      </div>

      <div className="summary-split">
        {/* ---------- 왼쪽: 로스율 ---------- */}
        <div>
          <h3 className="summary-half-title">로스율</h3>

          <div className="kpi-grid compact">
            <div className="kpi">
              <div className="label">광주공장 로스율</div>
              <div className="value-row">
                <span className="value num">2.6%</span>
                <span className="target num">/ 목표 2.0%</span>
              </div>
              <div className="delta up">▲ 전월 대비 0.4%p</div>
            </div>
            <div className="kpi">
              <div className="label">창원공장 로스율</div>
              <div className="value-row">
                <span className="value num">4.8%</span>
                <span className="target num">/ 목표 4.0%</span>
              </div>
              <div className="delta up">▲ 전월 대비 0.9%p</div>
            </div>
            <div className="kpi" style={{ gridColumn: "1 / -1" }}>
              <div className="label">탐지된 이상 항목</div>
              <div className="value-row">
                <span className="value num">5</span>
                <span className="target">건 · 로스유형 7종 전수 점검</span>
              </div>
              <div className="delta flat">기존 수기 결과 5건 전량 재현</div>
            </div>
          </div>

          <div className="stacked-cards">
            <RateTrendChartBox
              defaultGranularity={granularity}
              series={[
                { monthly: gjMonthly, color: "#0097A9", target: 2.0 },
                { monthly: cwMonthly, color: "#EB3300", target: 4.0 },
              ]}
            />

            <div className="card">
              <div className="card-head">
                <h2>공장별 관리 현황</h2>
                <span className="hint">8월 기준</span>
              </div>
              <div className="compare-row">
                <div>
                  <div className="cname">광주공장</div>
                  <div className="csub">규격 상한 USL 2.0%</div>
                </div>
                <div className="cval">
                  <span className="num">2.6%</span>
                  <span className="ctarget">
                    한도 대비 <span className="num">130%</span>
                  </span>
                </div>
              </div>
              <div className="meter">
                <i style={{ width: "65%", background: "var(--accent)" }} />
              </div>

              <div className="compare-row" style={{ marginTop: 14 }}>
                <div>
                  <div className="cname">창원공장</div>
                  <div className="csub">규격 상한 USL 4.0%</div>
                </div>
                <div className="cval">
                  <span className="num">4.8%</span>
                  <span className="ctarget">
                    한도 대비 <span className="num">120%</span>
                  </span>
                </div>
              </div>
              <div className="meter">
                <i style={{ width: "80%", background: "var(--accent)" }} />
              </div>

              <div className="compare-row" style={{ marginTop: 14, borderBottom: "none", paddingBottom: 0 }}>
                <div className="csub">두 공장은 관리 수준이 달라 기준값을 분리 적용하며, 판정 로직(4개 룰)은 동일하게 적용됩니다.</div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- 오른쪽: 로스 비용 ---------- */}
        <div>
          <h3 className="summary-half-title">로스 비용</h3>

          <div className="kpi-grid compact">
            <div className="kpi">
              <div className="label">광주공장 로스 비용</div>
              <div className="value-row">
                <span className="value num">{gjCurCost.toLocaleString()}만원</span>
              </div>
              <div className={`delta ${gjCostDelta > 0 ? "up" : gjCostDelta < 0 ? "down" : "flat"}`}>
                {gjCostDelta > 0 ? "▲" : gjCostDelta < 0 ? "▼" : "-"} 전월 대비 {Math.abs(gjCostDelta).toLocaleString()}만원
              </div>
            </div>
            <div className="kpi">
              <div className="label">창원공장 로스 비용</div>
              <div className="value-row">
                <span className="value num">{cwCurCost.toLocaleString()}만원</span>
              </div>
              <div className={`delta ${cwCostDelta > 0 ? "up" : cwCostDelta < 0 ? "down" : "flat"}`}>
                {cwCostDelta > 0 ? "▲" : cwCostDelta < 0 ? "▼" : "-"} 전월 대비 {Math.abs(cwCostDelta).toLocaleString()}만원
              </div>
            </div>
            <div className="kpi" style={{ gridColumn: "1 / -1" }}>
              <div className="label">두 공장 합산 로스 비용</div>
              <div className="value-row">
                <span className="value num">{totalCost.toLocaleString()}만원</span>
                <span className="target">당월 기준</span>
              </div>
              <div className="delta flat">7종 로스유형 전체 합산</div>
            </div>
          </div>

          <div className="stacked-cards">
            <CostTrendChartBox defaultGranularity={granularity} />

            <div className="card">
              <div className="card-head">
                <h2>공장별 비용 현황</h2>
                <span className="hint">당월 기준</span>
              </div>
              <div className="compare-row">
                <div>
                  <div className="cname">광주공장</div>
                  <div className="csub">로스유형 7종 합산</div>
                </div>
                <div className="cval">
                  <span className="num">{gjCurCost.toLocaleString()}만원</span>
                  <span className="ctarget">
                    전체 대비 <span className="num">{Math.round((gjCurCost / totalCost) * 100)}%</span>
                  </span>
                </div>
              </div>
              <div className="meter">
                <i style={{ width: `${Math.round((gjCurCost / totalCost) * 100)}%`, background: "var(--accent2)" }} />
              </div>

              <div className="compare-row" style={{ marginTop: 14 }}>
                <div>
                  <div className="cname">창원공장</div>
                  <div className="csub">로스유형 7종 합산</div>
                </div>
                <div className="cval">
                  <span className="num">{cwCurCost.toLocaleString()}만원</span>
                  <span className="ctarget">
                    전체 대비 <span className="num">{Math.round((cwCurCost / totalCost) * 100)}%</span>
                  </span>
                </div>
              </div>
              <div className="meter">
                <i style={{ width: `${Math.round((cwCurCost / totalCost) * 100)}%`, background: "var(--accent)" }} />
              </div>

              <div className="compare-row" style={{ marginTop: 14, borderBottom: "none", paddingBottom: 0 }}>
                <div className="csub">비용은 로스율에 로스유형별 기준단가를 반영해 환산한 참고값이며, 정확한 산식은 확정되지 않아 추후 갱신될 수 있습니다.</div>
              </div>
            </div>

            <MaterialCostCompositionCard granularity={granularity} />
          </div>
        </div>
      </div>

      <div className="section-title-row">
        <h2>이상 포인트 Top 5</h2>
        <span className="hint">광주·창원 통합 · 위 월별/분기별/연도별 버튼으로 판정 기준 자체를 바꿔볼 수 있습니다</span>
      </div>

      <AnomalyList entries={entries} granularity={granularity} />
    </section>
  );
}
