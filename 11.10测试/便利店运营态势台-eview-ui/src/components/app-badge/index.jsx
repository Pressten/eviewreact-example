// TODO(eview-ui): Badge 无对应（eview-ui 无徽标组件），按 handwrite-templates.md §4 手写补位。
// 样式沿用源项目 token CSS 变量（随 .dark 轨自动翻转暗色）。
export default function AppBadge({ count, max = 99, dot = false, children, offset = [0, 0], style, title }) {
  const overflow = typeof count === "number" && count > max;
  const content = dot ? "" : overflow ? `${max}+` : count;
  const show = dot ? true : typeof count === "number" ? count !== 0 : !!count;
  return (
    <span style={{ position: "relative", display: "inline-flex", ...style }} title={title}>
      {children}
      {show && (
        <sup
          style={{
            position: "absolute",
            top: offset[0],
            right: offset[1],
            minWidth: dot ? "8px" : "18px",
            height: dot ? "8px" : "18px",
            padding: dot ? 0 : "0 5px",
            borderRadius: dot ? "50%" : "9px",
            background: "var(--error)",
            color: "#fff",
            fontSize: "12px",
            lineHeight: "18px",
            textAlign: "center",
            boxSizing: "border-box",
            pointerEvents: "none",
          }}
        >
          {content}
        </sup>
      )}
    </span>
  );
}
