// TODO(eview-react): Progress 无对应组件，当前手写 line + circle 进度条
// 样式用源项目 CSS 变量（原始 token），类名用业务前缀 app-

export function LineProgress({ percent, strokeColor, showInfo = true, style, size }) {
  const p = Math.min(100, Math.max(0, percent || 0));
  const color = strokeColor || "var(--primary)";
  const trackHeight = size === "small" ? "0.375rem" : "0.5rem";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", ...style }}>
      <div
        style={{
          flex: 1,
          height: trackHeight,
          background: "var(--surface-variant, rgba(0,0,0,0.06))",
          borderRadius: "var(--radius-full, 9999px)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${p}%`,
            height: "100%",
            background: color,
            borderRadius: "inherit",
            transition: "width 0.3s ease",
          }}
        />
      </div>
      {showInfo ? (
        <span style={{ color: "var(--on-surface-variant, #777)", minWidth: "2.5rem", textAlign: "right", fontSize: "var(--font-body-s, 0.75rem)" }}>
          {p}%
        </span>
      ) : null}
    </div>
  );
}

export function CircleProgress({ percent, size = 88, strokeColor, format, strokeWidth = 6 }) {
  const p = Math.min(100, Math.max(0, percent || 0));
  const color = strokeColor || "var(--primary)";
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (p / 100) * circumference;
  return (
    <div style={{ position: "relative", width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-variant, rgba(0,0,0,0.08))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />
      </svg>
      <span style={{ position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {format ? format(p) : <span style={{ fontWeight: "var(--font-weight-bold, 600)", color: "var(--on-surface, #191919)" }}>{p}%</span>}
      </span>
    </div>
  );
}
