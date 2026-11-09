import { Tag } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import SectionCard from "../../components/section-card/index.jsx";
import "./index.css";

const STATUS_TAG = {
  normal: { color: "success", label: "正常" },
  warning: { color: "warning", label: "告警" },
  critical: { color: "error", label: "异常" },
};

// 迷你 24h 趋势 sparkline（纯 SVG，按可用率走势渲染）
function Sparkline({ data, status }) {
  const w = 96;
  const h = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / span) * (h - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const stroke = status === "critical" ? "var(--error)" : status === "warning" ? "var(--critical)" : "var(--success)";
  return (
    <svg className="sparkline" width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts.join(" ")} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// 区块② 服务总览：8 个核心服务可用性卡
export default function ServiceOverview({ services, selectedServiceId, onSelectService }) {
  return (
    <SectionCard
      title="服务总览"
      subtitle="8 个核心服务可用性"
      icon="server"
      actions={<span className="overview-legend"><span className="legend-dot ok" />正常<span className="legend-dot warn" />告警<span className="legend-dot crit" />异常</span>}
    >
      <div className="service-grid">
        {services.map((s) => {
          const active = s.id === selectedServiceId;
          const st = STATUS_TAG[s.status];
          return (
            <button
              key={s.id}
              type="button"
              className={`svc-card is-${s.status}${active ? " is-active" : ""}`}
              onClick={() => onSelectService(s.id)}
            >
              <div className="svc-card-top">
                <span className="svc-name">{s.name}</span>
                <Tag color={st.color} bordered={false}>{st.label}</Tag>
              </div>
              <div className="svc-avail">
                <span className="avail-value">{s.availability.toFixed(2)}<span className="avail-unit">%</span></span>
                <span className="avail-label">可用率</span>
              </div>
              <div className="svc-card-bottom">
                <Sparkline data={s.trend} status={s.status} />
                <div className="svc-stats">
                  <span className="stat-row"><Icon name="gauge" size="0.75rem" />{s.qps.toLocaleString()} QPS</span>
                  <span className="stat-row"><Icon name="layers" size="0.75rem" />{s.instances} 实例</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </SectionCard>
  );
}
