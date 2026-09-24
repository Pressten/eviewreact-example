import React from "react";
import "./index.css";

// TODO(eview-react): Descriptions 无对应组件,当前手写键值详情块(参考 handwrite-templates.md §3)
// 对齐 antd Descriptions bordered column={n} 的带边框网格视觉。
function KeyValueList({ items, columns = 2 }) {
  return (
    <dl
      className="key-value-list"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {items.map((it) => (
        <React.Fragment key={it.label}>
          <dt className="key-value-list__label">{it.label}</dt>
          <dd className="key-value-list__value">{it.value ?? "—"}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

export default KeyValueList;
