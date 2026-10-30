// Layer 4: ⑥ 品类毛利率排名 — 12 个品类按毛利率相对大小排布（JadeJueChart 玉玦图）
// 底部洞察条: 最高 / 最低品类与极差（与排名单调一致）
import { useMemo } from "react";
import Chart from "../../../assets/shared/chart.jsx";
import { Icon } from "../../../assets/shared/icon.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import { CATEGORY_MARGINS, buildCategoryInsights } from "../../mock/weekly-report.js";
import "./index.css";

export default function CategoryMargin() {
  const categoryInsights = useMemo(() => buildCategoryInsights(), []);

  return (
    <SectionCard
      index="06"
      title="品类毛利率排名"
      subtitle="12 个品类按毛利率相对大小排名 · 悬停查看明细 · 单位: %"
      className="span-7"
    >
      <div className="category-chart">
        <Chart
          name="JadeJueChart"
          option={{
            data: CATEGORY_MARGINS.map((category) => ({
              name: category.categoryName,
              value: category.grossMarginRate,
            })),
            title: { text: "品类毛利率", subtext: "单位: %" },
          }}
          style={{ height: "100%" }}
        />
      </div>
      <div className="insight-strip">
        <span className="insight-chip">
          <Icon name="arrow-up-right" size="0.75rem" className="chip-icon" />
          最高 {categoryInsights.highestName} {categoryInsights.highestRate}%
        </span>
        <span className="insight-chip">
          <Icon name="arrow-down-right" size="0.75rem" className="chip-icon" />
          最低 {categoryInsights.lowestName} {categoryInsights.lowestRate}%
        </span>
        <span className="insight-chip">
          <Icon name="chevrons-up-down" size="0.75rem" className="chip-icon" />
          极差 {categoryInsights.spread} pct
        </span>
      </div>
    </SectionCard>
  );
}
