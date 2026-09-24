// TODO(eview-react): ProgressBar 未覆盖，当前手写最小可用版（替代 antd Progress）。
// props: percent, status('active'|'success'|'exception'|'normal'), showInfo(默认 true), size('small')

export default function SimpleProgress({ percent = 0, status = "normal", showInfo = true, size }) {
  const color =
    status === "exception"
      ? "var(--error)"
      : status === "success"
      ? "var(--success)"
      : "var(--primary)";
  const p = Math.min(100, Math.max(0, percent));
  const trackH = size === "small" ? "6px" : "8px";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
      <div
        style={{
          flex: 1,
          height: trackH,
          background: "var(--color-fill)",
          borderRadius: "var(--radius-full)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${p}%`,
            height: "100%",
            background: color,
            transition: "width .2s",
            borderRadius: "var(--radius-full)",
          }}
        />
      </div>
      {showInfo ? (
        <span
          style={{
            color: "var(--on-surface-variant)",
            minWidth: "32px",
            textAlign: "right",
            fontSize: "var(--font-size-base)",
          }}
        >
          {p}%
        </span>
      ) : null}
    </div>
  );
}
