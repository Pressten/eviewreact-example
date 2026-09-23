import { Icon } from "../../shared/icon.jsx";
import "./index.css";

// 可点击 KPI 卡片:点击后按状态联动筛选下方图表与表格
export default function StatCard({ icon, label, value, unit, delta, deltaIcon, tone, active, onClick }) {
  return (
    <button
      type="button"
      className={"stat-card" + (active ? " is-active" : "")}
      onClick={onClick}
      aria-pressed={active}
    >
      <span className={"stat-icon stat-icon-" + tone}>
        <Icon name={icon} size={20} />
      </span>
      <span className="stat-meta">
        <span className="stat-label">{label}</span>
        <span className="stat-value">
          {value}
          <em className="stat-unit">{unit}</em>
        </span>
        {delta ? (
          <span className={"stat-delta stat-delta-" + tone}>
            <Icon name={deltaIcon || "trending-up"} size={12} />
            {delta}
          </span>
        ) : null}
      </span>
    </button>
  );
}
