import Badge from "@nce/eview-react/Badge";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { seedTasks } from "../../mock/dataset.js";
import { message } from "../../shared/message.jsx";
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

  const handleMenu = (key) => {
    if (["audit", "access", "conf"].includes(key)) {
      message.info("演示入口：该模块即将上线，敬请期待");
      return;
    }
    setActiveMenu(key);
  };

  const renderItem = (m) => (
    <button
      key={m.key}
      type="button"
      className={`sb-menu-item${activeMenu === m.key ? " active" : ""}`}
      onClick={() => handleMenu(m.key)}
      title={sidebarCollapsed ? m.labelText : undefined}
    >
      <span className="sb-menu-icon">{m.icon}</span>
      {!sidebarCollapsed ? <span className="sb-menu-text">{m.label}</span> : null}
    </button>
  );

  const items = [
    { key: "overview", icon: <Icon name="layout-dashboard" size={16} />, label: "数据概览", labelText: "数据概览" },
    { key: "management", icon: <Icon name="database" size={16} />, label: "数据管理", labelText: "数据管理" },
    { key: "sync", icon: <Icon name="refresh-cw" size={16} />, label: withBadge("数据同步", runningCount), labelText: "数据同步" },
    { key: "recycle", icon: <Icon name="trash-2" size={16} />, label: withBadge("回收站", recycleItems.length), labelText: "回收站" },
  ];

  const systemItems = [
    { key: "audit", icon: <Icon name="file-text" size={16} />, label: "审计日志", labelText: "审计日志" },
    { key: "access", icon: <Icon name="shield-check" size={16} />, label: "权限管理", labelText: "权限管理" },
    { key: "conf", icon: <Icon name="settings" size={16} />, label: "系统设置", labelText: "系统设置" },
  ];

  return (
    <aside className={`sb-aside${sidebarCollapsed ? " collapsed" : ""}`}>
      <nav className="sb-menu">
        {items.map(renderItem)}
        <div className="sb-menu-group">
          {!sidebarCollapsed ? <div className="sb-menu-group-label">系统</div> : null}
          {systemItems.map(renderItem)}
        </div>
      </nav>
      <button type="button" className="sb-collapse" onClick={toggleSidebar}>
        <Icon name={sidebarCollapsed ? "panel-left" : "chevrons-left"} size={16} />
        {!sidebarCollapsed && <span>收起侧栏</span>}
      </button>
    </aside>
  );
}
