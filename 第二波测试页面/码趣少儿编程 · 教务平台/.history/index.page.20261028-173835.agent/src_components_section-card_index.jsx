import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

// Layer 3: 通用区块容器（标题 + 副标题 + 右侧操作槽 + 主体）
export default function SectionCard({ title, subtitle, icon, accent, actions, children, bodyClass }) {
  return (
    <section className={`section-card${accent ? ` is-${accent}` : ""}`}>
      <header className="section-card-head">
        <div className="section-card-title">
          {icon && <Icon name={icon} size="1rem" />}
          <span className="section-card-name">{title}</span>
          {subtitle && <span className="section-card-sub">{subtitle}</span>}
        </div>
        {actions && <div className="section-card-actions">{actions}</div>}
      </header>
      <div className={`section-card-body${bodyClass ? ` ${bodyClass}` : ""}`}>{children}</div>
    </section>
  );
}
