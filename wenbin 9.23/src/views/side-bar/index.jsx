import Badge from "@nce/eview-react/Badge";
import { Icon } from "../../shared/icon.jsx";
import { useToast } from "../../shared/feedback.jsx";
import { useApp } from "../../context.jsx";
import { seedTasks } from "../../mock/dataset.js";
import "./index.css";

const runningCount = seedTasks.filter((t) => t.status === "running").length;

function withBadge(label, count) {
  return (
    <span className="sb-item-label">
      {label}
      {count > 0 ? <Badge content={count} className="sb-badge" /> : null}
    </span>
  );
}

export default function SideBar() {
  const { activeMenu, setActiveMenu, sidebarCollapsed, toggleSidebar, recycleItems } = useApp();
  const [toastNode, notify] = useToast();

  const handleMenu = (key) => {
    if (["audit", "access", "conf"].includes(key)) {
      notify.info("演示入口：该模块即将上线，敬请期待");
      return;
    }
    setActiveMenu(key);
  };

  const items = [
    { key: "overview", icon: <Icon name="layout-dashboard" size={16} />, label: "数据概览" },
    { key: "management", icon: <Icon name="database" size={16} />, label: "数据管理" },
    { key: "sync", icon: <Icon name="refresh-cw" size={16} />, label: withBadge("数据同步", runningCount) },
    { key: "recycle", icon: <Icon name="trash-2" size={16} />, label: withBadge("回收站", recycleItems.length) },
    {
      type: "group",
      label: "系统",
      children: [
        { key: "audit", icon: <Icon name="file-text" size={16} />, label: "审计日志" },
        { key: "access", icon: <Icon name="shield-check" size={16} />, label: "权限管理" },
        { key: "conf", icon: <Icon name="settings" size={16} />, label: "系统设置" },
      ],
    },
  ];

  return (
    <aside className={`sb-aside${sidebarCollapsed ? " collapsed" : ""}`}>
      {toastNode}
      <nav className="sb-menu" style={{ flex: 1, minWidth: 0 }}>
        {items.map((m) => {
          if (m.type === "group") {
            return (
              <div key="sb-group-system" className="sb-group">
                {!sidebarCollapsed && <label className="sb-group-label">{m.label}</label>}
                {m.children.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    className={`sb-menu-item${activeMenu === c.key ? " active" : ""}`}
                    onClick={() => handleMenu(c.key)}
                  >
                    {c.icon}
                    {!sidebarCollapsed && c.label}
                  </button>
                ))}
              </div>
            );
          }
          return (
            <button
              key={m.key}
              type="button"
              className={`sb-menu-item${activeMenu === m.key ? " active" : ""}`}
              onClick={() => handleMenu(m.key)}
            >
              {m.icon}
              {!sidebarCollapsed && m.label}
            </button>
          );
        })}
      </nav>
      <button type="button" className="sb-collapse" onClick={toggleSidebar}>
        <Icon name={sidebarCollapsed ? "panel-left" : "chevrons-left"} size={16} />
        {!sidebarCollapsed && <span>收起侧栏</span>}
      </button>
    </aside>
  );
}
