import "./index.css";

// 通用区块卡片：标题 + 图标 + 右侧操作区 + 内容区
export default function SectionCard({ icon, title, extra, children, className = "", bodyClassName = "", style }) {
  return (
    <section className={`sec-card ${className}`} style={style}>
      {(title || extra) && (
        <header className="sec-card-head">
          <div className="sec-card-title">
            {icon && icon}
            <h3>{title}</h3>
          </div>
          {extra && <div className="sec-card-extra">{extra}</div>}
        </header>
      )}
      <div className={`sec-card-body ${bodyClassName}`}>{children}</div>
    </section>
  );
}
