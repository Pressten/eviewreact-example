export default function SimpleProgress({ percent = 0, status = "normal", showText = true, style, className }) {
  const color =
    status === "error"
      ? "var(--error)"
      : status === "success"
        ? "var(--success)"
        : "var(--primary)";
  const p = Math.min(100, Math.max(0, Number(percent) || 0));
  return (
    <div
      className={`app-progress${className ? " " + className : ""}`}
      style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)", ...style }}
    >
      <div
        className="app-progress__track"
        style={{
          flex: 1,
          height: "0.5rem",
          background: "var(--surface-variant)",
          borderRadius: "var(--radius-full)",
          overflow: "hidden",
        }}
      >
        <div
          className="app-progress__fill"
          style={{ width: `${p}%`, height: "100%", background: color, transition: "width .2s" }}
        />
      </div>
      {showText ? (
        <span
          className="app-progress__text"
          style={{
            color: "var(--on-surface-variant)",
            minWidth: "2.5rem",
            textAlign: "right",
            font: "var(--font-body-s)",
          }}
        >
          {p}%
        </span>
      ) : null}
    </div>
  );
}
