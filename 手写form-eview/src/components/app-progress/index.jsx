import "./index.css";

// TODO(eview-react): Progress 无 eview-react 对应组件，当前手写最小可用版
// 线性进度条：antd Progress type="line"
export function AppProgress({ percent = 0, color = "var(--primary)", className = "", style }) {
  const p = Math.min(100, Math.max(0, percent));
  return (
    <div className={`app-progress ${className}`} style={style}>
      <div className="app-progress__track">
        <div
          className="app-progress__fill"
          style={{ width: `${p}%`, background: color }}
        />
      </div>
    </div>
  );
}

// 环形进度条：antd Progress type="circle"
export function AppProgressCircle({
  percent = 0,
  size = 88,
  color = "var(--primary)",
  children,
}) {
  const p = Math.min(100, Math.max(0, percent));
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (p / 100) * circ;
  return (
    <div
      className="app-progress-circle"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg width={size} height={size} className="app-progress-circle__svg">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="app-progress-circle__bg"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="app-progress-circle__bar"
        />
      </svg>
      {children ? (
        <div className="app-progress-circle__content">{children}</div>
      ) : null}
    </div>
  );
}

export default AppProgress;
