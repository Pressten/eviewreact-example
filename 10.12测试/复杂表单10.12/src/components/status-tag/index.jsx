// Layer 3: 状态文本标记（soft 语义色，token 驱动，暗色自动翻转）
import { STATUS_DICT } from "../../mock/operator.js";
import "./index.css";

export default function StatusTag({ status }) {
  const cfg = STATUS_DICT[status] || { text: status, tone: "none" };
  return (
    <span className={`status-tag status-tag--${cfg.tone}`}>
      <span className="status-tag__dot" />
      {cfg.text}
    </span>
  );
}
