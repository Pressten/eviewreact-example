import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

// Layer 3: 通用区块卡片 — 标题 + 图标 + 描述 + 内容
// id 用于左侧 Anchor 锚点定位与滚动联动高亮。
export default function SectionCard({ id, icon, title, description, children }) {
  return (
    <section id={id} className="section-card">
      <header className="section-card__head">
        <span className="section-card__icon">
          {icon && <Icon name={icon} size="1.25rem" />}
        </span>
        <div className="section-card__titles">
          <h2 className="section-card__title">{title}</h2>
          {description && <p className="section-card__desc">{description}</p>}
        </div>
      </header>
      <div className="section-card__body">{children}</div>
    </section>
  );
}
