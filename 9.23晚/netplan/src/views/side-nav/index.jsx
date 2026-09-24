import { useState } from "react";
import { Menu } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { sideNavItems } from "../../mock/nav.js";
import "./index.css";

// Layer 4: 侧边导航
export default function SideNav() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState(["topology"]);
  const [openKeys, setOpenKeys] = useState(["planning"]);

  const items = sideNavItems.map((item) => ({
    key: item.key,
    icon: <Icon name={item.icon} size={16} />,
    label: item.label,
    children: item.children
      ? item.children.map((child) => ({ key: child.key, label: child.label }))
      : undefined,
  }));

  return (
    <aside className={"side-nav" + (collapsed ? " is-collapsed" : "")}>
      <nav className="side-nav-scroll">
        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          selectedKeys={selectedKeys}
          openKeys={collapsed ? undefined : openKeys}
          onSelect={(info) => setSelectedKeys([info.key])}
          onOpenChange={(keys) => setOpenKeys(keys)}
          items={items}
          style={{ borderInlineEnd: "none", background: "transparent" }}
        />
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
