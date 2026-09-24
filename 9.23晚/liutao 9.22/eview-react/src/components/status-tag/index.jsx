import "./index.css";

// Layer 3: 可复用状态标签 — 跨页签通用(设备状态/告警级别)
const TONE_CLASS = {
  success: "status-tag--success",
  error: "status-tag--error",
  warning: "status-tag--warning",
  info: "status-tag--info",
  neutral: "status-tag--neutral",
};

export default function StatusTag({ text, tone = "neutral" }) {
  return (
    <span className={`status-tag ${TONE_CLASS[tone] || TONE_CLASS.neutral}`}>
      <span className="status-tag__dot" />
      {text}
    </span>
  );
}
