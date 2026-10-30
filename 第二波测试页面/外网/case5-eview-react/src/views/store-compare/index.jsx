// Layer 4: ③ 门店销售对比 — 20 家门店销售额柱状图（线下/线上两个系列），随门店范围筛选联动
// 底部洞察条: 标杆门店 / 待提升门店 / 线上线下结构（均随筛选重算）
import { useMemo } from "react";
import { IconPlusIcBpitFlag, IconPlusIcPublicStar, IconPlusIcPublicChartBar } from '@hui/icon-plus';
import Chart from "@nce/eview-react/Chart";
import { useApp } from "../../context.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import { buildChannelStats, buildStoreExtremes, formatNumber } from "../../mock/weekly-report.jsx";
import "./index.css";

export default function StoreCompare({ stores }) {
  const { isDark } = useApp();
  const chartBase = { a2ui: true, theme: isDark ? "hdesign-dark" : "hdesign-light" };
  const channelStats = useMemo(() => buildChannelStats(stores), [stores]);
  const extremes = useMemo(() => buildStoreExtremes(stores), [stores]);
  const barData = useMemo(
    () =>
      stores.map((store) => ({
        "门店": store.storeName,
        "线下": store.offlineSales,
        "线上": store.onlineSales,
      })),
    [stores]
  );

  return (
    <SectionCard
      index="03"
      title="门店销售对比"
      subtitle={`${stores.length} 家门店 · 线上/线下双口径 · 悬停查看明细 · 单位: 万元`}
    >
      <div className="store-stat-strip">
        <div className="store-stat">
          <span className="store-stat-label">周销售额合计</span>
          <span className="store-stat-value">{channelStats.totalText}</span>
          <span className="store-stat-unit">万元</span>
        </div>
        <div className="store-stat">
          <span className="store-stat-label">线下合计</span>
          <span className="store-stat-value">{channelStats.offlineText}</span>
          <span className="store-stat-unit">万元</span>
        </div>
        <div className="store-stat">
          <span className="store-stat-label">线上合计</span>
          <span className="store-stat-value">{channelStats.onlineText}</span>
          <span className="store-stat-unit">万元</span>
        </div>
        <div className="store-stat">
          <span className="store-stat-label">线上占比</span>
          <span className="store-stat-value">{channelStats.onlineShare}</span>
          <span className="store-stat-unit">%</span>
        </div>
      </div>
      <div className="store-chart">
        <Chart
          name="BarChart"
          option={{
            ...chartBase,
            data: barData,
            xAxis: { data: "门店" },
            yAxisTitle: "销售额 (万元)",
          }}
          style={{ height: "100%" }}
        />
      </div>
      {extremes && (
        <div className="insight-strip">
          <span className="insight-chip">
            <IconPlusIcPublicStar iconSize="0.75rem" iconColor={['currentcolor']} className="chip-icon" />
            标杆门店 {extremes.topStoreName} · {formatNumber(extremes.topStoreSales, 1)} 万
          </span>
          <span className="insight-chip">
            <IconPlusIcBpitFlag iconSize="0.75rem" iconColor={['currentcolor']} className="chip-icon" />
            待提升 {extremes.bottomStoreName} · {formatNumber(extremes.bottomStoreSales, 1)} 万
          </span>
          <span className="insight-chip">
            <IconPlusIcPublicChartBar iconSize="0.75rem" iconColor={['currentcolor']} className="chip-icon" />
            结构 线下 {channelStats.offlineShare}% / 线上 {channelStats.onlineShare}%
          </span>
        </div>
      )}
    </SectionCard>
  );
}
