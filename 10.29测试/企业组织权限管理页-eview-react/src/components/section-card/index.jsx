import "./index.css";

// 鍖哄潡鍗＄墖 鈥?缁熶竴瀹瑰櫒锛氭爣棰樸€佸壇鏍囬銆佸彸涓婅鍔ㄤ綔鍖?export default function SectionCard({ title, subtitle, icon, action, children, className = "", bodyClassName = "" }) {
  return (
    <section className={`section-card ${className}`}>
      <header className="section-card__head">
        <div className="section-card__title-wrap">
          {icon && icon}
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
