import Badge from "@nce/eview-react/Badge";
import { Icon } from "../../shared/icon.jsx";
import { useApp } from "../../context.jsx";
import { seedTasks } from "../../mock/dataset.js";
import { useNotice, NoticeBar } from "../../shared/ui-helpers.jsx";
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

const mainItems = [
  { key: "overview", icon: "layout-dashboard", label: "数据概览" },
  { key: "management", icon: "database", label: "数据管理" },
  { key: "sync", icon: "refresh-cw", label: "数据同步", badge: runningCount },
  { key: "recycle", icon: "trash-2", label: "回收站", badge: true },
];

const sysItems = [
  { key: "audit", icon: "file-text", label: "审计日志" },
  { key: "access", icon: "shield-check", label: "权限管理" },
  { key: "conf", icon: "settings", label: "系统设置" },
];

export default function SideBar() {
  const { activeMenu, setActiveMenu, sidebarCollapsed, toggleSidebar, recycleItems } = useApp();
  const { notice, notify, clear } = useNotice();

  const handleMenu = (key) => {
    if (["audit", "access", "conf"].includes(key)) {
      notify("default", "演示入口：该模块即将上线，敬请期待");
      return;
    }
    setActiveMenu(key);
  };

  const renderItem = (item) => (
    <button
      key={item.key}
      type="button"
      className={`sb-menu-item${activeMenu === item.key ? " active" : ""}`}
      onClick={() => handleMenu(item.key)}
    >
      <Icon name={item.icon} size={16} />
      {!sidebarCollapsed && (
        <span className="sb-item-label">
          {item.label}
          {item.badge === true ? (
            recycleItems.length > 0 ? <Badge content={recycleItems.length} className="sb-badge" /> : null
          ) : item.badge ? (
            <Badge content={item.badge} className="sb-badge" />
          ) : null}
        </span>
      )}
    </button>
  );

  return (
    <aside className={`sb-aside${sidebarCollapsed ? " collapsed" : ""}`}>
      <NoticeBar notice={notice} onClose={clear} />
      <nav className="sb-menu">
        {mainItems.map(renderItem)}
        {!sidebarCollapsed && <div className="sb-menu-group-label">系统</div>}
        {sysItems.map(renderItem)}
      </nav>
      <button type="button" className="sb-collapse" onClick={toggleSidebar}>
        <Icon name={sidebarCollapsed ? "panel-left" : "chevrons-left"} size={16} />
        {!sidebarCollapsed && <span>收起侧栏</span>}
      </button>
    </aside>
  );
}
