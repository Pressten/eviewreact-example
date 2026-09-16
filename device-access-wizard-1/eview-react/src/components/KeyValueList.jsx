import { Fragment } from 'react';

// TODO(eview-react): Descriptions 无对应组件，当前手写键值详情块
// 模板取自 handwrite-templates §3，样式见 app.css（.app-kvlist*）
export function KeyValueList({ items, columns = 2 }) {
  return (
    <dl className="app-kvlist" style={{ gridTemplateColumns: `repeat(${columns}, minmax(120px, auto) 1fr)` }}>
      {items.map((it) => (
        <Fragment key={it.label}>
          <dt className="app-kvlist-key">{it.label}</dt>
          <dd className="app-kvlist-val">{it.value ?? '—'}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
