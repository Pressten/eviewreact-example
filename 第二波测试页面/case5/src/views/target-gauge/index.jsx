// Layer 4: ⑦ 目标完成度 — 本月销售目标整体完成度仪表盘（GaugeChart）
// 色阶语义: 低于70% 红(亟待加速) / 70~85% 橙(进度偏慢) / 85~100% 蓝(推进稳健) / 100%及以上 绿(超额达成)
// 完成度 = 筛选范围内 Σ实际 / Σ目标（与 ⑧ 六区域按目标加权对上），随门店范围筛选联动
// 卡片底部附色阶图例,让「色阶随完成度变化」可读
import { useMemo } from "react";
import { Tag } from "antd";
import Chart from "../../../assets/shared/chart.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import { WEEK_INFO, buildOverallCompletion } from "../../mock/weekly-report.js";
import "./index.css";

const GAUGE_MAX = 120; // 刻度上限定为 120%,容纳超额区间

function completionStatus(completion) {
  if (completion >= 100) {
    return { statusKey: "exceed", statusText: "超额达成", tagColor: "success", toneClass: "tone-exceed" };
  }
  if (completion >= 85) {
    return { statusKey: "steady", statusText: "推进稳健", tagColor: "processing", toneClass: "tone-steady" };
  }
  if (completion >= 70) {
    return { statusKey: "slow", statusText: "进度偏慢", tagColor: "warning", toneClass: "tone-slow" };
  }
  return { statusKey: "risk", statusText: "亟待加速", tagColor: "error", toneClass: "tone-risk" };
}

const GAUGE_LEGEND = [
  { legendLabel: "低于 70% · 亟待加速", legendColor: "var(--error)" },
  { legendLabel: "70% ~ 85% · 进度偏慢", legendColor: "var(--critical)" },
  { legendLabel: "85% ~ 100% · 推进稳健", legendColor: "var(--info)" },
  { legendLabel: "100% 及以上 · 超额达成", legendColor: "var(--success)" },
];

export default function TargetGauge({ stores }) {
  const overall = useMemo(() => buildOverallCompletion(stores), [stores]);
  const status = completionStatus(overall.completion);

  return (
    <SectionCard
      index="07"
      title="本月目标完成度"
      subtitle={`${WEEK_INFO.monthRange} 累计 · 色阶随完成度变化`}
      className="span-5"
      action={<Tag color={status.tagColor}>{status.statusText}</Tag>}
    >
      <div className="gauge-body">
        <div className="gauge-chart-wrap">
          <Chart
            name="GaugeChart"
            option={{
              data: [{ value: overall.completion, name: "月度目标完成率" }],
              min: 0,
              max: GAUGE_MAX,
              splitNumber: 6,
              pointer: true,
              splitColor: [
                [70 / GAUGE_MAX, "#E02128"],
                [85 / GAUGE_MAX, "#F4840C"],
                [100 / GAUGE_MAX, "#2070F3"],
                [1, "#09AA71"],
              ],
            }}
            style={{ height: "100%" }}
          />
        </div>
        <div className="gauge-stats">
          <div className="gauge-stat">
            <span className="gauge-stat-label">本月目标</span>
            <span className="gauge-stat-value">{overall.targetText} 万元</span>
          </div>
          <div className="gauge-stat">
            <span className="gauge-stat-label">月至今已完成</span>
            <span className="gauge-stat-value">{overall.actualText} 万元</span>
          </div>
          <div className="gauge-stat">
            <span className="gauge-stat-label">整体完成率</span>
            <span className={`gauge-stat-value ${status.toneClass}`}>{overall.completion}%</span>
          </div>
          <div className="gauge-stat">
            <span className="gauge-stat-label">剩余缺口</span>
            <span className="gauge-stat-value">{overall.gapText} 万元</span>
          </div>
          <div className="gauge-stat">
            <span className="gauge-stat-label">时间进度</span>
            <span className="gauge-stat-value">{WEEK_INFO.monthElapsedRate}%</span>
          </div>
          <p className="gauge-note">
            完成率领先时间进度 {overall.leadOverTime} pct，按当前节奏全月目标达成在望。
          </p>
        </div>
      </div>
      <div className="gauge-legend">
        {GAUGE_LEGEND.map((legend) => (
          <span className="legend-item" key={legend.legendLabel}>
            <i className="legend-dot" style={{ background: legend.legendColor }} />
            {legend.legendLabel}
          </span>
        ))}
      </div>
    </SectionCard>
  );
}
