import "./index.css";

// 手写补位 — antd Timeline 无 eview-react Reference（导出名 TimeLine 存在但无文档）
// 节点 + 连线 + dot，色值用源项目 CSS 变量。
export default function AppTimeline({ items = [], className = "" }) {
  return (
    <ol className={`app-timeline ${className}`}>
      {items.map((node, i) => (
        <li className="app-timeline__item" key={i}>
          <span className="app-timeline__rail">
            <span className="app-timeline__dot" style={{ background: node.color || "var(--primary)" }} />
            {i < items.length - 1 ? <span className="app-timeline__line" /> : null}
          </span>
          <div className="app-timeline__content">{node.children}</div>
        </li>
      ))}
    </ol>
  );
}
