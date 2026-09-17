import { FormattedMessage } from "react-intl";
import "./status-tag.css";

// Layer 3: 设备状态标签 — status 取 online / offline / alarm / upgrading / disabled
// TODO(eview-react): 源项目的运行时 fetch 图标不可用,状态图标退化去除,仅保留文字
const STATUS_FALLBACK = {
  online: "Online",
  offline: "Offline",
  alarm: "Alarm",
  upgrading: "Upgrading",
  disabled: "Disabled",
};

export default function StatusTag({ status }) {
  return (
    <span className={"status-tag status-tag-" + status}>
      <span className="status-tag-text">
        <FormattedMessage
          id={"status." + status}
          defaultMessage={STATUS_FALLBACK[status] || status}
        />
      </span>
    </span>
  );
}
