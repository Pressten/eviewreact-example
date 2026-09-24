import { Button } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

// Layer 3: 空数据占位块（token 着色，用于表格 emptyText 与空区块）
export default function EmptyBlock({ icon = "inbox", title = "暂无数据", desc, actionText, onAction, compact }) {
  return (
    <div className={"empty-block" + (compact ? " is-compact" : "")}>
      <span className="empty-block-icon">
        <Icon name={icon} size={compact ? 24 : 32} strokeWidth={1.5} />
      </span>
      <p className="empty-block-title">{title}</p>
      {desc ? <p className="empty-block-desc">{desc}</p> : null}
      {actionText ? (
        <Button className="empty-block-action" type="primary" onClick={onAction}>
          {actionText}
        </Button>
      ) : null}
    </div>
  );
}
