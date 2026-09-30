// 手写补位 — antd Progress 无 eview-react 对应（handwrite-templates.md §9）
// 支持 line / circle 两种形态；色值用源项目 CSS 变量，不写死。
export default function AppProgress({
  type = "line",
  percent = 0,
  strokeColor = "var(--primary)",
  showInfo = true,
  size,
  format,
  style,
  className = "",
}) {
  const p = Math.min(100, Math.max(0, percent));
  const color = strokeColor || "var(--primary)";
  const label = typeof format === "function" ? format(p) : `${p}%`;

  if (type === "circle") {
    const dim = typeof size === "number" ? size : 88;
    const stroke = Math.max(4, Math.round(dim / 10));
    const r = (dim - stroke) / 2;
    const c = 2 * Math.PI * r;
    const offset = c - (p / 100) * c;
    return (
      <div className={`app-progress app-progress--circle ${className}`} style={{ width: dim, height: dim, ...style }}>
        <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`}>
          <circle cx={dim / 2} cy={dim / 2} r={r} fill="none" strokeWidth={stroke} className="app-progress__track" />
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${dim / 2} ${dim / 2})`}
            className="app-progress__bar"
          />
        </svg>
        {showInfo ? <span className="app-progress__num">{label}</span> : null}
      </div>
    );
  }

  const height = size === "small" ? 6 : 8;
  return (
    <div className={`app-progress app-progress--line ${className}`} style={style}>
      <div className="app-progress__outer" style={{ height }}>
        <div className="app-progress__bar" style={{ width: `${p}%`, background: color }} />
      </div>
      {showInfo ? <span className="app-progress__num">{label}</span> : null}
    </div>
  );
}
