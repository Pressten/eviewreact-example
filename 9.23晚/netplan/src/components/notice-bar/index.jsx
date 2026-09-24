import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

// Layer 3: 告警 / 提示块（token 着色，无左侧色条）
const NOTICE_META = {
  warning: { icon: "triangle-alert", className: "is-warning" },
  error: { icon: "circle-alert", className: "is-error" },
  info: { icon: "info", className: "is-info" },
  success: { icon: "circle-check", className: "is-success" },
};

export default function NoticeBar({ type, title, desc }) {
  const meta = NOTICE_META[type] || NOTICE_META.info;
  return (
    <div className={"notice-bar " + meta.className}>
      <span className="notice-icon">
        <Icon name={meta.icon} size={16} />
      </span>
      <div className="notice-content">
        <p className="notice-title">{title}</p>
        {desc ? <p className="notice-desc">{desc}</p> : null}
      </div>
    </div>
  );
}
