// Layer 3: KPI 概览卡(可复用)
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

export default function StatCard({ icon, label, value, unit, delta, up, tone }) {
  return (
    <div className="stat-card">
      <span className={"stat-card__icon stat-card__icon--" + tone}>
        <Icon name={icon} size="1.25rem" />
      </span>
      <div className="stat-card__body">
        <div className="stat-card__label">{label}</div>
        <div className="stat-card__value">
          {value}
          <span className="stat-card__unit">{unit}</span>
        </div>
        <div className={"stat-card__delta " + (up ? "is-up" : "is-down")}>
          <Icon name={up ? "trending-up" : "trending-down"} size="0.875rem" />
          <span className="stat-card__delta-value">{delta}</span>
          <span className="stat-card__delta-note">较昨日</span>
        </div>
      </div>
    </div>
  );
}
