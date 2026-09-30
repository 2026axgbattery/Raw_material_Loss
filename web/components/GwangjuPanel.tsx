import { GRANULARITY_META, Granularity, buildMonthly } from "@/lib/timeseries";
import { FACTORY_TREND_SEED, LOSS_ITEMS } from "@/lib/lossItems";
import TrendChart from "./TrendChart";
import AnomalyList, { AnomalyEntry } from "./AnomalyList";

const PROCESS_ROWS = [
  { name: "생산_극판_EX1호기", pct: 20, tone: "accent" },
  { name: "생산_1공장1차조립_11라인", pct: 13, tone: "accent" },
  { name: "생산_극판_EX5호기", pct: 11, tone: "accent2" },
  { name: "생산_극판_EX9호기", pct: 7, tone: "accent2" },
  { name: "생산_1공장1차조립_12라인", pct: 5, tone: "accent2" },
  { name: "생산_극판_EX2호기 · EX6호기 (합산)", pct: 4, tone: "accent2" },
  { name: "폐극판선별 (그 외 발생분 포함 전량 집계)", pct: 40, tone: "accent-strong" },
] as const;

export default function GwangjuPanel({ granularity }: { granularity: Granularity }) {
  const g = GRANULARITY_META[granularity];
  const gjMonthly = buildMonthly(FACTORY_TREND_SEED.광주.key, FACTORY_TREND_SEED.광주.base, FACTORY_TREND_SEED.광주.slope, FACTORY_TREND_SEED.광주.amp, FACTORY_TREND_SEED.광주.override);
  const entries: AnomalyEntry[] = LOSS_ITEMS.광주.map((item) => ({ key: item.key, factory: "광주" as const, item }));

  return (
    <section className="tab-panel">
      <div className="page-head">
        <h1>광주공장 로스 이상탐지 결과</h1>
        <p>
          규격 상한 USL <span className="num">2.0%</span> 기준 관리 · 폐극판 발생공정 7개 지점 + 최종 선별공정 추적
        </p>
      </div>

      <div className="kpi-grid">
        <div className="kpi">
          <div className="label">광주공장 로스율</div>
          <div className="value-row">
            <span className="value num">2.6%</span>
            <span className="target num">/ 목표 2.0%</span>
          </div>
          <div className="delta up">▲ 전월 대비 0.4%p</div>
        </div>
        <div className="kpi">
          <div className="label">규격 한도 대비</div>
          <div className="value-row">
            <span className="value num">130%</span>
            <span className="target num">USL 2.0% 기준</span>
          </div>
          <div className="delta up">▲ 지난달 115%</div>
        </div>
        <div className="kpi">
          <div className="label">탐지된 이상 항목</div>
          <div className="value-row">
            <span className="value num">2</span>
            <span className="target">건 · 로스유형 7종 중</span>
          </div>
          <div className="delta flat">기존 수기 결과 2건 전량 재현</div>
        </div>
        <div className="kpi">
          <div className="label">이번 달 최대 영향 로스</div>
          <div className="value-row">
            <span className="value num">340만원</span>
          </div>
          <div className="delta flat">폐극판 · 순연</div>
        </div>
      </div>

      <div className="row-2col">
        <div className="card">
          <div className="card-head">
            <h2>{g.chartTitle} 로스율 추이 (2023~2026)</h2>
            <div className="legend">
              <span>
                <i style={{ background: "var(--accent2)" }} />
                광주 (목표 2.0%)
              </span>
            </div>
          </div>
          <div className="chart-wrap">
            <TrendChart granularity={granularity} series={[{ monthly: gjMonthly, color: "#0097A9", target: 2.0 }]} />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>폐극판 발생공정별 현황</h2>
            <span className="hint">8월 기준 · 순연</span>
          </div>
          {PROCESS_ROWS.map((row, i) => (
            <div key={row.name}>
              <div className="compare-row" style={i > 0 ? { marginTop: 10, ...(i === PROCESS_ROWS.length - 1 ? { borderBottom: "none", paddingBottom: 0 } : {}) } : undefined}>
                <div>
                  <div className="cname">{row.name}</div>
                  <div className="csub">{i === PROCESS_ROWS.length - 1 ? "최종 선별공정" : "폐극판 발생공정"}</div>
                </div>
                <div className="cval">
                  <span className="num">{row.pct}%</span>
                </div>
              </div>
              <div className="meter">
                <i style={{ width: `${row.pct}%`, background: `var(--${row.tone})` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-title-row">
        <h2>광주공장 이상 포인트</h2>
        <span className="hint">로스유형 7종 전체 · 이상치 유무와 무관하게 모두 표시 · 항목을 눌러 판정 근거와 전체 기간 추이를 확인하세요</span>
      </div>

      <AnomalyList entries={entries} granularity={granularity} />
    </section>
  );
}
