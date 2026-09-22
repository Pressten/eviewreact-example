// TODO(eview-react): Descriptions 无对应组件，手写键值详情块。
// props: items=[{label, value, span=1}], columns, bordered, title, className
// 用 CSS grid：columns 列，每列 label+value 两格；span 控制跨几格（每格=2 个 grid 单元）。
export default function KeyValueList({ items, columns = 2, bordered, title, className = "" }) {
  return (
    <div className={`app-kvl ${bordered ? "app-kvl-bordered" : ""} ${className}`.trim()}>
      {title ? <div className="app-kvl-title">{title}</div> : null}
      <dl
        className="app-kvl-grid"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr) auto)` }}
      >
        {items.map((it, i) => {
          const span = it.span || 1;
          return (
            <div
              key={i}
              className="app-kvl-cell"
              style={{ gridColumn: `span ${span * 2}` }}
            >
              <dt className="app-kvl-label">{it.label}</dt>
              <dd className="app-kvl-value">{it.value ?? "—"}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
