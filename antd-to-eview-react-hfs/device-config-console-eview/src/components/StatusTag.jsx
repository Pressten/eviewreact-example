import { FormattedMessage } from "react-intl";
import { Icon } from "../../assets/shared/icons.js";
import "./status-tag.css";

// Layer 3: 设备状态标签 — status 取 online / offline / alarm / upgrading / disabled
const STATUS_ICON = {
  online: "circle-check",
  offline: "circle-x",
  alarm: "triangle-alert",
  upgrading: "rotate-ccw",
  disabled: "power",
};

const STATUS_FALLBACK = {
  online: "Online",
  offline: "Offline",
  alarm: "Alarm",
  upgrading: "Upgrading",
  disabled: "Disabled",
};

export default function StatusTag({ status }) {
  const icon = STATUS_ICON[status] || "circle-alert";
  return (
    <span className={"status-tag status-tag-" + status}>
      <span className="status-tag-icon">
        <Icon name={icon} size={12} />
      </span>
      <span className="status-tag-text">
        <FormattedMessage
          id={"status." + status}
          defaultMessage={STATUS_FALLBACK[status] || status}
        />
      </span>
    </span>
  );
}
