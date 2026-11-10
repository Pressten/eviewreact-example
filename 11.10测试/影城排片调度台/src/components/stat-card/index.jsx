import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

export default function StatCard({ label, value, unit, deltaDir, deltaLabel, valueClassName, icon }) {
  const dir = deltaDir || "flat";
  const arrowName = dir === "up" ? "arrow-up" : dir === "down" ? "arrow-down" : "minus";
  const arrowColor = dir === "up" ? "#09AA71" : dir === "down" ? "#E02128" : "#777777";
  const deltaCls = dir === "up" ? "delta-up" : dir === "down" ? "delta-down" : "delta-flat";

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        {icon && <Icon name={icon} size="1rem" className="stat-card-icon" />}
      </div>
      <div className="stat-card-value-row">
        <span className={"stat-card-value " + (valueClassName || "")}>{value}</span>
        {unit && <span className="stat-card-unit">{unit}</span>}
      </div>
      {deltaLabel && (
        <div className="stat-card-delta">
          <Icon name={arrowName} size="0.75rem" color={arrowColor} />
          <span className={deltaCls}>{deltaLabel}</span>
        </div>
      )}
    </div>
  );
}
