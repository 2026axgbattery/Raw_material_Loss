import { Granularity, GRANULARITY_META } from "@/lib/timeseries";
import { factoryMaterialCostBreakdown } from "@/lib/factoryStats";

export default function MaterialCostCompositionCard({ granularity }: { granularity: Granularity }) {
  const g = GRANULARITY_META[granularity];
  const gj = factoryMaterialCostBreakdown("광주", granularity);
  const cw = factoryMaterialCostBreakdown("창원", granularity);
  const total = gj.total + cw.total;
  const bom = gj.bom + cw.bom;
  const processLoss = gj.processLoss + cw.processLoss;
  const nonconforming = gj.nonconforming + cw.nonconforming;

  const bomPct = (bom / total) * 100;
  const processPct = (processLoss / total) * 100;
  const nonconPct = (nonconforming / total) * 100;

  return (
    <div className="card">
      <div className="card-head">
        <h2>전체 재료비 구성 (광주+창원)</h2>
        <span className="hint">{g.unit} 기준 · 만원</span>
      </div>

      <div className="stack-meter">
        <i style={{ width: `${bomPct}%`, background: "var(--border)" }} />
        <i style={{ width: `${processPct}%`, background: "var(--accent2)" }} />
        <i style={{ width: `${nonconPct}%`, background: "var(--accent)" }} />
      </div>

      <div className="stack-legend">
        <span>
          <i style={{ background: "var(--border)" }} />
          BOM구성 <b className="num">{Math.round(bomPct * 10) / 10}%</b> ({bom.toLocaleString()}만원)
        </span>
        <span>
          <i style={{ background: "var(--accent2)" }} />
          공정로스 <b className="num">{Math.round(processPct * 10) / 10}%</b> ({processLoss.toLocaleString()}만원)
        </span>
        <span>
          <i style={{ background: "var(--accent)" }} />
          부적합 <b className="num">{Math.round(nonconPct * 10) / 10}%</b> ({nonconforming.toLocaleString()}만원)
        </span>
      </div>

      <p className="composition-note">
        공정로스 = 슬러그·폐연호·초기연분, 부적합 = 폐극판·폐전지·주부자재폐기(목데이터). 코드대체·재고보정 로스는 BOM구성에 포함해 집계했습니다.
        전체 재료비 총액은 실제 확정값이 아니라 로스·부적합 합계 대비 비중을 가정한 예시 수치입니다.
      </p>
    </div>
  );
}
