import "./index.css";

// Layer 3: 状态标签 — 软色底 + 语义色文字
export default function StatusTag({ text, tone = "info" }) {
  return (
    <span className={"status-tag status-tag--" + tone}>
      <span className="status-tag__dot" />
      <span className="status-tag__text">{text}</span>
    </span>
  );
}
