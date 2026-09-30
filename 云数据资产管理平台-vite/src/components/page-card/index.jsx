import "./index.css";

// Layer 3: 内容卡片容器 — Level 1 抬升容器(阴影不叠加边框)
export default function PageCard({ title, subtitle, extra, className = "", bodyClassName = "", children }) {
  return (
    <section className={`page-card ${className}`}>
      {(title || extra) && (
        <header className="page-card__head">
          <div className="page-card__heading">
            {title && <h3 className="page-card__title">{title}</h3>}
            {subtitle && <span className="page-card__subtitle">{subtitle}</span>}
          </div>
          {extra && <div className="page-card__extra">{extra}</div>}
        </header>
      )}
      <div className={`page-card__body ${bodyClassName}`}>{children}</div>
    </section>
  );
}
