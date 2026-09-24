import { useState } from "react";
import { Icon } from "../../shared/icon.jsx";
import { sideNavItems } from "../../mock/nav.js";
import "./index.css";

// Layer 4: 侧边导航
// TODO(eview-react): Menu 无对应组件，当前手写侧导航（含可折叠分组）
export default function SideNav() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("topology");
  const [openKeys, setOpenKeys] = useState(["planning"]);

  const toggleGroup = (key) => {
    setOpenKeys((prev) =>
      prev.indexOf(key) > -1 ? prev.filter((k) => k !== key) : prev.concat(key)
    );
  };

  return (
    <aside className={"side-nav" + (collapsed ? " is-collapsed" : "")}>
      <nav className="side-nav-scroll">
        {sideNavItems.map((item) => {
          const hasChildren = Array.isArray(item.children) && item.children.length > 0;
          const isOpen = openKeys.indexOf(item.key) > -1;
          if (hasChildren) {
            return (
              <div key={item.key} className={"side-nav-group" + (isOpen ? " is-open" : "")}>
                <button
                  type="button"
                  className="side-nav-item side-nav-item-group"
                  onClick={() => toggleGroup(item.key)}
                >
                  <span className="side-nav-item-icon">
                    <Icon name={item.icon} size={16} />
                  </span>
                  {collapsed ? null : (
                    <>
                      <span className="side-nav-item-label">{item.label}</span>
                      <span className="side-nav-item-arrow">
                        <Icon name={isOpen ? "chevron-down" : "chevron-right"} size={14} />
                      </span>
                    </>
                  )}
                </button>
                {!collapsed && isOpen ? (
                  <div className="side-nav-children">
                    {item.children.map((child) => (
                      <button
                        key={child.key}
                        type="button"
                        className={
                          "side-nav-item side-nav-item-child" +
                          (selectedKey === child.key ? " is-active" : "")
                        }
                        onClick={() => setSelectedKey(child.key)}
                      >
                        <span className="side-nav-item-label">{child.label}</span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          }
          return (
            <button
              key={item.key}
              type="button"
              className={"side-nav-item" + (selectedKey === item.key ? " is-active" : "")}
              onClick={() => setSelectedKey(item.key)}
            >
              <span className="side-nav-item-icon">
                <Icon name={item.icon} size={16} />
              </span>
              {collapsed ? null : <span className="side-nav-item-label">{item.label}</span>}
            </button>
          );
        })}
      </nav>
      <div className="side-nav-foot">
        <button
          type="button"
          className="side-nav-collapse"
          onClick={() => setCollapsed((value) => !value)}
        >
          <Icon name={collapsed ? "panel-left-open" : "panel-left-close"} size={16} />
          {collapsed ? null : <span>收起导航</span>}
        </button>
      </div>
    </aside>
  );
}
