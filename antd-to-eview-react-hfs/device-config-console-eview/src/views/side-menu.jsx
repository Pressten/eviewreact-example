import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Icon } from "../icons.jsx";
import { useApp } from "../context.jsx";
import { sideMenuItems } from "../data.js";
import "./side-menu.css";

// Layer 4: 侧边导航 — 展开 248px / 折叠 48px,亮色底,折叠态保留图标与选中态
// TODO(eview-react): antd Layout.Sider + Menu(inline) 无 Reference,当前手写导航列表,
// 支持两级展开、选中态与折叠;不支持折叠态弹出子菜单。
function SideMenuNode({ node, collapsed, selected, onSelect, openKeys, toggleOpen }) {
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  const isOpen = openKeys.indexOf(node.key) >= 0;

  if (!hasChildren) {
    return (
      <button
        type="button"
        className={`app-sider-item ${selected === node.key ? "is-selected" : ""}`}
        title={collapsed ? node.fallback : undefined}
        onClick={() => onSelect(node.key)}
      >
        {node.icon ? (
          <span className="app-sider-item-icon">
            <Icon name={node.icon} size={16} />
          </span>
        ) : null}
        {!collapsed ? <span className="app-sider-item-label">{node.label}</span> : null}
      </button>
    );
  }

  return (
    <div className="app-sider-submenu">
      <button
        type="button"
        className={`app-sider-submenu-title ${isOpen ? "is-open" : ""}`}
        title={collapsed ? node.fallback : undefined}
        onClick={() => toggleOpen(node.key)}
        aria-expanded={isOpen}
      >
        {node.icon ? (
          <span className="app-sider-item-icon">
            <Icon name={node.icon} size={16} />
          </span>
        ) : null}
        {!collapsed ? (
          <>
            <span className="app-sider-item-label">{node.label}</span>
            <span className="app-sider-arrow">
              <Icon name="chevron-down" size={12} />
            </span>
          </>
        ) : null}
      </button>
      {!collapsed && isOpen ? (
        <div className="app-sider-sub">
          {node.children.map((child) => (
            <SideMenuNode
              key={child.key}
              node={child}
              collapsed={collapsed}
              selected={selected}
              onSelect={onSelect}
              openKeys={openKeys}
              toggleOpen={toggleOpen}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function SideMenu() {
  const { collapsed } = useApp();
  const [selected, setSelected] = useState("device-config");
  const [openKeys, setOpenKeys] = useState(["devices", "collection"]);

  const items = useMemo(
    () =>
      sideMenuItems.map((node) => ({
        ...node,
        label: <FormattedMessage id={node.msgId} defaultMessage={node.fallback} />,
        children: node.children
          ? node.children.map((child) => ({
              ...child,
              label: <FormattedMessage id={child.msgId} defaultMessage={child.fallback} />,
            }))
          : undefined,
      })),
    []
  );

  const toggleOpen = (key) =>
    setOpenKeys((prev) => (prev.indexOf(key) >= 0 ? prev.filter((k) => k !== key) : [...prev, key]));

  return (
    <aside className={`app-sider ${collapsed ? "is-collapsed" : ""}`}>
      <div className="app-sider-children">
        <nav className="app-sider-menu">
          {items.map((node) => (
            <SideMenuNode
              key={node.key}
              node={node}
              collapsed={collapsed}
              selected={selected}
              onSelect={setSelected}
              openKeys={openKeys}
              toggleOpen={toggleOpen}
            />
          ))}
        </nav>
        <div className="app-sider-foot">
          <span className="foot-dot" />
          <span className="foot-text">
            <span className="foot-title">
              <FormattedMessage id="menu.serviceHealthy" defaultMessage="采集服务运行正常" />
            </span>
            <span className="foot-meta">
              <FormattedMessage id="menu.version" defaultMessage="版本 v3.8.2" />
            </span>
          </span>
        </div>
      </div>
    </aside>
  );
}
