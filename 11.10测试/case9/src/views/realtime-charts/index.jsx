import { useMemo } from "react";
import { Dropdown, Tag, message } from "antd";
import Chart from "../../../assets/shared/chart.jsx";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import { SERVICES } from "../../mock/services.js";
import { buildSeries, RANGE_LABELS } from "../../mock/metrics.js";
import "./index.css";

const CHART_ACTIONS = [
  { key: "snapshot", label: "下载图表快照" },
  { key: "drill", label: "查看下钻明细" },
  { key: "fullscreen", label: "全屏查看" },
];

// ⑤ 实时图表：近 1 小时 QPS 与错误率（2 个系列），随 ② 服务卡 / ④ 拓扑节点联动切换
export default function RealtimeCharts() {
  const app = useApp();
  const svc = SERVICES[app.env].find((s) => s.key === app.selectedService) || SERVICES[app.env][0];

  const { points, errThreshold } = useMemo(
    () => buildSeries(app.env, svc.key, app.timeRange),
    [app.env, svc.key, app.timeRange]
  );

  const qpsData = points.map((p) => ({ 时间: p.label, QPS: p.qps }));
  const errData = points.map((p) => ({ 时间: p.label, 错误率: p.err }));

  const onChartAction = ({ key }) => {
    if (key === "snapshot") message.success(`已下载 ${svc.name} ${RANGE_LABELS[app.timeRange]}图表快照`);
    if (key === "drill") message.info(`打开 ${svc.name} 下钻明细（实例维度）`);
    if (key === "fullscreen") message.info("已进入全屏模式（Esc 退出）");
  };

  return (
    <SectionCard
      id="realtime-section"
      icon="activity"
      title="实时图表"
      className="rt-section"
      extra={
        <>
          <Tag className="rt-svc-tag">{svc.name}</Tag>
          <span className="rt-range">
            {RANGE_LABELS[app.timeRange]} · 错误率阈值 {errThreshold}%
          </span>
          <span className="rt-divider" />
          <Dropdown menu={{ items: CHART_ACTIONS, onClick: onChartAction }} placement="bottomRight">
            <span className="rt-more" title="图表操作">
              <Icon name="ellipsis" size="1rem" />
            </span>
          </Dropdown>
        </>
      }
    >
      <div className="rt-grid">
        <div className="rt-chart">
          <div className="rt-chart-title">
            <Icon name="activity" size="0.875rem" />
            {RANGE_LABELS[app.timeRange]} QPS · {svc.name}
          </div>
          <Chart
            name="LineChart"
            option={{ data: qpsData, xAxis: { data: "时间" }, yAxisTitle: "QPS（次/秒）", smooth: true, area: true }}
            style={{ height: "16rem" }}
          />
        </div>
        <div className="rt-chart">
          <div className="rt-chart-title">
            <Icon name="triangle-alert" size="0.875rem" />
            {RANGE_LABELS[app.timeRange]} 错误率 · {svc.name}
          </div>
          <Chart
            name="LineChart"
            option={{
              data: errData,
              xAxis: { data: "时间" },
              yAxisTitle: "错误率（%）",
              smooth: true,
              markLine: { bottom: errThreshold },
            }}
            style={{ height: "16rem" }}
          />
        </div>
      </div>
    </SectionCard>
  );
}
