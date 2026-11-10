import { useMemo } from "react";
import Chart from "../../../assets/shared/chart.jsx";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import { SERVICES, fmtNum, liveQps, trendFor } from "../../mock/services.js";
import { worstActiveLevel } from "../../mock/alarms.js";
import "./index.css";

// 服务卡状态：可用率 + 活动告警（触发中/已认领）双口径推导，与告警列表逻辑一致
function cardStatus(svc, worst) {
  if (svc.availability < 99.5 || (worst && worst.level === "P0")) return "critical";
  if (svc.availability < 99.9 || (worst && worst.level === "P1")) return "warning";
  return "healthy";
}

// ② 服务总览：8 个核心服务可用性卡（点击联动 ⑤ 实时图表）
export default function ServiceOverview() {
  const app = useApp();

  const list = useMemo(
    () =>
      SERVICES[app.env].map((svc) => {
        const worst = worstActiveLevel(app.alarms, svc.key);
        const activeCount = app.alarms.filter(
          (a) => a.targetKey === svc.key && (a.status === "firing" || a.status === "claimed")
        ).length;
        return { ...svc, activeCount, status: cardStatus(svc, worst) };
      }),
    [app.env, app.alarms]
  );

  const select = (key) => {
    app.setSelectedService(key);
    const el = document.getElementById("realtime-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <SectionCard
      id="service-section"
      icon="boxes"
      title="服务总览"
      className="svc-section"
      extra={<span className="svc-extra">SLO 99.9% · 点击卡片联动下方实时图表</span>}
    >
      <div className="svc-grid">
        {list.map((svc) => (
          <div
            key={svc.key}
            className={`svc-card st-${svc.status}${app.selectedService === svc.key ? " is-selected" : ""}`}
            role="button"
            tabIndex={0}
            onClick={() => select(svc.key)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") select(svc.key);
            }}
          >
            <div className="svc-head">
              <span className={`svc-dot st-${svc.status}`} />
              <span className="svc-name">{svc.name}</span>
              {svc.activeCount > 0 ? (
                <span className={`svc-alarm st-${svc.status}`}>
                  <Icon name="triangle-alert" size="0.75rem" />
                  {svc.activeCount} 条活动告警
                </span>
              ) : null}
              <span className="svc-domain">{svc.domain}</span>
            </div>
            <div className="svc-avail-row">
              <div className="svc-avail-block">
                <span className="svc-avail-label">24h 可用性</span>
                <span className={`svc-avail st-${svc.status}`}>
                  {svc.availability.toFixed(2)}
                  <i>%</i>
                </span>
              </div>
              <div className="svc-trend">
                <Chart
                  name="LineChart"
                  option={{ data: trendFor(app.env, svc), xAxis: { data: "t" }, mini: true, smooth: true }}
                  style={{ height: "100%", width: "100%" }}
                />
              </div>
            </div>
            <div className="svc-meta">
              <span title="实时 QPS">{fmtNum(liveQps(svc.qps, svc.key, app.refreshTick))} QPS</span>
              <span title="实时错误率">错误率 {svc.errRate}%</span>
              <span className="svc-instances" title="实例数">
                <Icon name="server" size="0.75rem" />
                {svc.instances} 实例
              </span>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
