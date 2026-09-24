import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

export default function StatCard({ icon, label, value, unit, trend, trendLabel, tone = "brand", onClick }) {
  const up = typeof trend === "number" && trend >= 0;
  return (
    <button type="button" className={`stat-card stat-${tone}`} onClick={onClick}>
      <span className="stat-icon">
        <Icon name={icon} size={20} />
      </span>
      <span className="stat-body">
        <span className="stat-label">{label}</span>
        <span className="stat-value">
          {value}
          {unit ? <em>{unit}</em> : null}
        </span>
        <span className="stat-meta">
          {typeof trend === "number" ? (
            <b className={up ? "stat-up" : "stat-down"}>
              <Icon name={up ? "trending-up" : "trending-down"} size={13} />
              {up ? "+" : ""}
              {trend}%
            </b>
          ) : null}
          <i>{trendLabel}</i>
        </span>
      </span>
    </button>
  );
}
