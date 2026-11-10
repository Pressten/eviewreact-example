import { Icon } from "../../../assets/shared/icon.jsx";
import Chart from "../../../assets/shared/chart.jsx";
import { trendData } from "../../mock/trend.js";
import "./index.css";

export default function BoxOfficeTrend() {
  const totalRevenue = trendData.reduce(function (s, d) { return s + d["票房金额"]; }, 0);
  const avgOcc = Math.round(trendData.reduce(function (s, d) { return s + d["上座率"]; }, 0) / trendData.length);
  const weekendRevenue = trendData[5]["票房金额"] + trendData[6]["票房金额"];

  return (
    <div className="trend-section">
      <div className="trend-header">
        <div className="section-title">
          <Icon name="chart-line" size="1.25rem" color="#0067D1" />
          <span>近 7 日票房趋势</span>
        </div>
      </div>
      <div className="trend-body">
        <div className="trend-summary">
          <div className="trend-summary-item">
            <span className="trend-summary-label">周累计票房</span>
            <span className="trend-summary-value">{totalRevenue.toFixed(1)}</span>
            <span className="trend-summary-label">万元</span>
          </div>
          <div className="trend-summary-item">
            <span className="trend-summary-label">周末两日票房</span>
            <span className="trend-summary-value">{weekendRevenue.toFixed(1)}</span>
            <span className="trend-summary-label">万元</span>
          </div>
          <div className="trend-summary-item">
            <span className="trend-summary-label">周均上座率</span>
            <span className="trend-summary-value">{avgOcc}</span>
            <span className="trend-summary-label">%</span>
          </div>
        </div>
        <Chart
          name="LineChart"
          option={{
            data: trendData,
            xAxis: { data: "日期", name: "近 7 日" },
            yAxisTitle: "数值（万元 / %）",
            smooth: true,
          }}
          style={{ flex: 1, minHeight: "15rem" }}
        />
      </div>
    </div>
  );
}
