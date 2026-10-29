import "./Timeline.css";

// Timeline — 手写时间轴（antd Timeline 在 eview-react 无对应 Reference，导出名 TimeLine 无文档）
// 兼容 antd Timeline items API：{ key, color, children }
// color 支持 green/gray/red/blue（语义色 token 映射）
export default function Timeline({ className, items = [] }) {
  return (
    <div className={`tl ${className || ""}`}>
      {items.map((it, i) => (
        <div className="tl-item" key={it.key || i}>
          <div className={`tl-dot tl-dot-${it.color || "gray"}`} />
          <div className="tl-content">{it.children}</div>
        </div>
      ))}
    </div>
  );
}
