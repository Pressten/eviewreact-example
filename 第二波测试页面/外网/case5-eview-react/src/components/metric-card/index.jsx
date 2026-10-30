// Layer 3: 周核心指标卡 — 数值 + 周同比 + 迷你趋势（LineChart mini），整卡可点击查看 8 周趋势
import Chart from "@nce/eview-react/Chart";
import { IconPlusIcPublicRightArrow, IconPlusIcPublicSortUp, IconPlusIcPublicSortDown } from '@hui/icon-plus';
import { useApp } from "../../context.jsx";
import "./index.css";

export default function MetricCard({ kpi, onClick }) {
  const { isDark } = useApp();
  const chartBase = { a2ui: true, theme: isDark ? "hdesign-dark" : "hdesign-light" };
  const isUp = kpi.yoyRate >= 0;
  const miniTrendData = kpi.history.map((point) => ({
    "周次": point.weekLabel,
    [kpi.metricName]: point.current,
  }));

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className="metric-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <div className="metric-head">
        <span className="metric-icon">{kpi.icon}</span>
        <span className="metric-name">{kpi.metricName}</span>
      </div>
      <div className="metric-value-row">
        <span className="metric-value">{kpi.valueText}</span>
        <span className="metric-unit">{kpi.unit}</span>
      </div>
      <span className={`metric-yoy ${isUp ? "up" : "down"}`}>
        {isUp ? <IconPlusIcPublicSortUp iconSize="0.875rem" iconColor={['currentcolor']} /> : <IconPlusIcPublicSortDown iconSize="0.875rem" iconColor={['currentcolor']} />}
        {isUp ? "+" : ""}{kpi.yoyRate}% 周同比
      </span>
      <div className="metric-trend">
        <Chart
          name="LineChart"
          option={{
            ...chartBase,
            data: miniTrendData,
            xAxis: { data: "周次" },
            yAxisTitle: `${kpi.metricName} (${kpi.unit})`,
            mini: true,
            smooth: true,
            area: true,
          }}
          style={{ height: "100%" }}
        />
      </div>
      <span className="metric-link">
        查看 8 周趋势
        <IconPlusIcPublicRightArrow iconSize="0.75rem" iconColor={['currentcolor']} />
      </span>
    </div>
  );
}
