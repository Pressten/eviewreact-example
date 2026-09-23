import "./index.css";

export default function Progress({ percent, status = "normal", showInfo = true, size = "default", className = "" }) {
  const p = Math.min(100, Math.max(0, Number(percent) || 0));
  const tone = status === "error" ? "error" : status === "success" ? "success" : status === "warning" ? "warning" : "primary";
  return (
    <div className={`app-progress app-progress-${size} ${className}`.trim()}>
      <div className="app-progress-track">
        <div className={`app-progress-fill app-progress-${tone}`} style={{ width: `${p}%` }} />
      </div>
      {showInfo ? <span className="app-progress-text">{p}%</span> : null}
    </div>
  );
}
