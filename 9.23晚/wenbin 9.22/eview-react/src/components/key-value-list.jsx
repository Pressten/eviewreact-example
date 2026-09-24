// TODO(eview-react): Descriptions 未覆盖，当前手写键值详情块。
// 用法：<KeyValueList title="基本信息" column={2} bordered items={[{label,value,span}]} />

export default function KeyValueList({ title, column = 2, items = [], bordered, size }) {
  const pad = size === "small" ? "6px 12px" : "8px 12px";
  return (
    <div className="app-kvlist">
      {title ? (
        <div
          style={{
            font: "var(--font-headline-s)",
            fontWeight: "var(--font-weight-semibold)",
            color: "var(--on-surface)",
            marginBottom: "8px",
          }}
        >
          {title}
        </div>
      ) : null}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${column}, minmax(0, 1fr))`,
          border: bordered ? "1px solid var(--divider)" : "none",
          borderRadius: "var(--radius-base)",
          overflow: "hidden",
        }}
      >
        {items.map((it, i) => (
          <div
            key={i}
            style={{
              gridColumn: it.span ? `span ${it.span}` : undefined,
              display: "flex",
              borderBottom: bordered ? "1px solid var(--divider)" : "none",
              borderRight: bordered ? "1px solid var(--divider)" : "none",
              background: "var(--surface-container-highest)",
            }}
          >
            <div
              style={{
                background: "var(--color-table-header)",
                padding: pad,
                color: "var(--on-surface-variant)",
                fontSize: "var(--font-size-md)",
                whiteSpace: "nowrap",
                flex: "0 0 auto",
                minWidth: "96px",
              }}
            >
              {it.label}
            </div>
            <div
              style={{
                padding: pad,
                color: "var(--on-surface)",
                fontSize: "var(--font-size-md)",
                flex: 1,
                minWidth: 0,
              }}
            >
              {it.value ?? "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
