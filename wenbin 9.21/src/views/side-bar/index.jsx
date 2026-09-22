import Badge from "@nce/eview-react/Badge";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { useNotice } from "../../components/notice/index.jsx";
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
  const { notify } = useNotice();

  const handleMenu = (key) => {
    if (["audit", "access", "conf"].includes(key)) {
      notify("info", "演示入口：该模块即将上线，敬请期待");
      return;
    }
    setActiveMenu(key);
  };

  const mainItems = [
    { key: "overview", icon: "layout-dashboard", label: "数据概览" },
    { key: "management", icon: "database", label: "数据管理" },
    { key: "sync", icon: "refresh-cw", label: withBadge("数据同步", runningCount) },
    { key: "recycle", icon: "trash-2", label: withBadge("回收站", recycleItems.length) },
  ];

  const sysItems = [
    { key: "audit", icon: "file-text", label: "审计日志" },
    { key: "access", icon: "shield-check", label: "权限管理" },
    { key: "conf", icon: "settings", label: "系统设置" },
  ];

  return (
    <aside className={`sb-aside${sidebarCollapsed ? " collapsed" : ""}`}>
      <nav className="sb-menu">
        {mainItems.map((m) => (
          <button
            key={m.key}
            type="button"
            className={`sb-menu-item${activeMenu === m.key ? " active" : ""}`}
              onClick={() => handleMenu(m.key)}
            title={sidebarCollapsed ? (typeof m.label === "string" ? m.label : m.key) : undefined}
          >
            <span className="sb-menu-icon">
              <Icon name={m.icon} size={16} />
            </span>
            {!sidebarCollapsed ? <span className="sb-menu-text">{m.label}</span> : null}
          </button>
        ))}
        {!sidebarCollapsed ? <div className="sb-group-label">系统</div> : null}
        {sysItems.map((m) => (
          <button
            key={m.key}
            type="button"
            className={`sb-menu-item${activeMenu === m.key ? " active" : ""}`}
            onClick={() => handleMenu(m.key)}
            title={sidebarCollapsed ? m.label : undefined}
          >
            <span className="sb-menu-icon">
              <Icon name={m.icon} size={16} />
            </span>
            {!sidebarCollapsed ? <span className="sb-menu-text">{m.label}</span> : null}
          </button>
        ))}
      </nav>
      <button type="button" className="sb-collapse" onClick={toggleSidebar}>
        <Icon name={sidebarCollapsed ? "panel-left" : "chevrons-left"} size={16} />
        {!sidebarCollapsed && <span>收起侧栏</span>}
      </button>
    </aside>
  );
}
