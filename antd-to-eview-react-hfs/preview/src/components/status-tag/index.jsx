import { Icon } from "../../shared/icon.jsx";
import { STATUS_MAP } from "../../mock/device.js";
import "./index.css";

// 状态软徽标:语义色文字 + 对应容器底色,深浅色随 token 自动翻转
export default function StatusTag({ status }) {
  const meta = STATUS_MAP[status] || STATUS_MAP.offline;
  return (
    <span className={"status-tag status-tag-" + meta.tone}>
      <Icon name={meta.icon} size={12} />
      {meta.label}
    </span>
  );
}
