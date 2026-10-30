import Chart from "@nce/eview-react/Chart";
import { IconPlusIcPublicRefreshClockwise, IconPlusIcPublicTransverseRectangleTemplate, IconPlusIcPublicAlert } from '@hui/icon-plus';
import SectionCard from "../../components/section-card/index.jsx";
import { useApp } from "../../context.jsx";
import { getRealtime, getServices } from "../../mock/monitor.js";
import "./index.css";

// 区块⑤ 实时图表：近 1 小时 QPS 与错误率折线图（2 个系列）
// 服务卡 / 拓扑节点点击联动切换为该服务的数据；错误率异常时段在数据上体现。
export default function RealtimeCharts({ selectedServiceId, env, onSelectService }) {
  const { isDark } = useApp();
  const services = getServices(env);
  const svc = services.find((s) => s.id === selectedServiceId) || services[0];
  const series = getRealtime(svc.id, env);

  const chartBase = { a2ui: true, theme: isDark ? "hdesign-dark" : "hdesign-light" };
  const qpsOption = {
    ...chartBase,
    data: series.map((p) => ({ time: p.time, QPS: p.qps })),
    xAxis: { data: "time", name: "时间" },
    yAxisTitle: "QPS (req/s)",
    smooth: true,
    area: true,
  };

  const errOption = {
    ...chartBase,
    data: series.map((p) => ({ time: p.time, 错误率: p.errorRate })),
    xAxis: { data: "time", name: "时间" },
    yAxisTitle: "错误率 (%)",
    smooth: true,
    area: true,
    markLine: { top: svc.id === "payment-service" ? 1 : 0.5 },
  };

  return (
    <SectionCard
      title="实时指标"
      subtitle={`近 1 小时 · ${svc.name}`}
      icon={<IconPlusIcPublicTransverseRectangleTemplate iconSize="1.25rem" iconColor={['currentcolor']} />}
      actions={
        <div className="rt-svc-select">
          {services.slice(0, 5).map((s) => (
            <button
              key={s.id}
              type="button"
              className={`rt-chip${s.id === svc.id ? " is-active" : ""}${s.status !== "normal" ? ` is-${s.status}` : ""}`}
              onClick={() => onSelectService(s.id)}
              title={s.name}
            >
              {s.name}
            </button>
          ))}
          <button className="rt-refresh" type="button" title="刷新数据">
            <IconPlusIcPublicRefreshClockwise iconSize="0.875rem" iconColor={['currentcolor']} />
          </button>
        </div>
      }
    >
      <div className="rt-charts">
        <div className="rt-chart-box">
          <div className="rt-chart-head">
            <span className="rt-chart-title">QPS 趋势</span>
            <span className="rt-chart-unit">req/s</span>
          </div>
          <Chart name="LineChart" option={qpsOption} style={{ height: "16rem" }} />
        </div>
        <div className="rt-chart-box">
          <div className="rt-chart-head">
            <span className="rt-chart-title">错误率趋势</span>
            <span className="rt-chart-unit">%</span>
            {svc.id === "payment-service" && (
              <span className="rt-anomaly-tag">
                <IconPlusIcPublicAlert iconSize="0.75rem" iconColor={['currentcolor']} />异常时段 35-44 分
              </span>
            )}
          </div>
          <Chart name="LineChart" option={errOption} style={{ height: "16rem" }} />
        </div>
      </div>
    </SectionCard>
  );
}
