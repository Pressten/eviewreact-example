// 内容卡片容器（Level 1 悬浮面：标题 + 工具区 + 内容体）
// 卡片容器 eview-react 暂无完全匹配的 Reference（Panel 偏折叠分组），
// 按 fallback-handwrite 第三层用原生语义标签 + 业务样式实现。
function PanelCard({ title, subtitle, extra, children, className, bodyClassName }) {
  const rootClass = className ? 'panel-card ' + className : 'panel-card';
  const bodyClass = bodyClassName ? 'panel-card__body ' + bodyClassName : 'panel-card__body';
  return (
    <section className={rootClass}>
      {title || extra ? (
        <header className="panel-card__header">
          <div className="panel-card__titles">
            <h2 className="panel-card__title">{title}</h2>
            {subtitle ? <span className="panel-card__subtitle">{subtitle}</span> : null}
          </div>
          {extra ? <div className="panel-card__extra">{extra}</div> : null}
        </header>
      ) : null}
      <div className={bodyClass}>{children}</div>
    </section>
  );
}

export default PanelCard;
