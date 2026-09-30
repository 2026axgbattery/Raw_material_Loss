import { GRANULARITY_META, Granularity, buildMonthly } from "@/lib/timeseries";
import { FACTORY_TREND_SEED, LOSS_ITEMS } from "@/lib/lossItems";
import TrendChart from "./TrendChart";
import AnomalyList, { AnomalyEntry } from "./AnomalyList";

const LOSS_TYPE_ROWS = [
  { name: "폐전지", sub: "격리판 손상 중심", pct: 4.8, meter: 80, tone: "accent" },
  { name: "폐연호", sub: "포장재 운반 파손 중심", pct: 4.1, meter: 68, tone: "accent" },
  { name: "초기연분", sub: "조기 증가 신호", pct: 3.5, meter: 58, tone: "accent2" },
  { name: "코드대체·재고보정·슬러그", sub: "정상 관리 범위 (합산)", pct: 1.2, meter: 20, tone: "accent2" },
] as const;

export default function ChangwonPanel({ granularity }: { granularity: Granularity }) {
  const g = GRANULARITY_META[granularity];
  const cwMonthly = buildMonthly(FACTORY_TREND_SEED.창원.key, FACTORY_TREND_SEED.창원.base, FACTORY_TREND_SEED.창원.slope, FACTORY_TREND_SEED.창원.amp, FACTORY_TREND_SEED.창원.override);
  const entries: AnomalyEntry[] = LOSS_ITEMS.창원.map((item) => ({ key: item.key, factory: "창원" as const, item }));

  return (
    <section className="tab-panel">
      <div className="page-head">
        <h1>창원공장 로스 이상탐지 결과</h1>
        <p>
          규격 상한 USL <span className="num">4.0%</span> 기준 관리 · 발생공정 매핑 미확보로 로스유형 단위로 집계
        </p>
      </div>

      <div className="kpi-grid">
        <div className="kpi">
          <div className="label">창원공장 로스율</div>
          <div className="value-row">
            <span className="value num">4.8%</span>
            <span className="target num">/ 목표 4.0%</span>
          </div>
          <div className="delta up">▲ 전월 대비 0.9%p</div>
        </div>
        <div className="kpi">
          <div className="label">규격 한도 대비</div>
          <div className="value-row">
            <span className="value num">120%</span>
            <span className="target num">USL 4.0% 기준</span>
          </div>
          <div className="delta up">▲ 지난달 108%</div>
        </div>
        <div className="kpi">
          <div className="label">탐지된 이상 항목</div>
          <div className="value-row">
            <span className="value num">3</span>
            <span className="target">건 · 로스유형 7종 중</span>
          </div>
          <div className="delta flat">기존 수기 결과 3건 전량 재현</div>
        </div>
        <div className="kpi">
          <div className="label">이번 달 최대 영향 로스</div>
          <div className="value-row">
            <span className="value num">1,240만원</span>
          </div>
          <div className="delta flat">폐전지 · 격리판</div>
        </div>
      </div>

      <div className="row-2col">
        <div className="card">
          <div className="card-head">
            <h2>{g.chartTitle} 로스율 추이 (2023~2026)</h2>
            <div className="legend">
              <span>
                <i style={{ background: "var(--accent)" }} />
                창원 (목표 4.0%)
              </span>
            </div>
          </div>
          <div className="chart-wrap">
            <TrendChart granularity={granularity} series={[{ monthly: cwMonthly, color: "#EB3300", target: 4.0 }]} />
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h2>로스유형별 현황</h2>
            <span className="hint">8월 기준 · 발생공정 미확보</span>
          </div>
          {LOSS_TYPE_ROWS.map((row, i) => (
            <div key={row.name}>
              <div
                className="compare-row"
                style={i > 0 ? { marginTop: 12, ...(i === LOSS_TYPE_ROWS.length - 1 ? { borderBottom: "none", paddingBottom: 0 } : {}) } : undefined}
              >
                <div>
                  <div className="cname">{row.name}</div>
                  <div className="csub">{row.sub}</div>
                </div>
                <div className="cval">
                  <span className="num">{row.pct}%</span>
                </div>
              </div>
              <div className="meter">
                <i style={{ width: `${row.meter}%`, background: `var(--${row.tone})` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-title-row">
        <h2>창원공장 이상 포인트</h2>
        <span className="hint">로스유형 7종 전체 · 이상치 유무와 무관하게 모두 표시 · 항목을 눌러 판정 근거와 전체 기간 추이를 확인하세요</span>
      </div>

      <AnomalyList entries={entries} granularity={granularity} />
    </section>
  );
}
