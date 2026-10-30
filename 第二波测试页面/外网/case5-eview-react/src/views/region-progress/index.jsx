// Layer 4: ⑧ 区域进度 — 六大区域目标完成进度横向对比（ProcessChart 进度条）
// 纵向三段式: 全宽进度图（横向对比）→ 六区域卡片栅格（超额语义高亮）→ 洞察胶囊条 + 动态结论
// 随门店范围筛选联动；完成率配色与 ⑦ 仪表盘色阶语义一致
import { useMemo } from "react";
import { IconPlusIcIctTrophy, IconPlusIcPublicChartBar, IconPlusIcIctMoveUpAndDown, IconPlusIcIctMoveUp } from '@hui/icon-plus';
import Tag from "@/shared/Tag";
import Chart from "@nce/eview-react/Chart";
import { useApp } from "../../context.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import { buildRegionInsights, formatNumber } from "../../mock/weekly-report.jsx";
import "./index.css";

function regionTone(completion) {
  if (completion >= 100) {
    return { toneClass: "rate-exceed", tagColor: "success", tagText: "超额达成" };
  }
  if (completion >= 90) {
    return { toneClass: "rate-steady", tagColor: "processing", tagText: "稳步推进" };
  }
  return { toneClass: "rate-slow", tagColor: "warning", tagText: "需加速" };
}

export default function RegionProgress({ stores }) {
  const { isDark } = useApp();
  const chartBase = { a2ui: true, theme: isDark ? "hdesign-dark" : "hdesign-light" };
  const insights = useMemo(() => buildRegionInsights(stores), [stores]);
  const { regions, overall } = insights;

  return (
    <SectionCard
      index="08"
      title="区域目标完成进度"
      subtitle={`${regions.length} 个区域横向对比 · 超过 100% 高亮为超额达成 · 目标口径: 2026 年 10 月全月`}
    >
      <div className="region-chart-wrap">
        <Chart
          name="ProcessChart"
          option={{
            ...chartBase,
            name: "ProcessBarChart",
            data: regions.map((region) => ({
              name: region.regionFullName,
              value: region.completion,
            })),
            unit: "%",
          }}
          style={{ height: "100%" }}
        />
      </div>

      <div className="region-grid">
        {regions.map((region) => {
          const tone = regionTone(region.completion);
          return (
            <div
              key={region.region}
              className={`region-card ${region.completion >= 100 ? "region-card-exceed" : ""}`}
            >
              <div className="region-card-head">
                <span className="region-card-name">{region.regionFullName}</span>
                <Tag color={tone.tagColor} className="region-card-tag">
                  {region.completion >= 100 && (
                    <IconPlusIcIctTrophy iconSize="0.75rem" iconColor={['currentcolor']} className="region-tag-icon" />
                  )}
                  {tone.tagText}
                </Tag>
              </div>
              <span className={`region-card-rate ${tone.toneClass}`}>{region.completion}%</span>
              <div className="region-card-caption">
                目标 {formatNumber(region.target)} 万 · 已完成 {formatNumber(region.actual)} 万
              </div>
              <div className="region-card-stores">{region.storeCount} 家门店</div>
            </div>
          );
        })}
      </div>

      <div className="region-summary">
        <div className="insight-strip">
          <span className="insight-chip">
            <IconPlusIcPublicChartBar iconSize="0.75rem" iconColor={['currentcolor']} className="chip-icon" />
            平均完成率 {insights.averageCompletion}%
          </span>
          <span className="insight-chip">
            <IconPlusIcIctTrophy iconSize="0.75rem" iconColor={['currentcolor']} className="chip-icon" />
            超额区域 {insights.exceedCount} 个{insights.exceedNames ? ` · ${insights.exceedNames}` : ""}
          </span>
          <span className="insight-chip">
            <IconPlusIcIctMoveUpAndDown iconSize="0.75rem" iconColor={['currentcolor']} className="chip-icon" />
            完成率区间 {insights.minCompletion}% ~ {insights.maxCompletion}%
          </span>
          <span className="insight-chip">
            <IconPlusIcIctMoveUp iconSize="0.75rem" iconColor={['currentcolor']} className="chip-icon" />
            领先时间进度 +{overall.leadOverTime} pct
          </span>
        </div>
        <p className="region-summary-note">{insights.insightNote}</p>
      </div>
    </SectionCard>
  );
}
