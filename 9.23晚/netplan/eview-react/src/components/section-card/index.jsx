import "./index.css";

// Layer 3: 通用区块容器（白面板内的分组，非独立卡片）
export default function SectionCard({ title, subtitle, extra, children, className }) {
  return (
    <section className={"section-card" + (className ? " " + className : "")}>
      <header className="section-card-head">
        <div className="section-card-heading">
          <h2 className="section-card-title">{title}</h2>
          {subtitle ? <p className="section-card-subtitle">{subtitle}</p> : null}
        </div>
        {extra ? <div className="section-card-extra">{extra}</div> : null}
      </header>
      <div className="section-card-body">{children}</div>
    </section>
  );
}
