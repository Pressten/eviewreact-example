import Badge from "@nce/eview-react/Badge";
import { Icon } from "../../shared/icon.jsx";
import { useToast } from "../../shared/toast.jsx";
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
  const toast = useToast();

  const handleMenu = (key) => {
    if (["audit", "access", "conf"].includes(key)) {
      toast.info("演示入口：该模块即将上线，敬请期待");
      return;
    }
    setActiveMenu(key);
  };

  const mainItems = [
    { key: "overview", icon: <Icon name="layout-dashboard" size={16} />, label: "数据概览", badge: 0 },
    { key: "management", icon: <Icon name="database" size={16} />, label: "数据管理", badge: 0 },
    { key: "sync", icon: <Icon name="refresh-cw" size={16} />, label: "数据同步", badge: runningCount },
    { key: "recycle", icon: <Icon name="trash-2" size={16} />, label: "回收站", badge: recycleItems.length },
  ];

  const sysItems = [
    { key: "audit", icon: <Icon name="file-text" size={16} />, label: "审计日志" },
    { key: "access", icon: <Icon name="shield-check" size={16} />, label: "权限管理" },
    { key: "conf", icon: <Icon name="settings" size={16} />, label: "系统设置" },
  ];

  const renderItem = (m) => (
    <button
      key={m.key}
      type="button"
      className={`sb-menu-item${activeMenu === m.key ? " active" : ""}`}
      onClick={() => handleMenu(m.key)}
    >
      <span className="sb-menu-icon">{m.icon}</span>
      {!sidebarCollapsed ? withBadge(m.label, m.badge) : null}
    </button>
  );

  return (
    <aside className={`sb-aside${sidebarCollapsed ? " collapsed" : ""}`}>
      <nav className="sb-nav">
        {mainItems.map(renderItem)}
        <div className="sb-group-label">{!sidebarCollapsed ? "系统" : ""}</div>
        {sysItems.map(renderItem)}
      </nav>
      <button type="button" className="sb-collapse" onClick={toggleSidebar}>
        <Icon name={sidebarCollapsed ? "panel-left" : "chevrons-left"} size={16} />
        {!sidebarCollapsed && <span>收起侧栏</span>}
      </button>
    </aside>
  );
}
