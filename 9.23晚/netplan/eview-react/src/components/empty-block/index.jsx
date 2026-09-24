import Button from "@nce/eview-react/Button";
import { Icon } from "../../shared/icon.jsx";
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
        <Button className="empty-block-action" status="primary" text={actionText} onClick={onAction} />
      ) : null}
    </div>
  );
}
