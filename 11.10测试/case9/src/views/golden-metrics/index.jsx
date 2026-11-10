import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import { GOLDEN } from "../../mock/metrics.js";
import { fmtNum, liveQps } from "../../mock/services.js";
import "./index.css";

// ③ 黄金指标行：QPS / 平均响应时间 / 错误率 / P99 延迟，各带环比涨跌；
// 点击指标卡联动 ⑤ 实时图表（入口网关视角），QPS 随刷新频率实时跳动。
export default function GoldenMetrics() {
  const app = useApp();
  const metrics = GOLDEN[app.env];

  const openCharts = () => {
    app.setSelectedService("api-gateway");
    const el = document.getElementById("realtime-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <SectionCard
      id="golden-section"
      icon="gauge"
      title="黄金指标"
      className="gm-section"
      extra={
        <span className="gm-extra">
          数据口径：入口网关 · {app.env === "prod" ? "生产环境" : "预发环境"} · 点击指标卡联动实时图表
        </span>
      }
    >
      <div className="gm-grid">
        {metrics.map((m) => (
          <div
            key={m.key}
            className="gm-card is-clickable"
            role="button"
            tabIndex={0}
            onClick={openCharts}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openCharts();
            }}
          >
            <div className="gm-label">
              <Icon name={m.icon} size="0.875rem" />
              {m.label}
            </div>
            <div className="gm-value">
              {m.key === "qps" ? fmtNum(liveQps(m.value, "api-gateway", app.refreshTick)) : m.display}
              <span className="gm-unit">{m.unit}</span>
            </div>
            <div className="gm-delta">
              <span className={`gm-delta-chip ${m.good ? "is-good" : "is-bad"}`}>
                <Icon name={m.deltaUp ? "trending-up" : "trending-down"} size="0.875rem" />
                {m.delta}
              </span>
              <span className="gm-base">{m.base}</span>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
