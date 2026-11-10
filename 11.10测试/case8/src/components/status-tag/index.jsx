import { Tag } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { STATUS_META } from "../../mock/flight.js";
import "./index.css";

// 航班状态 Tag —— 7 种状态统一色规范:
// 正常类: 计划=中性 / 登机中=info / 已起飞=success 软底 / 已到达=success 实底
// 不正常类: 延误=warning / 备降=critical / 取消=error
export default function StatusTag({ status, showIcon = true }) {
  const meta = STATUS_META[status] || { label: status };
  return (
    <Tag className={`flight-status flight-status-${status}`} bordered={false}>
      {showIcon && meta.icon ? <Icon name={meta.icon} size="0.75rem" /> : null}
      <span>{meta.label}</span>
    </Tag>
  );
}
