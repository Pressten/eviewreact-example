import "./index.css";

// Layer 3: 通用分区卡片容器（表单区 / 表格区复用）
export default function SectionCard({ title, subtitle, extra, children }) {
  return (
    <section className="section-card">
      {title || extra ? (
        <header className="section-card__head">
          <div className="section-card__titles">
            {title ? <h2 className="section-card__title">{title}</h2> : null}
            {subtitle ? <p className="section-card__subtitle">{subtitle}</p> : null}
          </div>
          {extra ? <div className="section-card__extra">{extra}</div> : null}
        </header>
      ) : null}
      <div className="section-card__body">{children}</div>
    </section>
  );
}
