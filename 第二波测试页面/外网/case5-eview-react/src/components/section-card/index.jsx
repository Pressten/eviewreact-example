// Layer 3: 通用区块容器 — 周报 9 区块的统一卡片骨架（编号 + 标题 + 副标题 + 操作区）
import "./index.css";

export default function SectionCard({ index, title, subtitle, action, className, children }) {
  return (
    <section className={["report-section", className].filter(Boolean).join(" ")}>
      <header className="section-head">
        <div className="section-title-wrap">
          <div className="section-title-row">
            {index ? <span className="section-index">{index}</span> : null}
            <h3 className="section-title">{title}</h3>
          </div>
          {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
        </div>
        {action ? <div className="section-action">{action}</div> : null}
      </header>
      {children}
    </section>
  );
}
