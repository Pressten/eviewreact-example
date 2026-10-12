import "./index.css";

// 内容卡片外壳 — 标题 + 右上角操作区 + 主体
export default function SectionCard({ title, subtitle, extra, children, className = "", bodyClassName = "" }) {
  return (
    <section className={`section-card ${className}`}>
      <header className="section-card__head">
        <div className="section-card__titles">
          <h3 className="section-card__title">{title}</h3>
          {subtitle ? <span className="section-card__subtitle">{subtitle}</span> : null}
        </div>
        {extra ? <div className="section-card__extra">{extra}</div> : null}
      </header>
      <div className={`section-card__body ${bodyClassName}`}>{children}</div>
    </section>
  );
}
