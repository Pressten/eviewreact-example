import { typeMeta } from "../../mock/drive.jsx";
import "./index.css";

// 文件类型图标 — 类型映射图标 + 数据分类色（consistent mapping）
export default function FileTypeIcon({ type, size = "1.5rem", rounded = true }) {
  const meta = typeMeta[type] || typeMeta.doc;
  const IconComp = meta.icon;
  return (
    <span className={`file-type-icon ft-${type}${rounded ? " ft-rounded" : ""}`}>
      <IconComp iconSize={size} iconColor={['currentcolor']} />
    </span>
  );
}
