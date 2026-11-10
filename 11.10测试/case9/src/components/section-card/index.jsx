import { Icon } from "../../../assets/shared/icon.jsx";
import "./index.css";

// Layer 3 公共组件 — 区块卡片外壳（标题 + 右侧操作区 + 内容）
export default function SectionCard({ id, icon, title, extra, children, className, bodyClassName }) {
  return (
    <section id={id} className={`section-card ${className || ""}`}>
      <header className="section-card-head">
        <div className="section-card-title">
          {icon ? (
            <span className="sc-ico">
              <Icon name={icon} size="1rem" />
            </span>
          ) : null}
          <h3>{title}</h3>
        </div>
        {extra ? <div className="section-card-extra">{extra}</div> : null}
      </header>
      <div className={`section-card-body ${bodyClassName || ""}`}>{children}</div>
    </section>
  );
}
