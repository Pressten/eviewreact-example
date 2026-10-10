import "./index.css";

// Layer 3: 状态标签 — 软色底 + 语义色文字 + 状态点
// tone: success | error | warning | neutral | disabled
export default function StatusTag({ tone = "neutral", children }) {
  return (
    <span className={"status-tag status-tag--" + tone}>
      <span className="status-tag__dot" aria-hidden="true" />
      {children}
    </span>
  );
}
