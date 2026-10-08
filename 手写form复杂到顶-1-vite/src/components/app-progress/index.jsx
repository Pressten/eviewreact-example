// TODO(eview-react): Progress 无对应组件，当前手写进度条
// 线性进度条 + 环形进度条两种形态，样式用源项目 CSS 变量

export default function AppProgress({ percent = 0, type = "line", size = 88, strokeColor = "var(--primary)" }) {
  const p = Math.min(100, Math.max(0, percent));

  if (type === "circle") {
    const radius = size / 2 - 6;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (p / 100) * circumference;
    return (
      <div style={{ width: `${size}px`, height: `${size}px`, position: "relative" }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={6}
            stroke="var(--hover, rgba(0,0,0,0.08))"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={6}
            stroke={strokeColor}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset .3s" }}
          />
        </svg>
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--on-surface, #191919)",
          }}
        >
          {p}%
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          flex: 1,
          height: "6px",
          background: "var(--hover, rgba(0,0,0,0.05))",
          borderRadius: "3px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${p}%`,
            height: "100%",
            background: strokeColor,
            transition: "width .2s",
          }}
        />
      </div>
    </div>
  );
}
