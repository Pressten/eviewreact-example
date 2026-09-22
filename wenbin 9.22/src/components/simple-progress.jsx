// TODO(eview-react): Progress 无对应组件，手写最小可用进度条。
// props: percent, status('normal'|'success'|'exception'|'active'), showInfo, size('small')
const STATUS_COLOR = {
  success: "var(--success)",
  exception: "var(--error)",
  active: "var(--primary)",
  normal: "var(--primary)",
};

export default function SimpleProgress({ percent = 0, status = "normal", showInfo = true, size }) {
  const p = Math.min(100, Math.max(0, percent));
  const color = STATUS_COLOR[status] || "var(--primary)";
  const h = size === "small" ? 6 : 8;
  return (
    <div className="app-progress">
      <div
        className="app-progress-track"
        style={{ height: `${h}px`, background: "var(--hover)" }}
      >
        <div
          className="app-progress-bar"
          style={{ width: `${p}%`, background: color, transition: "width .2s" }}
        />
      </div>
      {showInfo ? (
        <span className="app-progress-text" style={{ color: "var(--on-surface-variant)" }}>
          {p}%
        </span>
      ) : null}
    </div>
  );
}
