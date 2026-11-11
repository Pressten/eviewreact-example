// TODO(eview-ui): Badge 无对应，手写徽标（模板见 handwrite-templates.md §4）
// 样式用源项目 CSS 变量；类名用业务前缀；count=0 时不渲染徽标。
import { Fragment } from "react";

// count: 数字；max: 溢出阈值（原 overflowCount）；dot: 仅圆点；
// children: 被包裹元素（有 children 时绝对定位浮于右上角，无 children 时内联展示）；
// offset: [top, right] 偏移（仅有 children 时生效）；color: 徽标底色（默认 error）。
export default function AppBadge({
  count,
  max = 99,
  dot = false,
  children,
  offset = [0, 0],
  color = "var(--error, #d93026)",
}) {
  const overflow = typeof count === "number" && count > max;
  const content = dot ? "" : overflow ? `${max}+` : count;
  const supStyle = {
    minWidth: dot ? "8px" : "18px",
    height: dot ? "8px" : "18px",
    padding: dot ? 0 : "0 5px",
    borderRadius: dot ? "50%" : "9px",
    background: color,
    color: "#fff",
    fontSize: "12px",
    lineHeight: "18px",
    textAlign: "center",
    boxSizing: "border-box",
  };
  if (!children) {
    return count !== 0 ? (
      <sup style={{ ...supStyle, display: "inline-block", verticalAlign: "middle" }}>{content}</sup>
    ) : null;
  }
  return (
    <span style={{ position: "relative", display: "inline-flex" }}>
      {children}
      {count !== 0 && (
        <sup style={{ ...supStyle, position: "absolute", top: offset[0], right: offset[1] }}>{content}</sup>
      )}
    </span>
  );
}
