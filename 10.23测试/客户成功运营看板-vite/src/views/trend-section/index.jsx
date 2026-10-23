import TipBox from "@nce/eview-react/TipBox";
import { IconPlusIcDigitalPowerDpArrowMoveUp, IconPlusIcPublicChart, IconPlusIcPublicEllipsis, IconPlusIcPublicRefreshClockwise, IconPlusIcPublicSetting } from '@hui/icon-plus';
import Chart from "@nce/eview-react/Chart";
import SectionCard from "../../components/section-card/index.jsx";
import { useApp } from "../../context.jsx";
import { getTrendData, getHealthDistribution } from "../../mock/dashboard.jsx";
import "./index.css";

// ④ 趋势区 + ⑤ 构成区 — 折线图 3 系列 + 饼图 4 类占比
// 受全局 timeRange / industry 联动(数据层面体现)
export default function TrendSection() {
  const { timeRange, industry, isDark } = useApp();
  const trendData = getTrendData(timeRange, industry);
  const pie = getHealthDistribution(timeRange, industry);

  const chartBase = { a2ui: true, theme: isDark ? "hdesign-dark" : "hdesign-light" };

  const lineOption = {
    ...chartBase,
    data: trendData,
    xAxis: { data: "时间", name: "时间" },
    yAxisTitle: "数值",
    smooth: true,
  };

  const pieOption = {
    ...chartBase,
    data: pie.data,
    title: { text: "客户分布", subtext: `共 ${pie.total} 家` },
    legendPosition: "bottomCenter",
  };

  return (
    <div className="trend-row">
      <SectionCard
        title="活跃度趋势"
        icon={<IconPlusIcDigitalPowerDpArrowMoveUp iconSize="1.25rem" iconColor={['currentcolor']} className="section-card-icon" />}
        extra={
          <div className="chart-actions">
            <IconPlusIcPublicRefreshClockwise iconSize="1rem" iconColor={['currentcolor']} className="chart-action-icon" title="刷新" />
            <span className="chart-action-divider" />
            <IconPlusIcPublicSetting iconSize="1rem" iconColor={['currentcolor']} className="chart-action-icon" title="图表设置" />
            <IconPlusIcPublicEllipsis iconSize="1rem" iconColor={['currentcolor']} className="chart-action-icon" title="更多" />
          </div>
        }
        className="trend-card"
      >
        <Chart name="LineChart" option={lineOption} style={{ height: "18rem" }} />
      </SectionCard>

      <SectionCard
        title="客户健康度构成"
        icon={<IconPlusIcPublicChart iconSize="1.25rem" iconColor={['currentcolor']} className="section-card-icon" />}
        extra={
          <TipBox content="健康度按活跃度 / 工单量 / 使用深度综合评定" type="simple">
            <span className="legend-hint">评分说明</span>
          </TipBox>
        }
        className="pie-card"
      >
        <Chart name="PieChart" option={pieOption} style={{ height: "18rem" }} />
      </SectionCard>
    </div>
  );
}
