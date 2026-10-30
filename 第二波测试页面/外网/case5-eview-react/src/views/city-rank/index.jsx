// Layer 4: ⑤ 城市排行 — TOP10 城市销售额（HillChart 绝对值排行,严格降序），随门店范围筛选联动
// 底部洞察条: TOP1 城市 / TOP3 集中度 / 覆盖城市数（均随筛选重算）
import { useMemo } from "react";
import Chart from "@nce/eview-react/Chart";
import { IconPlusIcPublicStar, IconPlusIcPublicChartBar, IconPlusIcPublicMappinOnMap } from '@hui/icon-plus';
import { useApp } from "../../context.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import { buildCityInsights, buildCityRank, formatNumber } from "../../mock/weekly-report.jsx";
import "./index.css";

export default function CityRank({ stores }) {
  const { isDark } = useApp();
  const chartBase = { a2ui: true, theme: isDark ? "hdesign-dark" : "hdesign-light" };
  const cityRank = useMemo(() => buildCityRank(stores), [stores]);
  const cityInsights = useMemo(() => buildCityInsights(stores), [stores]);

  return (
    <SectionCard
      index="05"
      title={`城市排行 TOP${cityRank.length}`}
      subtitle="按本周销售额绝对值降序 · 悬停查看明细 · 单位: 万元"
      className="span-5"
    >
      <div className="city-chart">
        <Chart
          name="HillChart"
          option={{
            ...chartBase,
            data: cityRank.map((city) => ({ name: city.city, value: city.citySales })),
          }}
          style={{ height: "100%" }}
        />
      </div>
      <div className="insight-strip">
        <span className="insight-chip">
          <IconPlusIcPublicStar iconSize="0.75rem" iconColor={['currentcolor']} className="chip-icon" />
          TOP1 {cityInsights.topCityName} · {formatNumber(cityInsights.topCitySales, 1)} 万
        </span>
        <span className="insight-chip">
          <IconPlusIcPublicChartBar iconSize="0.75rem" iconColor={['currentcolor']} className="chip-icon" />
          TOP3 城市占比 {cityInsights.top3Share}%
        </span>
        <span className="insight-chip">
          <IconPlusIcPublicMappinOnMap iconSize="0.75rem" iconColor={['currentcolor']} className="chip-icon" />
          覆盖 {cityInsights.cityCount} 城
        </span>
      </div>
    </SectionCard>
  );
}
