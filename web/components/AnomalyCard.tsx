"use client";

import { useState } from "react";
import type { Factory } from "@/lib/schema";
import type { LossItem } from "@/lib/lossItems";
import { Granularity, GRANULARITY_META, buildMonthly, pointsForGranularity, computeRuleEval, matchedCount, fmtPct } from "@/lib/timeseries";
import RuleEvalBlock from "./RuleEvalBlock";
import LossRateChartBox from "./LossRateChartBox";
import CostChartBox from "./CostChartBox";

interface Props {
  factory: Factory;
  item: LossItem;
  granularity: Granularity;
  defaultOpen?: boolean;
}

export default function AnomalyCard({ factory, item, granularity, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  const monthly = buildMonthly(item.key, item.base, item.slope, item.amp, item.override);
  const points = pointsForGranularity(monthly, granularity);
  const re = computeRuleEval(points, item.target, granularity);
  const g = GRANULARITY_META[granularity];
  const matched = matchedCount(re);
  const isAnomaly = matched > 0;
  const statusClass = matched === 4 ? "critical" : isAnomaly ? "" : "normal";

  const vsText =
    re.cur <= item.target ? `목표 ${fmtPct(item.target)} · 이내` : `목표 ${fmtPct(item.target)} · +${fmtPct(re.cur - item.target).replace("%", "%p")}`;

  return (
    <div className={`anomaly ${statusClass} ${open ? "open" : ""}`.trim()}>
      <button className="anomaly-top" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span className="rank num">{isAnomaly ? "!" : "–"}</span>
        <span className="path">
          <span className="breadcrumb">
            {item.breadcrumbFactory} &gt; <b>{item.breadcrumbType}</b>
            {item.breadcrumbMaterial ? <> &gt; {item.breadcrumbMaterial}</> : null}
          </span>
          <span className="item">{item.title}</span>
        </span>
        <span className="rules">
          {isAnomaly ? (
            <>
              {re.uslBreak && <span className="rule-chip hot">규격 이탈(USL)</span>}
              {re.uclBreak && <span className="rule-chip">통계적 관리한계</span>}
              {re.increasing3 && <span className="rule-chip">{g.period3} 연속 증가</span>}
              {re.newHigh && <span className="rule-chip hot">{g.priorMax}</span>}
            </>
          ) : (
            <span className="rule-chip ok">이상치 없음</span>
          )}
        </span>
        <span className="metric">
          <div className="rate num">{fmtPct(re.cur)}</div>
          <div className="vs num">{vsText}</div>
        </span>
        <span className="chev" aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <div className="anomaly-detail">
          <h3 className="detail-id">
            {item.breadcrumbFactory} &gt; <b>{item.breadcrumbType}</b>
            {item.breadcrumbMaterial ? <> &gt; {item.breadcrumbMaterial}</> : null}
          </h3>

          <RuleEvalBlock re={re} target={item.target} granularity={granularity} />

          {item.contrib && (
            <div className="contrib-block">
              <div className="contrib-block-title">기여도 분해</div>
              {item.contrib.map((c) => (
                <div className="contrib-row" key={c.name}>
                  <span className="name">{c.name}</span>
                  <div className="bar">
                    <i style={{ width: `${c.pct}%` }} />
                  </div>
                  <span className="pct num">{c.pct}%</span>
                </div>
              ))}
            </div>
          )}

          <div className="detail-grid">
            <div className="charts-grid">
              <LossRateChartBox monthly={monthly} color={item.color} target={item.target} defaultGranularity={granularity} />
              <CostChartBox monthly={monthly} color={item.color} baseCostFirstYear={item.baseCostFirstYear} defaultGranularity={granularity} />
            </div>
            <div className="summary-box">
              <span className="tag">자동 요약</span>
              {item.summary}
            </div>
          </div>

          <div className="evidence-row">
            <div className="evidence-item">
              <div className="k">{g.prevWord}</div>
              <div className="v num">{fmtPct(re.prev)}</div>
            </div>
            <div className="evidence-item">
              <div className="k">{g.unit}</div>
              <div className="v num">{fmtPct(re.cur)}</div>
            </div>
            <div className="evidence-item">
              <div className="k">{g.priorMax} 이력</div>
              <div className="v num">
                {fmtPct(re.priorMax)} ({re.priorMaxLabel})
              </div>
            </div>
          </div>

          <div className="actions">
            {statusClass === "critical" && (
              <button className="btn btn-primary" type="button">
                소명 요청서 생성
              </button>
            )}
            <button className="btn btn-ghost" type="button">
              기간축 드릴다운 (분기 → 월)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
