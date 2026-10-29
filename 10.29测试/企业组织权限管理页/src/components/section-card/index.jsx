import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

// 区块卡片 — 统一容器：标题、副标题、右上角动作区
export default function SectionCard({ title, subtitle, icon, action, children, className = "", bodyClassName = "" }) {
  return (
    <section className={`section-card ${className}`}>
      <header className="section-card__head">
        <div className="section-card__title-wrap">
          {icon && <Icon name={icon} size="1.25rem" className="section-card__icon" />}
          <div>
            <h3 className="section-card__title">{title}</h3>
            {subtitle && <p className="section-card__subtitle">{subtitle}</p>}
          </div>
        </div>
        {action && <div className="section-card__action">{action}</div>}
      </header>
      <div className={`section-card__body ${bodyClassName}`}>{children}</div>
    </section>
  );
}
