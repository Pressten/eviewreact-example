// 手写补位：antd Progress → eview-react 无对应（见 handwrite-templates.md §9）
// 最小可用进度条，色值沿用源项目 token 体系（CSS 变量），不写死色值。
export default function SimpleProgress({ percent, status = "normal", showLabel = true }) {
  const color =
    status === "error"
      ? "var(--error, #E02128)"
      : status === "success"
        ? "var(--success, #62B42E)"
        : "var(--primary, #0067D1)";
  const p = Math.min(100, Math.max(0, percent || 0));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
      <div
        style={{
          flex: 1,
          height: "8px",
          background: "var(--hover, rgba(0,0,0,0.05))",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div style={{ width: `${p}%`, height: "100%", background: color, transition: "width .2s" }} />
      </div>
      {showLabel ? (
        <span style={{ color: "var(--on-surface-variant, #777)", minWidth: "40px", textAlign: "right" }}>{p}%</span>
      ) : null}
    </div>
  );
}
