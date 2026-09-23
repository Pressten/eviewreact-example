import { useState } from "react";
import Badge from "@nce/eview-react/Badge";
import DivMessage from "@nce/eview-react/DivMessage";
import { Icon } from "../../shared/icon.jsx";
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
  const [notice, setNotice] = useState(null);
  const notify = (type, text) => setNotice({ key: Date.now(), type, text });

  const handleMenu = (key) => {
    if (["audit", "access", "conf"].includes(key)) {
      notify("default", "演示入口：该模块即将上线，敬请期待");
      return;
    }
    setActiveMenu(key);
  };

  const mainItems = [
    { key: "overview", icon: <Icon name="layout-dashboard" size={16} />, label: "数据概览" },
    { key: "management", icon: <Icon name="database" size={16} />, label: "数据管理" },
    { key: "sync", icon: <Icon name="refresh-cw" size={16} />, label: withBadge("数据同步", runningCount) },
    { key: "recycle", icon: <Icon name="trash-2" size={16} />, label: withBadge("回收站", recycleItems.length) },
  ];

  const sysItems = [
    { key: "audit", icon: <Icon name="file-text" size={16} />, label: "审计日志" },
    { key: "access", icon: <Icon name="shield-check" size={16} />, label: "权限管理" },
    { key: "conf", icon: <Icon name="settings" size={16} />, label: "系统设置" },
  ];

  const renderItem = (it) => (
    <button
      key={it.key}
      type="button"
      className={`app-sb-item${activeMenu === it.key ? " active" : ""}`}
      onClick={() => handleMenu(it.key)}
    >
      <span className="app-sb-icon">{it.icon}</span>
      {!sidebarCollapsed ? <span className="app-sb-text">{it.label}</span> : null}
    </button>
  );

  return (
    <aside className={`sb-aside${sidebarCollapsed ? " collapsed" : ""}`}>
      <nav className="app-sb-nav">
        {mainItems.map(renderItem)}
        {!sidebarCollapsed ? <div className="app-sb-group-label">系统</div> : null}
        {sysItems.map(renderItem)}
      </nav>
      <button type="button" className="sb-collapse" onClick={toggleSidebar}>
        <Icon name={sidebarCollapsed ? "panel-left" : "chevrons-left"} size={16} />
        {!sidebarCollapsed && <span>收起侧栏</span>}
      </button>
      {notice ? (
        <DivMessage
          key={notice.key}
          display
          type={notice.type}
          text={notice.text}
          disposeTimeOut={3000}
          onClose={() => setNotice(null)}
          style={{ position: "absolute", top: 8, left: 8, right: 8, zIndex: 12 }}
        />
      ) : null}
    </aside>
  );
}
