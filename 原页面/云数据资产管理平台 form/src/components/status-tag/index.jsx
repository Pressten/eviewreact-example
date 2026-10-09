import { Tag } from "antd";
import { STATUS_META } from "../../mock/datasource.js";
import "./index.css";

// Layer 3: 运行状态标签 — 语义软色块 + 圆点
export default function StatusTag({ status }) {
  const meta = STATUS_META[status] || { label: status, tone: "neutral" };
  return (
    <Tag bordered={false} className={`status-tag status-tag--${meta.tone}`}>
      <span className="status-tag__dot" />
      {meta.label}
    </Tag>
  );
}
