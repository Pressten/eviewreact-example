// Layer 4: 侧边菜单栏(Menu 组件,可折叠)
import { useState } from "react";
import { Menu } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { menuItems } from "../../mock/dashboard.js";
import "./index.css";

function toItems(list) {
  return list.map((it) => ({
    key: it.key,
    icon: it.icon ? <Icon name={it.icon} size="1rem" /> : undefined,
    label: it.label,
    children: it.children
      ? it.children.map((c) => ({ key: c.key, label: c.label }))
      : undefined,
  }));
}

export default function SideMenu({ collapsed }) {
  const [selectedKeys, setSelectedKeys] = useState(["dashboard"]);
  const [openKeys, setOpenKeys] = useState(["device", "alarm"]);

  return (
    <aside className={"side-menu" + (collapsed ? " is-collapsed" : "")}>
      <Menu
        mode="inline"
        inlineCollapsed={collapsed}
        selectedKeys={selectedKeys}
        onClick={({ key }) => setSelectedKeys([key])}
        items={toItems(menuItems)}
        {...(collapsed ? {} : { openKeys, onOpenChange: setOpenKeys })}
      />
    </aside>
  );
}
