import { Tag } from "antd";
import { shareMeta } from "../../mock/drive.js";
import "./index.css";

// 共享状态标签 — 私有/共享/公开链接，token 驱动软色
export default function ShareStatusTag({ status }) {
  const meta = shareMeta[status] || shareMeta.private;
  return (
    <Tag className={`share-tag share-tag--${meta.tone}`} bordered>
      {meta.label}
    </Tag>
  );
}
