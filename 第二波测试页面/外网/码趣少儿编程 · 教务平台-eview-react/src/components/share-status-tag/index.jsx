import Tag from "@/shared/Tag";
import { shareMeta } from "../../mock/drive.jsx";
import "./index.css";

// 共享状态标签 — 私有/共享/公开链接，色值走 antd Tag preset
export default function ShareStatusTag({ status }) {
  const meta = shareMeta[status] || shareMeta.private;
  return <Tag color={meta.color}>{meta.label}</Tag>;
}
