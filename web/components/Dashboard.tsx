"use client";

import { useState } from "react";
import type { Granularity } from "@/lib/timeseries";
import { LOSS_TYPES, MATERIALS } from "@/lib/schema";
import GranularityToggle from "./GranularityToggle";
import SummaryPanel from "./SummaryPanel";
import GwangjuPanel from "./GwangjuPanel";
import ChangwonPanel from "./ChangwonPanel";

type TabKey = "all" | "gj" | "cw";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "종합" },
  { key: "gj", label: "광주공장" },
  { key: "cw", label: "창원공장" },
];

export default function Dashboard() {
  const [tab, setTab] = useState<TabKey>("all");
  const [granularity, setGranularity] = useState<Granularity>("month");

  return (
    <div className="frame">
      <nav className="rail" role="tablist" aria-label="공장 선택">
        {TABS.map((t) => (
          <button key={t.key} className="tab" role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </nav>

      <div className="frame-scroll">
        <div className="topbar">
          <div className="brand">
            <div className="brand-mark" aria-hidden="true" />
            <div className="brand-text">
              <div className="name">
                Loss <span className="accent">Insight</span>
              </div>
              <div className="sub">재료비 로스 이상탐지 · 원가혁신팀</div>
            </div>
          </div>
          <div className="run-status">
            <span className="pill pill-ok">
              <i className="pill-dot" />
              원본 파일 9종 업로드 · 파싱 성공 100%
            </span>
            <span className="pill pill-warn">
              <i className="pill-dot" />
              정합성 검증 8/8 통과 · 경고 1건
            </span>
          </div>
        </div>

        <div className="shared-filters">
          <GranularityToggle value={granularity} onChange={setGranularity} />
          <select aria-label="로스유형 필터" defaultValue="전체 로스유형">
            <option>전체 로스유형</option>
            {LOSS_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select aria-label="로스발생자재 필터" defaultValue="전체 로스발생자재">
            <option>전체 로스발생자재</option>
            {MATERIALS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>

        {tab === "all" && <SummaryPanel granularity={granularity} />}
        {tab === "gj" && <GwangjuPanel granularity={granularity} />}
        {tab === "cw" && <ChangwonPanel granularity={granularity} />}

        <footer>
          <span>데이터 기준: ERP·MES 원본 업로드 2026-09-01 09:12 · 재료비 총액 대비 정합성 오차 0.6%p</span>
          <span>Loss Insight MVP · FR-4 이상치 탐지 · FR-5 드릴다운 분석</span>
        </footer>
      </div>
    </div>
  );
}
