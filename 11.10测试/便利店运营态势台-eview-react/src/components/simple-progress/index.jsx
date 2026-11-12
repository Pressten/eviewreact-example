// 手写简单进度条（antd Progress 无对应 eview-react 组件，按 handwrite-templates.md §8 SimpleProgress）
// 保留源 antd Progress 的 strokeColor / showInfo / format 行为
export default function SimpleProgress({ percent, color = "var(--primary)", showInfo = true, format, style }) {
  const p = Math.min(100, Math.max(0, Number(percent) || 0));
  const label = typeof format === "function" ? format(percent) : `${p}%`;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", ...style }}>
      <div
        style={{
          flex: 1,
          height: "8px",
          background: "var(--hover, rgba(0,0,0,0.05))",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${p}%`,
            height: "100%",
            background: color,
            transition: "width .2s",
          }}
        />
      </div>
      {showInfo ? (
        <span
          style={{
            color: "var(--on-surface-variant, #777)",
            minWidth: "40px",
            textAlign: "right",
          }}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}
