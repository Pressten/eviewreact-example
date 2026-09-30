import Tag from "@nce/eview-react/Tag";
import { STATUS_META } from "../../mock/datasource.js";
import "./index.css";

// Layer 3: 运行状态标签 — 语义软色块 + 圆点
// antd Tag(bordered=false) → eview Tag(color 语义色映射，fill=solid 默认无描边)
const TONE_COLOR = {
  success: "success",
  error: "danger",
  warning: "warning",
  info: "primary",
  neutral: "default",
};

export default function StatusTag({ status }) {
  const meta = STATUS_META[status] || { label: status, tone: "neutral" };
  return (
    <Tag color={TONE_COLOR[meta.tone] ?? "default"} className={`status-tag status-tag--${meta.tone}`}>
      <span className="status-tag__dot" />
      {meta.label}
    </Tag>
  );
}
