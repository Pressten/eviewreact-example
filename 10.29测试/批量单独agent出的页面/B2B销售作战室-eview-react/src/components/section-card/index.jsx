import "./index.css";

// 通用区块卡片容器 — 标题 + 图标 + 右侧操作区 + 内容区
export default function SectionCard({ title, icon, iconColor, extra, children, className, bodyClassName, accent }) {
  return (
    <section className={`sec-card ${className || ""}`}>
      <header className="sec-card__head">
        <div className="sec-card__title">
          {accent && <span className="sec-card__accent" style={{ background: accent }} />}
          {icon && icon}
          <h3>{title}</h3>
        </div>
        {extra && <div className="sec-card__extra">{extra}</div>}
      </header>
      <div className={`sec-card__body ${bodyClassName || ""}`}>{children}</div>
    </section>
  );
}
