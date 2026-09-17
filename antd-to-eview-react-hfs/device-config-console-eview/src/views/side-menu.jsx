import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useApp } from "../context.jsx";
import { sideMenuItems } from "../data.js";
import "./side-menu.css";

function MenuItemLabel({ node }) {
  return <FormattedMessage id={node.msgId} defaultMessage={node.fallback} />;
}

// Layer 4: 侧边导航 — 展开 248px / 折叠 48px,亮色底,折叠态保留图标与选中态
export default function SideMenu() {
  const { collapsed } = useApp();
  const [selected, setSelected] = useState("device-config");
  const [openKeys, setOpenKeys] = useState(() => new Set(["devices", "collection"]));

  const toggleGroup = (key) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <aside className={"app-sider" + (collapsed ? " collapsed" : "")}>
      <nav className="app-sider-menu">
        {sideMenuItems.map((node) =>
          node.children ? (
            <div key={node.key} className="sider-group">
              <button
                type="button"
                className={"sider-item sider-submenu" + (openKeys.has(node.key) ? " open" : "")}
                onClick={() => toggleGroup(node.key)}
              >
                {collapsed ? (
                  <span className="sider-item-glyph" aria-hidden="true">{node.fallback[0]}</span>
                ) : (
                  <>
                    <span className="sider-item-text">
                      <MenuItemLabel node={node} />
                    </span>
                    <span className="sider-arrow" aria-hidden="true">
                      {openKeys.has(node.key) ? "-" : "+"}
                    </span>
                  </>
                )}
              </button>
              {!collapsed && openKeys.has(node.key) ? (
                <div className="sider-children">
                  {node.children.map((child) => (
                    <button
                      key={child.key}
                      type="button"
                      className={"sider-item sider-child" + (selected === child.key ? " active" : "")}
                      onClick={() => setSelected(child.key)}
                    >
                      <span className="sider-item-text">
                        <MenuItemLabel node={child} />
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <button
              key={node.key}
              type="button"
              className={"sider-item" + (selected === node.key ? " active" : "")}
              onClick={() => setSelected(node.key)}
              title={collapsed ? node.fallback : undefined}
            >
              {collapsed ? (
                <span className="sider-item-glyph" aria-hidden="true">{node.fallback[0]}</span>
              ) : (
                <span className="sider-item-text">
                  <MenuItemLabel node={node} />
                </span>
              )}
            </button>
          )
        )}
      </nav>
      <div className="app-sider-foot">
        <span className="foot-dot" />
        {!collapsed ? (
          <span className="foot-text">
            <span className="foot-title">
              <FormattedMessage id="menu.serviceHealthy" defaultMessage="采集服务运行正常" />
            </span>
            <span className="foot-meta">
              <FormattedMessage id="menu.version" defaultMessage="版本 v3.8.2" />
            </span>
          </span>
        ) : null}
      </div>
    </aside>
  );
}
