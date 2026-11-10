import "./index.css";

// 延误分钟数 —— 分级着色: >60 红 / >30 橙(告警黄级, 保证可读) / 其余默认强调
export default function DelayMinutes({ value }) {
  if (!value) return <span className="delay-min delay-min-zero">—</span>;
  const level = value > 60 ? "high" : value > 30 ? "mid" : "low";
  return <span className={`delay-min delay-min-${level}`}>+{value}</span>;
}
