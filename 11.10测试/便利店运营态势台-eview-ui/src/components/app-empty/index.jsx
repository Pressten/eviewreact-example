// TODO(eview-ui): Empty 无对应（eview-ui 无空状态组件），按 handwrite-templates.md §5 手写补位。
// 样式沿用源项目 token CSS 变量（随 .dark 轨自动翻转暗色）。图标用保留的 Icon shim。
import Icon from "@/shared/Icon";

export default function AppEmpty({ description = "暂无数据", icon = "inbox", style }) {
  return (
    <div
      className="app-empty"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        color: "var(--on-surface-variant)",
        ...style,
      }}
    >
      <Icon name={icon} size={48} />
      <p style={{ marginTop: "0.75rem", marginBottom: 0, fontSize: "0.875rem" }}>{description}</p>
    </div>
  );
}
