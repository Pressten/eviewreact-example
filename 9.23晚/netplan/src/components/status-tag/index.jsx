import "./index.css";

// Layer 3: 状态标签（软底 + 语义文字色，全部走 token，暗色自动翻转）
const STATUS_TONE = {
  success: "is-success",
  warning: "is-warning",
  error: "is-error",
  info: "is-info",
  neutral: "is-neutral",
};

const STATUS_MAP = {
  使用中: "success",
  已绑定: "success",
  规划中: "info",
  已保留: "info",
  待确认: "warning",
  冲突: "error",
  空闲: "neutral",
  已释放: "neutral",
};

export default function StatusTag({ status, tone }) {
  const finalTone = tone || STATUS_MAP[status] || "neutral";
  return <span className={"status-tag " + STATUS_TONE[finalTone]}>{status}</span>;
}
