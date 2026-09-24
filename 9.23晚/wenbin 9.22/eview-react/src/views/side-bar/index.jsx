import Badge from "@nce/eview-react/Badge";
import { Icon } from "../../shared/icon.jsx";
import { message } from "../../shared/toast.jsx";
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

// TODO(eview-react): Menu 无对应 Reference，当前手写侧导航（支持图标/分组/选中/折叠）。
function SideMenu({ items, activeKey, collapsed, onSelect }) {
  return (
    <nav className="sb-menu">
      {items.map((it, i) => {
        if (it.type === "group") {
          return (
            <div key={`g-${i}`} className="sb-menu-group">
              {!collapsed ? <div className="sb-menu-group-title">{it.label}</div> : null}
              {(it.children || []).map((c) => (
                <button
                  key={c.key}
                  type="button"
                  className={`sb-menu-item${activeKey === c.key ? " active" : ""}`}
                  onClick={() => onSelect({ key: c.key })}
                  title={typeof c.label === "string" ? c.label : c.key}
                >
                  <span className="sb-menu-icon">{c.icon}</span>
                  {!collapsed ? <span className="sb-menu-text">{c.label}</span> : null}
                </button>
              ))}
            </div>
          );
        }
        return (
          <button
            key={it.key}
            type="button"
            className={`sb-menu-item${activeKey === it.key ? " active" : ""}`}
            onClick={() => onSelect({ key: it.key })}
            title={typeof it.label === "string" ? it.label : it.key}
          >
            <span className="sb-menu-icon">{it.icon}</span>
            {!collapsed ? <span className="sb-menu-text">{it.label}</span> : null}
          </button>
        );
      })}
    </nav>
  );
}

export default function SideBar() {
  const { activeMenu, setActiveMenu, sidebarCollapsed, toggleSidebar, recycleItems } = useApp();

  const handleMenu = ({ key }) => {
    if (["audit", "access", "conf"].includes(key)) {
      message.info("演示入口：该模块即将上线，敬请期待");
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
      <SideMenu
        items={items}
        activeKey={activeMenu}
        collapsed={sidebarCollapsed}
        onSelect={handleMenu}
      />
      <button type="button" className="sb-collapse" onClick={toggleSidebar}>
        <Icon name={sidebarCollapsed ? "panel-left" : "chevrons-left"} size={16} />
        {!sidebarCollapsed && <span>收起侧栏</span>}
      </button>
    </aside>
  );
}
