import { GRANULARITY_META, Granularity, RuleEval, fmtPct, matchedCount } from "@/lib/timeseries";
import type { ReactNode } from "react";

interface Row {
  no: string;
  name: string;
  pass: boolean;
  detail: ReactNode;
}

function ReRow({ row }: { row: Row }) {
  return (
    <div className={`re-row ${row.pass ? "pass" : "fail"}`}>
      <span className="re-icon" aria-hidden="true">
        {row.pass ? "✓" : "–"}
      </span>
      <span>
        <span className="re-rule">
          {row.no} {row.name}
        </span>
        <span className="re-detail">{row.detail}</span>
      </span>
      <span className="re-verdict">{row.pass ? "해당" : "비해당"}</span>
    </div>
  );
}

export default function RuleEvalBlock({ re, target, granularity }: { re: RuleEval; target: number; granularity: Granularity }) {
  const g = GRANULARITY_META[granularity];
  const matched = matchedCount(re);
  const title = matched === 4 ? "4개 기준 모두 해당" : matched === 0 ? "4개 기준 모두 비해당 (정상 범위)" : `${matched}/4개 기준 해당`;

  const rows: Row[] = [
    {
      no: "①",
      name: "규격 이탈 (USL)",
      pass: re.uslBreak,
      detail: (
        <>
          기준 USL <span className="num">{fmtPct(target)}</span> · {g.unit} <span className="num">{fmtPct(re.cur)}</span> →{" "}
          {re.uslBreak ? (
            <>
              <span className="num">+{fmtPct(re.cur - target)}</span> 초과
            </>
          ) : (
            "한도 이내"
          )}
        </>
      ),
    },
    {
      no: "②",
      name: "통계적 관리한계 (UCL)",
      pass: re.uclBreak,
      detail: (
        <>
          관리상한 <span className="num">{fmtPct(re.ucl)}</span>({g.histLabel} 평균 <span className="num">{fmtPct(re.mean)}</span> + 2σ) · {g.unit}{" "}
          <span className="num">{fmtPct(re.cur)}</span> → {re.uclBreak ? "초과" : "이내"}
        </>
      ),
    },
    {
      no: "③",
      name: `${g.period3} 연속 증가`,
      pass: re.increasing3,
      detail: (
        <>
          {re.m3.map((p, i) => (
            <span key={i}>
              {i > 0 && " → "}
              <span className="num">{fmtPct(p.value)}</span>
            </span>
          ))}{" "}
          → {re.increasing3 ? "연속 증가" : "증가 조건 미충족"}
        </>
      ),
    },
    {
      no: "④",
      name: `${g.priorMax} 갱신`,
      pass: re.newHigh,
      detail: (
        <>
          {g.priorMaxWord} 최고 <span className="num">{fmtPct(re.priorMax)}</span>({re.priorMaxLabel}) · {g.unit} <span className="num">{fmtPct(re.cur)}</span> →{" "}
          {re.newHigh ? "갱신" : "이내"}
        </>
      ),
    },
  ];

  return (
    <div className="rule-eval">
      <div className="rule-eval-title">
        판정 기준 상세 ({g.unit} {re.curLabel} 기준) · {title}
      </div>
      {rows.map((row) => (
        <ReRow key={row.no} row={row} />
      ))}
    </div>
  );
}
