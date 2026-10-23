import "./index.css";

// 通用区块容器:标题 + 图标 + 右侧操作区 + 内容区
export default function SectionCard({ title, icon, extra, children, className, bodyClassName }) {
  return (
    <section className={`section-card ${className || ""}`}>
      <header className="section-card-head">
        <div className="section-card-title">
          {icon && icon}
          <h3 className="section-card-name">{title}</h3>
        </div>
        {extra && <div className="section-card-extra">{extra}</div>}
      </header>
      <div className={`section-card-body ${bodyClassName || ""}`}>{children}</div>
    </section>
  );
}
