import { Tooltip } from "antd";
import Chart from "../../../assets/shared/chart.jsx";
import { Icon } from "../../../assets/shared/icon.jsx";
import VerdictTag from "../../components/verdict-tag/index.jsx";
import { trendData } from "../../mock/metrics.js";
import "./index.css";

// Layer 4: 趋势判断 — 达成率走势 + 综合健康度仪表盘
export default function TrendPanel({ stats, activeRule }) {
  const lineOption = {
    data: trendData,
    xAxis: { data: "月份", name: "统计月份" },
    yAxisTitle: "达成率 (%)",
    smooth: true,
    area: true,
    markLine: { bottom: 98 },
  };

  const gaugeOption = {
    data: [{ value: Number(stats.avgRate.toFixed(1)), name: "综合达成率" }],
    min: 80,
    max: 105,
    splitNumber: 5,
    // 阈值配色与判断规则一致：<94% 异常 / 94%~98% 预警 / ≥98% 达标
    splitColor: [
      [0.55, "#e02128"],
      [0.71, "#f4840c"],
      [1, "#09aa71"],
    ],
    text: { offset: [0, 0], formatter: "{value}%" },
  };

  return (
    <section className="trend-row">
      <article className="panel panel--chart">
        <header className="panel-head">
          <div className="panel-head-title">
            <h2>达成率走势</h2>
            <p>近 12 个月综合达成率与达标指标占比变化</p>
          </div>
          <Tooltip title="低于 98% 基准线即触发预警判断">
            <span className="panel-hint">
              <Icon name="info" size={13} />
              基准线 98%
            </span>
          </Tooltip>
        </header>
        <div className="panel-body">
          <Chart name="LineChart" option={lineOption} style={{ height: 260 }} />
        </div>
      </article>

      <article className="panel">
        <header className="panel-head">
          <div className="panel-head-title">
            <h2>综合健康度</h2>
            <p>当前周期整体判断结论</p>
          </div>
        </header>
        <div className="panel-body panel-body--gauge">
          <Chart name="GaugeChart" option={gaugeOption} style={{ height: 172 }} />
          <div className="gauge-verdict">
            <span className="gauge-verdict-label">本轮结论</span>
            <VerdictTag verdict={activeRule} />
          </div>
          <ul className="gauge-meta">
            <li>
              <span>达标指标</span>
              <strong className="is-success">{stats.pass} 项</strong>
            </li>
            <li>
              <span>预警 / 异常</span>
              <strong className="is-error">{stats.warn + stats.fail} 项</strong>
            </li>
          </ul>
        </div>
      </article>
    </section>
  );
}
