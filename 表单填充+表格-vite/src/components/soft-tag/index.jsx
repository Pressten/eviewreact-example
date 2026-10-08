// Layer 3: 通用软色标签（状态 / 属性标记）
import { Icon } from "../../assets/shared/icon.jsx";
import "./index.css";

export default function SoftTag({ tone, icon, children }) {
  return (
    <span className={`soft-tag soft-tag--${tone || "neutral"}`}>
      {icon ? <Icon name={icon} size="0.75rem" /> : null}
      <span>{children}</span>
    </span>
  );
}
